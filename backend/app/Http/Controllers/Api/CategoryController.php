<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

    public function index()
    {
        $categories = $this->categoryService->getRootCategories(['parent']);

        return response()->json([
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        $data['status'] = 'active';

        $category = $this->categoryService->createCategory($data);

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category
        ], 201);
    }

    public function show($id)
    {
        $category = $this->categoryService->getCategoryById($id, ['parent', 'children', 'products']);

        return response()->json([
            'category' => $category
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'status' => 'in:active,inactive',
        ]);

        $data = $request->all();
        if ($request->has('name')) {
            $data['slug'] = Str::slug($request->name);
        }

        $this->categoryService->updateCategory($id, $data);

        return response()->json([
            'message' => 'Category updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $this->categoryService->deleteCategory($id);

        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }
}
