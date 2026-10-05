<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index(Request $request)
    {
        // Staff managing the catalogue (?all=1) get every category, including
        // inactive and sub-categories, uncached; shoppers get the cached list
        // of active top-level categories.
        $viewer = $request->user() ?: $request->user('sanctum');
        if ($request->boolean('all') && $viewer && $viewer->hasAnyRole(['admin', 'manager'])) {
            $categories = Category::with('parent:id,name')->orderBy('name')->get();
        } else {
            $categories = $this->categoryService->getRootCategories(['parent']);
        }

        return response()->json([
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string|max:2000',
            'image' => 'nullable|string|max:2048',
            'status' => 'nullable|in:active,inactive',
        ]);

        $data['slug'] = $this->uniqueSlug($data['slug'] ?? $data['name']);
        $data['status'] = $data['status'] ?? 'active';

        $category = $this->categoryService->createCategory($data);

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category,
        ], 201);
    }

    public function show($id)
    {
        $category = $this->categoryService->getCategoryById($id, [
            'parent',
            'children',
            // Only what a shopper can buy, newest first, capped.
            'products' => fn ($q) => $q->active()->latest()->limit(48),
        ]);

        return response()->json([
            'category' => $category,
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:categories,id|not_in:' . (int) $id,
            'description' => 'nullable|string|max:2000',
            'image' => 'nullable|string|max:2048',
            'status' => 'nullable|in:active,inactive',
        ]);

        $data['slug'] = $this->uniqueSlug($data['slug'] ?? $data['name'], (int) $id);
        if (($data['status'] ?? null) === null) {
            unset($data['status']); // an empty status never overwrites the stored one
        }

        $this->categoryService->updateCategory($id, $data);

        return response()->json([
            'message' => 'Category updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $this->categoryService->deleteCategory($id);

        return response()->json([
            'message' => 'Category deleted successfully',
        ]);
    }

    /** A slug that does not collide with another category (the column is unique). */
    private function uniqueSlug(string $source, ?int $ignoreId = null): string
    {
        $base = Str::slug($source) ?: 'category';
        $slug = $base;
        $i = 2;

        while (Category::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
