import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter } from "@/components/ui/card";
import type { Reservation } from "@/types/reservationTypes";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import {
  formatReservedAt,
  formatTimeLimit,
} from "@/services/reservationDisplay";

import Placeholder from "../../../assets/image/rice.webp";

interface RestaurantReservationProps {
  reservation: Reservation;
}

export default function RestaurantReservation({
  reservation,
}: RestaurantReservationProps) {
  const restaurant = reservation.restaurant;

  return (
    <Link to={`/my-reservation/${reservation.id}`} className="w-full">
      <Card
        className={`w-full h-29 md:w-[20em] px-3 py-4 bg-background gap-2 flex flex-row justify-between items-center`}
      >
        <section className="flex flex-row w-[90%] gap-3 items-center">
          <img
            src={(restaurant && restaurant.media.cover) ?? Placeholder}
            alt="Restaurant image"
            className="h-[4em] w-[4em] rounded-full object-cover"
          />
          <CardDescription className="text-start flex flex-col justify-center">
            <h5 className="text-[1.2em] font-title text-foreground font-medium">
              {restaurant?.name}
            </h5>
            <p className="text-[0.7em] text-muted-foreground">
              Précommande(s) :{" "}
              <span className="text-primary">
                {reservation.participants?.length}/{reservation.party_size}
              </span>
            </p>
            <p className="text-[0.7em]">
              Modification possible jusqu’à{" "}
              <span className="text-primary">
                {formatTimeLimit(reservation.slot_at)}
              </span>
            </p>
            <section className="px-0 flex flex-row flex-wrap gap-2 pt-1">
              <Badge
                variant="secondary"
                className="rounded-phone px-2 text-[0.7em] m-0 bg-secondary text-foreground font-light"
              >
                {reservation.party_size}{" "}
                {reservation.party_size > 1 ? "personnes" : "personne"}
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-phone px-2 text-[0.7em] m-0 bg-secondary text-foreground font-light"
              >
                {formatReservedAt(reservation.slot_at)}
              </Badge>
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
