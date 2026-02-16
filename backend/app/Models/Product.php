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
