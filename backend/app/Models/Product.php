<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'category_id',
        'distributor_id',
        'sku',
        'price_inr',
        'price_aed',
        'distributor_price_inr',
        'distributor_price_aed',
        'commission_amount_inr',
        'commission_amount_aed',
        'stock_quantity',
        'images',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'status',
    ];

    /**
     * Distributor cost price and commission are internal figures — never expose
     * them to the public storefront. Controllers call makeVisible() for
     * authenticated staff / vendors who legitimately need them.
     */
    protected $hidden = [
        'distributor_price_inr',
        'distributor_price_aed',
        'commission_amount_inr',
        'commission_amount_aed',
    ];

    public const INTERNAL_FIELDS = [
        'distributor_price_inr',
        'distributor_price_aed',
        'commission_amount_inr',
        'commission_amount_aed',
    ];

    /**
     * Pricing must leave a non-negative margin in each currency: the vendor's
     * cost price can't exceed the selling price, and the commission can't
     * exceed the margin between them. Returns validation messages keyed by field.
     */
    public static function pricingErrors(array $data): array
    {
        $errors = [];
        foreach (['inr' => 'INR', 'aed' => 'AED'] as $suffix => $label) {
            $price = (float) ($data["price_{$suffix}"] ?? 0);
            $cost = (float) ($data["distributor_price_{$suffix}"] ?? 0);
            $commission = (float) ($data["commission_amount_{$suffix}"] ?? 0);

            if ($cost > $price) {
                $errors["distributor_price_{$suffix}"] = "The distributor price ({$label}) cannot be higher than the selling price.";
            } elseif ($commission > round($price - $cost, 2)) {
                $errors["commission_amount_{$suffix}"] = "The commission ({$label}) cannot exceed the selling price minus the distributor price.";
            }
        }

        return $errors;
    }

    protected function casts(): array
    {
        return [
            'price_inr' => 'decimal:2',
            'price_aed' => 'decimal:2',
            'distributor_price_inr' => 'decimal:2',
            'distributor_price_aed' => 'decimal:2',
            'commission_amount_inr' => 'decimal:2',
            'commission_amount_aed' => 'decimal:2',
            'stock_quantity' => 'integer',
            'images' => 'array',
        ];
    }

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function distributor()
    {
        return $this->belongsTo(User::class , 'distributor_id');
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Accessors for currency-specific pricing
    public function getPriceAttribute()
    {
        // Default to INR, can be overridden based on user preference
        return $this->price_inr;
    }

    public function getFormattedPriceInrAttribute()
    {
        return '₹' . number_format($this->price_inr, 2);
    }

    public function getFormattedPriceAedAttribute()
    {
        return 'د.إ' . number_format($this->price_aed, 2);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    public function scopeByDistributor($query, $distributorId)
    {
        return $query->where('distributor_id', $distributorId);
    }

    // Helper methods
    public function isInStock()
    {
        return $this->stock_quantity > 0;
    }

    public function decreaseStock($quantity)
    {
        if ($this->stock_quantity >= $quantity) {
            $this->stock_quantity -= $quantity;
            $this->save();
            return true;
        }
        return false;
    }

    public function increaseStock($quantity)
    {
        $this->stock_quantity += $quantity;
        $this->save();
    }
}
