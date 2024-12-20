<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'shipping_address' => $this->shipping_address,
            'total_amount' => $this->total_amount,
            'notes' => $this->notes,
            'created_at' => $this->created_at->toDateTimeString(), // форматирование даты
            'updated_at' => $this->updated_at->toDateTimeString(), // форматирование даты
            'contractor' => new ContractorResource($this->whenLoaded('contractor')),
            'products' => ProductResource::collection($this->whenLoaded('products')),
            'user' => $this->user ? [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ] : null,
        ];
    }
}
