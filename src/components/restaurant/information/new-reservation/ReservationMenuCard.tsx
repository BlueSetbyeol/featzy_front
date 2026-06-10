import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Menu } from "@/types/restaurantTypes";
import { useState } from "react";

interface ReservationMenuCardProps {
  dish: Menu;
  newReservationMenu?: Menu[];
  setNewReservationMenu: (newReservationMenu: Menu[]) => void;
}

export default function ReservationMenuCard({
  dish,
  newReservationMenu,
  setNewReservationMenu,
}: ReservationMenuCardProps) {
  const [menuSelected, setMenuSelected] = useState(false);
  function handleAddMenuClick(choice: Menu) {
    if (newReservationMenu) {
      if (!menuSelected) {
        setNewReservationMenu?.([...newReservationMenu, choice]);
        setMenuSelected(true);
      } else if (menuSelected) {
        const guestToKeep = newReservationMenu.filter(
          (menu) => menu.id !== choice.id,
        );
        setNewReservationMenu?.(guestToKeep);
        setMenuSelected(false);
      }
    }
  }
  return (
    <Button variant="link" onClick={() => handleAddMenuClick(dish)}>
      <Card
        className="w-full rounded-sm flex flex-row justify-between p-4 gap-3"
        key={dish.id}
      >
        <section className="flex flex-col items-start max-w-4/5">
          <p className="text-start">{dish.name}</p>
          <p className="text-start text-muted-foreground font-light">
            {dish.description}
          </p>
        </section>
        <p className="text-end">{dish.price} €</p>
      </Card>
    </Button>
  );
}
