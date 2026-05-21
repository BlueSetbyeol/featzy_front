import { useLocation } from "react-router";
import { Button } from "../ui/button";
import Search from "../../assets/icon/search.svg";
import Filters from "../../assets/icon/filters_red.svg";
import { useContext, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { AlertTriangleIcon, MapPin } from "lucide-react";
import GeoContext from "@/context/GeoContext";

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

export default function SearchingLoc() {
  const location = useLocation();
  const { setZoom, setMapCenter } = useContext(GeoContext);

  const GMKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [userLocation, setUserLocation] = useState<string>("");
  const [userLocationError, setUserLocationError] = useState<string[]>([]);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "error" | "success"
  >("idle");

  // this function is called if a user inputs their address manually
  async function handleAddressSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    const googleResp = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${userLocation}&key=${GMKey}`,
    );
    const newGeocode = await googleResp.json();
    if (newGeocode.error_message && newGeocode.status === "REQUEST_DENIED") {
      setUserLocationError([
        "This address cannot be geolocated. Please avoid using symbols, apartment / suite numbers, city names or zip codes",
      ]);
      setLocationStatus("error");
    } else {
      setUserLocationError([]);
      setLocationStatus("success");
      setMapCenter(newGeocode.results[0].geometry.location);
      setZoom(15);
    }
  }

  async function handleDialogClose() {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      setMapCenter({ lat: latitude, lng: longitude });
      setZoom(15);

      // Reverse geocode to get a human-readable name
      try {
        const resp = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GMKey}`,
        );
        const data = await resp.json();

        if (data.status === "OK" && data.results.length > 0) {
          // Pick the most useful component — street or neighborhood
          const addressComponents = data.results[0].address_components;
          const street = addressComponents.find((c: AddressComponent) =>
            c.types.includes("route"),
          )?.long_name;
          const neighborhood = addressComponents.find(
            (c: AddressComponent) =>
              c.types.includes("neighborhood") ||
              c.types.includes("sublocality"),
          )?.long_name;

          setUserLocation(
            street ?? neighborhood ?? data.results[0].formatted_address,
          );
        }
      } catch (err) {
        console.error("Reverse geocoding failed:", err);
        setUserLocation("");
      }
    });
  }

  return (
    <section
      className={
        location.pathname !== "/map"
          ? "w-full"
          : "w-full px-5 z-9999 absolute top-4 "
      }
    >
      <article
        className={
          location.pathname !== "/map"
            ? "flex flex-row items-center gap-2"
            : "flex flex-row items-center gap-2 text-secondary pl-3 mb-2 bg-primary rounded-phone "
        }
      >
        <MapPin className="text-white size-[1.3em]" />
        <p className="text-background font-light">Lieu choisi</p>

        <Dialog>
          {locationStatus === "error" && userLocationError ? (
            <AlertTriangleIcon className="size-4" />
          ) : (
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="m-0 p-0 w-[70%] text-background font-light"
              >
                {locationStatus === "success"
                  ? `: ${userLocation}`
                  : "Me localiser"}
              </Button>
            </DialogTrigger>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lieu choisi</DialogTitle>
              <DialogDescription>
                Autorisation de géolocalisation
              </DialogDescription>
            </DialogHeader>
            <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
              <p className="mb-4 leading-normal">
                Pour que nous puissions trouver les restaurants dans votre
                proximité, nous avons besoin de votre autorisation de
                géolocalisation. Ces informations ne seront pas mémoriser et ne
                serviront que le temps de votre session.
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">
                  Saisir une adresse manuellement
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="default" onClick={handleDialogClose}>
                  Accepter
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </article>

      <article className="bg-background flex flex-row w-full p-3 mb-5 rounded-phone gap-2">
        <img
          src={Search}
          alt="click to look for the location you want"
          className="size-[1.5em]"
        />
        <input
          type="text"
          className="w-[80%] mr-2 pl-4 text-foreground rounded-sm focus:border-foreground border-0"
          placeholder="Recherche"
          onChange={(e) => {
            setUserLocation(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddressSubmit(e);
            }
          }}
        />
        <img
          src={Filters}
          alt="Search's settings and filters"
          className="size-[1.5em]"
        />
      </article>
    </section>
  );
}
