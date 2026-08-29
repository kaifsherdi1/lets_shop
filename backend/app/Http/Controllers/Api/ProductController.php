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

    /**
     * Roles that may see distributor cost price and commission figures.
     * These routes are public, so resolve the bearer token via the sanctum
     * guard explicitly (there is no auth middleware to do it for us).
     */
    private function canSeeInternal(Request $request): bool
    {
        $user = $request->user() ?: $request->user('sanctum');

        return $user && $user->hasAnyRole(['admin', 'manager', 'accountant', 'distributor', 'agent']);
    }

    public function index(Request $request)
    {
        $filters = $request->only(['category_id', 'distributor_id', 'search']);
        $perPage = (int) $request->get('per_page', 20);

        // Staff / vendors get a fresh (uncached) query with the internal cost
        // fields revealed; the public storefront gets the cached, sanitised list.
        if ($this->canSeeInternal($request)) {
            $query = \App\Models\Product::with(['category', 'distributor']);
            if (! empty($filters['category_id'])) {
                $query->where('category_id', $filters['category_id']);
            }
            if (! empty($filters['distributor_id'])) {
                $query->where('distributor_id', $filters['distributor_id']);
            }
            if (! empty($filters['search'])) {
                $s = $filters['search'];
                $query->where(fn ($q) => $q->where('name', 'like', "%{$s}%")
                    ->orWhere('sku', 'like', "%{$s}%"));
            }
            $products = $query->orderBy('created_at', 'desc')->paginate($perPage);
            $products->getCollection()->each->makeVisible(\App\Models\Product::INTERNAL_FIELDS);

            return response()->json($products);
        }

        $products = $this->productService->getProducts($perPage, ['category', 'distributor'], $filters);

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

        $data['slug'] = $this->uniqueSlug($request->name);
        $data['distributor_id'] = $request->user()->id;
        $data['status'] = $data['status'] ?? 'active';

        $product = $this->productService->createProduct($data);
        $product->makeVisible(\App\Models\Product::INTERNAL_FIELDS);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $product = $this->productService->getProductById($id, ['category', 'distributor']);

        if ($this->canSeeInternal($request)) {
            $product->makeVisible(\App\Models\Product::INTERNAL_FIELDS);
        }

        return response()->json([
            'product' => $product
        ]);
    }

    /** Build a slug that will not collide with an existing product. */
    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'product';
        $slug = $base;
        $i = 2;

        while (\App\Models\Product::withTrashed()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
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

        // Re-generate slug if name changed (kept collision-free)
        $validated['slug'] = $this->uniqueSlug($validated['name'], (int) $id);

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
        $products->getCollection()->each->makeVisible(\App\Models\Product::INTERNAL_FIELDS);

        return response()->json($products);
    }
}
