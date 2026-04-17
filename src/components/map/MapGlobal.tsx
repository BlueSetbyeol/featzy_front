import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { CustomAdvancedMarkers } from "../../components/map/CustomAdvancedMarkers";
import type { Restaurant } from "@/types/mapTypes";
import { useState } from "react";
import CustomAdvancedDescription from "../../components/map/CustomAdvancedDescription";

interface MapGlobalProps {
  restaurants: Restaurant[];
}

export default function MapGlobal({ restaurants }: MapGlobalProps) {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [clicked, setClicked] = useState(0);

  return (
    <APIProvider apiKey={API_KEY} libraries={["marker"]}>
      <Map
        mapId={"c0e09e50af53e4dc56e87afd"}
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={{ lat: 45.757732, lng: 4.83635 }}
        defaultZoom={13}
        gestureHandling="greedy"
        disableDefaultUI
      >
        <CustomAdvancedMarkers
          restaurants={restaurants}
          clicked={clicked}
          setClicked={setClicked}
        />
        <CustomAdvancedDescription
          restaurants={restaurants}
          clicked={clicked}
          setClicked={setClicked}
        />
      </Map>
    </APIProvider>
  );
}
