import { userApi } from "@/api/userApi";
import { Badge } from "@/components/ui/badge";
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import GeoContext from "@/context/GeoContext";
import UserContext from "@/context/UserContext";
import { extractApiError } from "@/lib/axios";
import { priceLevelLabel } from "@/lib/format";
import { calculateDistance } from "@/services/calculateDistanceToRestaurant";
import type { Restaurant } from "@/types/restaurantTypes";
import { Heart, Star } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

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
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [isFavorited, setIsFavorited] = useState<boolean>(
    restaurant.is_favorited ?? false,
  );
  const [favoritePending, setFavoritePending] = useState(false);

  const getDistanceLabel = (): string => {
    if (!userCenter) return "";

    const distance: number | null = calculateDistance(userCenter, restaurant);
    if (distance == null) return "";

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  async function handleClickFavorite(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }
    if (favoritePending) return;

    const next = !isFavorited;
    setIsFavorited(next);
    setFavoritePending(true);
    try {
      if (next) {
        await userApi.addFavorite(restaurant.id);
      } else {
        await userApi.removeFavorite(restaurant.id);
      }
    } catch (error) {
      setIsFavorited(!next);
      toast.error(extractApiError(error).message);
    } finally {
      setFavoritePending(false);
    }
  }

  const cuisineNames = restaurant.cuisine_types
    ?.map((cuisine) => cuisine.name)
    .join(", ");

  return (
    <DrawerHeader className="relative px-0 py-3">
      <DrawerDescription className="sr-only">
        Informations sur le Restaurant : menu, avis, à propos
      </DrawerDescription>
      {restaurant.average_rating !== null && (
        <Badge
          variant="secondary"
          className="rounded-phone py-0.5 px-1.5 absolute z-21 top-7 right-3 text-[0.8em] bg-background text-foreground"
        >
          <Star className="text-accent fill-accent" />
          {restaurant.average_rating.toFixed(1)}
        </Badge>
      )}
      <img
        src={restaurant.media.cover ?? Placeholder}
        alt={restaurant.name}
        className="relative object-cover z-1 rounded-t-sm h-45 mb-4"
      />
      <section className="w-full flex flex-col justify-between items-start px-6">
        <section className="w-full flex flex-row justify-between">
          <DrawerTitle className="text-[20px] text-start font-title font-medium leading-6.5 tracking-[0.2px] m-0">
            {restaurant.name}
          </DrawerTitle>
          <button type="button" onClick={handleClickFavorite}>
            <Heart
              className={
                profileList
                  ? "text-primary fill-primary w-4 h-4"
                  : isFavorited
                    ? "text-secondary-foreground w-5 h-5 fill-secondary-foreground"
                    : "text-secondary-foreground w-5 h-5"
              }
            />
          </button>
        </section>
        <section className="w-full flex flex-row justify-between items-end">
          <section className="text-[12px] text-start font-normal leading-5 tracking-[0.2px] m-0 flex flex-row gap-2">
            {cuisineNames && <p>Cuisine {cuisineNames}</p>}
            {restaurant.price_level !== null && (
              <p>{priceLevelLabel(restaurant.price_level)}</p>
            )}
            {restaurant.address.city && <p>{restaurant.address.city}</p>}
          </section>
          {userCenter && (
            <p className="text-[12px] text-start font-normal leading-5 tracking-[0.2px] m-0 flex flex-row gap-2">
              {getDistanceLabel()}
            </p>
          )}
        </section>
      </section>
    </DrawerHeader>
  );
}
