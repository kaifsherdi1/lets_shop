<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
  public function index(Request $request)
  {
    $cart = Cart::with(['items.product.category'])
      ->firstOrCreate(['user_id' => $request->user()->id]);

    return response()->json([
      'cart' => $cart,
      'total_items' => $cart->total_items,
      'total' => $cart->total,
    ]);
  }

  public function addItem(Request $request)
  {
    $request->validate([
      'product_id' => 'required|exists:products,id',
      'quantity' => 'required|integer|min:1',
    ]);

    $product = Product::findOrFail($request->product_id);

    // Check stock availability
    if ($product->stock_quantity < $request->quantity) {
      return response()->json([
        'message' => 'Insufficient stock available'
      ], 400);
    }

    // Get or create cart and item with transaction
    DB::beginTransaction();

    try {
      $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);

      // Check if item already exists in cart
      $cartItem = CartItem::where('cart_id', $cart->id)
        ->where('product_id', $product->id)
        ->first();

      if ($cartItem) {
        $newQuantity = $cartItem->quantity + $request->quantity;

        if ($product->stock_quantity < $newQuantity) {
          throw new \Exception('Insufficient stock available');
        }

        $cartItem->update(['quantity' => $newQuantity]);
      }
      else {
        $cartItem = CartItem::create([
          'cart_id' => $cart->id,
          'product_id' => $product->id,
          'quantity' => $request->quantity,
          'price' => $product->price_inr,
        ]);
      }

      DB::commit();
    }
    catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['message' => $e->getMessage()], 400);
    }

    $cart->load(['items.product']);

    return response()->json([
      'message' => 'Item added to cart',
      'cart' => $cart,
      'total_items' => $cart->total_items,
      'total' => $cart->total,
    ]);
  }

  public function updateItem(Request $request, CartItem $cartItem)
  {
    // Verify cart ownership
    if ($cartItem->cart->user_id !== $request->user()->id) {
      return response()->json(['message' => 'Unauthorized'], 403);
    }

    $request->validate([
      'quantity' => 'required|integer|min:1',
    ]);

    // Check stock availability
    if ($cartItem->product->stock_quantity < $request->quantity) {
      return response()->json([
        'message' => 'Insufficient stock available'
      ], 400);
    }

    $cartItem->update([
      'quantity' => $request->quantity,
    ]);

    $cart = $cartItem->cart;
    $cart->load(['items.product']);

    return response()->json([
      'message' => 'Cart item updated',
      'cart' => $cart,
      'total_items' => $cart->total_items,
      'total' => $cart->total,
    ]);
  }

  public function removeItem(Request $request, CartItem $cartItem)
  {
    // Verify cart ownership
    if ($cartItem->cart->user_id !== $request->user()->id) {
      return response()->json(['message' => 'Unauthorized'], 403);
    }

    $cart = $cartItem->cart;
    $cartItem->delete();

    $cart->load(['items.product']);

    return response()->json([
      'message' => 'Item removed from cart',
      'cart' => $cart,
      'total_items' => $cart->total_items,
      'total' => $cart->total,
    ]);
  }

  public function clear(Request $request)
  {
    $cart = Cart::where('user_id', $request->user()->id)->first();

    if ($cart) {
      $cart->items()->delete();
    }

    return response()->json([
      'message' => 'Cart cleared successfully'
    ]);
  }
}
