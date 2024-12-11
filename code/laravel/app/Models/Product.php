<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model {
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'unit',
        'stock_quantity',
        'sku'
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

//    public function category() {
//        return $this->belongsTo(Category::class);
//    }
//
//    public function supplier() {
//        return $this->belongsTo(Supplier::class);
//    }
}
