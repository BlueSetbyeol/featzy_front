import type { Geolocation } from "@/types/mapTypes";
import { createContext, useState } from "react";

const GeoContext = createContext<GeoProps>({
  setGeo: () => {},
  setMapCenter: () => {},
  setUserCenter: () => {},
  setUserLocation: () => {},
  setZoom: () => {},
  zoom: 6,
});

interface GeoProps {
  setGeo: React.Dispatch<React.SetStateAction<Geolocation | undefined>>;
  Geo?: Geolocation;
  mapCenter?: { lat: number; lng: number };
  setMapCenter: (mapCenter: { lat: number; lng: number }) => void;
  userCenter?: { lat: number; lng: number };
  setUserCenter: (userCenter: { lat: number; lng: number }) => void;
  userLocation?: string;
  setUserLocation: (userLocation: string) => void;
  setZoom: (zoom: number) => void;
  zoom: number;
}

export const GeoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [Geo, setGeo] = useState<Geolocation | undefined>();
  const [mapCenter, setMapCenter] = useState<
    { lat: number; lng: number } | undefined
  >();
  const [userCenter, setUserCenter] = useState<
    { lat: number; lng: number } | undefined
  >();
  const [zoom, setZoom] = useState(6);
  const [userLocation, setUserLocation] = useState<string>("");

  return (
    <GeoContext.Provider
      value={{
        Geo,
        setGeo,
        zoom,
        setZoom,
        mapCenter,
        setMapCenter,
        userCenter,
        setUserCenter,
        userLocation,
        setUserLocation,
      }}
    >
      {children}
    </GeoContext.Provider>
  );
};

export default GeoContext;
