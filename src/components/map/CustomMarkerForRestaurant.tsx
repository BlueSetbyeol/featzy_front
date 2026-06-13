import { useState, useRef, useEffect, type FunctionComponent } from "react";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import Pin from "@/assets/icon/pin.svg";
import type { Restaurant } from "@/types/restaurantTypes";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";

import Placeholder from "../../assets/image/rice.webp";

interface Props {
  restaurant: Restaurant;
  clicked: number;
  setClicked: (id: number) => void;
}
export const CustomMarkerForRestaurant: FunctionComponent<Props> = ({
  restaurant,
  clicked,
  setClicked,
}: Props) => {
  const [hovered, setHovered] = useState(0);

  const map = useMap();

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

  const renderCustomPin = (restaurant: Restaurant) => {
    return (
      <>
        <div
          className={
            clicked === restaurant.id
              ? "pin_basic w-20 max-w-20 h-20 bg-primary"
              : hovered === restaurant.id
                ? "pin_basic w-20 max-w-20 h-20"
                : "pin_basic w-8.5 max-w-8.5 h-8.5"
          }
        >
          <div className="relative w-full h-full overflow-hidden no-scrollbar rounded-[inherit] flex justify-center items-center transition-opacity duration-200 ease-in-out">
            <img
              src={restaurant.media.cover ?? Placeholder}
              alt="Image of the restaurant"
              className={
                clicked === restaurant.id || hovered === restaurant.id
                  ? "absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-75 ease-in-out"
                  : "absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-75 ease-in-out"
              }
            />
            <span
              className={
                clicked === restaurant.id
                  ? "hidden"
                  : hovered === restaurant.id
                    ? "hidden"
                    : "absolute opacity-100 transition-opacity duration-200 ease-in-out"
              }
            >
              <img src={Pin} alt="pin du restaurant" />
            </span>
          </div>
        </div>

        <div
          className={
            clicked === restaurant.id || hovered === restaurant.id
              ? "absolute bottom-0 w-0 h-0 border-8 border-primary rounded-none rounded-br-[5px] -z-1 left-1/2 translate-y-[23%] -translate-x-1/2 rotate-45 scale-[1.4] "
              : "absolute bottom-0 w-0 h-0 border-8 border-secondary rounded-none rounded-br-[5px] -z-1 left-1/2 translate-y-[22%] -translate-x-1/2 rotate-45 transition-all duration-200 ease-in-out"
          }
        />
      </>
    );
  };

  const { latitude, longitude } = restaurant.address;
  if (latitude === null || longitude === null) return null;

  return (
    <>
      <AdvancedMarker
        position={{ lat: latitude, lng: longitude }}
        title={restaurant.name}
        onMouseEnter={() => setHovered(restaurant.id)}
        onMouseLeave={() => setHovered(0)}
        className={
          clicked === restaurant.id
            ? "marker_basic z-3 -translate-y-2.25"
            : hovered === restaurant.id
              ? "marker_basic z-2 -translate-y-2.25"
              : "marker_basic z-1 -translate-y-1.25"
        }
        clickable={true}
        onClick={() => {
          setClicked(clicked === restaurant.id ? 0 : restaurant.id);
        }}
        ref={(marker) => setMarkerRef(marker, restaurant.id)}
      >
        <div className="relative flex flex-col items-center">
          {renderCustomPin(restaurant)}
        </div>
      </AdvancedMarker>
    </>
  );
};
