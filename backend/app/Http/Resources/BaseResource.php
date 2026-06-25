<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

abstract class BaseResource extends JsonResource
{
    /**
     * Wrap collection responses with metadata.
     */
    public static function collection($resource): BaseResourceCollection
    {
        return new BaseResourceCollection($resource, static::class);
    }
}
