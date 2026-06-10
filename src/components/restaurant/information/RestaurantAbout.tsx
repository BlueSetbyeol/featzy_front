import MapForRestaurant from "@/components/map/MapForRestaurant";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Restaurant } from "@/types/restaurantTypes";
import { Home, Phone } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router";

interface RestaurantAboutProps {
  restaurant: Restaurant;
}

export default function RestaurantAbout({ restaurant }: RestaurantAboutProps) {
  const [value, setValue] = useState("horaires");

  const location = useLocation();

  return (
    <article className="w-full flex flex-col items-start gap-3 py-4">
      <div className="text-start">{restaurant.description}</div>
      <div className="flex flex-col gap-1 items-start w-full pb-4">
        <div className="flex flex-row gap-2 items-end w-full">
          <Home className="size-4" />
          <p className="text-[0.9em]">
            {restaurant.address.street} - {restaurant.address.zipcode}{" "}
            {restaurant.address.city},{restaurant.address.country}
          </p>
        </div>
        <div className="flex flex-row gap-2 items-end w-full">
          <Phone className="size-4" />
          <p className="text-[0.9em]">{restaurant.phone_number}</p>
        </div>
        <Select
          value={value}
          onValueChange={(val) => {
            setValue(val);
          }}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={value}
              className="text-[1em] font-ligth"
            />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            <SelectGroup>
              <SelectItem value="horaires">Horaires</SelectItem>
              {restaurant.opening_hours &&
                restaurant.opening_hours.data.map((time) => (
                  <SelectItem value="{time.day_name} " key={time.day_of_week}>
                    {time.day_name}: {time.opening_time} - {time.closing_time}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {location.pathname === `/` && (
        <MapForRestaurant restaurant={restaurant} />
      )}
    </article>
  );
}
