<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contractor extends Model {
    use HasFactory;

  protected $fillable = [
    'name',
    'unp',
    'contact_person',
    'email',
    'phone',
    'address'
  ];

  protected $casts = [
    'created_at' => 'datetime',
    'updated_at' => 'datetime',
  ];

  public function orders() {
    return $this->hasMany(Order::class);
  }
}
