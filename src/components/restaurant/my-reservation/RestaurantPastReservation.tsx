import { Card, CardDescription, CardFooter } from "@/components/ui/card";
import type { Reservation } from "@/types/reservationTypes";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import {
  formatSimpleReservedAt,
  reservationStatusLabels,
} from "@/services/reservationDisplay";
import { Badge } from "@/components/ui/badge";

import Placeholder from "../../../assets/image/rice.webp";

interface RestaurantPastReservationProps {
  reservation: Reservation;
}

export default function RestaurantPastReservation({
  reservation,
}: RestaurantPastReservationProps) {
  const restaurant = reservation.restaurant;

  const isNegativeStatus =
    reservation.status === "cancelled" || reservation.status === "no_show";

  return (
    <Link to={`/my-reservation/${reservation.id}`} className="w-full">
      <Card className="w-full h-26 md:w-[20em] px-3 py-4 bg-background gap-2 flex flex-row justify-between items-center">
        <section className="flex flex-row w-[90%] gap-3 items-center">
          <img
            src={restaurant?.media.cover ?? Placeholder}
            alt="Restaurant image"
            className="h-[4em] w-[4em] rounded-full object-cover"
          />
          <CardDescription className="text-start flex flex-col justify-center gap-1">
            <h5 className="text-[1.2em] font-title text-foreground font-medium">
              {restaurant?.name}
            </h5>
            <p className="text-[0.9em] text-muted-foreground">
              {formatSimpleReservedAt(reservation.slot_at)}
            </p>
            {isNegativeStatus && (
              <Badge
                variant={"destructive"}
                className={`rounded-phone px-2 text-[0.7em] m-0 font-light`}
              >
                {reservationStatusLabels[reservation.status]}
              </Badge>
            )}
          </CardDescription>
        </section>
        <CardFooter className="px-0">
          <ChevronRight />
        </CardFooter>
      </Card>
    </Link>
  );
}
