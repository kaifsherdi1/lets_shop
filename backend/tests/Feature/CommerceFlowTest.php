<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Commission;
use App\Models\Order;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use App\Models\Wallet;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * End-to-end API checks for the money and stock paths: checkout, cancellation,
 * commissions, wallets/withdrawals, order lifecycle and data exposure.
 */
class CommerceFlowTest extends TestCase
{
    use RefreshDatabase;

    private Category $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        $this->category = Category::create(['name' => 'Electronics', 'slug' => 'electronics', 'status' => 'active']);
    }

    // ── helpers ──────────────────────────────────────────────────────────

    private function user(string $role, array $attrs = []): User
    {
        $u = new User();
        $u->forceFill(array_merge([
            'name' => ucfirst($role) . ' ' . Str::random(4),
            'full_name' => ucfirst($role) . ' User',
            'email' => $role . '.' . Str::lower(Str::random(8)) . '@example.com',
            'password' => bcrypt('Password!123'),
            'role_id' => Role::where('slug', $role)->value('id'),
            'status' => 'active',
            'email_verified_at' => now(),
        ], $attrs))->save();

        return $u->fresh('role');
    }

    private function product(User $owner, array $attrs = []): Product
    {
        return Product::create(array_merge([
            'name' => 'Headphones ' . Str::random(4),
            'slug' => 'headphones-' . Str::lower(Str::random(6)),
            'description' => 'Wireless headphones',
            'category_id' => $this->category->id,
            'distributor_id' => $owner->id,
            'sku' => 'SKU-' . Str::upper(Str::random(8)),
            'price_aed' => 100,
            'price_inr' => 2000,
            'distributor_price_aed' => 70,
            'distributor_price_inr' => 1400,
            'commission_amount_aed' => 10,
            'commission_amount_inr' => 200,
            'stock_quantity' => 5,
            'status' => 'active',
        ], $attrs));
    }

    private function fillCart(User $buyer, Product $product, int $qty): void
    {
        $cart = Cart::firstOrCreate(['user_id' => $buyer->id]);
        CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => $qty, 'price' => $product->price_aed]);
    }

    private function checkout(User $buyer, string $currency = 'AED', array $extra = [])
    {
        Sanctum::actingAs($buyer);

        return $this->postJson('/api/orders', array_merge([
            'delivery_address' => '12 Marina Walk, Dubai, UAE',
            'currency' => $currency,
            'payment_method' => 'cod',
        ], $extra));
    }

    private function deliver(Order $order, User $admin): void
    {
        Sanctum::actingAs($admin);
        foreach (['processing', 'shipped', 'delivered'] as $status) {
            $this->patchJson("/api/admin/orders/{$order->id}/status", ['status' => $status])->assertOk();
        }
    }

    // ── checkout & stock ─────────────────────────────────────────────────

    public function test_checkout_decrements_stock_and_computes_totals_server_side(): void
    {
        $vendor = $this->user('distributor');
        $buyer = $this->user('customer');
        $product = $this->product($vendor);
        $this->fillCart($buyer, $product, 2);

        $res = $this->checkout($buyer)->assertCreated();

        $this->assertSame(3, $product->fresh()->stock_quantity);
        $order = Order::findOrFail($res->json('order.id'));
        $this->assertEquals(200.00, (float) $order->subtotal);
        $this->assertEquals(10.00, (float) $order->tax);   // 5%
        $this->assertEquals(210.00, (float) $order->total);
        $this->assertMatchesRegularExpression('/^LS\d{4}-\d{8}$/', $order->order_number);
        $this->assertSame(0, Cart::where('user_id', $buyer->id)->first()->items()->count());
    }

    public function test_checkout_rejects_more_than_available_stock_without_side_effects(): void
    {
        $buyer = $this->user('customer');
        $product = $this->product($this->user('distributor'), ['stock_quantity' => 1]);
        $this->fillCart($buyer, $product, 2);

        $this->checkout($buyer)->assertStatus(422)->assertJsonPath('message', fn ($m) => str_contains($m, 'left in stock'));

        $this->assertSame(1, $product->fresh()->stock_quantity);
        $this->assertSame(0, Order::count()); // the transaction rolled back
    }

    public function test_checkout_rejects_products_taken_off_sale(): void
    {
        $buyer = $this->user('customer');
        $product = $this->product($this->user('distributor'));
        $this->fillCart($buyer, $product, 1);
        $product->update(['status' => 'inactive']);

        $this->checkout($buyer)->assertStatus(422);
        $this->assertSame(5, $product->fresh()->stock_quantity);
    }

    public function test_checkout_ignores_a_smuggled_address_id(): void
    {
        $buyer = $this->user('customer');
        $this->fillCart($buyer, $this->product($this->user('distributor')), 1);

        $res = $this->checkout($buyer, 'AED', ['address_id' => 999])->assertCreated();

        $this->assertNull(Order::find($res->json('order.id'))->address_id);
    }

    // ── cancellation ─────────────────────────────────────────────────────

    public function test_cancelling_restores_stock_exactly_once(): void
    {
        $buyer = $this->user('customer');
        $product = $this->product($this->user('distributor'));
        $this->fillCart($buyer, $product, 2);
        $orderId = $this->checkout($buyer)->json('order.id');

        $this->postJson("/api/orders/{$orderId}/cancel")->assertOk();
        $this->postJson("/api/orders/{$orderId}/cancel")->assertStatus(422);

        $this->assertSame(5, $product->fresh()->stock_quantity);
        $this->assertSame('cancelled', Commission::first()->status);
    }

    public function test_customers_cannot_view_or_cancel_someone_elses_order(): void
    {
        $owner = $this->user('customer');
        $this->fillCart($owner, $this->product($this->user('distributor')), 1);
        $orderId = $this->checkout($owner)->json('order.id');

        Sanctum::actingAs($this->user('customer'));
        $this->getJson("/api/orders/{$orderId}")->assertForbidden();
        $this->postJson("/api/orders/{$orderId}/cancel")->assertForbidden();
        $this->assertSame('pending', Order::find($orderId)->order_status);
    }

    // ── order lifecycle ──────────────────────────────────────────────────

    public function test_admin_status_changes_follow_the_order_lifecycle(): void
    {
        $admin = $this->user('admin');
        $buyer = $this->user('customer');
        $product = $this->product($this->user('distributor'));
        $this->fillCart($buyer, $product, 1);
        $order = Order::find($this->checkout($buyer)->json('order.id'));

        Sanctum::actingAs($admin);
        $this->patchJson("/api/admin/orders/{$order->id}/status", ['status' => 'delivered'])->assertStatus(422);

        // Cancelling through the admin path restores stock like a customer cancel.
        $this->patchJson("/api/admin/orders/{$order->id}/status", ['status' => 'cancelled'])->assertOk();
        $this->assertSame(5, $product->fresh()->stock_quantity);

        // Cancelled is final.
        $this->patchJson("/api/admin/orders/{$order->id}/status", ['status' => 'delivered'])->assertStatus(422);
    }

    // ── commissions & wallets ────────────────────────────────────────────

    public function test_commission_cannot_be_approved_before_delivery(): void
    {
        $buyer = $this->user('customer');
        $this->fillCart($buyer, $this->product($this->user('distributor')), 1);
        $this->checkout($buyer)->assertCreated();

        Sanctum::actingAs($this->user('admin'));
        $this->postJson('/api/commissions/' . Commission::first()->id . '/approve')->assertStatus(422);
        $this->assertSame('pending', Commission::first()->status);
    }

    public function test_approval_credits_the_vendor_once_in_the_order_currency(): void
    {
        $admin = $this->user('admin');
        $vendor = $this->user('distributor'); // note: no wallet exists yet
        $buyer = $this->user('customer');
        $this->fillCart($buyer, $this->product($vendor), 3);
        $order = Order::find($this->checkout($buyer, 'INR')->json('order.id'));
        $this->deliver($order, $admin);

        $commission = Commission::firstOrFail();
        $this->assertSame('INR', $commission->currency);
        $this->assertEquals(600.00, (float) $commission->amount); // 3 × 200

        Sanctum::actingAs($admin);
        $this->postJson("/api/commissions/{$commission->id}/approve")->assertOk();
        $this->postJson("/api/commissions/{$commission->id}/approve")->assertStatus(409); // no double pay

        $this->assertEquals(600.00, (float) Wallet::where('user_id', $vendor->id)->where('currency', 'INR')->value('balance'));
        $this->assertNull(Wallet::where('user_id', $vendor->id)->where('currency', 'AED')->value('balance') ?: null);
        $this->assertSame('paid', $commission->fresh()->status);
    }

    public function test_vendors_earn_no_commission_on_their_own_purchases(): void
    {
        $vendor = $this->user('distributor');
        $this->fillCart($vendor, $this->product($vendor), 1);

        $this->checkout($vendor)->assertCreated();

        $this->assertSame(0, Commission::count());
    }

    public function test_withdrawals_cannot_exceed_the_available_balance(): void
    {
        $vendor = $this->user('distributor');
        Wallet::create(['user_id' => $vendor->id, 'currency' => 'AED', 'balance' => 500]);
        $bank = ['account_name' => 'V', 'account_number' => '123', 'bank_name' => 'B', 'ifsc_code' => 'X1'];

        Sanctum::actingAs($vendor);
        $this->postJson('/api/wallet/withdraw', ['amount' => 400, 'bank_details' => $bank])->assertCreated();
        // 400 is already on hold, so only 100 remains available.
        $this->postJson('/api/wallet/withdraw', ['amount' => 200, 'bank_details' => $bank])->assertStatus(422);
        $this->postJson('/api/wallet/withdraw', ['amount' => 100, 'bank_details' => $bank])->assertCreated();
    }

    public function test_a_withdrawal_is_debited_only_once(): void
    {
        $vendor = $this->user('distributor');
        Wallet::create(['user_id' => $vendor->id, 'currency' => 'AED', 'balance' => 500]);
        Sanctum::actingAs($vendor);
        $id = $this->postJson('/api/wallet/withdraw', [
            'amount' => 300,
            'bank_details' => ['account_name' => 'V', 'account_number' => '123', 'bank_name' => 'B', 'ifsc_code' => 'X1'],
        ])->json('withdrawal_request.id');

        Sanctum::actingAs($this->user('accountant'));
        $this->postJson("/api/withdrawals/{$id}/approve")->assertOk();
        $this->postJson("/api/withdrawals/{$id}/approve")->assertStatus(409);
        $this->postJson("/api/withdrawals/{$id}/reject", ['notes' => 'late'])->assertStatus(409);

        $this->assertEquals(200.00, (float) Wallet::where('user_id', $vendor->id)->value('balance'));
    }

    // ── access control & data exposure ───────────────────────────────────

    public function test_managers_cannot_suspend_administrators(): void
    {
        $admin = $this->user('admin');
        Sanctum::actingAs($this->user('manager'));

        $this->patchJson("/api/admin/users/{$admin->id}/status", ['status' => 'suspended'])->assertForbidden();
        $this->assertSame('active', $admin->fresh()->status);
    }

    public function test_public_product_data_hides_cost_prices_and_vendor_contact_details(): void
    {
        $vendor = $this->user('distributor', ['phone' => '+971500000001']);
        $product = $this->product($vendor);

        $json = $this->getJson("/api/products/{$product->id}")->assertOk()->json('product');

        $this->assertArrayNotHasKey('distributor_price_aed', $json);
        $this->assertArrayNotHasKey('commission_amount_aed', $json);
        $this->assertSame(['id', 'full_name'], array_keys($json['distributor']));
    }

    public function test_vendors_see_internal_pricing_only_on_their_own_products(): void
    {
        $owner = $this->user('distributor');
        $product = $this->product($owner);

        Sanctum::actingAs($this->user('agent'));
        $this->getJson("/api/products/{$product->id}")->assertOk()->assertJsonMissingPath('product.distributor_price_aed');

        Sanctum::actingAs($owner);
        $this->getJson("/api/products/{$product->id}")->assertOk()->assertJsonPath('product.distributor_price_aed', '70.00');
    }

    public function test_commission_cannot_exceed_the_vendor_margin(): void
    {
        Sanctum::actingAs($this->user('distributor'));

        $this->postJson('/api/products', [
            'name' => 'Overpaid widget',
            'description' => 'x',
            'category_id' => $this->category->id,
            'sku' => 'SKU-MARGIN-1',
            'price_aed' => 100, 'distributor_price_aed' => 70, 'commission_amount_aed' => 50, // margin is 30
            'price_inr' => 2000, 'distributor_price_inr' => 1400, 'commission_amount_inr' => 100,
            'stock_quantity' => 1,
        ])->assertStatus(422)->assertJsonValidationErrors(['commission_amount_aed']);
    }
}
