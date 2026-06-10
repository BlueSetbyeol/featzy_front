import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter } from "@/components/ui/card";
import type { Restaurant } from "@/types/restaurantTypes";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

interface RestaurantFavoriteCardProps {
  restaurant: Restaurant;
  pastReservation: boolean;
}

export default function RestaurantReservation({
  restaurant,
  pastReservation,
}: RestaurantFavoriteCardProps) {
  // TODO remplacer restaurant.id par l'id de la réservation !
  return (
    <>
      {pastReservation ? (
        <Link to={`/reservation/${restaurant.id}`} className="w-full">
          <Card className="w-full h-26 md:w-[20em] px-3 py-4 bg-background gap-2 flex flex-row justify-between items-center">
            <section className="flex flex-row w-[90%] gap-3 items-center">
              <img
                src={restaurant.cover_image_url}
                alt="Restaurant image"
                className="h-[4em] w-[4em] rounded-full"
              />
              <CardDescription className="text-start flex flex-col justify-center">
                <h5 className="text-[1.2em] font-title text-foreground font-medium">
                  {restaurant.name}
                </h5>
                <p className="text-[0.9em]">Date Résa</p>
              </CardDescription>
            </section>
            <CardFooter className="px-0">
              <ChevronRight />
            </CardFooter>
          </Card>
        </Link>
      ) : (
        <Link to={`/reservation/${restaurant.id}`} className="w-full">
          <Card className="w-full h-29 md:w-[20em] px-3 py-4 bg-background gap-2 flex flex-row justify-between items-center">
            <section className="flex flex-row w-[90%] gap-3 items-center">
              <img
                src={restaurant.cover_image_url}
                alt="Restaurant image"
                className="h-[4em] w-[4em] rounded-full"
              />
              <CardDescription className="text-start flex flex-col justify-center">
                <h5 className="text-[1.2em] font-title text-foreground font-medium">
                  {restaurant.name}
                </h5>
                <p className="text-[0.9em]">Payé ?</p>
                <section className="px-0 flex flex-row gap-2 pt-1">
                  <Badge
                    variant="secondary"
                    className="rounded-phone py-1 px-2 text-[0.7em] m-0 bg-secondary text-foreground"
                  >
                    Nb personne
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="rounded-phone py-1 px-2 text-[0.7em] m-0 bg-secondary text-foreground"
                  >
                    Date à Heure - Résa
                  </Badge>
                </section>
              </CardDescription>
            </section>
            <CardFooter className="px-0">
              <ChevronRight />
            </CardFooter>
          </Card>
        </Link>
      )}
    </>
  );
}
