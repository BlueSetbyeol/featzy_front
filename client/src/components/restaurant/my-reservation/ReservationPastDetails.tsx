import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatReservedAt } from "@/services/reservationDisplay";
import type { Order, Reservation } from "@/types/reservationTypes";
import { Check, X } from "lucide-react";
import { Link } from "react-router";
import { formatPrice } from "@/lib/format";
import { useContext } from "react";
import UserContext from "@/context/UserContext";

import Placeholder from "../../../assets/image/rice.webp";

interface ReservationPastDetailsProps {
  reservation: Reservation;
  order: Order | null;
}

export default function ReservationPastDetails({
  reservation,
  order,
}: ReservationPastDetailsProps) {
  const { user } = useContext(UserContext);

  const restaurant = reservation?.restaurant;
  const orderItems = order?.items ?? [];
  const isNegativeStatus =
    reservation?.status === "cancelled" || reservation?.status === "no_show";

  return (
    <Card className="p-1 bg-primary text-primary-foreground w-[90vw] gap-2">
      <div className="flex justify-center items-center gap-2 mt-2">
        {isNegativeStatus ? (
          <X className="rounded-full bg-card text-primary size-6 p-1" />
        ) : (
          <Check className="rounded-full bg-card text-primary size-6 p-1" />
        )}
        <h2>
          {reservation.participants?.forEach(
            (guest) => guest.invitation_status === "accepted",
          )
            ? "Comandée"
            : "Réservée"}
        </h2>
      </div>
      <Card className="p-4 ">
        <CardHeader className="flex flex-row justify-start items-center gap-2 px-0">
          <img
            src={
              restaurant?.media.cover ?? restaurant?.media.logo ?? Placeholder
            }
            alt="Reservation image"
            className="h-[4em] w-[4em] rounded-full object-cover"
          />
          <div className="flex flex-col items-start text-start">
            <p>{restaurant?.name}</p>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <section className="flex flex-row justify-between items-start w-full">
            <article className="flex flex-col justify-start items-start w-1/2">
              <h3 className="text-[0.9em] font-light text-muted-foreground text-start">
                DATE DE COMMANDE
              </h3>
              <p className="text-[0.9em] font-light">
                {formatReservedAt(reservation.slot_at)}
              </p>
            </article>

            <article className="flex flex-col items-end w-1/2">
              <h3 className="text-[0.9em] font-light text-muted-foreground">
                N° DE COMMANDE
              </h3>

              <p className="text-[0.9em] font-light text-end">
                {reservation.public_uuid}
              </p>
            </article>
          </section>
          <Separator className="my-4" />
          <section className="flex flex-col items-start gap-3">
            <article className="flex flex-col items-start">
              <h3 className="text-[0.9em] font-light pb-1 text-muted-foreground">
                TYPE COMMANDE
              </h3>
              <p className="text-[0.9em] font-light">
                {reservation.is_preorder
                  ? "Pré-commande en ligne"
                  : "Commande sur place"}
              </p>
              <p className="text-[0.9em] font-light">
                {reservation.party_size > 1 && "En groupe de "}
                {reservation.party_size}{" "}
                {reservation.party_size > 1 ? "personnes" : "personne"}
              </p>
            </article>
            {user && (
              <article className="flex flex-col items-start">
                <h3 className="text-[0.9em] font-light pb-1 text-muted-foreground">
                  VOS INFORMATIONS
                </h3>
                <p className="text-[0.9em] font-light">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-[0.9em] font-light">{user.phone}</p>
                <p className="text-[0.9em] font-light">{user.email}</p>
              </article>
            )}
          </section>
          {orderItems.length > 0 && (
            <>
              <Separator className="my-4" />
              <section>
                <h3 className="text-[0.9em] font-light pb-1 text-muted-foreground text-start">
                  RECAPITULATIF
                </h3>
                {orderItems.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-row justify-between items-start"
                  >
                    <p className="text-[0.9em] font-light">
                      {item.quantity}x {item.name_snapshot}
                    </p>
                    <p className="text-[0.9em] font-light">
                      {formatPrice(item.line_total)}
                    </p>
                  </article>
                ))}
                <article className="flex flex-row justify-between items-start bg-accent text-foreground p-2 rounded-md mt-2">
                  <p className="text-[1.1em]">Total</p>
                  <p className="text-[1.1em]">
                    {formatPrice(order?.items_total ?? 0)}
                  </p>
                </article>
              </section>
            </>
          )}
          <section className="w-full flex flex-row gap-2 mt-5 justify-between">
            <Button className="w-[48%] rounded-sm">
              <p className="text-[0.9em] font-light">Télécharger la facture</p>
            </Button>
            {restaurant && (
              <Link
                to={`/restaurant/${restaurant.id}/new-reservation`}
                className="w-[48%]"
              >
                <Button
                  className={`w-full rounded-sm bg-accent text-secondary-foreground font-light text-[1em]`}
                >
                  <p className="text-[0.9em] font-light">Réserver à nouveau</p>
                </Button>
              </Link>
            )}
          </section>
        </CardContent>
      </Card>
    </Card>
  );
}
