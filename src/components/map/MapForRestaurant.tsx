import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { CustomMarkerForRestaurant } from "./CustomMarkerForRestaurant";
import type { Restaurant } from "@/types/mapTypes";
import { useState } from "react";

interface MapForRestaurantProps {
  restaurant: Restaurant;
}

export default function MapForRestaurant({
  restaurant,
}: MapForRestaurantProps) {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [clicked, setClicked] = useState(0);

  return (
    <APIProvider apiKey={API_KEY} libraries={["marker"]}>
      <Map
        mapId={"c0e09e50af53e4dc56e87afd"}
        style={{ width: "90vw", height: "35vh" }}
        defaultCenter={{
          lat: restaurant.location.lat,
          lng: restaurant.location.lng,
        }}
        defaultZoom={13}
        gestureHandling="greedy"
        disableDefaultUI
      >
        <CustomMarkerForRestaurant
          restaurant={restaurant}
          clicked={clicked}
          setClicked={setClicked}
        />
      </Map>
    </APIProvider>
  );
}
