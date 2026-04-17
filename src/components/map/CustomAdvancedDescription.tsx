import type { Restaurant } from "@/types/mapTypes";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface AdvancedDescriptionProps {
  restaurants: Restaurant[];
  clicked: number;
  setClicked: (id: number) => void;
}

export default function CustomAdvancedDescription({
  restaurants,
  clicked,
  setClicked,
}: AdvancedDescriptionProps) {
  const restaurant = restaurants.find((r) => r.id === clicked);
  return (
    <>
      <Drawer direction="bottom">
        <DrawerTrigger asChild>
          <Button variant="outline" className="capitalize">
            A déterminer
          </Button>
        </DrawerTrigger>
        <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="no-scrollbar overflow-y-auto px-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <p
                key={index}
                className="mb-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed"
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            ))}
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {restaurant && (
        <section
          className={
            clicked === restaurant.id
              ? "bg-background border-primary fixed bottom-[8vh] w-full h-auto rounded-phone pb-18 p-4 flex flex-row gap-4 justify-evenly items-start animate-[slideInFadeIn_0.7s_ease-in-out]"
              : "hidden"
          }
        >
          <img
            src={restaurant.logo_url}
            alt="Image of the restaurant"
            className="relative w-1/2 h-full object-cover opacity-100 transition-opacity duration-75 ease-in-out"
          />
          <Button
            className="w-auto absolute top-4 right-4 border-0 cursor-pointer text-primary-foreground bg-primary rounded-full"
            onClick={() => setClicked(0)}
          >
            X
          </Button>
          <section className="pt-8 h-[80%] flex flex-col max-w-95 opacity-100 visible animate-[slideInFadeIn_0.7s_ease-in-out]">
            <h2 className="text-primary-foreground text-[20px] not-italic font-bold leading-6.5 tracking-[0.2px] m-0">
              {restaurant.name}
            </h2>
            <p className="w-full text-[14px] not-italic font-normal leading-5 tracking-[0.2px] m-0">
              Spécialité: {restaurant.cuisine_type}
            </p>
            <p className="w-full text-[14px] not-italic font-normal leading-5 tracking-[0.2px] m-0">
              Ouverture: {restaurant.openingHours}
            </p>
          </section>
        </section>
      )}
    </>
  );
}
