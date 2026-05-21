import type { Restaurant } from "@/types/restaurantTypes";
import { Button } from "../ui/button";
import Pin from "@/assets/icon/pin.svg";
import Like from "../../assets/icon/heart_unselected.svg";
import Rate from "../../assets/icon/star.svg";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MarkerClusterer, type Marker } from "@googlemaps/markerclusterer";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useContext, useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import GeoContext from "@/context/GeoContext";
import Placeholder from "../../assets/image/rice.webp";

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

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [showReservation, setShowReservation] = useState<boolean>(false);
  const [showPictures, setShowPictures] = useState<boolean>(false);

  const drawerMenuList = [
    { name: "menu", itemShow: showMenu },
    { name: "details", itemShow: showDetails },
    { name: "about", itemShow: showAbout },
    { name: "reservation", itemShow: showReservation },
    { name: "pictures", itemShow: showPictures },
  ];

  function handleInformationsDisplay(info: string) {
    setShowMenu(info === "menu");
    setShowDetails(info === "details");
    setShowAbout(info === "about");
    setShowReservation(info === "reservation");
    setShowPictures(info === "pictures");
  }

  return (
    <>
      {restaurants.map((restaurant: Restaurant) => (
        <Drawer direction="bottom" key={restaurant.id}>
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
            }}
          >
            <div className="relative flex flex-col items-center">
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  className="capitalize hover:bg-transparent hover:size-12 dark:hover:bg-transparent"
                >
                  <img src={Pin} alt="pin du restaurant" className="size-10" />
                </Button>
              </DrawerTrigger>
            </div>
          </AdvancedMarker>

          <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[90vh] min-h-auto pb-2">
            {/* pb-[10vh] avec la navbar non clickable ... */}
            <DrawerHeader className="relative">
              <DrawerTitle className="text-primary text-[20px] not-italic font-bold leading-6.5 tracking-[0.2px] m-0">
                {restaurant.name}
              </DrawerTitle>
              <DrawerDescription className="w-full text-[14px] not-italic font-normal leading-5 tracking-[0.2px] m-0">
                Spécialité: {restaurant.cuisine_type}
              </DrawerDescription>
              <img
                src={Like}
                alt="unselected heart"
                className="size-7 absolute z-21 top-6 right-6"
              />
            </DrawerHeader>
            <div className="no-scrollbar overflow-y-auto px-4">
              {restaurant && (
                <section>
                  <div className=" relative w-full h-70.5 flex flex-row items-start justify-between gap-3 z-0">
                    <img
                      // src={restaurant.cover_image_url}
                      src={Placeholder}
                      alt="Photo du restaurant"
                      className="z-0 h-full w-full"
                    />
                  </div>
                  <Badge
                    variant="secondary"
                    className="rounded-phone py-0.5 px-1.5 absolute z-21 top-28 right-6 text-[14px]"
                  >
                    {restaurant.average_rating}
                    <img src={Rate} alt="rate number" className="size-6" />
                  </Badge>
                  <article className="w-full flex flex-col items-start gap-2">
                    <section className="flex w-full gap-4 overflow-x-auto no-scrollbar px-5 my-3">
                      {drawerMenuList.map((item, index) => (
                        <Button
                          variant="ghost"
                          onClick={() => handleInformationsDisplay(item.name)}
                          className={
                            item.itemShow
                              ? "border-0 border-b-primary border-b rounded-none"
                              : "border-0"
                          }
                          key={index}
                        >
                          {item.name}
                        </Button>
                      ))}
                    </section>
                  </article>
                  {showDetails && (
                    <article className="w-full flex flex-col items-start gap-2 pb-4">
                      <h1>Détails</h1>
                      <div className="flex flex-col items-start w-full">
                        <p className="text-[13px]">
                          Adresse : {restaurant.address.street} -{" "}
                          {restaurant.address.zipcode} {restaurant.address.city}
                          ,{restaurant.address.country}
                        </p>
                        <p className="text-[13px]">distance ??</p>
                        <p className="text-[13px]">
                          Phone : {restaurant.phone_number}
                        </p>
                        {restaurant.opening_hours &&
                          restaurant.opening_hours.data.map((time) => (
                            <Button
                              className="w-auto mr-2 bg-secondary text-foreground rounded-button"
                              key={time.day_of_week}
                            >
                              {time.day_name} : {time.opening_time} -{" "}
                              {time.closing_time}
                            </Button>
                          ))}
                      </div>
                    </article>
                  )}
                </section>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      ))}
    </>
  );
}
