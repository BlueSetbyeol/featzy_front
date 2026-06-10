import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function EarlyCommand() {
  const timeofReservation = "11:30";
  const timeLeftBeforeReservation = "00:30";
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
        <h1>Super !</h1>
        <h2>Votre réservation est bien confirmée.</h2>
        <h3>
          Les invitations ont été envoyées à vos co-mangeurs ! Dites-leur de
          bien regarder leur messagerie 😉
        </h3>
        <p className="text-primary">
          <span>Attention</span> : vous avez choisi de pré-commander votre
          repas, assurez-vous donc que vous, et tous vos co-mangeurs aient
          commande leur plat avant <span>{timeofReservation}</span>. Sans quoi,
          le restaurateur pourra annuler votre commande.
        </p>
        <p>Souhaitez-vous pré-commander vos plats tout de suite ?</p>
      </section>
      <section className="w-full mt-8 flex flex-col justify-start p-4 gap-2">
        {/* Link to earlyCommand/id ? */}
        <Button variant="default">
          Précommander mon repas ({timeLeftBeforeReservation})
        </Button>
        <Button variant="secondary">Plus tard</Button>
      </section>
    </main>
  );
}
