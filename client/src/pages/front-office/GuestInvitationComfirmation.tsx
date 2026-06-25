import { Button } from "@/components/ui/button";
import { useReservation, useRsvp } from "@/hooks/useReservations";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function GuestInvitationConfirmation() {
  // L'URL est /command/:id/guest-confirmation → :id est l'identifiant de la réservation
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: reservation, isLoading } = useReservation(id);
  const rsvp = useRsvp();

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!reservation) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [reservation]);

  const reservedAtDate = reservation
    ? new Date(reservation.reserved_at.replace(" ", "T"))
    : null;
  const organizerName =
    reservation?.participants?.find((p) => p.role === "organizer")?.user?.name ??
    "L'organisateur";
  const timeofReservation = reservedAtDate ? format(reservedAtDate, "HH:mm") : "";
  const dateOfReservation = reservedAtDate
    ? reservedAtDate.toLocaleDateString("fr-FR", { dateStyle: "long" })
    : "";
  const remainingMinutes = reservedAtDate
    ? Math.max(Math.floor((reservedAtDate.getTime() - now) / 60000), 0)
    : 0;
  const timeLeftBeforeReservation = `${String(Math.floor(remainingMinutes / 60)).padStart(2, "0")}:${String(remainingMinutes % 60).padStart(2, "0")}`;

  async function handleAcceptInvitation() {
    if (!id) return;
    try {
      await rsvp.mutateAsync({ id, status: "accepted" });
      navigate(`/command/${id}/early-command`);
    } catch {
      // toast géré globalement par le QueryCache pour les queries ;
      // ici on laisse l'utilisateur réessayer.
    }
  }

  async function handleRemoveFromReservationClick() {
    if (!id) {
      navigate("/my-reservation");
      return;
    }
    try {
      await rsvp.mutateAsync({ id, status: "declined" });
      toast.success("Tu as décliné l'invitation");
    } finally {
      navigate("/my-reservation");
    }
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
      {isLoading ? (
        <section className="w-full mt-8 flex flex-col justify-start p-4 gap-2">
          <p className="text-muted-foreground text-start">
            Chargement de l'invitation…
          </p>
        </section>
      ) : !reservation ? (
        <section className="w-full mt-8 flex flex-col justify-start p-4 gap-2">
          <p className="text-muted-foreground text-start">
            Impossible de charger cette invitation.
          </p>
        </section>
      ) : (
        <>
          <section className="w-full mt-8 flex flex-col justify-start p-4 gap-2">
            <h1>{organizerName} vous convie à un repas 🍽️ :</h1>
            <div>
              <p>Restaurant {reservation.restaurant?.name}</p>
              <p>Le : {dateOfReservation}</p>
              <p>À : {timeofReservation}</p>
            </div>
            {reservation.is_preorder && (
              <p className="">
                <span className="font-bold">{organizerName}</span> a choisi
                l’option de
                <span className="font-bold"> pré-commande</span> de votre repas.
                Après confirmation de votre venue vous serez donc redirigée vers
                le menu du restaurant pour y faire votre choix et pré-commander
                vos plats !
              </p>
            )}
            <p>Confirmez-vous votre présence ?</p>
          </section>
          <section className="w-full mt-8 flex flex-col justify-start p-4 gap-2">
            <Button
              variant="default"
              className="font-light"
              onClick={handleAcceptInvitation}
              disabled={rsvp.isPending}
            >
              {reservation.is_preorder
                ? `Précommander mon repas (${timeLeftBeforeReservation})`
                : "Confirmer ma présence"}
            </Button>
            <Button
              variant="secondary"
              className="font-light"
              onClick={handleRemoveFromReservationClick}
              disabled={rsvp.isPending}
            >
              Non, retirer ma présence
            </Button>
          </section>
        </>
      )}
    </main>
  );
}
