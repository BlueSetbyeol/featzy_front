import { useContext, useMemo, useState } from "react";
import { type RestaurantQuery } from "@/api/RestaurantApi";
import { useAllRestaurants } from "@/hooks/useRestaurants";
import MapGlobal from "@/components/map/MapGlobal";
import SearchingLoc from "@/components/map/SearchingLoc";
import GeoContext from "@/context/GeoContext";
import { calculateDistance } from "@/services/calculateDistanceToRestaurant";

export default function GlobalRestaurantMap() {
  const [query, setQuery] = useState<RestaurantQuery>({});
  const { userCenter } = useContext(GeoContext);

  // Cache partagé avec Welcome/RestaurantList ; on ne garde que les
  // restaurants géolocalisables pour la carte. Si la position de
  // l'utilisateur est connue, on se limite à un rayon de 5 km, triés par
  // distance croissante. On dérive donc la liste via useMemo plutôt que de
  // muter un state.
  const { data: restaurants = [] } = useAllRestaurants(query);
  const mappableRestaurants = useMemo(() => {
    const geolocated = restaurants.filter(
      (restaurant) =>
        restaurant.address.latitude !== null &&
        restaurant.address.longitude !== null,
    );
    if (!userCenter) {
      return geolocated;
    }
    return geolocated
      .map((restaurant) => ({
        restaurant,
        distanceKm: calculateDistance(userCenter, restaurant),
      }))
      .filter((entry) => entry.distanceKm !== null && entry.distanceKm <= 5)
      .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
      .map((entry) => entry.restaurant);
  }, [restaurants, userCenter]);

  return (
    <>
      <SearchingLoc onFiltersApply={setQuery} />
      <MapGlobal restaurants={mappableRestaurants} />
    </>
  );
}
