import type { Restaurant } from "@/types/mapTypes";
import { useContext } from "react";
import UserContext from "@/context/UserContext";
import RestaurantReservation from "@/components/restaurant/RestaurantReservation";

export default function Reservation() {
  const { user } = useContext(UserContext);

  let restaurants: Restaurant[] = [];

  if (user && user.registered_restaurant) {
    restaurants = user?.registered_restaurant;
  }

  return (
    <main className="flex flex-col items-start justify-start w-full h-full gap-4 overflow-y-auto">
      <h2 className="pt-4 text-3xl font-title text-start px-5">
        Mes réservations
      </h2>
      <section className="w-full pt-5">
        <article className="w-full flex flex-row justify-between px-5 pb-2">
          <h4 className="text-xl font-title">A venir</h4>
        </article>
        <section className="flex flex-col w-full gap-8 px-5">
          {restaurants.map((restaurant) => (
            <RestaurantReservation
              key={restaurant.id}
              restaurant={restaurant}
              pastReservation={false}
            />
          ))}
        </section>
      </section>
      <section className="w-full pt-5">
        <article className="w-full flex flex-row justify-between px-5 pb-2">
          <h4 className="text-xl font-title">Passées</h4>
        </article>
        <section className="flex flex-col w-full gap-8 px-5">
          {restaurants.map((restaurant) => (
            <RestaurantReservation
              key={restaurant.id}
              restaurant={restaurant}
              pastReservation={true}
            />
          ))}
        </section>
      </section>
    </main>
  );
}
