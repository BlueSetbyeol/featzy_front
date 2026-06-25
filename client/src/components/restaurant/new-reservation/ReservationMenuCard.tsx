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
import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/types/restaurantTypes";
import { useState } from "react";
import Allergy from "../../../assets/icon/allergy.svg";
import Option from "../../../assets/icon/option.svg";
import Plus from "../../../assets/icon/plus.svg";
import Minus from "../../../assets/icon/minus.svg";

import Placeholder from "../../../assets/image/rice.webp";

interface ReservationMenuCardProps {
  dish: MenuItem;
  onAdd: (dish: MenuItem, quantity: number) => Promise<boolean>;
}

export default function ReservationMenuCard({
  dish,
  onAdd,
}: ReservationMenuCardProps) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  async function handleAdd() {
    setAdding(true);
    try {
      const added = await onAdd(dish, quantity);
      if (added) {
        setOpen(false);
        setQuantity(1);
      }
    } finally {
      setAdding(false);
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="p-0 pt-2">
          <Button variant="link" className="w-full h-auto">
            <Card
              className="w-full rounded-sm flex flex-col items-start justify-between p-2 gap-1 text-wrap"
              key={dish.id}
            >
              <p className="">{dish.name}</p>
              <p className="text-start text-muted-foreground font-light text-[0.9em]">
                {dish.description}
              </p>
              <p className="text-[0.9em]">{formatPrice(dish.price)}</p>
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
              src={dish.photos.length > 0 ? dish.photos[0].url : Placeholder}
              alt="image du plat"
              className="relative object-cover z-1 w-full h-45"
            />
            <div className="w-full flex flex-col items-start mt-3">
              <p className="text-[1.1em]">{dish.name}</p>
              <p className="text-[0.9em] text-[#8F8B73] font-light">
                {dish.description}
              </p>
              {dish.is_sold_out && (
                <p className="text-start text-primary">Épuisé</p>
              )}
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
                className="w-full flex flex-col items-start gap-2 rounded-sm overflow-y-auto no-scrollbar"
              >
                {(dish.option_groups ?? []).length === 0 ? (
                  <p className="text-[0.9em] text-muted-foreground text-start">
                    Aucune option pour ce plat
                  </p>
                ) : (
                  (dish.option_groups ?? []).map((group) => (
                    <div
                      key={group.id}
                      className="w-full flex flex-col items-start gap-1"
                    >
                      <p className="text-[0.95em]">{group.name}</p>
                      {(group.options ?? []).map((option) => (
                        <Card
                          key={option.id}
                          className="w-full rounded-sm flex-row items-center justify-between p-2"
                        >
                          <span className="text-[0.9em]">{option.name}</span>
                          {option.price_delta > 0 && (
                            <span className="text-[0.9em] text-muted-foreground">
                              +{formatPrice(option.price_delta)}
                            </span>
                          )}
                        </Card>
                      ))}
                    </div>
                  ))
                )}
              </TabsContent>
              <TabsContent
                value="ingredient"
                className="w-full flex flex-col items-start gap-2 rounded-sm overflow-y-auto no-scrollbar"
              >
                <p className="text-[0.9em] text-muted-foreground text-start">
                  Aucun ingrédient renseigné
                </p>
              </TabsContent>
              <TabsContent
                value="allergy"
                className="w-full flex flex-wrap items-start gap-2 rounded-sm overflow-y-auto no-scrollbar"
              >
                {(dish.allergens ?? []).length === 0 ? (
                  <p className="text-[0.9em] text-muted-foreground text-start">
                    Aucun allergène signalé
                  </p>
                ) : (
                  (dish.allergens ?? []).map((allergen) => (
                    <Card
                      key={allergen.id}
                      className="rounded-sm flex-row items-center gap-2 p-2"
                    >
                      {allergen.icon && (
                        <img src={allergen.icon} alt="" className="size-5" />
                      )}
                      <span className="text-[0.9em]">{allergen.name}</span>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
            <section>
              <article className="w-full flex justify-center items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <img src={Minus} alt="enlever un plat" />
                </Button>
                <p className="min-w-6 text-center">{quantity}</p>
                <Button
                  variant="ghost"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <img src={Plus} alt="ajouter un plat" />
                </Button>
              </article>
              <Button
                className="w-full font-light"
                onClick={handleAdd}
                disabled={adding}
              >
                {adding
                  ? "Ajout…"
                  : `Ajouter pour ${formatPrice(dish.price * quantity)}`}
              </Button>
            </section>
          </section>
        </SheetContent>
      </Sheet>
    </>
  );
}
