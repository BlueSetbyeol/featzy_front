import { useCancelReservation } from "@/hooks/useReservations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { extractApiError } from "@/lib/axios";
import {
  formatReservedAt,
  formatTimeToReservation,
} from "@/services/reservationDisplay";
import type { Order, OrderItem, Reservation } from "@/types/reservationTypes";
import { Check, X } from "lucide-react";
import UserContext from "@/context/UserContext";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useContext, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import Dislike from "../../../assets/icon/heart_dislike.svg";

import Placeholder from "../../../assets/image/rice.webp";

interface ReservationFuturDetailsProps {
  reservation: Reservation;
  id: string | undefined;
  order: Order | null;
}

export default function ReservationFuturDetails({
  reservation,
  id,
  order,
}: ReservationFuturDetailsProps) {
  const { user } = useContext(UserContext);
  const [cancelReason, setCancelReason] = useState("");
  const cancelMutation = useCancelReservation();
  const cancelling = cancelMutation.isPending;

  const canCancel =
    reservation !== null &&
    reservation.status === "confirmed" &&
    new Date(reservation.slot_at).getTime() > Date.now();

  async function handleCancelReservation() {
    if (!id) {
      return;
    }
    try {
      await cancelMutation.mutateAsync({
        id,
        reason: cancelReason.trim() || undefined,
      });
      setCancelReason("");
      toast.success("Votre réservation a bien été annulée");
      setReloadKey((key) => key + 1);
    } catch (error) {
      const apiError = extractApiError(error);
      if (apiError.code === "CANCELLATION_DEADLINE_PASSED") {
        toast.error("Le délai d'annulation est dépassé");
      } else {
        toast.error(apiError.message);
      }
    }
  }

  const restaurant = reservation?.restaurant;
  const participants = reservation?.participants ?? [];
  const myParticipant = participants.find((p) => p.user_id === user?.id) ?? null;
  const orderItems = order?.items ?? [];
  const isNegativeStatus =
    reservation?.status === "cancelled" || reservation?.status === "no_show";

  const earlyCommandIsDone = (items: OrderItem[], participant_id: number) => {
    const commanded = items.filter(
      (item) => item.reservation_participant_id === participant_id,
    );
    if (commanded.length > 0) {
      return "Commandé";
    } else {
      return "En attente";
    }
  };

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
          <section className="flex flex-col items-start">
            <h3 className="text-[0.9em] font-light pb-1 text-muted-foreground">
              DETAILS DE LA RESERVATION
            </h3>
            <p className="text-[0.9em] font-light">
              {reservation.party_size > 1 && "En groupe de "}
              {reservation.party_size}{" "}
              {reservation.party_size > 1 ? "personnes" : "personne"}
            </p>
            <p className="text-[0.9em]">Pré-commande(s) :</p>
            {participants.length > 0 && (
              <article className="w-full flex flex-col items-start ml-2 gap-1">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="w-full flex flex-row justify-between items-center"
                  >
                    <p className="text-[0.9em]">{participant.user?.name}</p>
                    <Badge
                      variant="outline"
                      className={
                        earlyCommandIsDone(orderItems, participant.id) ===
                        "Commandé"
                          ? "border-accent border-2"
                          : ""
                      }
                    >
                      {earlyCommandIsDone(orderItems, participant.id)}
                    </Badge>
                  </div>
                ))}
              </article>
            )}
          </section>
          {user && (
            <article className="flex flex-col items-start mb-3">
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
          <section className="w-full flex flex-row gap-2 justify-between my-4">
            {canCancel && (
              <Drawer>
                <DrawerTrigger asChild>
                  <Button className="w-[48%] rounded-sm font-light text-[0.9em]">
                    <p className="text-[1.2em]">Annuler</p>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="px-4">
                  <DrawerHeader className="items-start px-0">
                    <DrawerTitle className="flex flex-row gap-2">
                      <img
                        src={Dislike}
                        alt="favori"
                        className="bg-[#F2C1C1] rounded-full p-1"
                      />
                      Annuler la réservation ?
                    </DrawerTitle>
                    <DrawerDescription className="sr-only">
                      Annuler la réservation
                    </DrawerDescription>
                    <p className="text-[0.9em] font-light text-start">
                      Cette action est définitive. Vous pouvez préciser une
                      raison si vous le souhaites.
                    </p>
                  </DrawerHeader>
                  <Textarea
                    value={cancelReason}
                    onChange={(event) => setCancelReason(event.target.value)}
                    placeholder="Raison de l'annulation (optionnel)"
                    className="text-[0.9em] font-light"
                  />
                  <DrawerFooter>
                    <Button
                      disabled={cancelling}
                      onClick={(event) => {
                        event.preventDefault();
                        void handleCancelReservation();
                      }}
                    >
                      <p className="text-[0.9em] font-light">
                        {cancelling ? "Annulation…" : "Confirmer l'annulation"}
                      </p>
                    </Button>
                    <DrawerClose>
                      <Button variant="secondary" className="bg-muted w-full">
                        <p className="text-[0.9em] font-light">
                          Non, vous avez changé d'avis
                        </p>
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            )}
            {restaurant && (
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    className={`w-[48%] rounded-sm bg-accent text-secondary-foreground font-light text-[1em]`}
                    disabled={!canCancel}
                  >
                    <p className="text-[1.1em]">Modifier</p>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="px-4">
                  <DrawerHeader className="items-start px-0">
                    <DrawerTitle className="flex flex-row gap-2">
                      <img
                        src={Dislike}
                        alt="favori"
                        className="bg-[#F2C1C1] rounded-full p-1"
                      />
                      Modifier la réservation ?
                    </DrawerTitle>
                    <DrawerDescription className="sr-only">
                      Modifier la réservation
                    </DrawerDescription>
                    <p className="text-[0.9em] font-light text-start">
                      Toute modification risque l’annulation de la réservation
                      par le restaurateur.
                    </p>
                  </DrawerHeader>
                  <DrawerFooter className="px-0 pt-0">
                    <Link
                      to={`/restaurant/${restaurant.id}/new-reservation`}
                      className="w-full"
                    >
                      <Button className="w-full">
                        <p className="text-[0.9em] font-light">
                          Vous souhaitez modifier
                        </p>
                      </Button>
                    </Link>
                    <DrawerClose>
                      <Button variant="secondary" className="bg-muted w-full">
                        <p className="text-[0.9em] font-light">
                          Non, vous avez changé d'avis
                        </p>
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            )}
          </section>
          {myParticipant &&
            restaurant &&
            earlyCommandIsDone(orderItems, myParticipant.id) === "En attente" && (
              <Link
                to={`/command/${reservation.id}/early-command`}
                className="w-full"
              >
                <Button
                  className={`w-full rounded-sm font-light text-[1em]`}
                  disabled={
                    formatTimeToReservation(reservation.slot_at) === "Passé"
                  }
                >
                  <p className="text-[1.1em]">
                    Pré-commander votre repas (
                    {formatTimeToReservation(reservation.slot_at)})
                  </p>
                </Button>
              </Link>
            )}
        </CardContent>
      </Card>
    </Card>
  );
}
