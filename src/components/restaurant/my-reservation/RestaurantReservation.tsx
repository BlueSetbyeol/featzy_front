import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter } from "@/components/ui/card";
import type { Reservation } from "@/types/reservationTypes";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import {
  formatReservedAt,
  reservationStatusLabels,
} from "@/services/reservationDisplay";
import Placeholder from "../../../assets/image/rice.webp";

interface RestaurantReservationProps {
  reservation: Reservation;
  pastReservation: boolean;
}

export default function RestaurantReservation({
  reservation,
  pastReservation,
}: RestaurantReservationProps) {
  const restaurant = reservation.restaurant;
  const imageUrl = restaurant?.media.cover ?? restaurant?.media.logo ?? Placeholder;
  const isNegativeStatus =
    reservation.status === "cancelled" || reservation.status === "no_show";

  return (
    <Link to={`/my-reservation/${reservation.id}`} className="w-full">
      <Card
        className={`w-full ${pastReservation ? "h-26" : "h-29"} md:w-[20em] px-3 py-4 bg-background gap-2 flex flex-row justify-between items-center`}
      >
        <section className="flex flex-row w-[90%] gap-3 items-center">
          <img
            src={imageUrl}
            alt="Restaurant image"
            className="h-[4em] w-[4em] rounded-full object-cover"
          />
          <CardDescription className="text-start flex flex-col justify-center">
            <h5 className="text-[1.2em] font-title text-foreground font-medium">
              {restaurant?.name}
            </h5>
            <p className="text-[0.9em]">
              {formatReservedAt(reservation.reserved_at)}
            </p>
            <section className="px-0 flex flex-row flex-wrap gap-2 pt-1">
              <Badge
                variant={isNegativeStatus ? "destructive" : "secondary"}
                className={`rounded-phone py-1 px-2 text-[0.7em] m-0 ${isNegativeStatus ? "" : "bg-secondary text-foreground"}`}
              >
                {reservationStatusLabels[reservation.status]}
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-phone py-1 px-2 text-[0.7em] m-0 bg-secondary text-foreground"
              >
                {reservation.party_size}{" "}
                {reservation.party_size > 1 ? "personnes" : "personne"}
              </Badge>
              {reservation.is_preorder && (
                <Badge
                  variant="secondary"
                  className="rounded-phone py-1 px-2 text-[0.7em] m-0 bg-secondary text-foreground"
                >
                  Pré-commande
                </Badge>
              )}
            </section>
          </CardDescription>
        </section>
        <CardFooter className="px-0">
          <ChevronRight />
        </CardFooter>
      </Card>
    </Link>
  );
}
