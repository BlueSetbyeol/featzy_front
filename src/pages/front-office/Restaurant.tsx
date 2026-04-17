import { Link } from "react-router";
import GoBackArrow from "../../assets/icon/go_back.svg";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import type { Restaurant } from "@/types/mapTypes";
import Plus from "../../assets/icon/plus.svg";
import Minus from "../../assets/icon/minus.svg";

import Placeholder from "../../assets/image/rice.webp";
import Like from "../../assets/icon/unselected_heart.svg";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import MapForRestaurant from "@/components/map/MapForRestaurant";

export default function Restaurant() {
  const { id } = useParams();

  const [chosenRestaurant, setChosenRestaurant] = useState<Restaurant>({
    id: 1,
    owner_id: 1,
    email: "restaurant@google.com",
    phone_number: "0133456789",
    description: "sweet restaurant",
    logo_url: Placeholder,
    price_range: "20€",
    capacity: 50,
    average_rating: 4.5,
    total_reviews: 5,
    is_active: true,
    accepts_reservations: true,
    name: "Restaurant A",
    cuisine_type: "Italienne",
    openingHours: ["8-12h"],
    cover_image_url: Placeholder,
    address_id: 1,
    location: {
      lat: 45.757732,
      lng: 4.83635,
    },
  });
  const [numberOfParticipant, setNumberOfParticipant] = useState<number>(1);

  useEffect(() => {
    //fetch restaurants/{id}
  }, [id]);

  return (
    <main className="relative h-full w-full flex flex-coljustify-between">
      <div className="w-full h-70.5 flex flex-row items-start justify-between gap-3 z-0">
        <Link to="/restaurants" className="absolute z-10 px-5 mt-2">
          {/* TODO A améliorer pour prendre en compte l'origine de la demande de détails */}
          <img src={GoBackArrow} alt="Go back to profil" className="size-10" />
        </Link>
        <img
          src={Placeholder}
          alt="Photo du restaurant"
          className="z-0 h-full w-full"
        />
      </div>
      <section className="absolute bottom-0 h-[69%] w-full p-5 z-2 rounded-t-xl bg-background flex flex-col items-start gap-5">
        <article className="w-full flex flex-col items-start gap-2">
          <div className="flex flex-row justify-between w-full">
            <h1>{chosenRestaurant.name}</h1>
            <img src={Like} alt="unselected heart" className="size-7" />
          </div>
          <div className="flex flex-row justify-between w-full">
            <p className="text-[13px]">{chosenRestaurant.cuisine_type}</p>
            <p className="text-[13px]">distance ??</p>
          </div>
          <Button className="w-full bg-background border-primary border-2 text-primary text-2xl py-6 rounded-2xl">
            Voir le menu
          </Button>
        </article>
        <article className="w-full flex flex-col items-start gap-2">
          <h1>Réservation</h1>
          <div className="w-full flex flex-col items-end gap-2">
            <div className="flex flex-row gap-2 items-center">
              <p className="text-[13px]">{numberOfParticipant} personne</p>
              <ButtonGroup>
                <Button
                  variant="outline"
                  onClick={() =>
                    setNumberOfParticipant(numberOfParticipant - 1)
                  }
                  className="bg-card-foreground"
                >
                  <img src={Minus} alt="Moins de participant" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setNumberOfParticipant(numberOfParticipant + 1)
                  }
                  className="bg-card-foreground"
                >
                  <img src={Plus} alt="Plus de participant" />
                </Button>
              </ButtonGroup>
            </div>
            <Button className="w-full bg-background border-primary border-2 text-primary text-2xl py-6 rounded-2xl">
              Réserver
            </Button>
          </div>
        </article>
        <article className="w-full flex flex-col items-start gap-2 pb-4">
          <h1>Détails</h1>
          <div className="flex flex-col items-start w-full">
            <p className="text-[13px]">
              Adresse : {chosenRestaurant.address_id}
            </p>
            <p className="text-[13px]">
              Phone : {chosenRestaurant.phone_number}
            </p>
          </div>
          <MapForRestaurant restaurant={chosenRestaurant} />
        </article>
      </section>
    </main>
  );
}
