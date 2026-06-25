import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRestaurantMenu } from "@/hooks/useRestaurants";
import type { MenuItem } from "@/types/restaurantTypes";
import ReservationMenuCard from "./ReservationMenuCard";
import Entrees from "../../../assets/icon/starter.svg";
import Plats from "../../../assets/icon/main-dish.svg";
import Desserts from "../../../assets/icon/desert.svg";
import Boissons from "../../../assets/icon/drink.svg";

interface ReservationMenusProps {
  onAdd: (menuItem: MenuItem, quantity: number) => Promise<boolean>;
  /** NB : reçoit un identifiant de restaurant (cf. EarlyCommand) */
  reservationId: number;
}

export default function ReservationMenus({
  onAdd,
  reservationId,
}: ReservationMenusProps) {
  const { data: restaurantMenu = [], isLoading: loading } =
    useRestaurantMenu(reservationId);

  const categoryIcons = [Entrees, Plats, Desserts, Boissons];

  if (loading) {
    return (
      <p className="my-2 text-muted-foreground text-start">
        Chargement du menu…
      </p>
    );
  }

  if (restaurantMenu.length === 0) {
    return (
      <p className="my-2 text-muted-foreground text-start">
        Aucun menu disponible pour ce restaurant
      </p>
    );
  }

  return (
    <>
      <article className="w-full h-full flex flex-col items-start">
        <Tabs
          defaultValue={String(restaurantMenu[0].id)}
          className="my-2 w-full h-full flex flex-col items-start rounded-sm"
        >
          <TabsList className="w-full rounded-sm bg-muted group-data-[orientation=horizontal]/tabs:h-[5.7em] gap-1">
            {restaurantMenu.map((category, index) => (
              <TabsTrigger
                key={category.id}
                value={String(category.id)}
                className="flex-1 flex-col justify-center items-center h-autogap-1 font-light rounded-sm data-[state=active]:opacity-100 opacity-40"
              >
                <img
                  src={categoryIcons[index]}
                  alt="voir les entrées"
                  className="size-[2.3em]"
                />
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {restaurantMenu.map((category) => (
            <TabsContent
              key={category.id}
              value={String(category.id)}
              className="flex-1 rounded-sm w-full h-[60%]"
            >
              {/* <section className="flex flex-col gap-3 items-start pb-4"> */}
              {(category.menu_items ?? []).map((dish) => (
                <ReservationMenuCard key={dish.id} dish={dish} onAdd={onAdd} />
              ))}
              {/* </section> */}
            </TabsContent>
          ))}
        </Tabs>
      </article>
    </>
  );
}
