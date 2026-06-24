import type { Reservation, ReservationStatus } from "@/types/reservationTypes";

export const reservationStatusLabels: Record<ReservationStatus, string> = {
  confirmed: "Confirmée",
  seated: "À table",
  completed: "Terminée",
  cancelled: "Annulée",
  no_show: "Absence",
};

export function formatReservedAt(timeSlot: string): string {
  const date = new Date(timeSlot);
  const day = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
  }).format(date);

  const time = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return `${day} à ${time}`;
}

export function formatSimpleReservedAt(timeSlot: string): string {
  const date = new Date(timeSlot);

  const month = new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(
    date,
  );
  const dayNum = date.getDate();
  const dayLabel = dayNum === 1 ? "1er" : `${dayNum}`;
  const year = date.getFullYear();

  return `${dayLabel} ${month} ${year}`;
}

export function formatTimeLimit(timeSlot: string): string {
  const date = new Date(timeSlot);
  date.setHours(date.getHours() - 1);

  const time = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return time;
}

export function formatTimeToReservation(timeSlot: string): string {
  const date = new Date(timeSlot);
  date.setHours(date.getHours() - 1);

  const today = Date.now();
  const timeLeftMs = date.getTime() - today;

  if (timeLeftMs <= 0) return "Passé";

  const totalMinutes = Math.floor(timeLeftMs / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0)
    return `${hours}h${minutes.toString().padStart(2, "0")}`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}`;
}

export function formatAddress(reservation: Reservation): string {
  const address = reservation.restaurant?.address;
  if (!address) {
    return "";
  }
  return [address.street, address.postal_code, address.city]
    .filter(Boolean)
    .join(", ");
}
