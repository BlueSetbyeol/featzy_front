import { Link } from "react-router";
import RestaurantReservation from "@/components/restaurant/my-reservation/RestaurantReservation";
import RestaurantPastReservation from "@/components/restaurant/my-reservation/RestaurantPastReservation";
import { Button } from "@/components/ui/button";
import { useMyReservations } from "@/hooks/useReservations";
import type { Reservation as ReservationModel } from "@/types/reservationTypes";

function isUpcoming(reservation: ReservationModel): boolean {
  return (
    (reservation.status === "confirmed" || reservation.status === "seated") &&
    new Date(reservation.slot_at).getTime() >= Date.now()
  );
}

export default function Reservation() {
  const {
    data,
    isLoading: loading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage: loadingMore,
  } = useMyReservations();

  const reservations = data?.pages.flatMap((page) => page.data) ?? [];

  function loadMore() {
    if (hasNextPage) {
      void fetchNextPage();
    }
  }

  const upcoming = reservations
    .filter(isUpcoming)
    .sort(
      (a, b) => new Date(a.slot_at).getTime() - new Date(b.slot_at).getTime(),
    );
  const past = reservations
    .filter((reservation) => !isUpcoming(reservation))
    .sort(
      (a, b) => new Date(b.slot_at).getTime() - new Date(a.slot_at).getTime(),
    );
  const hasMore = hasNextPage;

  return (
    <main className="flex flex-col items-start justify-start w-full h-full gap-4 overflow-y-auto no-scrollbar mb-4">
      <h2 className="pt-4 text-3xl font-title text-start px-5">
        Vos réservations
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
              <section className="flex flex-col w-full gap-3 px-5">
                {upcoming.map((reservation) => (
                  <RestaurantReservation
                    key={reservation.id}
                    reservation={reservation}
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
              <section className="flex flex-col w-full gap-3 px-5">
                {past.map((reservation) => (
                  <RestaurantPastReservation
                    key={reservation.id}
                    reservation={reservation}
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
          <p>Vous n'avez pas encore fait de réservation</p>
          <Link to="/map">
            <Button>Voir les restaurants</Button>
          </Link>
        </section>
      )}
    </main>
  );
}
