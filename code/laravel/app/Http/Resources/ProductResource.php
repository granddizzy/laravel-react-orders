<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'unit' => $this->unit,
            'stock_quantity' => $this->stock_quantity,
            'sku' => $this->sku,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
