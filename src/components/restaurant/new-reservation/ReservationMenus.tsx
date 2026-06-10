import { RestaurantApi } from "@/api/RestaurantApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Menu } from "@/types/restaurantTypes";
import { useEffect, useState } from "react";
import Starter from "../../../assets/icon/starter.svg";
import MainDish from "../../../assets/icon/main-dish.svg";
import Desert from "../../../assets/icon/desert.svg";
import Drink from "../../../assets/icon/drink.svg";
import ReservationMenusSection from "./ReservationMenusSection";

interface ReservationMenusProps {
  totalCommand: number;
  setTotalCommand: (totalCommand: number) => void;
  newReservationMenu?: Menu[];
  setNewReservationMenu: (newReservationMenu: Menu[]) => void;
}

export default function ReservationMenus({
  totalCommand,
  setTotalCommand,
  newReservationMenu,
  setNewReservationMenu,
}: ReservationMenusProps) {
  // TODO récupérer la réservation dont id ci-dessous
  // const { id } = useParams();

  const [restaurantMenu, setRestaurantMenu] = useState<
    Record<string, Menu[]> | undefined
  >();

  // depuis la réservation, récupérer l'id du restaurant.
  const RestaurantId = "7";

  useEffect(() => {
    async function getOneMenus() {
      if (RestaurantId) {
        const allMenus = await RestaurantApi.getOneMenus(RestaurantId);

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
  }, [RestaurantId]);

  return (
    <>
      <article className="w-full h-full flex flex-col items-start">
        <Tabs
          defaultValue="starter"
          className="my-2 w-full h-full flex flex-col items-start rounded-sm"
        >
          <TabsList className="w-full rounded-sm bg-muted group-data-[orientation=horizontal]/tabs:h-[5.7em] gap-1">
            <TabsTrigger
              value="starter"
              className="flex-1 flex-col justify-center items-center h-autogap-1 font-light rounded-sm data-[state=active]:opacity-100 opacity-40"
            >
              <img
                src={Starter}
                alt="voir les entrées"
                className="size-[2.3em]"
              />
              Entrées
            </TabsTrigger>
            <TabsTrigger
              value="main"
              className="flex-1 flex-col justify-center items-center h-auto gap-1 font-light rounded-sm data-[state=active]:opacity-100 opacity-40"
            >
              <img
                src={MainDish}
                alt="voir les plats"
                className="size-[2.3em]"
              />
              Plats
            </TabsTrigger>
            <TabsTrigger
              value="desert"
              className="flex-1 flex-col justify-center items-center h-auto gap-1 font-light rounded-sm data-[state=active]:opacity-100 opacity-40"
            >
              <img
                src={Desert}
                alt="voir les desserts"
                className="size-[2.3em]"
              />
              Desserts
            </TabsTrigger>
            <TabsTrigger
              value="drink"
              className="flex-1 flex-col justify-center items-center h-auto gap-1 font-light rounded-sm data-[state=active]:opacity-100 opacity-40"
            >
              <img
                src={Drink}
                alt="voir les boissons"
                className="size-[2.3em]"
              />
              Boissons
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="starter"
            className="flex-1 rounded-sm w-full h-[60%]"
          >
            <ReservationMenusSection
              dishes={restaurantMenu?.["Entrée"]}
              newReservationMenu={newReservationMenu}
              setNewReservationMenu={setNewReservationMenu}
              totalCommand={totalCommand}
              setTotalCommand={setTotalCommand}
            />
          </TabsContent>
          <TabsContent value="main">
            <ReservationMenusSection
              dishes={restaurantMenu?.["Plat principal"]}
              newReservationMenu={newReservationMenu}
              setNewReservationMenu={setNewReservationMenu}
              totalCommand={totalCommand}
              setTotalCommand={setTotalCommand}
            />
          </TabsContent>
          <TabsContent value="desert">
            <ReservationMenusSection
              dishes={restaurantMenu?.["Dessert"]}
              newReservationMenu={newReservationMenu}
              setNewReservationMenu={setNewReservationMenu}
              totalCommand={totalCommand}
              setTotalCommand={setTotalCommand}
            />
          </TabsContent>
          <TabsContent value="drink">
            <ReservationMenusSection
              dishes={restaurantMenu?.["Boisson"]}
              newReservationMenu={newReservationMenu}
              setNewReservationMenu={setNewReservationMenu}
              totalCommand={totalCommand}
              setTotalCommand={setTotalCommand}
            />
          </TabsContent>
        </Tabs>
      </article>
    </>
  );
}
