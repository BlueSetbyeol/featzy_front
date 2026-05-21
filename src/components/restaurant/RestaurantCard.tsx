import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Restaurant } from "@/types/restaurantTypes";
import { Link } from "react-router";
import Placeholder from "../../assets/image/rice.webp";
import { Heart, Star } from "lucide-react";

interface RestaurantCardProps {
  restaurant: Restaurant;
  profileList: boolean;
}

export default function RestaurantCard({
  restaurant,
  profileList,
}: RestaurantCardProps) {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="w-full">
      <Card
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
        <CardContent className="flex items-start justify-between gap-1 px-5 min-h-15">
          <CardTitle className="flex flex-col items-start">
            <h5
              className={
                profileList
                  ? "text-[0.8em] font-title text-start text-foreground font-medium"
                  : "text-[1.2em] font-title text-start text-foreground font-medium"
              }
            >
              {restaurant.name}
            </h5>
            <p
              className={
                profileList
                  ? "text-start text-[0.7em] text-muted-foreground font-normal pb-2 pt-1"
                  : "text-start text-[1em] text-muted-foreground font-normal pb-2 pt-1"
              }
            >
              Cuisine {restaurant.cuisine_type}
            </p>
          </CardTitle>
          <Heart
            className={
              profileList
                ? "text-primary fill-primary w-4 h-4"
                : "text-primary w-6 h-6"
            }
          />
        </CardContent>
        <CardFooter
          className={
            profileList
              ? "hidden"
              : "px-0 pt-1 border-t border-secondary min-h-10"
          }
        >
          {restaurant.opening_hours &&
            restaurant.opening_hours.data &&
            restaurant.opening_hours.data.map((time) => (
              <Button
                className="w-auto mr-2 bg-secondary text-foreground rounded-button"
                key={time.day_of_week}
              >
                {time.day_name} : {time.opening_time} - {time.closing_time}
              </Button>
            ))}
        </CardFooter>
      </Card>
    </Link>
  );
}
