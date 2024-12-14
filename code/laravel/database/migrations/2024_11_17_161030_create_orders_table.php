<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
//            $table->foreignId('user_id')->constrained()->onDelete('cascade');  // Ссылка на пользователя, который создал заказ
            $table->foreignId('manager_id')->constrained()->onDelete('cascade');  // Менеджер, который ведет заказ
//            $table->foreignId('organization_id')->constrained()->onDelete('cascade');  // Организация, которая создала заказ
            $table->foreignId('contractor_id')->constrained()->onDelete('cascade');  // Контрагент, для которого создан заказ
            $table->enum('status', ['pending', 'confirmed', 'shipped', 'completed', 'cancelled'])->default('pending');  // Статус заказа
            $table->string('shipping_address')->nullable();  // Адрес доставки
            $table->string('billing_address')->nullable();  // Адрес для счета (может отличаться от адреса доставки)
            $table->timestamp('ordered_at')->useCurrent();  // Дата и время размещения заказа
            $table->timestamp('shipped_at')->nullable();  // Дата отправки заказа
            $table->timestamp('completed_at')->nullable();  // Дата завершения заказа
            $table->decimal('total_amount', 10, 2)->default(0);;  // Общая сумма
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
