import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { RestaurantApi } from "@/api/RestaurantApi";
import type { Menu, Restaurant } from "@/types/restaurantTypes";
import { useEffect, useState } from "react";
import MenuIcon from "../../../assets/icon/menu.svg";
import ReviewIcon from "../../../assets/icon/review.svg";
import PictureIcon from "../../../assets/icon/picture.svg";
import AboutIcon from "../../../assets/icon/about.svg";
import RestaurantMenus from "./RestaurantMenus";
import RestaurantReview from "./RestaurantReview";
import RestaurantPictures from "./RestaurantPictures";
import RestaurantAbout from "./RestaurantAbout";

interface RestaurantDrawerContentProps {
  restaurantId: string;
}

export default function RestaurantDrawerContent({
  restaurantId,
}: RestaurantDrawerContentProps) {
  const [restaurant, setRestaurant] = useState<Restaurant | undefined>();

  useEffect(() => {
    if (!restaurantId) return;

    async function getOneRestaurant() {
      const restaurant = await RestaurantApi.getOne(restaurantId);
      setRestaurant(restaurant);
    }

    getOneRestaurant();
  }, [restaurantId]);

  const [restaurantMenu, setRestaurantMenu] = useState<
    Record<string, Menu[]> | undefined
  >();

  useEffect(() => {
    async function getOneMenus() {
      const allMenus = await RestaurantApi.getOneMenus(restaurantId);

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
    getOneMenus();
  }, [restaurantId]);

  return (
    <>
      {restaurant && (
        <section className="w-full flex flex-col items-start gap-2">
          <Tabs defaultValue="menu" className="my-2 w-full rounded-sm">
            <TabsList className="w-full rounded-sm bg-muted group-data-[orientation=horizontal]/tabs:h-[5.7em]">
              <TabsTrigger
                value="menu"
                className="flex-1 flex-col justify-center items-center h-auto gap-1 font-light rounded-sm data-[state=active]:opacity-100 opacity-40"
              >
                <img
                  src={MenuIcon}
                  alt="voir le menu"
                  className="size-[2.3em]"
                />
                Menu
              </TabsTrigger>
              <TabsTrigger
                value="review"
                className="flex-1 flex-col justify-center items-center h-auto gap-1 font-light rounded-sm data-[state=active]:opacity-100 opacity-40"
              >
                <img src={ReviewIcon} alt="voir les avis" />
                Avis
              </TabsTrigger>
              <TabsTrigger
                value="photos"
                className="flex-1 flex-col justify-center items-center h-auto gap-1 font-light rounded-sm data-[state=active]:opacity-100 opacity-40"
              >
                <img src={PictureIcon} alt="voir les photos" />
                Photos
              </TabsTrigger>
              <TabsTrigger
                value="a_propos"
                className="flex-1 flex-col justify-center items-center h-auto gap-1 font-light rounded-sm data-[state=active]:opacity-100 opacity-40"
              >
                <img src={AboutIcon} alt="voir plus" />A propos
              </TabsTrigger>
            </TabsList>
            <TabsContent value="menu" className="flex-1 rounded-sm">
              {restaurantMenu && (
                <RestaurantMenus restaurantMenu={restaurantMenu} />
              )}
            </TabsContent>
            <TabsContent value="review">
              <RestaurantReview />
            </TabsContent>
            <TabsContent value="photos">
              <RestaurantPictures />
            </TabsContent>
            <TabsContent value="a_propos">
              <RestaurantAbout restaurant={restaurant} />
            </TabsContent>
          </Tabs>
        </section>
      )}
    </>
  );
}
