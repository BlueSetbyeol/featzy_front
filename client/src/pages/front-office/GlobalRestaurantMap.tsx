import { useContext, useEffect, useState } from "react";
import type { Restaurant } from "@/types/restaurantTypes";
import { RestaurantApi, type RestaurantQuery } from "@/api/RestaurantApi";
import { extractApiError } from "@/lib/axios";
import { toast } from "sonner";
import MapGlobal from "@/components/map/MapGlobal";
import SearchingLoc from "@/components/map/SearchingLoc";
import GeoContext from "@/context/GeoContext";
import { calculateDistance } from "@/services/calculateDistanceToRestaurant";

export default function GlobalRestaurantMap() {
  const [query, setQuery] = useState<RestaurantQuery>({});
  const { userCenter } = useContext(GeoContext);

  // Cache partagé avec Welcome/RestaurantList ; on ne garde que les
  // restaurants géolocalisables pour la carte.
  const { data: restaurants = [] } = useAllRestaurants(query);
  const mappableRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.address.latitude !== null &&
      restaurant.address.longitude !== null,
  );

  function getDistanceLabel(
    userCenter: { lat: number; lng: number },
    restaurant: Restaurant,
  ): string {
    if (!userCenter) return "";

    const distance = calculateDistance(userCenter, restaurant);
    if (distance === null) return "";

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  }

  useEffect(() => {
    if (userCenter) {
      const sorted = restaurants
        .map((restaurant) => ({
          ...restaurant,
          distanceLabel: getDistanceLabel(
            { lat: userCenter.lat, lng: userCenter.lng },
            restaurant,
          ),
          distanceKm: calculateDistance(
            { lat: userCenter.lat, lng: userCenter.lng },
            restaurant,
          ),
        }))
        .sort((a, b) => {
          if (a.distanceKm === null && b.distanceKm === null) return 0;
          if (a.distanceKm === null) return 1;
          if (b.distanceKm === null) return -1;
          return a.distanceKm - b.distanceKm;
        })
        .filter((restaurant) => (restaurant.distanceKm ?? 0) <= 5);
      setRestaurants(sorted);
    }
  }, [userCenter]);

  return (
    <>
      <SearchingLoc onFiltersApply={setQuery} />
      <MapGlobal restaurants={mappableRestaurants} />
    </>
  );
}
