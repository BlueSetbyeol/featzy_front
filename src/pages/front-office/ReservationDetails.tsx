import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { Order, Reservation } from "@/types/reservationTypes";
import { Button } from "../../components/ui/button";
import ReservationFuturDetails from "@/components/restaurant/my-reservation/ReservationFuturDetails";
import ReservationPastDetails from "@/components/restaurant/my-reservation/ReservationPastDetails";
import { formatTimeLimit } from "@/services/reservationDisplay";
import { orderApi, reservationApi } from "@/api/reservationApi";
import { extractApiError } from "@/lib/axios";
import { toast } from "sonner";

function canShowOrder(reservation: Reservation): boolean {
  return (
    reservation.is_preorder &&
    ["confirmed", "seated", "completed"].includes(reservation.status)
  );
}

export default function ReservationDetails() {
  const { id } = useParams();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

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

  return (
    <main className="h-[92dvh] px-5">
      <div className="w-full h-[8vh] flex flex-row gap-3 mb-5 pt-2 items-center">
        <Link to="/my-reservation">
          <ArrowLeft className="size-5" />
        </Link>
        <h1>
          {reservation && new Date(reservation.slot_at).getTime() >= Date.now()
            ? "A venir"
            : "Passée"}
        </h1>
      </div>
      <section className="h-[80vh] overflow-y-auto no-scrollbar w-full">
        {loading ? (
          <div className="w-[90vw] h-96 mx-auto rounded-xl bg-muted animate-pulse" />
        ) : reservation ? (
          reservation &&
          new Date(reservation.slot_at).getTime() >= Date.now() ? (
            <ReservationFuturDetails
              reservation={reservation}
              setReloadKey={setReloadKey}
              id={id}
              order={order}
            />
          ) : (
            <ReservationPastDetails reservation={reservation} order={order} />
          )
        ) : (
          <section className="w-full pt-5 flex flex-col items-center gap-8">
            <p>Réservation introuvable</p>
            <Link to="/my-reservation">
              <Button>Retour à vos réservations</Button>
            </Link>
          </section>
        )}
        {reservation &&
          new Date(reservation.slot_at).getTime() >= Date.now() && (
            <p className="text-primary text-[1.1em] mt-4 font-light">
              Modification/annulation possible jusqu’à{" "}
              {formatTimeLimit(reservation.slot_at)} le jour même
            </p>
          )}
      </section>
    </main>
  );
}
