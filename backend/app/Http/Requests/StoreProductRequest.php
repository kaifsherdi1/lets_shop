<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->isAdmin() || $this->user()->hasRole('distributor');
  }

  public function rules(): array
  {
    return [
      'name' => 'required|string|max:255',
      'description' => 'required|string',
      'category_id' => 'required|exists:categories,id',
      'sku' => 'required|string|unique:products,sku',
      'price_inr' => 'required|numeric|min:0',
      'price_aed' => 'required|numeric|min:0',
      'distributor_price_inr' => 'required|numeric|min:0',
      'distributor_price_aed' => 'required|numeric|min:0',
      'commission_amount_inr' => 'required|numeric|min:0',
      'commission_amount_aed' => 'required|numeric|min:0',
      'stock_quantity' => 'required|integer|min:0',
      'images' => 'nullable|array',
      'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
      'meta_title' => 'nullable|string|max:255',
      'meta_description' => 'nullable|string',
      'meta_keywords' => 'nullable|string',
      'status' => 'nullable|in:active,inactive,out_of_stock',
    ];
  }
}
