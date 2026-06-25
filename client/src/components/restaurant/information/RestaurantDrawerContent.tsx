import { useRestaurant } from "@/hooks/useRestaurants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import RestaurantAbout from "./RestaurantAbout";
import RestaurantMenus from "./RestaurantMenus";
import RestaurantPictures from "./RestaurantPictures";
import RestaurantReview from "./RestaurantReview";

interface RestaurantDrawerContentProps {
  restaurantId: string;
}

export default function RestaurantDrawerContent({
  restaurantId,
}: RestaurantDrawerContentProps) {
  const { data: restaurant } = useRestaurant(restaurantId);

  if (!restaurant) return null;

  return (
    <section className="w-full flex flex-col items-start gap-2">
      <Tabs defaultValue="menu" className="my-2 w-full rounded-sm">
        <TabsList className="w-full rounded-sm">
          <TabsTrigger value="menu" className="flex-1">
            Menu
          </TabsTrigger>
          <TabsTrigger value="review" className="flex-1 rounded-sm">
            Avis
          </TabsTrigger>
          <TabsTrigger value="photos" className="flex-1 rounded-sm">
            Photos
          </TabsTrigger>
          <TabsTrigger value="a_propos" className="flex-1 rounded-sm">
            A propos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="menu" className="flex-1 rounded-sm">
          <RestaurantMenus restaurantId={restaurant.id} />
        </TabsContent>
        <TabsContent value="review">
          <RestaurantReview restaurantId={restaurant.id} />
        </TabsContent>
        <TabsContent value="photos">
          <RestaurantPictures media={restaurant.media} />
        </TabsContent>
        <TabsContent value="a_propos">
          <RestaurantAbout restaurant={restaurant} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
