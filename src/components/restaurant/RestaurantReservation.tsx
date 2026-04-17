import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Restaurant } from "@/types/mapTypes";

interface RestaurantFavoriteCardProps {
  restaurant: Restaurant;
  pastReservation: boolean;
}

export default function RestaurantReservation({
  restaurant,
  pastReservation,
}: RestaurantFavoriteCardProps) {
  return (
    <>
      {pastReservation ? (
        <Card
          className={
            "mx-auto w-full md:w-[20em] max-w-sm p-3 bg-primary gap-2 flex-row justify-start"
          }
        >
          <div className="relative h-18 w-30 rounded-phone">
            <img
              src={restaurant.cover_image_url}
              alt="Restaurant image"
              className="absolute object-cover border-4 h-18 w-30 border-primary aspect-video rounded-phone right-1 bottom-1"
            />
          </div>
          <CardDescription className="flex flex-col justify-around w-full">
            <CardHeader className="flex items-center justify-between gap-1 px-0">
              <CardTitle className="pb-1 text-2xl border-b border-secondary font-title text-secondary">
                {restaurant.name}
              </CardTitle>
            </CardHeader>
            <section className={"px-0 flex flex-row gap-4 pt-2"}>
              <Badge
                variant="secondary"
                className="rounded-phone py-0.5 px-1.5 text-[12px] m-0 bg-secondary text-primary font-light"
              >
                Nb personne
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-phone py-0.5 px-1.5 text-[12px] m-0 bg-secondary text-primary font-light"
              >
                Date Résa
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-phone py-0.5 px-1.5 text-[12px] m-0 bg-secondary text-primary font-light"
              >
                Heure Résa
              </Badge>
            </section>
          </CardDescription>
        </Card>
      ) : (
        <Card
          className={
            "mx-auto w-full md:w-[20em] max-w-sm p-3 bg-primary gap-2 flex-row justify-start"
          }
        >
          <div className="relative h-28 w-42 rounded-phone">
            <img
              src={restaurant.cover_image_url}
              alt="Restaurant image"
              className="absolute object-cover border-4 h-28 w-42 border-primary aspect-video rounded-phone"
            />
          </div>
          <CardDescription className="flex flex-col justify-around w-full">
            <CardHeader className="flex items-center justify-between gap-1 px-0">
              <CardTitle className="pb-1 text-2xl border-b border-secondary font-title text-secondary">
                {restaurant.name}
              </CardTitle>
              <Badge
                variant="secondary"
                className="rounded-phone py-0.5 px-1.5 text-[12px] m-0 bg-secondary text-primary font-light"
              >
                Payé ?
              </Badge>
            </CardHeader>
            <section className="px-0 flex flex-col gap-2 pt-1">
              <Badge
                variant="secondary"
                className="rounded-phone py-0.5 px-1.5 text-[12px] m-0 bg-secondary text-primary font-light"
              >
                Nb personne
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-phone py-0.5 px-1.5 text-[12px] m-0 bg-secondary text-primary font-light"
              >
                Date à Heure - Résa
              </Badge>
            </section>
          </CardDescription>
        </Card>
      )}
    </>
  );
}
