import ReservationMenus from "@/components/restaurant/new-reservation/ReservationMenus";
import { Button } from "@/components/ui/button";
import UserContext from "@/context/UserContext";
import { useReservation } from "@/hooks/useReservations";
import { useAddOrderItem, useOrder, usePlaceOrder } from "@/hooks/useOrders";
import { extractApiError } from "@/lib/axios";
import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/types/restaurantTypes";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function EarlyCommand() {
  const { id } = useParams();
  const { user, loading: userLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const enabled = !!id && !userLoading && !!user;
  const reservationQuery = useReservation(id, { enabled });
  const orderQuery = useOrder(id, { enabled });
  const reservation = reservationQuery.data ?? null;
  const order = orderQuery.data ?? null;
  const loading = reservationQuery.isFetching || orderQuery.isFetching;

  const addItem = useAddOrderItem(order?.id ?? "");
  const placeOrder = usePlaceOrder();
  const placing = placeOrder.isPending;

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!reservation) {
      return;
    }
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [reservation]);

  const reservedAtDate = reservation
    ? new Date(reservation.reserved_at.replace(" ", "T"))
    : null;
  const remainingMinutes = reservedAtDate
    ? Math.max(Math.floor((reservedAtDate.getTime() - now) / 60000), 0)
    : 0;
  const timeLeftBeforeReservation = `${String(Math.floor(remainingMinutes / 60)).padStart(2, "0")}:${String(remainingMinutes % 60).padStart(2, "0")}`;
  const timeofReservation = reservedAtDate
    ? format(reservedAtDate, "HH:mm")
    : "";
  const orderItems = order?.items ?? [];
  const myParticipant =
    reservation?.participants?.find((p) => p.user_id === user?.id) ?? null;

  // Renvoie true si l'item a bien été ajouté, pour que la carte puisse
  // fermer son drawer uniquement en cas de succès.
  async function handleAddItem(
    menuItem: MenuItem,
    quantity: number,
  ): Promise<boolean> {
    if (!order) {
      return false;
    }
    if (!myParticipant) {
      toast.error("Impossible de retrouver ta place dans la réservation");
      return false;
    }
    try {
      await addItem.mutateAsync({
        menu_item_id: menuItem.id,
        reservation_participant_id: myParticipant.id,
        quantity,
      });
      toast.success(`${menuItem.name} ajouté à ta pré-commande`);
      return true;
    } catch (error) {
      toast.error(extractApiError(error).message);
      return false;
    }
  }

  async function handlePlaceOrder() {
    if (!order) {
      return;
    }
    try {
      await placeOrder.mutateAsync(order.id);
      toast.success("Ta pré-commande est validée !");
      navigate("/my-reservation");
    } catch (error) {
      const { code, message } = extractApiError(error);
      toast.error(
        code === "INSUFFICIENT_STOCK"
          ? `Stock insuffisant : ${message}`
          : message,
      );
    }
  }

  return (
    <main className="h-full w-full">
      <div className="w-full flex flex-row gap-3 px-5 pt-5 items-center">
        <Link to="/my-reservation" className="justify-start items-start">
          <ArrowLeft className="size-4" />
        </Link>
        <section className="text-start">
          <h1>Votre réservation</h1>
          <p className="text-start">
            Commande avant{" "}
            <span className="text-primary">{timeofReservation}</span> — temps
            restant {timeLeftBeforeReservation}
          </p>
        </section>
      </div>
      {userLoading || loading ? (
        <section className="w-full mt-8 flex flex-col justify-start p-4 gap-2">
          <p className="text-muted-foreground text-start">
            Chargement de votre réservation…
          </p>
        </section>
      ) : !user ? (
        <section className="w-full mt-8 flex flex-col justify-start p-4 gap-2">
          <p className="text-muted-foreground text-start">
            Connectez-vous pour accéder à votre pré-commande.
          </p>
          <Button variant="default" onClick={() => navigate("/login")}>
            Se connecter
          </Button>
        </section>
      ) : !reservation ? (
        <section className="w-full mt-8 flex flex-col justify-start p-4 gap-2">
          <p className="text-muted-foreground text-start">
            Impossible de charger votre réservation.
          </p>
        </section>
      ) : (
        <section className="w-full h-[88%] mt-5 flex flex-col justify-between p-4 gap-2">
          <ReservationMenus
            onAdd={handleAddItem}
            reservationId={reservation.restaurant_id}
          />
          <Button
            variant="default"
            onClick={handlePlaceOrder}
            disabled={placing || orderItems.length === 0}
          >
            {placing
              ? "Validation…"
              : `Votre Panier ${formatPrice(order?.items_total ?? 0)}`}
          </Button>
        </section>
      )}
    </main>
  );
}
