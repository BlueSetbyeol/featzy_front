import { APIProvider, Map } from "@vis.gl/react-google-maps";
import type { Restaurant } from "@/types/restaurantTypes";
import CustomMarkerDescription from "./CustomMarkerDescription";
import { useContext } from "react";
import GeoContext from "@/context/GeoContext";

interface MapGlobalProps {
  restaurants: Restaurant[];
}

export default function MapGlobal({ restaurants }: MapGlobalProps) {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { zoom, setZoom, mapCenter, setMapCenter } = useContext(GeoContext);

  let center = {};

  if (mapCenter) {
    center = { lat: mapCenter.lat, lng: mapCenter.lng };
  } else {
    center = { lat: 46.413512, lng: 2.558082 };
  }

  return (
    <APIProvider apiKey={API_KEY} libraries={["marker"]}>
      <Map
        mapId={"c0e09e50af53e4dc56e87afd"}
        style={{ width: "100vw", height: "100vh" }}
        center={center}
        zoom={zoom}
        onCameraChanged={(event) => {
          setMapCenter(event.detail.center);
          setZoom(event.detail.zoom);
        }}
        gestureHandling="greedy"
        disableDefaultUI
      >
        <CustomMarkerDescription restaurants={restaurants} />
      </Map>
    </APIProvider>
  );
}
