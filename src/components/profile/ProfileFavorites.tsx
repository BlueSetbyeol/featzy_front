import ProfileNavigation from "./ProfileNavigation";
import RestaurantFavoriteCard from "../restaurant/RestaurantFavoriteCard";
import type { Restaurant } from "@/types/restaurantTypes";
import UserContext from "@/context/UserContext";
import { useContext, useState } from "react";
import { Card } from "../ui/card";
import Search from "../../assets/icon/search.svg";

export default function ProfileFavorites() {
  const { user } = useContext(UserContext);

  let restaurants: Restaurant[] = [];

  if (user && user.registered_restaurant) {
    restaurants = user?.registered_restaurant;
  }

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
        <p>{restaurants.length} favoris</p>
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
        {restaurants.map((restaurant, index) => (
          <RestaurantFavoriteCard restaurant={restaurant} key={index} />
        ))}
      </main>
    </>
  );
}
