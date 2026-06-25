<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class BaseResourceCollection extends ResourceCollection
{
    public function __construct($resource, protected string $resourceClass)
    {
        $this->collects = $resourceClass;
        parent::__construct($resource);
    }

    public function toArray(Request $request): array
    {
        $paginated = $this->resource instanceof LengthAwarePaginator;

        $result = ['data' => $this->collection];

        if ($paginated) {
            $result['meta'] = [
                'total'        => $this->resource->total(),
                'per_page'     => $this->resource->perPage(),
                'current_page' => $this->resource->currentPage(),
                'last_page'    => $this->resource->lastPage(),
                'from'         => $this->resource->firstItem(),
                'to'           => $this->resource->lastItem(),
            ];
            $result['links'] = [
                'first' => $this->resource->url(1),
                'last'  => $this->resource->url($this->resource->lastPage()),
                'prev'  => $this->resource->previousPageUrl(),
                'next'  => $this->resource->nextPageUrl(),
            ];
        }

        return $result;
    }
}
