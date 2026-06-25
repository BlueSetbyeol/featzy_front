import { useContext, useState } from "react";
import { Link } from "react-router";
import UserContext from "@/context/UserContext";
import RestaurantCard from "@/components/restaurant/RestaurantCard";
import SearchingLoc from "@/components/map/SearchingLoc";
import { RestaurantVariety } from "../../components/restaurant/RestaurantVariety";
import { type RestaurantQuery } from "@/api/RestaurantApi";
import { useAllRestaurants } from "@/hooks/useRestaurants";
import { ArrowRight } from "lucide-react";
import SelectedButton from "@/components/ui/selected-button";
import { isOpenNow } from "@/services/getTime";
import { toast } from "sonner";
import GeoContext from "@/context/GeoContext";
import { calculateDistance } from "@/services/calculateDistanceToRestaurant";

export default function Welcome() {
  const { user } = useContext(UserContext);
  const { userCenter } = useContext(GeoContext);

  const [query, setQuery] = useState<RestaurantQuery>({});
  const [selectFilters, setSelectFilters] = useState<string[]>([]);

  const { data: restaurants = [], isLoading: loading } =
    useAllRestaurants(query);

  const filters = [
    "Offres",
    "Les mieux notés",
    "Prix",
    "Ticket Restaurant",
    "Allergies",
    "Régimes alimentaire",
    "Restrictions alimentaire",
  ];

  useEffect(() => {
    let cancelled = false;
    RestaurantApi.getAllPages(query)
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
  }, [query]);

  function getDistanceLabel(
    userCenter: { lat: number; lng: number },
    restaurant: Restaurant,
  ): string {
    if (!userCenter) return "";

    const distance = calculateDistance(userCenter, restaurant);
    if (distance === null) return "";

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  }

  useEffect(() => {
    if (userCenter) {
      const sorted = restaurants
        .map((restaurant) => ({
          ...restaurant,
          distanceLabel: getDistanceLabel(
            { lat: userCenter.lat, lng: userCenter.lng },
            restaurant,
          ),
          distanceKm: calculateDistance(
            { lat: userCenter.lat, lng: userCenter.lng },
            restaurant,
          ),
        }))
        .sort((a, b) => {
          if (a.distanceKm === null && b.distanceKm === null) return 0;
          if (a.distanceKm === null) return 1;
          if (b.distanceKm === null) return -1;
          return a.distanceKm - b.distanceKm;
        });
      setRestaurants(sorted);
    }
  }, [userCenter]);

  const topRated = restaurants.filter(
    (restaurant) => (restaurant.average_rating ?? 0) >= 4,
  );
  const openNow = restaurants.filter(isOpenNow);

  return (
    <main className="flex flex-col items-start justify-start w-full h-full gap-4 pb-4">
      <section className="px-5 bg-primary w-screen">
        <h2 className="pt-4 font-text text-start text-background font-light">
          Bonjour, {user?.first_name}
        </h2>
        <h1 className="font-title text-background text-start font-light">
          Qu’est-ce qu’on mange aujourd’hui ?
        </h1>
        <SearchingLoc onFiltersApply={setQuery} />
      </section>
      <section className="flex flex-col items-start justify-start w-full h-full gap-4 overflow-y-auto no-scrollbar">
        <section className="flex flex-col w-screen gap-3">
          <section className="flex w-full h-[5.8em] gap-4 overflow-x-auto no-scrollbar px-5">
            {RestaurantVariety.map(
              (variety: { name: string; image: string }) => (
                <button
                  type="button"
                  key={variety.name}
                  className="flex flex-col items-center"
                >
                  <img
                    src={variety.image}
                    alt={variety.name}
                    className="w-auto h-[4em] max-w-screen"
                  />
                  <p className="">{variety.name}</p>
                </button>
              ),
            )}
          </section>
          <section className="flex w-full gap-2 overflow-x-auto no-scrollbar px-5">
            {filters.map((filter, index) => (
              <SelectedButton
                filterType={filter}
                setSelectFilters={setSelectFilters}
                selectFilters={selectFilters}
                key={index}
              />
            ))}
          </section>
        </section>
        <section className="w-full pt-2">
          <article className="w-full flex flex-row justify-between pb-2 px-5 ">
            <h2 className="font-title">Restaurant les mieux notés</h2>
            <Link to="/restaurants">
              <ArrowRight className="size-4" />
            </Link>
          </article>
          <section className="flex flex-row w-full gap-8 overflow-x-auto no-scrollbar px-5">
            {loading ? (
              <p className="text-muted-foreground">Chargement…</p>
            ) : topRated.length === 0 ? (
              <p className="text-muted-foreground">
                Aucun restaurant pour le moment
              </p>
            ) : (
              topRated.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  profileList={false}
                />
              ))
            )}
          </section>
        </section>
        <section className="w-full pt-2">
          <article className="w-full flex flex-row justify-between px-5 pb-2">
            <h2 className="font-title">Ouverts actuellement</h2>
            <Link to="/restaurants">
              <ArrowRight className="size-4" />
            </Link>
          </article>
          <section className="flex flex-row w-full gap-8 px-5 overflow-x-auto no-scrollbar">
            {loading ? (
              <p className="text-muted-foreground">Chargement…</p>
            ) : openNow.length === 0 ? (
              <p className="text-muted-foreground">
                Aucun restaurant ouvert pour le moment
              </p>
            ) : (
              openNow.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  profileList={false}
                />
              ))
            )}
          </section>
        </section>
      </section>
    </main>
  );
}
