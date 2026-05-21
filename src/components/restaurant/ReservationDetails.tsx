import { ArrowLeft, Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
// import { useContext } from "react";
// import UserContext from "@/context/UserContext";
import type { Restaurant } from "@/types/restaurantTypes";
import Placeholder from "../../assets/image/image.png";
import { Link, useParams } from "react-router";
import { useState } from "react";
import { RestaurantApi } from "@/services/RestaurantApi";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

export default function ReservationDetails() {
  const { id } = useParams();
  //   const { user } = useContext(UserContext);

  // TODO faire l'appel API pour la réservation et non un restaurant

  const [reservation, setReservation] = useState<Restaurant | undefined>();

  async function getOneReservation(id: string) {
    const reservationList = await RestaurantApi.getOne(id);
    setReservation(reservationList);
  }

  if (reservation === undefined && id) {
    getOneReservation(id);
  }

  // TODO à remplacer par le statut de la réservation + Toutes les informations spécifique une fois reservation récupéré !
  const reservationStatus = false;

  return (
    <main className="h-screen">
      <div className="w-full h-20 flex flex-row gap-3 px-5 items-center">
        <Link to="/reservation">
          <ArrowLeft className="size-5" />
        </Link>
        <h1>Passées</h1>
      </div>
      <Card className="p-1 bg-primary text-primary-foreground w-[90vw] gap-2">
        <div className="flex justify-center items-center gap-2 mt-2">
          <Check className="rounded-full bg-card text-primary size-6 p-1" />
          <h2>Commandé</h2>
        </div>
        <Card className="p-4 ">
          <CardHeader className="flex flex-row justify-start items-center gap-2 px-0">
            <img
              // src={reservation?.cover_image_url}
              src={Placeholder}
              alt="Reservation image"
              className="h-[4em] w-[4em] rounded-full"
            />
            {reservation?.name}
          </CardHeader>
          <CardContent className="px-0">
            <section>
              <article className="flex flex-row justify-between items-start">
                <h3 className="text-[0.9em] font-light text-muted-foreground">
                  DATE DE COMMANDE
                </h3>
                <h3 className="text-[0.9em] font-light text-muted-foreground">
                  N° DE COMMANDE
                </h3>
              </article>
              <article className="flex flex-row justify-between items-start">
                <p className="text-[0.9em]">date du jour</p>
                <p className="text-[0.9em]">numéro</p>
              </article>
            </section>
            <Separator className="my-4" />
            <section>
              <article className="flex flex-col items-start">
                <h3 className="text-[0.9em] font-light pb-1 text-muted-foreground">
                  TYPE DE COMMANDE
                </h3>
                <p>Pré-commande sur place</p>
                <p>En groupe de 5 personnes</p>
              </article>
              <article className="flex flex-col items-start mt-4">
                <h3 className="text-[0.9em] font-light pb-1 text-muted-foreground">
                  VOS INFORMATIONS
                </h3>
                <p>Leila Dubois</p>
                <p>+33 612345678</p>
                <p>leiladubois@gmail.com</p>
              </article>
            </section>
            <Separator className="my-4" />
            <section>
              <h3 className="text-[0.9em] font-light pb-1 text-muted-foreground text-start">
                RECAPITULATIF
              </h3>
              <article className="flex flex-row justify-between items-start">
                <p className="text-[0.9em]">1x Soupe à l’oignon</p>
                <p className="text-[0.9em]">8,00 €</p>
              </article>
              <article className="flex flex-row justify-between items-start">
                <p className="text-[0.9em]">1x Saumon grillé</p>
                <p className="text-[0.9em]">16,00 €</p>
              </article>
              <article className="flex flex-row justify-between items-start">
                <p className="text-[0.9em]">2x Crème brûlée</p>
                <p className="text-[0.9em]">12,00 €</p>
              </article>
              <article className="flex flex-row justify-between items-start bg-accent text-foreground p-2 rounded-md mt-2">
                <p className="text-[1.1em]">Total</p>
                <p className="text-[1.1em]">36,00 €</p>
              </article>
            </section>
            {!reservationStatus ? (
              <section className="w-full flex flex-row justify-between items-center">
                <Button className="w-[48%] mt-5 rounded-sm font-light text-[0.9em]">
                  Télécharger la facture
                </Button>
                <Button className="w-[48%] mt-5 rounded-sm bg-accent text-secondary-foreground font-light text-[1em]">
                  Réserver de nouveau
                </Button>
              </section>
            ) : (
              <Button className="w-full mt-5 rounded-sm">Payer 36,00 €</Button>
            )}
          </CardContent>
        </Card>
      </Card>
    </main>
  );
}
