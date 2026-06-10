import type { Restaurant } from "@/types/restaurantTypes";
// import { useContext } from "react";
// import UserContext from "@/context/UserContext";
import RestaurantReservation from "@/components/restaurant/my-reservation/RestaurantReservation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function Reservation() {
  // const { user } = useContext(UserContext);

  const restaurants: Restaurant[] = [];

  // if (user && user.registered_restaurant) {
  //   restaurants = user?.registered_restaurant;
  // }

  return (
    <main className="flex flex-col items-start justify-start w-full h-full gap-4 overflow-y-auto no-scrollbar mb-4">
      <h2 className="pt-4 text-3xl font-title text-start px-5">
        Mes réservations
      </h2>
      {restaurants.length > 0 ? (
        <>
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
