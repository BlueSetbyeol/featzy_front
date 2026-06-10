import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Restaurant } from "@/types/restaurantTypes";
import { Heart, Star } from "lucide-react";
import { userApi } from "@/api/userApi";
import { useContext, useEffect, useState } from "react";
import GeoContext from "@/context/GeoContext";
import { calculateDistance } from "@/services/calculateDistanceToRestaurant";
import RestaurantDrawer from "./information/RestaurantDrawer";
// import UserContext from "@/context/UserContext";

import Placeholder from "../../assets/image/rice.webp";
import UserContext from "@/context/UserContext";

interface RestaurantCardProps {
  restaurant: Restaurant;
  profileList: boolean;
}

export default function RestaurantCard({
  restaurant,
  profileList,
}: RestaurantCardProps) {
  const [addedFavorite, setAddedFavorite] = useState<boolean>(false);
  const { userCenter } = useContext(GeoContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!restaurant.id) return;
    if (!user) return;

    async function getOneRestaurant() {
      const allFavorites = await userApi.getAllFavoriteRestaurant();
      allFavorites.filter((favorite) => {
        if (favorite.restaurant_id === restaurant.id) {
          setAddedFavorite(true);
        }
      });
    }

    getOneRestaurant();
  }, [restaurant.id, user]);

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

  function getDistanceLabel(restaurant: Restaurant) {
    if (!userCenter) return "";

    const distance = calculateDistance(userCenter, restaurant);

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  }

  const [open, setOpen] = useState(false);

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
            <Star className="text-accent fill-accent" />
            {restaurant.average_rating}
          </Badge>
          <img
            // src={restaurant.cover_image_url}
            src={Placeholder}
            alt="Restaurant image"
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
            <button
              type="button"
              onClick={(e) => {
                handleClickFavorite(e, restaurant.id);
              }}
              disabled={user === undefined && true}
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
          </CardTitle>
          <section className="w-full flex flex-row justify-between">
            <p
              className={
                profileList
                  ? "text-start text-[0.7em] text-muted-foreground font-normal pb-2 pt-1"
                  : "text-start text-[1em] text-muted-foreground font-normal pb-2 pt-1"
              }
            >
              Cuisine {restaurant.cuisine_type}
            </p>
            {getDistanceLabel(restaurant).length > 1 && (
              <p className="text-start text-[1em] text-muted-foreground font-normal pb-2 pt-1">
                {getDistanceLabel(restaurant)}
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
