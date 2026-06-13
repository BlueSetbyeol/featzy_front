import { ArrowLeft, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { orderApi, reservationApi } from "@/api/reservationApi";
import { extractApiError } from "@/lib/axios";
import { formatPrice } from "@/lib/format";
import type {
  InvitationStatus,
  Order,
  Reservation,
} from "@/types/reservationTypes";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Textarea } from "../../ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import {
  formatReservedAt,
  reservationStatusLabels,
} from "@/services/reservationDisplay";
import Placeholder from "../../../assets/image/image.png";

const invitationStatusLabels: Record<InvitationStatus, string> = {
  pending: "En attente",
  accepted: "Accepté",
  declined: "Refusé",
};

function canShowOrder(reservation: Reservation): boolean {
  return (
    reservation.is_preorder &&
    ["confirmed", "seated", "completed"].includes(reservation.status)
  );
}

function formatAddress(reservation: Reservation): string {
  const address = reservation.restaurant?.address;
  if (!address) {
    return "";
  }
  return [address.street, address.postal_code, address.city]
    .filter(Boolean)
    .join(", ");
}

export default function ReservationDetails() {
  const { id } = useParams();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const data = await reservationApi.getOne(id);
        if (cancelled) {
          return;
        }
        setReservation(data);
        if (canShowOrder(data)) {
          try {
            const openedOrder = await orderApi.open(data.id);
            if (!cancelled) {
              setOrder(openedOrder);
            }
          } catch {
            if (!cancelled) {
              setOrder(null);
            }
          }
        } else {
          setOrder(null);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(extractApiError(error).message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  async function handleCancelReservation() {
    if (!id) {
      return;
    }
    setCancelling(true);
    try {
      await reservationApi.cancel(id, cancelReason.trim() || undefined);
      setCancelOpen(false);
      setCancelReason("");
      toast.success("Ta réservation a bien été annulée");
      setReloadKey((key) => key + 1);
    } catch (error) {
      const apiError = extractApiError(error);
      if (apiError.code === "CANCELLATION_DEADLINE_PASSED") {
        toast.error("Le délai d'annulation est dépassé");
      } else {
        toast.error(apiError.message);
      }
    } finally {
      setCancelling(false);
    }
  }

  const restaurant = reservation?.restaurant;
  const participants = reservation?.participants ?? [];
  const orderItems = order?.items ?? [];
  const isNegativeStatus =
    reservation?.status === "cancelled" || reservation?.status === "no_show";
  const canCancel =
    reservation !== null &&
    reservation.status === "confirmed" &&
    new Date(reservation.reserved_at).getTime() > Date.now();

  return (
    <main className="h-screen">
      <div className="w-full h-20 flex flex-row gap-3 px-5 items-center">
        <Link to="/my-reservation">
          <ArrowLeft className="size-5" />
        </Link>
        <h1>Ma réservation</h1>
      </div>
      {loading ? (
        <div className="w-[90vw] h-96 mx-auto rounded-xl bg-muted animate-pulse" />
      ) : reservation ? (
        <Card className="p-1 bg-primary text-primary-foreground w-[90vw] gap-2">
          <div className="flex justify-center items-center gap-2 mt-2">
            {isNegativeStatus ? (
              <X className="rounded-full bg-card text-primary size-6 p-1" />
            ) : (
              <Check className="rounded-full bg-card text-primary size-6 p-1" />
            )}
            <h2>{reservationStatusLabels[reservation.status]}</h2>
          </div>
          <Card className="p-4 ">
            <CardHeader className="flex flex-row justify-start items-center gap-2 px-0">
              <img
                src={restaurant?.media.cover ?? restaurant?.media.logo ?? Placeholder}
                alt="Reservation image"
                className="h-[4em] w-[4em] rounded-full object-cover"
              />
              <div className="flex flex-col items-start text-start">
                <p>{restaurant?.name}</p>
                <p className="text-[0.8em] text-muted-foreground">
                  {formatAddress(reservation)}
                </p>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <section>
                <article className="flex flex-row justify-between items-start">
                  <h3 className="text-[0.9em] font-light text-muted-foreground">
                    DATE & HEURE
                  </h3>
                  <h3 className="text-[0.9em] font-light text-muted-foreground">
                    STATUT
                  </h3>
                </article>
                <article className="flex flex-row justify-between items-center">
                  <p className="text-[0.9em]">
                    {formatReservedAt(reservation.reserved_at)}
                  </p>
                  <Badge
                    variant={isNegativeStatus ? "destructive" : "secondary"}
                  >
                    {reservationStatusLabels[reservation.status]}
                  </Badge>
                </article>
              </section>
              <Separator className="my-4" />
              <section>
                <article className="flex flex-col items-start">
                  <h3 className="text-[0.9em] font-light pb-1 text-muted-foreground">
                    TA RÉSERVATION
                  </h3>
                  {reservation.service && <p>{reservation.service.name}</p>}
                  <p>
                    {reservation.party_size}{" "}
                    {reservation.party_size > 1 ? "personnes" : "personne"}
                  </p>
                  {reservation.is_preorder && (
                    <Badge variant="secondary" className="mt-1">
                      Pré-commande
                    </Badge>
                  )}
                </article>
                {reservation.special_requests && (
                  <article className="flex flex-col items-start mt-4">
                    <h3 className="text-[0.9em] font-light pb-1 text-muted-foreground">
                      DEMANDES SPÉCIALES
                    </h3>
                    <p className="text-start">{reservation.special_requests}</p>
                  </article>
                )}
                {participants.length > 0 && (
                  <article className="flex flex-col items-start mt-4 gap-1">
                    <h3 className="text-[0.9em] font-light pb-1 text-muted-foreground">
                      PARTICIPANTS
                    </h3>
                    {participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="w-full flex flex-row justify-between items-center"
                      >
                        <p className="text-[0.9em]">{participant.user?.name}</p>
                        <Badge variant="outline">
                          {invitationStatusLabels[participant.invitation_status]}
                        </Badge>
                      </div>
                    ))}
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
                        <p className="text-[0.9em]">
                          {item.quantity}x {item.name_snapshot}
                        </p>
                        <p className="text-[0.9em]">
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
              <section className="w-full flex flex-col gap-2">
                {canCancel && (
                  <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full mt-5 rounded-sm font-light text-[0.9em]"
                      >
                        Annuler la réservation
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Annuler la réservation ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est définitive. Tu peux préciser une
                          raison si tu le souhaites.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <Textarea
                        value={cancelReason}
                        onChange={(event) =>
                          setCancelReason(event.target.value)
                        }
                        placeholder="Raison de l'annulation (optionnel)"
                      />
                      <AlertDialogFooter>
                        <AlertDialogCancel>Retour</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          disabled={cancelling}
                          onClick={(event) => {
                            event.preventDefault();
                            void handleCancelReservation();
                          }}
                        >
                          {cancelling ? "Annulation…" : "Confirmer"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                {restaurant && (
                  <Link
                    to={`/restaurant/${restaurant.id}/new-reservation`}
                    className="w-full"
                  >
                    <Button
                      className={`w-full ${canCancel ? "" : "mt-5"} rounded-sm bg-accent text-secondary-foreground font-light text-[1em]`}
                    >
                      Réserver de nouveau
                    </Button>
                  </Link>
                )}
              </section>
            </CardContent>
          </Card>
        </Card>
      ) : (
        <section className="w-full pt-5 flex flex-col items-center gap-8">
          <p>Réservation introuvable</p>
          <Link to="/my-reservation">
            <Button>Retour à mes réservations</Button>
          </Link>
        </section>
      )}
    </main>
  );
}
