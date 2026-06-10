import { useContext, useState } from "react";
import { Link } from "react-router";
import UserContext from "@/context/UserContext";
import RestaurantCard from "@/components/restaurant/RestaurantCard";
import SearchingLoc from "@/components/map/SearchingLoc";
import { RestaurantVariety } from "../../components/restaurant/RestaurantVariety";
import type { Restaurant } from "@/types/restaurantTypes";
import { RestaurantApi } from "@/api/RestaurantApi";
import { ArrowRight } from "lucide-react";
import SelectedButton from "@/components/ui/selected-button";
import { isOpenNow } from "@/services/getTime";
import { Toaster } from "sonner";

export default function Welcome() {
  const { user } = useContext(UserContext);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  // const [selectFoodVariety, setSelectFoodVariety] = useState<string>();
  const [selectFilters, setSelectFilters] = useState<string[]>([]);

  const filters = [
    "Offres",
    "Les mieux notés",
    "Prix",
    "Ticket Restaurant",
    "Allergies",
    "Régimes alimentaire",
    "Restrictions alimentaire",
  ];

  async function getAllRestaurant() {
    const restaurantList = await RestaurantApi.getAll();
    setRestaurants(restaurantList);
  }

  if (restaurants.length <= 1) {
    getAllRestaurant();
  }

  // TODO une fois que les filtres peuvent être appliqués : restaurantList.filter((food)=> food === selectFoodVariety);

  return (
    <>
      <Toaster />
      <main className="flex flex-col items-start justify-start w-full h-full gap-4 pb-4">
        <section className="px-5 bg-primary w-screen">
          <h2 className="pt-4 font-text text-start text-background font-light">
            Bonjour, {user && user.user.firstname}
          </h2>
          <h1 className="font-title text-background text-start font-light">
            Qu’est-ce qu’on mange aujourd’hui ?
          </h1>
          <SearchingLoc />
        </section>
        <section className="flex flex-col items-start justify-start w-full h-full gap-4 overflow-y-auto no-scrollbar">
          <section className="flex flex-col w-screen gap-3">
            <section className="flex w-full h-[5.8em] gap-4 overflow-x-auto no-scrollbar px-5">
              {/* TODO Au click déclencher un tri dans les restaurants proposé mais ou ??*/}
              {RestaurantVariety.map(
                (variety: { name: string; image: string }) => (
                  <button
                    type="button"
                    key={variety.name}
                    className="flex flex-col items-center"
                    // onClick={(e) => setSelectFoodVariety(e.currentTarget.value)}
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
              {/* TODO Au click déclencher un tri dans les restaurants proposé mais ou ??*/}
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
              {restaurants
                .filter((restaurant) => restaurant.average_rating > 4.5)
                .map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    profileList={false}
                  />
                ))}
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
              {restaurants.filter(isOpenNow).map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  profileList={false}
                />
              ))}
            </section>
          </section>
        </section>
      </main>
    </>
  );
}
