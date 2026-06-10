import type { Restaurant } from "@/types/restaurantTypes";

const now = new Date();

// Convert current time to French timezone, then get the day number
const frenchDate = new Date(
  now.toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
);

const frenchDay = frenchDate.getDay(); // 0 = Sunday, 1 = Monday...

// Get current time as "HH:MM" string in France
const frenchTime = now.toLocaleTimeString("fr-FR", {
  timeZone: "Europe/Paris",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function isOpenNow(restaurant: Restaurant): boolean {
  if (!restaurant.opening_hours?.data) return false;

  const todaySchedule = restaurant.opening_hours.data.filter(
    (schedule) => schedule.day_of_week === frenchDay && !schedule.is_closed,
  );

  if (todaySchedule.length === 0) return false;

  // Check if current time falls within any service of the day
  return todaySchedule.some(
    (schedule) =>
      frenchTime >= schedule.opening_time &&
      frenchTime <= schedule.closing_time,
  );
}

export { frenchDay, frenchTime, isOpenNow };
