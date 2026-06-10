export type Restaurant = {
  id: number;
  name: string;
  description: string;
  email: string;
  phone_number: string;
  cuisine_type: string;
  price_range: string;
  price_range_label: string;
  capacity: number;
  allow_pre_order: boolean;
  average_rating: number;
  total_reviews: number;
  is_active: boolean;
  logo_url: string;
  cover_image_url: string;
  address: {
    id: number;
    street: string;
    zipcode: string;
    city: string;
    country: string;
    additional_info?: string;
    latitude: number;
    longitude: number;
  };
  owner_id?: number;
  opening_hours?: {
    data: {
      day_of_week: number;
      day_name: string;
      opening_time: string;
      closing_time: string;
      service_label: string;
      is_closed: boolean;
    }[];
  };
};

export type MenuCard = {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  items: {
    data: Menu[];
  };
};

export type Menu = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  category_label: string;
  image_url: string;
  stock_quantity: number;
  is_available: boolean;
};
