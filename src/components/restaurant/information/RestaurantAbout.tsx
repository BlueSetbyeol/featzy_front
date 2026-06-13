import MapForRestaurant from "@/components/map/MapForRestaurant";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OpeningHour, Restaurant } from "@/types/restaurantTypes";
import { Home, Phone } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router";

interface RestaurantAboutProps {
  restaurant: Restaurant;
}

function formatHour(time: string): string {
  return time.slice(0, 5);
}

function hoursLabel(entries: OpeningHour[]): string {
  return entries
    .map(
      (entry) =>
        `${entry.service_name} ${formatHour(entry.opens_at)} - ${formatHour(entry.closes_at)}`,
    )
    .join(" · ");
}

export default function RestaurantAbout({ restaurant }: RestaurantAboutProps) {
  const [value, setValue] = useState("horaires");

  const location = useLocation();

  const hoursByDay = useMemo(() => {
    const grouped = new Map<number, OpeningHour[]>();
    for (const hour of restaurant.opening_hours ?? []) {
      const entries = grouped.get(hour.day_of_week) ?? [];
      entries.push(hour);
      grouped.set(hour.day_of_week, entries);
    }
    return [...grouped.entries()]
      .sort(([a], [b]) => ((a + 6) % 7) - ((b + 6) % 7))
      .map(([day, entries]) => ({
        day,
        dayName: entries[0].day_name,
        entries: [...entries].sort((a, b) =>
          a.opens_at.localeCompare(b.opens_at),
        ),
      }));
  }, [restaurant.opening_hours]);

  const addressLine = [
    restaurant.address.street,
    [restaurant.address.postal_code, restaurant.address.city]
      .filter(Boolean)
      .join(" "),
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <article className="w-full flex flex-col items-start gap-3 py-4">
      <div className="text-start">{restaurant.description}</div>
      <div className="flex flex-col gap-1 items-start w-full pb-4">
        {addressLine && (
          <div className="flex flex-row gap-2 items-end w-full">
            <Home className="size-4" />
            <p className="text-[0.9em]">{addressLine}</p>
          </div>
        )}
        {restaurant.phone && (
          <div className="flex flex-row gap-2 items-end w-full">
            <Phone className="size-4" />
            <p className="text-[0.9em]">{restaurant.phone}</p>
          </div>
        )}
        <Select
          value={value}
          onValueChange={(val) => {
            setValue(val);
          }}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={value}
              className="text-[1em] font-ligth"
            />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            <SelectGroup>
              <SelectItem value="horaires">Horaires</SelectItem>
              {hoursByDay.map(({ day, dayName, entries }) => (
                <SelectItem value={`day-${day}`} key={day}>
                  {dayName} : {hoursLabel(entries)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {location.pathname === `/` && (
        <MapForRestaurant restaurant={restaurant} />
      )}
    </article>
  );
}
