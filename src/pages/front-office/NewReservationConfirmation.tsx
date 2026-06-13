import { orderApi, reservationApi } from "@/api/reservationApi";
import { Button } from "@/components/ui/button";
import UserContext from "@/context/UserContext";
import { extractApiError } from "@/lib/axios";
import type { Order, Reservation } from "@/types/reservationTypes";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

export default function NewReservationConfirmation() {
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("reservation");
  const { user, loading: userLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(!user && !userLoading);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!reservationId || userLoading) {
      return;
    }
    let cancelled = false;
    Promise.all([
      reservationApi.getOne(reservationId),
      orderApi.open(reservationId),
    ])
      .then(([fetchedReservation, openedOrder]) => {
        if (cancelled) {
          return;
        }
        setReservation(fetchedReservation);
        setOrder(openedOrder);
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
  }, [reservationId, user, userLoading]);

  useEffect(() => {
    if (!reservation) {
      return;
    }
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [reservation]);

  const reservedAtDate = reservation
    ? new Date(reservation.reserved_at.replace(" ", "T"))
    : null;
  const remainingMinutes = reservedAtDate
    ? Math.max(Math.floor((reservedAtDate.getTime() - now) / 60000), 0)
    : 0;
  const timeLeftBeforeReservation = `${String(Math.floor(remainingMinutes / 60)).padStart(2, "0")}:${String(remainingMinutes % 60).padStart(2, "0")}`;
  const timeofReservation = reservedAtDate
    ? format(reservedAtDate, "HH:mm")
    : "";

  if (!reservationId) {
    return (
      <main className="h-full w-full">
        <div className="w-full flex flex-row gap-3 px-5 pt-5 items-center">
          <Link to="/my-reservation" className="justify-start items-start">
            <ArrowLeft className="size-4" />
          </Link>
          <section className="text-start">
            <h1>Votre réservation</h1>
          </section>
        </div>
        <section className="w-full mt-8 flex flex-col justify-start p-4 gap-2">
          <h2>Une erreur est survenue</h2>
          <p className="text-primary">
            Nous ne retrouvons pas votre réservation...
          </p>
          <p>Vérifiez si il n'y a pas eu une erreur de parcours.</p>
        </section>
        <section className="w-full mt-8 flex flex-col justify-start p-4 gap-2">
          <Button
            variant="default"
            className="font-light"
            onClick={() => {
              navigate(`/reservation`);
            }}
          >
            Retourner à vos réservations
          </Button>
          <Button
            variant="secondary"
            className="font-light"
            onClick={() => {
              navigate(`/profil/support`);
            }}
          >
            Nous contacter
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="h-full w-full">
      <div className="w-full flex flex-row gap-3 px-5 pt-5 items-center">
        <Link to="/my-reservation" className="justify-start items-start">
          <ArrowLeft className="size-4" />
        </Link>
        <section className="text-start">
          <h1>Votre réservation</h1>
        </section>
      </div>
      {userLoading || loading ? (
        <section className="w-full mt-8 flex flex-col justify-start p-4 gap-2">
          <p className="text-muted-foreground text-start">
            Chargement de ta réservation…
          </p>
        </section>
      ) : !user ? (
        <section className="w-full mt-8 flex flex-col justify-start p-4 gap-2">
          <p className="text-muted-foreground text-start">
            Connecte-toi pour accéder à ta pré-commande.
          </p>
          <Button variant="default" onClick={() => navigate("/login")}>
            Se connecter
          </Button>
        </section>
      ) : !reservation ? (
        <section className="w-full mt-8 flex flex-col justify-start p-4 gap-2">
          <p className="text-muted-foreground text-start">
            Impossible de charger ta réservation.
          </p>
        </section>
      ) : (
        <>
          <section className="w-full mt-8 flex flex-col justify-start p-4 gap-2">
            <h1>Super !</h1>
            <h2>Votre réservation est bien confirmée.</h2>
            <h3>
              Les invitations ont été envoyées à vos co-mangeurs ! Dites-leur de
              bien regarder leur messagerie 😉
            </h3>
            <p className="text-primary">
              <span>Attention</span> : vous avez choisi de pré-commander votre
              repas, assurez-vous donc que vous, et tous vos co-mangeurs aient
              commande leur plat avant <span>{timeofReservation}</span>. Sans
              quoi, le restaurateur pourra annuler votre commande.
            </p>
            <p>Souhaitez-vous pré-commander vos plats tout de suite ?</p>
          </section>
          <section className="w-full mt-8 flex flex-col justify-start p-4 gap-2">
            <Button
              variant="default"
              className="font-light"
              onClick={() => {
                navigate(`/command/${reservation.id}/early-command`);
              }}
              disabled={!order}
            >
              Précommander mon repas ({timeLeftBeforeReservation})
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/reservation")}
            >
              Plus tard
            </Button>
          </section>
        </>
      )}
    </main>
  );
}
