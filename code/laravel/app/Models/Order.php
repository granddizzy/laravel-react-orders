<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model {
    use HasFactory;

    protected $fillable = [
        'manager_id',
        'contractor_id',
        'shipping_address',
        'billing_address',
    ];

    protected array $dates = ['ordered_at'];

    public static function boot() {
        parent::boot();

        // Устанавливаем ordered_at на текущее время при создании
        static::creating(function ($order) {
            if (!$order->ordered_at) {
                $order->ordered_at = now();
            }
        });
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function manager() {
        return $this->belongsTo(Manager::class);
    }

    public function contractor() {
        return $this->belongsTo(Contractor::class);
    }

//    public function products() {
//        return $this->belongsToMany(Product::class)
//            ->withPivot('quantity')
//            ->withTimestamps();
//    }
}
