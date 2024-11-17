<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model {
    use HasFactory;
    use HasFactory;

    protected $fillable = [
        'user_id', 'manager_id', 'status', 'total_amount', 'shipping_address', 'billing_address', 'ordered_at', 'shipped_at', 'completed_at'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function manager() {
        return $this->belongsTo(Manager::class);
    }

    public function contractor() {
        return $this->belongsTo(Contractor::class);
    }

    public function products() {
        return $this->belongsToMany(Product::class)
            ->withPivot('quantity', 'price', 'total')
            ->withTimestamps();
    }
}
