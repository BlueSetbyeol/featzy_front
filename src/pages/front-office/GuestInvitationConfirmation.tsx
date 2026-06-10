import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";

export default function GuestInvitationConfirmation() {
  // TODO change ces variables en vrai information à prendre depuis la confirmation de réservation.
  const restaurantName = "L’Étage";
  const timeofReservation = "11:30";
  const timeLeftBeforeReservation = "00:30";
  const reservation = { id: 1 };

  // TODO vérifier si il faut plutôt rediriger vers restaurant/id/new-reservation-confirmation (+?n° resa ??) ou reservation/id/confirmation
  const navigate = useNavigate();

  function handleRemoveFromReservationClick() {
    navigate(`/reservation`);
    // TODO ajouter l'appel API pour enlever un invité
  }

  return (
    <main className="h-full w-full">
      <div className="w-full flex flex-row gap-3 px-5 pt-5 items-center">
        <Link to="/reservation" className="justify-start items-start">
          <ArrowLeft className="size-4" />
        </Link>
        <section className="text-start">
          <h1>Votre réservation</h1>
        </section>
      </div>
      <section className="w-full mt-8 flex flex-col justify-start p-4 gap-2">
        <h1>Leïla vous convie à un repas 🍽️ :</h1>
        <div>
          <p>Restaurant {restaurantName}</p>
          <p>Le : 18 juin 2026</p>
          <p>À : {timeofReservation}</p>
        </div>
        <p className="">
          <span className="font-bold">Leïla</span> a choisi l’option de
          <span className="font-bold"> pré-commande</span> de votre repas. Après
          confirmation de votre venue vous serez donc redirigée vers le menu du
          restaurant pour y faire votre choix et pré-commander vos plats !
        </p>
        <p>Confirmez-vous votre présence ?</p>
      </section>
      <section className="w-full mt-8 flex flex-col justify-start p-4 gap-2">
        <Button
          variant="default"
          className="font-light"
          onClick={() => {
            navigate(`/command/${reservation.id}/early-command`);
          }}
        >
          Précommander mon repas ({timeLeftBeforeReservation})
        </Button>
        <Button
          variant="secondary"
          className="font-light"
          onClick={handleRemoveFromReservationClick}
        >
          Non, retirer ma présence
        </Button>
      </section>
    </main>
  );
}
