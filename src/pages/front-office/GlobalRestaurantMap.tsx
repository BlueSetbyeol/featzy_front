import type { Restaurant } from "@/types/restaurantTypes";
import { useEffect, useState } from "react";
// import UserContext from "@/context/UserContext";
import MapGlobal from "@/components/map/MapGlobal";
import SearchingLoc from "@/components/map/SearchingLoc";

export default function GlobalRestaurantMap() {
  // const { user } = useContext(UserContext);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/restaurants")
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <SearchingLoc />
      <MapGlobal restaurants={restaurants} />
    </>
  );
}
