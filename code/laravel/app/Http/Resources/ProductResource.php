<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request) {
        // Общие данные для продукта
        $productData = [
            'id' => $this->id,
            'name' => $this->name,
            'sku' => $this->sku,
            'price' => $this->price,
            'stock_quantity' => $this->stock_quantity,
            'unit' => $this->unit,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'description' => $this->description,
        ];

        // Дополнительные данные, если продукт используется в заказе
        if ($this->pivot) {
            $productData['quantity'] = $this->pivot->quantity;
            $productData['price'] = $this->pivot->price;
        }

        return $productData;
    }
}