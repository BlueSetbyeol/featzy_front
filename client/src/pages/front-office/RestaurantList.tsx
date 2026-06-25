import RestaurantCard from "@/components/restaurant/RestaurantCard";
import { useAllRestaurants } from "@/hooks/useRestaurants";

export default function RestaurantList() {
  const { data: restaurants = [], isLoading: loading } = useAllRestaurants();

  return (
    <section className="flex flex-col items-center justify-start w-full h-full gap-4 overflow-y-auto no-scrollbar px-5">
      <h2 className="pt-4 text-3xl font-title">Choisissez un restaurant</h2>
      <section className="flex flex-row flex-wrap gap-4 pb-16">
        {loading ? (
          <p className="text-muted-foreground">Chargement…</p>
        ) : restaurants.length === 0 ? (
          <p className="text-muted-foreground">
            Aucun restaurant pour le moment
          </p>
        ) : (
          restaurants.map((restaurant) => (
            <RestaurantCard
              restaurant={restaurant}
              profileList={false}
              key={restaurant.id}
            />
          ))
        )}
      </section>
    </section>
  );
}
