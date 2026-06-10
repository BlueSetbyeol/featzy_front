import { Button } from "@/components/ui/button";
import ReservationNavigation from "@/components/restaurant/information/new-reservation/ReservationNavigation";

import ReservationTimePlace from "@/components/restaurant/information/new-reservation/ReservationTimePlace";
import { useState } from "react";
import ReservationGuest from "@/components/restaurant/information/new-reservation/ReservationGuests";
import { useNavigate, useParams } from "react-router";

// TODO replace by right type when received from back
type userFriend = {
  id: number;
  firstname: string;
  lastname: string;
  image: string;
};

export default function NewReservation() {
  const [reservationStep, setReservationStep] = useState<number>(1);

  // 1ère étape : Time & place
  const [venue, setVenue] = useState<"eat" | "go">("eat");
  const [earlyCommandChoice, setEarlyCommandChoice] = useState<"oui" | "non">(
    "oui",
  );
  const [numberOfGuest, setNumberOfGuest] = useState("1");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("12:30");

  // 2ème partie : guests
  const [guestsToContact, setGuestsToContact] = useState<userFriend[]>([]);
  console.log(guestsToContact);

  // confirmation
  const navigate = useNavigate();
  const { id } = useParams();

  function handleClickConfirmation(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (reservationStep === 1) {
      setReservationStep(reservationStep + 1);
    } else {
      // TODO send reservation to back office with venue, earlyCommandChoice, numberOfGuest, date, time, guestsToContact
      // changer la destination /restaurant/${id}/early-command
      navigate(`/restaurant/${id}/early-command`);
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
            time={time}
            setTime={setTime}
            earlyCommandChoice={earlyCommandChoice}
            setEarlyCommandChoice={setEarlyCommandChoice}
          />
        ) : (
          <ReservationGuest
            numberOfGuest={numberOfGuest}
            guestsToContact={guestsToContact}
            setGuestsToContact={setGuestsToContact}
          />
        )}
        <Button
          className="w-full bg-primary border-primary text-primary-foreground rounded-[0.5em]"
          onClick={handleClickConfirmation}
          disabled={
            reservationStep === 2 &&
            Number(numberOfGuest) !== guestsToContact.length
          }
        >
          {reservationStep === 1 &&
          Number(numberOfGuest) === guestsToContact.length
            ? "Continuer"
            : "Confirmer"}
        </Button>
      </section>
    </main>
  );
}
