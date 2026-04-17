import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Restaurant } from "@/types/mapTypes";
import Loved from "../../assets/icon/selected_heart.svg";

interface RestaurantFavoriteCardProps {
  restaurant: Restaurant;
}

export default function RestaurantFavoriteCard({
  restaurant,
}: RestaurantFavoriteCardProps) {
  return (
    <Card
      className={
        "mx-auto w-full md:w-[20em] max-w-sm p-3 bg-muted-foreground text-primary-foreground gap-2 flex-row justify-start"
      }
    >
      <div>
        <div className="relative bg-foreground h-18 w-30 rounded-phone">
          <img
            src={restaurant.cover_image_url}
            alt="Restaurant image"
            className="absolute object-cover border-4 h-18 w-30 border-primary aspect-video rounded-phone right-1 bottom-1"
          />
        </div>
      </div>
      <CardDescription className="flex flex-col justify-around w-full">
        <CardHeader className="flex items-center justify-between gap-1 px-0">
          <CardTitle className="pb-1 text-2xl border-b font-title border-primary text-primary">
            {restaurant.name}
          </CardTitle>
          <img src={Loved} alt="unselected heart" className="size-7" />
        </CardHeader>
        <section className={"px-0 flex flex-row gap-4 pt-2"}>
          <Badge
            variant="secondary"
            className="rounded-phone py-0.5 px-1.5 text-[14px] m-0 bg-primary text-secondary"
          >
            {restaurant.cuisine_type}
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-phone py-0.5 px-1.5 text-[14px] m-0 bg-primary text-secondary"
          >
            {restaurant.city}
          </Badge>
        </section>
      </CardDescription>
    </Card>
  );
}
