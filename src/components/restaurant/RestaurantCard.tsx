import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Restaurant } from "@/types/mapTypes";
import Like from "../../assets/icon/unselected_heart.svg";
import Loved from "../../assets/icon/selected_heart.svg";
import Rate from "../../assets/icon/star.svg";
import { Link } from "react-router";

interface RestaurantCardProps {
  restaurant: Restaurant;
  profileList: boolean;
}

export default function RestaurantCard({
  restaurant,
  profileList,
}: RestaurantCardProps) {
  return (
    <Link to="/restaurant" className="w-full">
      {/* TODO Ajouter l'Id du restautant à appeler : /{restaurant.id}*/}
      <Card
        className={
          profileList
            ? "relative text-primary-foreground p-3 w-75 shrink-0"
            : "relative mx-auto w-full min-w-[13em] md:w-[20em] max-w-sm p-3 bg-primary text-primary-foreground gap-2 justify-start"
        }
      >
        <Badge
          variant="secondary"
          className="rounded-phone py-0.5 px-1.5 absolute z-21 top-6 right-6 text-[14px]"
        >
          {restaurant.average_rating}
          <img src={Rate} alt="rate number" className="size-6" />
        </Badge>
        <img
          src={restaurant.cover_image_url}
          alt="Restaurant image"
          className="relative object-cover w-full z-1 aspect-video rounded-phone"
        />
        <CardHeader className="gap-1 px-0">
          <CardTitle className="flex items-center justify-between text-2xl font-title">
            {restaurant.name}
            <img
              src={profileList ? Loved : Like}
              alt="unselected heart"
              className="size-7"
            />
          </CardTitle>
          <CardDescription className="text-primary-foreground text-start text-[20px pb-2">
            Cuisine {restaurant.cuisine_type}
          </CardDescription>
        </CardHeader>
        <CardFooter
          className={
            profileList ? "hidden" : "px-0 pt-1  border-t border-secondary"
          }
        >
          {restaurant.openingHours.map((hour, index) => (
            <Button
              className="w-auto mr-2 bg-secondary text-foreground rounded-button"
              key={index}
            >
              {hour}
            </Button>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
}
