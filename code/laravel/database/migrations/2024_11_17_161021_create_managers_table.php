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
        Schema::create('managers', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');  // Связь с пользователем
            $table->foreignId('organization_id')->constrained('organizations')->onDelete('cascade');  // Связь с организацией
            $table->enum('role', ['admin', 'supervisor', 'employee'])->default('employee');  // Роль менеджера (например, админ, супервайзер, сотрудник)
            $table->text('notes')->nullable();  // Дополнительные заметки о менеджере
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('managers');
    }
};
