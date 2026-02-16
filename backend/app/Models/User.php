<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes;

    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'password',
        'role_id',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationships
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class , 'distributor_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function loginSessions()
    {
        return $this->hasMany(LoginSession::class);
    }

    // Helper methods
    public function hasRole($role)
    {
        return $this->role && $this->role->slug === $role;
    }

    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    public function isDistributor()
    {
        return $this->hasRole('distributor');
    }

    public function isAgent()
    {
        return $this->hasRole('agent');
    }
}
