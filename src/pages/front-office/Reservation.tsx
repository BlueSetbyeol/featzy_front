import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import RestaurantReservation from "@/components/restaurant/my-reservation/RestaurantReservation";
import { Button } from "@/components/ui/button";
import { reservationApi } from "@/api/reservationApi";
import { extractApiError } from "@/lib/axios";
import type { Reservation as ReservationModel } from "@/types/reservationTypes";
import type { PaginationMeta } from "@/types/responsesTypes";

function isUpcoming(reservation: ReservationModel): boolean {
  return (
    (reservation.status === "confirmed" || reservation.status === "seated") &&
    new Date(reservation.reserved_at).getTime() >= Date.now()
  );
}

export default function Reservation() {
  const [reservations, setReservations] = useState<ReservationModel[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    reservationApi
      .getMine()
      .then((page) => {
        if (cancelled) return;
        setReservations(page.data);
        setMeta(page.meta);
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(extractApiError(error).message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function loadMore() {
    if (!meta || meta.current_page >= meta.last_page) {
      return;
    }
    setLoadingMore(true);
    try {
      const page = await reservationApi.getMine(meta.current_page + 1);
      setReservations((previous) => [...previous, ...page.data]);
      setMeta(page.meta);
    } catch (error) {
      toast.error(extractApiError(error).message);
    } finally {
      setLoadingMore(false);
    }
  }

  const upcoming = reservations
    .filter(isUpcoming)
    .sort(
      (a, b) =>
        new Date(a.reserved_at).getTime() - new Date(b.reserved_at).getTime(),
    );
  const past = reservations
    .filter((reservation) => !isUpcoming(reservation))
    .sort(
      (a, b) =>
        new Date(b.reserved_at).getTime() - new Date(a.reserved_at).getTime(),
    );
  const hasMore = meta !== null && meta.current_page < meta.last_page;

  return (
    <main className="flex flex-col items-start justify-start w-full h-full gap-4 overflow-y-auto no-scrollbar mb-4">
      <h2 className="pt-4 text-3xl font-title text-start px-5">
        Mes réservations
      </h2>
      {loading ? (
        <section className="flex flex-col w-full gap-4 px-5 pt-5">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-full h-26 md:w-[20em] rounded-xl bg-muted animate-pulse"
            />
          ))}
        </section>
      ) : reservations.length > 0 ? (
        <>
          {upcoming.length > 0 && (
            <section className="w-full pt-5">
              <article className="w-full flex flex-row justify-between px-5 pb-2">
                <h4 className="text-xl font-title">A venir</h4>
              </article>
              <section className="flex flex-col w-full gap-8 px-5">
                {upcoming.map((reservation) => (
                  <RestaurantReservation
                    key={reservation.id}
                    reservation={reservation}
                    pastReservation={false}
                  />
                ))}
              </section>
            </section>
          )}
          {past.length > 0 && (
            <section className="w-full pt-5">
              <article className="w-full flex flex-row justify-between px-5 pb-2">
                <h4 className="text-xl font-title">Passées</h4>
              </article>
              <section className="flex flex-col w-full gap-8 px-5">
                {past.map((reservation) => (
                  <RestaurantReservation
                    key={reservation.id}
                    reservation={reservation}
                    pastReservation={true}
                  />
                ))}
              </section>
            </section>
          )}
          {hasMore && (
            <section className="w-full flex justify-center pt-2 pb-4">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Chargement…" : "Voir plus"}
              </Button>
            </section>
          )}
        </>
      ) : (
        <section className="w-full h-full pt-5 flex flex-col justify-center gap-8">
          <p>Tu n'as pas encore fait de réservation</p>
          <Link to="/map">
            <Button>Voir les restaurants</Button>
          </Link>
        </section>
      )}
    </main>
  );
}
