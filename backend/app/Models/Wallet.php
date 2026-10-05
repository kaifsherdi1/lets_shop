<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    public const CURRENCIES = ['AED', 'INR'];

    protected $fillable = ['user_id', 'currency', 'balance'];

    protected function casts(): array
    {
        return [
            'balance' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * The user's wallet for one currency, created on first use and locked for
     * update — call inside a DB transaction before changing the balance.
     */
    public static function lockedFor(int $userId, string $currency): self
    {
        static::firstOrCreate(['user_id' => $userId, 'currency' => $currency], ['balance' => 0]);

        return static::where('user_id', $userId)->where('currency', $currency)->lockForUpdate()->firstOrFail();
    }
}
