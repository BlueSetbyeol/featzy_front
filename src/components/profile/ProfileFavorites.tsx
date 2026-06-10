import ProfileNavigation from "./ProfileNavigation";
import RestaurantFavoriteCard from "../restaurant/RestaurantFavoriteCard";
import type { Restaurant } from "@/types/restaurantTypes";
// import UserContext from "@/context/UserContext";
import { useState } from "react";
import { Card } from "../ui/card";
import Search from "../../assets/icon/search.svg";
import { userApi } from "@/api/userApi";
import { RestaurantApi } from "@/api/RestaurantApi";

export default function ProfileFavorites() {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>(
    [],
  );

  async function getAllFavorites() {
    const favoritesList = await userApi.getAllFavoriteRestaurant();
    const restaurants: Restaurant[] = await Promise.all(
      favoritesList.map((favorite) =>
        RestaurantApi.getOne(favorite.restaurant_id.toString()),
      ),
    );
    setFavoriteRestaurants(restaurants);
  }

  if (setFavoriteRestaurants.length <= 0) {
    getAllFavorites();
  }

  console.log(favoriteRestaurants);

  const [filter, setFilter] = useState<string>();

  function handleFilterSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    // TODO appeler la liste des contacts par nom, numéro de tel ou email
    //setFilter(resultat)
  }

  return (
    <>
      <nav className="w-screen h-20">
        <ProfileNavigation content={"Favoris"} />
      </nav>
      <main className="h-[87%] px-5 w-full flex flex-col gap-4 pb-4 items-start">
        <p>{favoriteRestaurants.length} favoris</p>
        <Card className="bg-background flex flex-row w-full p-2 mb-5 rounded-sm gap-2">
          <img
            src={Search}
            alt="click to look for the location you want"
            className="size-6 pt-1"
          />
          <input
            type="text"
            className="w-[80%] mr-2 pl-2 text-foreground rounded-sm focus:border-foreground border-0"
            placeholder={filter ?? "Rechercher un restaurant ou un mot-clé"}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFilterSubmit(e);
              }
            }}
          />
        </Card>
        {favoriteRestaurants.length > 0 ? (
          favoriteRestaurants.map((restaurant, index) => (
            <RestaurantFavoriteCard restaurant={restaurant} key={index} />
          ))
        ) : (
          <section className="w-full h-full pt-5 flex flex-col justify-center gap-8">
            <p>Tu n'as pas encore ajouter de restaurant dans tes favoris</p>
          </section>
        )}
      </main>
    </>
  );
}
