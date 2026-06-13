import { useEffect, useState } from "react";
import type { Restaurant } from "@/types/restaurantTypes";
import RestaurantCard from "@/components/restaurant/RestaurantCard";
import { RestaurantApi } from "@/api/RestaurantApi";
import { extractApiError } from "@/lib/axios";
import { toast } from "sonner";

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    RestaurantApi.getAllPages()
      .then((list) => {
        if (!cancelled) setRestaurants(list);
      })
      .catch((error) => {
        if (!cancelled) toast.error(extractApiError(error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
