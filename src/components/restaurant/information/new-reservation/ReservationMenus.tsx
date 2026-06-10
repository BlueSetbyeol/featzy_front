import { RestaurantApi } from "@/api/RestaurantApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Menu } from "@/types/restaurantTypes";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ReservationMenuCard from "./ReservationMenuCard";

export default function ReservationMenus() {
  const { id } = useParams();
  const [newReservationMenu, setNewReservationMenu] = useState<Menu[]>();

  const [restaurantMenu, setRestaurantMenu] = useState<
    Record<string, Menu[]> | undefined
  >();

  useEffect(() => {
    async function getOneMenus() {
      if (id) {
        const allMenus = await RestaurantApi.getOneMenus(id);

        const groupedByCategory = allMenus
          .flatMap((menu) => menu.items.data)
          .reduce(
            (acc, dish) => {
              const category = dish.category_label;

              if (!acc[category]) {
                acc[category] = [];
              }

              acc[category].push(dish);
              return acc;
            },
            {} as Record<string, Menu[]>,
          );

        setRestaurantMenu(groupedByCategory);
      }
    }
    getOneMenus();
  }, [id]);
  return (
    <>
      <article className="w-full flex flex-col items-start">
        <Tabs defaultValue="entrees" className="my-2 w-full rounded-sm">
          <TabsList className="w-full rounded-sm">
            <TabsTrigger
              value="entrees"
              className="flex-1 flex-col justify-center items-center h-auto gap-1 font-light rounded-sm data-[state=active]:opacity-100 opacity-40"
            >
              {/* <img src={MenuIcon} alt="voir le menu" className="size-[2.3em]" /> */}
              Entrées
            </TabsTrigger>

            <TabsTrigger value="plats" className="flex-1 rounded-sm">
              Plats
            </TabsTrigger>
            <TabsTrigger value="desserts" className="flex-1 rounded-sm">
              Desserts
            </TabsTrigger>
            <TabsTrigger value="boissons" className="flex-1 rounded-sm">
              Boissons
            </TabsTrigger>
          </TabsList>
          <TabsContent value="entrees" className="flex-1 rounded-sm">
            {restaurantMenu &&
              Object.entries(restaurantMenu).map(([category, dishes]) => (
                <section
                  key={category}
                  className="flex flex-col gap-3 items-start pb-4"
                >
                  {category === "entree" &&
                    dishes.map((dish) => (
                      <ReservationMenuCard
                        dish={dish}
                        newReservationMenu={newReservationMenu}
                        setNewReservationMenu={setNewReservationMenu}
                        key={dish.id}
                      />
                    ))}
                </section>
              ))}
          </TabsContent>
          <TabsContent value="plats">
            {restaurantMenu &&
              Object.entries(restaurantMenu).map(([category, dishes]) => (
                <section
                  key={category}
                  className="flex flex-col gap-3 items-start pb-4"
                >
                  {category === "plat" &&
                    dishes.map((dish) => (
                      <ReservationMenuCard
                        dish={dish}
                        newReservationMenu={newReservationMenu}
                        setNewReservationMenu={setNewReservationMenu}
                        key={dish.id}
                      />
                    ))}
                </section>
              ))}
          </TabsContent>
          <TabsContent value="desserts">
            {restaurantMenu &&
              Object.entries(restaurantMenu).map(([category, dishes]) => (
                <section
                  key={category}
                  className="flex flex-col gap-3 items-start pb-4"
                >
                  {category === "dessert" &&
                    dishes.map((dish) => (
                      <ReservationMenuCard
                        dish={dish}
                        newReservationMenu={newReservationMenu}
                        setNewReservationMenu={setNewReservationMenu}
                        key={dish.id}
                      />
                    ))}
                </section>
              ))}
          </TabsContent>
          <TabsContent value="boissons">
            {restaurantMenu &&
              Object.entries(restaurantMenu).map(([category, dishes]) => (
                <section
                  key={category}
                  className="flex flex-col gap-3 items-start pb-4"
                >
                  {category === "boisson" &&
                    dishes.map((dish) => (
                      <ReservationMenuCard
                        dish={dish}
                        newReservationMenu={newReservationMenu}
                        setNewReservationMenu={setNewReservationMenu}
                        key={dish.id}
                      />
                    ))}
                </section>
              ))}
          </TabsContent>
        </Tabs>
      </article>
    </>
  );
}
