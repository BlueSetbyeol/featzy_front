export type Geolocation = {
  location: {
    lat: number;
    lng: number;
  };
};

export type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};
