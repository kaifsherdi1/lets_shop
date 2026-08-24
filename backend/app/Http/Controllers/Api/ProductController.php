<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['category_id', 'distributor_id', 'search']);
        $products = $this->productService->getProducts(20, ['category', 'distributor'], $filters);

        return response()->json($products);
    }

    public function store(\App\Http\Requests\StoreProductRequest $request)
    {
        $data = $request->validated();

        // Handle images if uploaded
        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $imagePaths[] = asset('storage/' . $path);
            }
            $data['images'] = $imagePaths;
        }

        $data['slug'] = Str::slug($request->name);
        $data['distributor_id'] = $request->user()->id;
        $data['status'] = $data['status'] ?? 'active';

        $product = $this->productService->createProduct($data);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product
        ], 201);
    }

    public function show($id)
    {
        $product = $this->productService->getProductById($id, ['category', 'distributor']);

        return response()->json([
            'product' => $product
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = $this->productService->getProductById($id);

        // Strict ownership check — distributor can only edit their own products
        if ($product->distributor_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name'                   => 'required|string|max:255',
            'description'            => 'required|string',
            'category_id'            => 'required|exists:categories,id',
            'price_inr'              => 'required|numeric|min:0',
            'price_aed'              => 'required|numeric|min:0',
            'distributor_price_inr'  => 'required|numeric|min:0',
            'distributor_price_aed'  => 'required|numeric|min:0',
            'commission_amount_inr'  => 'required|numeric|min:0',
            'commission_amount_aed'  => 'required|numeric|min:0',
            'stock_quantity'         => 'required|integer|min:0',
            'images'                 => 'nullable|array',
            'images.*'               => 'image|mimes:jpeg,png,jpg,webp|max:2048',
            'status'                 => 'nullable|in:active,inactive,out_of_stock',
            'meta_title'             => 'nullable|string|max:255',
            'meta_description'       => 'nullable|string',
        ]);

        // Handle new image uploads (merge with existing)
        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $imagePaths[] = asset('storage/' . $path);
            }
            $validated['images'] = array_merge($product->images ?? [], $imagePaths);
        }

        // Re-generate slug if name changed
        $validated['slug'] = Str::slug($validated['name']);

        // Use only validated data — prevent mass assignment of arbitrary fields
        $this->productService->updateProduct($id, $validated);

        return response()->json([
            'message' => 'Product updated successfully'
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $product = $this->productService->getProductById($id);

        if ($product->distributor_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $this->productService->deleteProduct($id);

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }

    public function myProducts(Request $request)
    {
        $products = $this->productService->getMyProducts($request->user()->id, 20);
        return response()->json($products);
    }
}
