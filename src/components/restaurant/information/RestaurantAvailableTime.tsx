import { Badge } from "@/components/ui/badge";
// import type { Restaurant } from "@/types/restaurantTypes";

interface RestaurantAvailableTimeProps {
  //   restaurant: Restaurant;
  aboutOrReservation: string;
}

export default function RestaurantAvailableTime({
  aboutOrReservation,
}: RestaurantAvailableTimeProps) {
  //   {
  //   restaurant,
  // }: RestaurantAvailableTimeProps

  // TODO add restaurant available timetable for reservation

  return (
    <section className="px-4 py-2 flex flex-row gap-2 overflow-x-auto no-scrollbar">
      <Badge
        variant="secondary"
        className={
          aboutOrReservation !== "reservation"
            ? "rounded-phone py-0.5 px-1.5 text-[0.9em] bg-[#F7F3EE] text-foreground"
            : "rounded-[0.5em] p-2 bg-background border border-border"
        }
      >
        Réservation time
      </Badge>
      <Badge
        variant="secondary"
        className={
          aboutOrReservation !== "reservation"
            ? "rounded-phone py-0.5 px-1.5 text-[0.9em] bg-[#F7F3EE] text-foreground"
            : "rounded-[0.5em] p-2 bg-background border border-border"
        }
      >
        Réservation time
      </Badge>
    </section>
  );
}
