import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Restaurant } from "@/types/restaurantTypes";
import { Heart, Star } from "lucide-react";
import { userApi } from "@/api/userApi";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import GeoContext from "@/context/GeoContext";
import UserContext from "@/context/UserContext";
import { calculateDistance } from "@/services/calculateDistanceToRestaurant";
import { extractApiError } from "@/lib/axios";
import { priceLevelLabel } from "@/lib/format";
import RestaurantDrawer from "./information/RestaurantDrawer";

import Placeholder from "../../assets/image/rice.webp";

interface RestaurantCardProps {
  restaurant: Restaurant;
  profileList: boolean;
}

export default function RestaurantCard({
  restaurant,
  profileList,
}: RestaurantCardProps) {
  const { userCenter } = useContext(GeoContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [isFavorited, setIsFavorited] = useState<boolean>(
    restaurant.is_favorited ?? false,
  );
  const [open, setOpen] = useState(false);

  async function handleClickFavorite(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    const next = !isFavorited;
    setIsFavorited(next);
    try {
      if (next) {
        await userApi.addFavorite(restaurant.id);
      } else {
        await userApi.removeFavorite(restaurant.id);
      }
    } catch (error) {
      setIsFavorited(!next);
      toast.error(extractApiError(error).message);
    }
  }

  function getDistanceLabel(): string {
    if (!userCenter) return "";

    const distance = calculateDistance(userCenter, restaurant);
    if (distance === null) return "";

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  }

  const distanceLabel = getDistanceLabel();
  const subtitle = [
    restaurant.cuisine_types?.map((cuisine) => cuisine.name).join(", ") ?? "",
    priceLevelLabel(restaurant.price_level),
  ]
    .filter(Boolean)
    .join(" · ");

  console.log(restaurant.media.cover);

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className={
          profileList
            ? "relative text-primary-foreground p-3 w-75 shrink-0"
            : "relative mx-auto w-full min-w-[16em] md:w-[23em] max-w-sm py-0 bg-background border border-secondary text-primary-foreground gap-2 justify-start"
        }
      >
        <CardHeader className="w-full px-0">
          <Badge
            variant="secondary"
            className="rounded-phone py-0.5 px-1.5 absolute z-21 top-3 right-3 text-[0.8em] bg-background text-foreground"
          >
            {restaurant.average_rating !== null ? (
              <>
                <Star className="text-accent fill-accent" />
                {restaurant.average_rating}
              </>
            ) : (
              "Nouveau"
            )}
          </Badge>
          <img
            src={restaurant.media.cover ?? Placeholder}
            alt={`Photo du restaurant ${restaurant.name}`}
            className="relative object-cover z-1 aspect-video rounded-t-sm"
          />
        </CardHeader>
        <CardContent className="w-full flex flex-col items-start gap-1 px-5 min-h-15">
          <CardTitle className="w-full flex flex-row justify-between">
            <h5
              className={
                profileList
                  ? "text-[0.8em] font-title text-start text-foreground font-medium"
                  : "text-[1.2em] font-title text-start text-foreground font-medium"
              }
            >
              {restaurant.name}
            </h5>
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
          </CardTitle>
          <section className="w-full flex flex-row justify-between">
            <p
              className={
                profileList
                  ? "text-start text-[0.7em] text-muted-foreground font-normal pb-2 pt-1"
                  : "text-start text-[1em] text-muted-foreground font-normal pb-2 pt-1"
              }
            >
              {subtitle}
            </p>
            {distanceLabel && (
              <p className="text-start text-[1em] text-muted-foreground font-normal pb-2 pt-1">
                {distanceLabel}
              </p>
            )}
          </section>
        </CardContent>
      </Card>
      <RestaurantDrawer
        open={open}
        onOpenChange={setOpen}
        restaurant={restaurant}
        profileList={profileList}
      />
    </>
  );
}
