<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'user_id',
        'address_id',
        'delivery_address',
        'recipient_name',
        'recipient_phone',
        'currency',
        'subtotal',
        'tax',
        'shipping_fee',
        'total',
        'total_amount',
        'payment_method',
        'payment_status',
        'order_status',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'tax' => 'decimal:2',
            'shipping_fee' => 'decimal:2',
            'total' => 'decimal:2',
            'total_amount' => 'decimal:2',
        ];
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    /**
     * Unique order number, e.g. LS2026-48213907. Random rather than
     * "last + 1" so simultaneous checkouts can't generate the same number.
     */
    public static function generateOrderNumber()
    {
        do {
            $number = 'LS' . date('Y') . '-' . str_pad((string) random_int(0, 99999999), 8, '0', STR_PAD_LEFT);
        } while (self::where('order_number', $number)->exists());

        return $number;
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('order_status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('order_status', 'delivered');
    }
}
