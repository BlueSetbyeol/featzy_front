import ProfileNavigation from "./ProfileNavigation";
import RestaurantFavoriteCard from "../restaurant/RestaurantFavoriteCard";
import type { Restaurant } from "@/types/mapTypes";
import UserContext from "@/context/UserContext";
import { useContext } from "react";

export default function ProfileFavorites() {
  const { user } = useContext(UserContext);

  let restaurants: Restaurant[] = [];

  if (user && user.registered_restaurant) {
    restaurants = user?.registered_restaurant;
  }
  return (
    <>
      <nav className="w-screen h-20">
        <ProfileNavigation content={"Enregistrés"} />
      </nav>
      <main className="h-[87%] px-5 w-full flex flex-col gap-4 pb-4">
        {restaurants.map((restaurant, index) => (
          <RestaurantFavoriteCard restaurant={restaurant} key={index} />
        ))}
      </main>
    </>
  );
}
