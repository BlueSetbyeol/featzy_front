import { Badge } from "@/components/ui/badge";
import { Card, CardDescription } from "@/components/ui/card";
import type { Restaurant } from "@/types/restaurantTypes";
import Like from "../../assets/icon/heart_unselected.svg";
import Dislike from "../../assets/icon/heart_dislike.svg";
import Placeholder from "../../assets/image/rice.webp";
import { Button } from "../ui/button";
import { Star } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";

interface RestaurantFavoriteCardProps {
  restaurant: Restaurant;
}

export default function RestaurantFavoriteCard({
  restaurant,
}: RestaurantFavoriteCardProps) {
  function handleDeleteFavorite(e: { preventDefault: () => void }) {
    e.preventDefault();
    //delete de la liste des restaurants favoris pour l'utilisateur connecté
  }

  return (
    <Card className="w-full p-3 flex flex-row items-center justify-between">
      <CardDescription className="flex flex-row justify-between items-center w-full">
        <article className="flex flex-row items-center gap-4 w-[90%]">
          <img
            // src={restaurant.cover_image_url}
            src={Placeholder}
            alt="Friend's profile picture"
            className="size-14 rounded-full"
          />
          <section className="px-0 flex flex-col gap-1 pt-2 items-start">
            <p className="">{restaurant.name}</p>
            <p>Restaurant {restaurant.cuisine_type}</p>
            <div className="flex flex-rox gap-2 items-start">
              <Badge
                variant="secondary"
                className="rounded-phone py-0.5 px-2.5 text-[0.7em] m-0 bg-accent text-foreground"
              >
                {restaurant.address.city}
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-phone py-0.5 px-2.5 text-[0.7em] m-0 bg-accent text-foreground"
              >
                <Star className="text-accent fill-[#C4C26C]" />
                {restaurant.average_rating}
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-phone py-0.5 px-2.5 text-[0.7em] m-0 bg-accent text-foreground"
              >
                {restaurant.price_range}
              </Badge>
            </div>
          </section>
        </article>
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="bg-transparent">
              <img
                src={Like}
                alt="favori"
                className="bg-[#F2C1C1] rounded-full p-1"
              />
            </Button>
          </DrawerTrigger>
          <DrawerContent
            className="w-full px-4"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DrawerHeader className="flex flex-col items-start w-full px-0">
              <DrawerDescription className="sr-only">
                Retirer des favoris ce restaurant
              </DrawerDescription>
              <div className="flex flex-row gap-2 items-center justify-start">
                <img
                  src={Dislike}
                  alt="favori"
                  className="bg-[#F2C1C1] rounded-full p-1"
                />
                <h2>Retirer des favoris ?</h2>
              </div>
              <p className="text-[0.8em] text-muted-foreground">
                {restaurant.name} sera retiré de ta liste. Tu pourras toujours
                le remettre en favori depuis sa fiche.
              </p>
            </DrawerHeader>
            <Button onClick={(e) => handleDeleteFavorite(e)}>
              Ajouter le contact
            </Button>
            <DrawerFooter className="w-full px-0">
              <DrawerClose asChild>
                <Button className="bg-accent text-accent-foreground">
                  Annulet
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </CardDescription>
    </Card>
  );
}
