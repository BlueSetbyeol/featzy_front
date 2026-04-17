export type Restaurant = {
  id: number;
  owner_id: number;
  name: string;
  email: string;
  phone_number: string;
  description: string;
  cuisine_type: string;
  logo_url: string;
  openingHours: string[];
  cover_image_url: string;
  price_range: string;
  capacity: number;
  average_rating: number;
  total_reviews: number;
  is_active: boolean;
  accepts_reservations: boolean;
  //following to delete later on
  address_id: number;
  location: {
    lat: number;
    lng: number;
  };
  city?: string;
};
