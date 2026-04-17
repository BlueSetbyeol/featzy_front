import type { Restaurant } from "@/types/mapTypes";
import { useContext } from "react";
import UserContext from "@/context/UserContext";
import MapGlobal from "@/components/map/MapGlobal";

export default function GlobalRestaurantMap() {
  const { user } = useContext(UserContext);

  let restaurants: Restaurant[] = [];

  if (user && user.registered_restaurant) {
    restaurants = user?.registered_restaurant;
  }

  return (
    <>
      <MapGlobal restaurants={restaurants} />
    </>
  );
}
