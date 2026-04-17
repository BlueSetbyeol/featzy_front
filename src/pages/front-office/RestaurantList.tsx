import { useContext } from "react";
import type { Restaurant } from "@/types/mapTypes";
import UserContext from "@/context/UserContext";
import RestaurantCard from "@/components/restaurant/RestaurantCard";

export default function RestaurantList() {
  const { user } = useContext(UserContext);

  let restaurants: Restaurant[] = [];

  if (user && user.registered_restaurant) {
    restaurants = user?.registered_restaurant;
  }

  return (
    <section className="flex flex-col items-center justify-start w-full h-full gap-4 overflow-y-auto">
      <h2 className="pt-4 text-3xl font-title">Choisissez un restaurant</h2>
      <section className="flex flex-row flex-wrap gap-4 pb-16">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            restaurant={restaurant}
            profileList={false}
            key={restaurant.id}
          />
        ))}
      </section>
    </section>
  );
}
