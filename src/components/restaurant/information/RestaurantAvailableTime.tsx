import { RestaurantApi } from "@/api/RestaurantApi";
import { Badge } from "@/components/ui/badge";
import { extractApiError } from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface RestaurantAvailableTimeProps {
  aboutOrReservation: string;
  restaurantId?: number;
}

function todayLocalDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export default function RestaurantAvailableTime({
  aboutOrReservation,
  restaurantId,
}: RestaurantAvailableTimeProps) {
  const [times, setTimes] = useState<string[]>();

  useEffect(() => {
    if (!restaurantId) return;

    let cancelled = false;
    RestaurantApi.getAvailability(restaurantId, {
      date: todayLocalDate(),
      party_size: 2,
    })
      .then((availabilities) => {
        if (cancelled) return;
        const slotTimes = availabilities.flatMap((availability) =>
          availability.slots.map((slot) => slot.time.slice(0, 5)),
        );
        setTimes([...new Set(slotTimes)].slice(0, 6));
      })
      .catch((error) => {
        if (cancelled) return;
        setTimes([]);
        toast.error(extractApiError(error).message);
      });

    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  if (!restaurantId) return null;

  const badgeClassName =
    aboutOrReservation !== "reservation"
      ? "rounded-phone py-0.5 px-1.5 text-[0.9em] bg-[#F7F3EE] text-foreground"
      : "rounded-[0.5em] p-2 bg-background border border-border";

  return (
    <section className="px-4 py-2 flex flex-row gap-2 overflow-x-auto no-scrollbar">
      {times === undefined ? (
        <p className="text-[0.85em] text-muted-foreground">
          Chargement des créneaux…
        </p>
      ) : times.length === 0 ? (
        <p className="text-[0.85em] text-muted-foreground">
          Aucun créneau aujourd'hui
        </p>
      ) : (
        times.map((time) => (
          <Badge key={time} variant="secondary" className={badgeClassName}>
            {time}
          </Badge>
        ))
      )}
    </section>
  );
}
