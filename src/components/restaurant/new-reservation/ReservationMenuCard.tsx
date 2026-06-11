import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Menu } from "@/types/restaurantTypes";
import { useState } from "react";
import Allergy from "../../../assets/icon/allergy.svg";
import Option from "../../../assets/icon/option.svg";
import Plus from "../../../assets/icon/plus.svg";
import Minus from "../../../assets/icon/minus.svg";

import Placeholder from "../../../assets/image/rice.webp";

interface ReservationMenuCardProps {
  dish: Menu;
  newReservationMenu?: Menu[];
  setNewReservationMenu?: (newReservationMenu: Menu[]) => void;
  totalCommand?: number;
  setTotalCommand?: (totalCommand: number) => void;
}

export default function ReservationMenuCard({
  dish,
  newReservationMenu,
  setNewReservationMenu,
  totalCommand,
  setTotalCommand,
}: ReservationMenuCardProps) {
  const [menuSelected, setMenuSelected] = useState(false);
  function handleAddMenuClick(choice: Menu) {
    if (newReservationMenu) {
      if (!menuSelected) {
        setNewReservationMenu?.([...newReservationMenu, choice]);
        setMenuSelected(true);
        if (totalCommand) {
          const totalReduced = totalCommand + Number(choice.price);
          setTotalCommand?.(totalReduced);
        }
      } else if (menuSelected) {
        const guestToKeep = newReservationMenu.filter(
          (menu) => menu.id !== choice.id,
        );
        setNewReservationMenu?.(guestToKeep);
        setMenuSelected(false);
        if (totalCommand && totalCommand > 0) {
          const totalReduced = totalCommand - Number(choice.price);
          setTotalCommand?.(totalReduced);
        }
      }
    }
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild className="p-0 pt-2">
          <Button
            variant="link"
            onClick={() => handleAddMenuClick(dish)}
            className="w-full h-auto"
          >
            <Card
              className="w-full rounded-sm flex flex-col items-start justify-between p-2 gap-1 text-wrap"
              key={dish.id}
            >
              <p className="">{dish.name}</p>
              <p className="text-start text-muted-foreground font-light text-[0.9em]">
                {dish.description}
              </p>
              <p className="text-[0.9em]">{dish.price} €</p>
            </Card>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-screen h-screen p-4 gap-2">
          <SheetHeader className="w-full flex-row items-start p-2 gap-1">
            <section className="w-full flex flex-col items-start">
              <SheetDescription className="sr-only">
                Choix du plat et de sa quantité
              </SheetDescription>
              <SheetTitle className="text-[1em] text-[#8F8B73] font-light">
                Détails
              </SheetTitle>
            </section>
          </SheetHeader>
          <section className="w-full">
            <img
              // src={dish.image_url}
              src={Placeholder}
              alt="image du plat"
              className="relative object-cover z-1 w-full h-45"
            />
            <div className="w-full flex flex-col items-start mt-3">
              <p className="text-[1.1em]">{dish.name}</p>
              <p className="text-[0.9em] text-[#8F8B73] font-light">
                {dish.description}
              </p>
            </div>
          </section>
          <section className="h-[60%] flex flex-col justify-between">
            <Tabs defaultValue="option" className="my-2 w-full rounded-sm mt-0">
              <TabsList className="w-full rounded-sm bg-muted group-data-[orientation=horizontal]/tabs:h-[5.7em] gap-1">
                <TabsTrigger
                  value="option"
                  className="flex-1 flex-col justify-center items-center h-auto gap-1 font-light rounded-sm data-[state=active]:opacity-100 opacity-40"
                >
                  <img
                    src={Option}
                    alt="voir les options"
                    className="size-[2.3em]"
                  />
                  Options
                </TabsTrigger>
                <TabsTrigger
                  value="ingredient"
                  className="flex-1 flex-col justify-center items-center h-autogap-1 font-light rounded-sm data-[state=active]:opacity-100 opacity-40"
                >
                  <img
                    src={Allergy}
                    alt="voir les ingrédients"
                    className="size-[2.3em]"
                  />
                  Ingrédients
                </TabsTrigger>
                <TabsTrigger
                  value="allergy"
                  className="flex-1 flex-col justify-center items-center h-auto gap-1 font-light rounded-sm data-[state=active]:opacity-100 opacity-40"
                >
                  <img
                    src={Allergy}
                    alt="voir les allergies"
                    className="size-[2.3em]"
                  />
                  Allergènes
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="option"
                className="w-full flex-col items-start rounded-sm overflow-y-auto no-scrollbar"
              >
                <p>Pour plus de goût</p>
                <Card></Card>
              </TabsContent>
            </Tabs>
            <section>
              <article className="w-full flex justify-center gap-3">
                <Button variant="ghost" className="">
                  <img src={Minus} alt="enlever un plat" />
                </Button>
                <p></p>
                <Button variant="ghost">
                  <img src={Plus} alt="ajouter un plat" />
                </Button>
              </article>
              <Button className="w-full font-light">Ajouter pour {}</Button>
            </section>
          </section>
        </SheetContent>
      </Sheet>
    </>
  );
}
