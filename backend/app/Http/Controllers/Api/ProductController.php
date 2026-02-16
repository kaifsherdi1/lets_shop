<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'distributor'])
            ->active()
            ->inStock();

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by distributor
        if ($request->has('distributor_id')) {
            $query->byDistributor($request->distributor_id);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        $products = $query->paginate(20);

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'sku' => 'required|string|unique:products',
            'price_inr' => 'required|numeric|min:0',
            'price_aed' => 'required|numeric|min:0',
            'distributor_price_inr' => 'required|numeric|min:0',
            'distributor_price_aed' => 'required|numeric|min:0',
            'commission_amount_inr' => 'required|numeric|min:0',
            'commission_amount_aed' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'images' => 'nullable|array',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
        ]);

        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'category_id' => $request->category_id,
            'distributor_id' => $request->user()->id,
            'sku' => $request->sku,
            'price_inr' => $request->price_inr,
            'price_aed' => $request->price_aed,
            'distributor_price_inr' => $request->distributor_price_inr,
            'distributor_price_aed' => $request->distributor_price_aed,
            'commission_amount_inr' => $request->commission_amount_inr,
            'commission_amount_aed' => $request->commission_amount_aed,
            'stock_quantity' => $request->stock_quantity,
            'images' => $request->images,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'meta_keywords' => $request->meta_keywords,
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product
        ], 201);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'distributor']);

        return response()->json([
            'product' => $product
        ]);
    }

    public function update(Request $request, Product $product)
    {
        // Check if user owns this product
        if ($product->distributor_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'price_inr' => 'required|numeric|min:0',
            'price_aed' => 'required|numeric|min:0',
            'distributor_price_inr' => 'required|numeric|min:0',
            'distributor_price_aed' => 'required|numeric|min:0',
            'commission_amount_inr' => 'required|numeric|min:0',
            'commission_amount_aed' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'images' => 'nullable|array',
            'status' => 'in:active,inactive,out_of_stock',
        ]);

        $product->update($request->all());

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }

    public function destroy(Request $request, Product $product)
    {
        // Check if user owns this product
        if ($product->distributor_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }

    // Get products by current distributor
    public function myProducts(Request $request)
    {
        $products = Product::with('category')
            ->byDistributor($request->user()->id)
            ->paginate(20);

        return response()->json($products);
    }
}
