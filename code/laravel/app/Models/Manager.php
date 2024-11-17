<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Manager extends Model {
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_id', 'organization_id', // Связь с пользователем и организацией
        'role', // Должность или роль менеджера
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function organization() {
        return $this->belongsTo(Organization::class);
    }

    public function orders() {
        return $this->hasMany(Order::class);
    }
}
