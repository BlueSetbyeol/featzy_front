import type { Restaurant } from "@/types/restaurantTypes";
import Pin from "@/assets/icon/pin.svg";
import { MarkerClusterer, type Marker } from "@googlemaps/markerclusterer";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useContext, useEffect, useRef, useState } from "react";
import GeoContext from "@/context/GeoContext";
import RestaurantDrawer from "../restaurant/information/RestaurantDrawer";

interface CustomeMarkerDescriptionProps {
  restaurants: Restaurant[];
}

export default function CustomMarkerDescription({
  restaurants,
}: CustomeMarkerDescriptionProps) {
  const map = useMap();
  const { setZoom, setMapCenter } = useContext(GeoContext);

  const [markers, setMarkers] = useState<{ [key: number]: Marker }>({});

  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: number) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  const profileList = false;

  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  return (
    <>
      {restaurants.map((restaurant: Restaurant) => (
        <div key={restaurant.id}>
          <AdvancedMarker
            position={{
              lat: Number(restaurant.address.latitude),
              lng: Number(restaurant.address.longitude),
            }}
            title={"AdvancedMarker with custom html content."}
            clickable={true}
            ref={(marker) => {
              setMarkerRef(marker, restaurant.id);
            }}
            onClick={() => {
              setMapCenter({
                lat: Number(restaurant.address.latitude),
                lng: Number(restaurant.address.longitude),
              });
              setZoom(13);
              setSelectedRestaurant(restaurant);
            }}
          >
            <div className="relative flex items-center hover:bg-transparent hover:size-12 dark:hover:bg-transparent">
              <img src={Pin} alt="pin du restaurant" className="size-10" />
            </div>
          </AdvancedMarker>
          <RestaurantDrawer
            open={selectedRestaurant?.id === restaurant.id}
            onOpenChange={(open) => !open && setSelectedRestaurant(null)}
            restaurant={selectedRestaurant ?? restaurant}
            profileList={profileList}
          />
        </div>
      ))}
    </>
  );
}
