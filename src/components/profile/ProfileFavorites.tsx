import ProfileNavigation from "./ProfileNavigation";
import RestaurantFavoriteCard from "../restaurant/RestaurantFavoriteCard";
import type { Restaurant } from "@/types/restaurantTypes";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import Search from "../../assets/icon/search.svg";
import { userApi } from "@/api/userApi";
import { toast } from "sonner";
import { extractApiError } from "@/lib/axios";

export default function ProfileFavorites() {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFavorites() {
      try {
        const restaurants: Restaurant[] = [];
        let page = 1;
        let lastPage = 1;
        do {
          const response = await userApi.getFavorites(page);
          restaurants.push(...response.data);
          lastPage = response.meta.last_page;
          page += 1;
        } while (!cancelled && page <= lastPage);
        if (!cancelled) {
          setFavoriteRestaurants(restaurants);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(extractApiError(error).message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFavorites();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleFavoriteRemoved(restaurantId: number) {
    setFavoriteRestaurants((current) =>
      current.filter((restaurant) => restaurant.id !== restaurantId),
    );
  }

  const filteredRestaurants = favoriteRestaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(filter.trim().toLowerCase()),
  );

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
            alt="Rechercher un restaurant favori"
            className="size-6 pt-1"
          />
          <input
            type="text"
            className="w-[80%] mr-2 pl-2 text-foreground rounded-sm focus:border-foreground border-0"
            placeholder="Rechercher un restaurant ou un mot-clé"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          />
        </Card>
        {loading ? (
          <p className="text-muted-foreground">Chargement de tes favoris…</p>
        ) : filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <RestaurantFavoriteCard
              restaurant={restaurant}
              onRemoved={handleFavoriteRemoved}
              key={restaurant.id}
            />
          ))
        ) : (
          <section className="w-full h-full pt-5 flex flex-col justify-center gap-8">
            <p>
              {favoriteRestaurants.length > 0
                ? "Aucun favori ne correspond à votre recherche"
                : "Vous n'avez pas encore ajouté de restaurant dans vos favoris"}
            </p>
          </section>
        )}
      </main>
    </>
  );
}
