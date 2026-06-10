import { Drawer, DrawerContent, DrawerFooter } from "@/components/ui/drawer";
import type { Restaurant } from "@/types/restaurantTypes";
import { Separator } from "@/components/ui/separator";
import RestaurantAvailableTime from "./RestaurantAvailableTime";
import RestaurantDrawerHeader from "./RestaurantDrawerHeader";
import RestaurantDrawerContent from "./RestaurantDrawerContent";
import { Link } from "react-router";

interface RestaurantDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: Restaurant;
  profileList: boolean;
}

export default function RestaurantDrawer({
  open,
  onOpenChange,
  restaurant,
  profileList,
}: RestaurantDrawerProps) {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction="bottom"
      key={restaurant.id}
      snapPoints={[0.6, 1]}
      fadeFromIndex={1}
    >
      <DrawerContent
        className="flex flex-col flex-1 data-[vaul-drawer-direction=bottom]:max-h-dvh"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <RestaurantDrawerHeader
          restaurant={restaurant}
          profileList={profileList}
        />
        <section className="no-scrollbar overflow-y-auto px-6">
          <Separator />
          <RestaurantAvailableTime aboutOrReservation={"about"} />
          <RestaurantDrawerContent restaurantId={restaurant.id.toString()} />
        </section>
        <DrawerFooter className="px-4 pt-2 pb-4 shrink-0">
          <Link
            to={`/restaurant/${restaurant.id}/new-reservation`}
            className="rounded-[0.5em] bg-primary text-primary-foreground p-2"
          >
            Réserver
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
