import type { Menu } from "@/types/restaurantTypes";
import ReservationMenuCard from "./ReservationMenuCard";

interface ReservationMenusSectionProps {
  dishes?: Menu[];
  newReservationMenu?: Menu[];
  setNewReservationMenu?: (newReservationMenu: Menu[]) => void;
  totalCommand?: number;
  setTotalCommand?: (totalCommand: number) => void;
}

export default function ReservationMenusSection({
  dishes,
  newReservationMenu,
  setNewReservationMenu,
  totalCommand,
  setTotalCommand,
}: ReservationMenusSectionProps) {
  if (!dishes) return null;
  return (
    <>
      {dishes.map((dish) => (
        <ReservationMenuCard
          key={dish.id}
          dish={dish}
          newReservationMenu={newReservationMenu}
          setNewReservationMenu={setNewReservationMenu}
          totalCommand={totalCommand}
          setTotalCommand={setTotalCommand}
        />
      ))}
    </>
  );
}
