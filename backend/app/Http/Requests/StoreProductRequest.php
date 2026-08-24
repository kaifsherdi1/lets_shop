<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
  public function authorize(): bool
  {
    // Agents and Distributors can create products, Admins always can
    return $this->user()->isAdmin()
        || $this->user()->hasRole('distributor')
        || $this->user()->hasRole('agent');
  }

  public function rules(): array
  {
    return [
      'name'                   => 'required|string|max:255',
      'description'            => 'required|string',
      'category_id'            => 'required|exists:categories,id',
      'sku'                    => 'required|string|unique:products,sku',
      'price_inr'              => 'required|numeric|min:0|max:10000000',
      'price_aed'              => 'required|numeric|min:0|max:10000000',
      'distributor_price_inr'  => 'required|numeric|min:0|max:10000000',
      'distributor_price_aed'  => 'required|numeric|min:0|max:10000000',
      'commission_amount_inr'  => 'required|numeric|min:0|max:10000000',
      'commission_amount_aed'  => 'required|numeric|min:0|max:10000000',
      'stock_quantity'         => 'required|integer|min:0|max:999999',
      'images'                 => 'nullable|array|max:10',
      'images.*'               => 'image|mimes:jpeg,png,jpg,webp|max:2048',
      'meta_title'             => 'nullable|string|max:255',
      'meta_description'       => 'nullable|string|max:500',
      'meta_keywords'          => 'nullable|string|max:255',
      'status'                 => 'nullable|in:active,inactive,out_of_stock',
    ];
  }
}
