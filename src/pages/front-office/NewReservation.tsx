import { Button } from "@/components/ui/button";
import ReservationNavigation from "@/components/restaurant/new-reservation/ReservationNavigation";
import ReservationTimePlace, {
  type SelectedSlot,
} from "@/components/restaurant/new-reservation/ReservationTimePlace";
import ReservationGuest from "@/components/restaurant/new-reservation/ReservationGuests";
import UserContext from "@/context/UserContext";
import { reservationApi } from "@/api/reservationApi";
import { extractApiError } from "@/lib/axios";
import type { FriendMember } from "@/types/reservationTypes";
import { format } from "date-fns";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function NewReservation() {
  const [reservationStep, setReservationStep] = useState<number>(1);

  // 1ère étape : Time & place
  const [venue, setVenue] = useState<"eat" | "go">("eat");
  const [earlyCommandChoice, setEarlyCommandChoice] = useState<"oui" | "non">(
    "oui",
  );
  const [numberOfGuest, setNumberOfGuest] = useState("1");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [slotsRefreshKey, setSlotsRefreshKey] = useState(0);
  const maxGuests = Math.max(Number(numberOfGuest) - 1, 0);

  // 2ème partie : guests
  const [guestsToContact, setGuestsToContact] = useState<FriendMember[]>([]);

  // confirmation
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  async function submitReservation() {
    if (!id || !date || !selectedSlot) {
      return;
    }
    if (!user) {
      toast.error("Connecte-toi pour réserver");
      navigate("/login");
      return;
    }
    const isPreorder = earlyCommandChoice === "oui";
    setSubmitting(true);
    try {
      const reservation = await reservationApi.create(id, {
        service_id: selectedSlot.service_id,
        date: format(date, "yyyy-MM-dd"),
        reserved_at: selectedSlot.reserved_at,
        party_size: Number(numberOfGuest),
        is_preorder: isPreorder,
      });
      if (guestsToContact.length > 0) {
        try {
          await reservationApi.inviteParticipants(reservation.id, {
            user_ids: guestsToContact.map((guest) => guest.id),
          });
        } catch (error) {
          toast.error(
            `Réservation créée, mais l'envoi des invitations a échoué : ${extractApiError(error).message}`,
          );
        }
      }
      toast.success("votre réservation est confirmée !");
      if (isPreorder) {
        navigate(
          `/restaurant/${id}/new-reservation-confirmation?reservation=${reservation.id}`,
        );
      } else {
        navigate("/reservation");
      }
    } catch (error) {
      const { code, message } = extractApiError(error);
      if (code === "SLOT_UNAVAILABLE") {
        toast.error("Ce créneau vient d'être pris, choisis-en un autre");
        setSelectedSlot(null);
        setSlotsRefreshKey((key) => key + 1);
        setReservationStep(1);
      } else {
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleClickConfirmation(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (reservationStep === 1 && maxGuests !== 0) {
      setReservationStep(2);
    } else {
      void submitReservation();
    }
  }

  return (
    <main className="w-full h-full">
      <nav className="w-screen h-20">
        <ReservationNavigation
          step={reservationStep}
          setStep={setReservationStep}
        />
      </nav>
      <section className="w-screen h-[80vh] pt-1 flex flex-col items-start justify-between px-4 overflow-y-auto no-scrollbar">
        {reservationStep === 1 ? (
          <ReservationTimePlace
            numberOfGuest={numberOfGuest}
            setNumberOfGuest={setNumberOfGuest}
            venue={venue}
            setVenue={setVenue}
            date={date}
            setDate={setDate}
            earlyCommandChoice={earlyCommandChoice}
            setEarlyCommandChoice={setEarlyCommandChoice}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            slotsRefreshKey={slotsRefreshKey}
          />
        ) : (
          <ReservationGuest
            numberOfGuest={numberOfGuest}
            guestsToContact={guestsToContact}
            setGuestsToContact={setGuestsToContact}
            maxGuests={maxGuests}
          />
        )}
        <Button
          className="w-full bg-primary border-primary text-primary-foreground rounded-[0.5em]"
          onClick={handleClickConfirmation}
          disabled={(reservationStep === 1 && !selectedSlot) || submitting}
        >
          {reservationStep === 1 && maxGuests
            ? "Continuer"
            : submitting
              ? "Confirmation…"
              : "Confirmer"}
        </Button>
      </section>
    </main>
  );
}
