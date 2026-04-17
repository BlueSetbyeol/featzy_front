import type { Restaurant } from "./mapTypes";

export type User = {
  firstname: string;
  lastname: string;
  profile_picture_url: string;
  email: string;
  phone_number: string;
  address_id: number;
  is_active: boolean;
  friends?: {
    id: number;
    firstname: string;
    lastname: string;
    image: string;
  }[];
  diet?: string[];
  registered_restaurant?: Restaurant[];
};
