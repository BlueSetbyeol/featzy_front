import { useState } from "react";
import type { Restaurant } from "@/types/restaurantTypes";
import RestaurantCard from "@/components/restaurant/RestaurantCard";
import { RestaurantApi } from "@/services/RestaurantApi";

export default function RestaurantList() {
  // const { user } = useContext(UserContext);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  async function getAllRestaurant() {
    const restaurantList = await RestaurantApi.getAll();
    setRestaurants(restaurantList);
  }

  if (restaurants.length <= 1) {
    getAllRestaurant();
  }

  return (
    <section className="flex flex-col items-center justify-start w-full h-full gap-4 overflow-y-auto no-scrollbar px-5">
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
