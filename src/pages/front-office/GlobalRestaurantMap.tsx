import { useEffect, useState } from "react";
import type { Restaurant } from "@/types/restaurantTypes";
import { RestaurantApi, type RestaurantQuery } from "@/api/RestaurantApi";
import { extractApiError } from "@/lib/axios";
import { toast } from "sonner";
import MapGlobal from "@/components/map/MapGlobal";
import SearchingLoc from "@/components/map/SearchingLoc";

export default function GlobalRestaurantMap() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [query, setQuery] = useState<RestaurantQuery>({});

  useEffect(() => {
    let cancelled = false;
    RestaurantApi.getAllPages(query)
      .then((list) => {
        if (!cancelled) {
          setRestaurants(
            list.filter(
              (restaurant) =>
                restaurant.address.latitude !== null &&
                restaurant.address.longitude !== null,
            ),
          );
        }
      })
      .catch((error) => {
        if (!cancelled) toast.error(extractApiError(error).message);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <>
      <SearchingLoc onFiltersApply={setQuery} />
      <MapGlobal restaurants={restaurants} />
    </>
  );
}
