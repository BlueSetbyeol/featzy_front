import { userApi } from "@/api/userApi";
import { Badge } from "@/components/ui/badge";
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import GeoContext from "@/context/GeoContext";
import { calculateDistance } from "@/services/calculateDistanceToRestaurant";
import type { Restaurant } from "@/types/restaurantTypes";
import { Heart, Star } from "lucide-react";
import { useContext, useState } from "react";

import Placeholder from "../../../assets/image/rice.webp";

interface RestaurantDrawerHeaderProps {
  restaurant: Restaurant;
  profileList: boolean;
}

export default function RestaurantDrawerHeader({
  restaurant,
  profileList,
}: RestaurantDrawerHeaderProps) {
  const { userCenter } = useContext(GeoContext);

  const getDistanceLabel = (restaurant: Restaurant): string => {
    if (!userCenter) return "";

    const distance = calculateDistance(userCenter, restaurant);

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const [addedFavorite, setAddedFavorite] = useState<boolean>(false);

  async function handleClickFavorite(
    e: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) {
    e.preventDefault();
    e.stopPropagation();
    const addRemoveRestaurant =
      await userApi.addRemoveOneFavoriteRestaurant(id);
    if (addRemoveRestaurant.data.favorited === true) {
      setAddedFavorite(true);
    } else {
      setAddedFavorite(false);
    }
  }

  return (
    <DrawerHeader className="relative px-0 py-3">
      <DrawerDescription className="sr-only">
        Informations sur le Restaurant : menu, avis, à propos
      </DrawerDescription>
      <Badge
        variant="secondary"
        className="rounded-phone py-0.5 px-1.5 absolute z-21 top-7 right-3 text-[0.8em] bg-background text-foreground"
      >
        <Star className="text-accent fill-accent" />
        {restaurant.average_rating}
      </Badge>
      <img
        // src={restaurant.cover_image_url}
        src={Placeholder}
        alt="Restaurant image"
        className="relative object-cover z-1 rounded-t-sm h-45 mb-4"
      />
      <section className="w-full flex flex-col justify-between items-start px-6">
        <section className="w-full flex flex-row justify-between">
          <DrawerTitle className="text-[20px] text-start font-title font-medium leading-6.5 tracking-[0.2px] m-0">
            {restaurant.name}
          </DrawerTitle>
          <button
            type="button"
            onClick={(e) => {
              handleClickFavorite(e, restaurant.id);
              console.log(restaurant.id);
            }}
          >
            <Heart
              className={
                profileList
                  ? "text-primary fill-primary w-4 h-4"
                  : addedFavorite
                    ? "text-secondary-foreground w-5 h-5 fill-secondary-foreground"
                    : "text-secondary-foreground w-5 h-5"
              }
            />
          </button>
        </section>
        <section className="w-full flex flex-row justify-between items-end">
          <section className="text-[12px] text-start font-normal leading-5 tracking-[0.2px] m-0 flex flex-row gap-2">
            <p>Cuisine {restaurant.cuisine_type}</p>
            <p>{restaurant.price_range}</p>
            <p>{restaurant.address.city}</p>
          </section>
          {userCenter && (
            <p className="text-[12px] text-start font-normal leading-5 tracking-[0.2px] m-0 flex flex-row gap-2">
              {getDistanceLabel(restaurant)}
            </p>
          )}
        </section>
      </section>
    </DrawerHeader>
  );
}
