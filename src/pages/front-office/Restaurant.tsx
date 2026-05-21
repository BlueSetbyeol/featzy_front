import { Link } from "react-router";
import { useParams } from "react-router";
import { useState } from "react";
import GoBackArrow from "../../assets/icon/arrow_left.svg";
import Plus from "../../assets/icon/plus.svg";
import Minus from "../../assets/icon/minus.svg";
import Like from "../../assets/icon/heart_unselected.svg";
import type { Restaurant } from "@/types/restaurantTypes";
import MapForRestaurant from "@/components/map/MapForRestaurant";
import { RestaurantApi } from "@/services/RestaurantApi";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import Placeholder from "../../assets/image/rice.webp";

export default function Restaurant() {
  const { id } = useParams();

  // const { user } = useContext(UserContext);

  const [restaurant, setRestaurant] = useState<Restaurant | undefined>();

  async function getOneRestaurant(id: string) {
    const restaurantList = await RestaurantApi.getOne(id);
    setRestaurant(restaurantList);
  }

  if (restaurant === undefined && id) {
    getOneRestaurant(id);
  }

  const [numberOfParticipant, setNumberOfParticipant] = useState<number>(1);

  return (
    <main className="relative h-full w-full flex flex-coljustify-between">
      <div className="w-full h-70.5 flex flex-row items-start justify-between gap-3 z-0">
        <Link to="/restaurants" className="absolute z-10 px-5 mt-2">
          {/* TODO A améliorer pour prendre en compte l'origine de la demande de détails */}
          <img src={GoBackArrow} alt="Go back to profil" className="size-10" />
        </Link>
        <img
          // src={restaurant?.cover_image_url}
          src={Placeholder}
          alt="Photo du restaurant"
          className="z-0 h-full w-full"
        />
      </div>
      <section className="absolute bottom-0 h-[69%] w-full p-5 z-2 rounded-t-xl bg-background flex flex-col items-start gap-5">
        <article className="w-full flex flex-col items-start gap-2">
          <div className="flex flex-row justify-between w-full">
            <h1>{restaurant?.name}</h1>
            <img src={Like} alt="unselected heart" className="size-7" />
          </div>
          <div className="flex flex-row justify-between w-full">
            <p className="text-[0.75em]">{restaurant?.cuisine_type}</p>
            <p className="text-[0.75em]">distance ??</p>
          </div>
          <Button className="w-full bg-background border-primary border-2 text-primary text-2xl py-6 rounded-2xl">
            Voir le menu
          </Button>
        </article>
        <article className="w-full flex flex-col items-start gap-2">
          <h1>Réservation</h1>
          <div className="w-full flex flex-col items-end gap-2">
            <div className="flex flex-row gap-2 items-center">
              <p className="text-[0.75em]">{numberOfParticipant} personne</p>
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
            <p className="text-[0.75em]">
              Adresse : {restaurant?.address.street} -{" "}
              {restaurant?.address.zipcode} {restaurant?.address.city},
              {restaurant?.address.country}
            </p>
            {restaurant?.opening_hours &&
              restaurant?.opening_hours.data.map((time) => (
                <Button
                  className="w-auto mr-2 bg-secondary text-foreground rounded-button"
                  key={time.day_of_week}
                >
                  {time.day_name} : {time.opening_time} - {time.closing_time}
                </Button>
              ))}
            <p className="text-[0.75em]">Phone : {restaurant?.phone_number}</p>
          </div>
          {restaurant && <MapForRestaurant restaurant={restaurant} />}
        </article>
      </section>
    </main>
  );
}
