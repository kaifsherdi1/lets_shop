<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'distributor_id',
        'quantity',
        'price',
        'distributor_price',
        'commission_amount',
        'commission_status',
        'approved_by',
        'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'price' => 'decimal:2',
            'distributor_price' => 'decimal:2',
            'commission_amount' => 'decimal:2',
            'approved_at' => 'datetime',
        ];
    }

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function distributor()
    {
        return $this->belongsTo(User::class , 'distributor_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class , 'approved_by');
    }

    // Accessors
    public function getSubtotalAttribute()
    {
        return $this->quantity * $this->price;
    }

    public function getTotalCommissionAttribute()
    {
        return $this->quantity * $this->commission_amount;
    }
}
