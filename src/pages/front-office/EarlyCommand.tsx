import ReservationMenus from "@/components/restaurant/new-reservation/ReservationMenus";
import { Button } from "@/components/ui/button";
import type { Menu } from "@/types/restaurantTypes";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function EarlyCommand() {
  const [totalCommand, setTotalCommand] = useState<number>(0);
  const [newReservationMenu, setNewReservationMenu] = useState<Menu[]>();
  return (
    <main className="h-full w-full">
      <div className="w-full flex flex-row gap-3 px-5 pt-5 items-center">
        <Link to="/reservation" className="justify-start items-start">
          <ArrowLeft className="size-4" />
        </Link>
        <section className="text-start">
          <h1>Votre réservation</h1>
        </section>
      </div>
      <section className="w-full h-[88%] mt-8 flex flex-col justify-between p-4 gap-2">
        <ReservationMenus
          totalCommand={totalCommand}
          setTotalCommand={setTotalCommand}
          newReservationMenu={newReservationMenu}
          setNewReservationMenu={setNewReservationMenu}
        />
        <Button>Mon Panier ({totalCommand})</Button>
      </section>
    </main>
  );
}
