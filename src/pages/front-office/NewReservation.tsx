// import { ProgressBar } from "@/components/reservation/ProgressionBar";
// import ReservationNavigation from "@/components/reservation/ReservationNavigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ToGo from "../../assets/icon/a_emporter.svg";
import ToEat from "../../assets/icon/sur_place.svg";

export default function NewReservation() {
  // const [progress, setProgress] = useState(14);

  const [venue, setVenue] = useState(true);

  console.log(venue);
  return (
    <main className="w-full h-full">
      <nav className="w-screen h-20">
        {/* <ReservationNavigation content={venue ? "Commande" : "Groupe"} />
        <ProgressBar progress={progress} /> */}
      </nav>
      {venue && (
        <section className="w-screen h-[80vh] pt-1 flex items-center justify-around">
          <Button
            onClick={() => {
              setVenue(venue ? false : true);
              // setProgress(28);
            }}
            variant={"secondary"}
            className="w-43 h-32 flex flex-col justify-center items-center gap-2 rounded-phone p-4"
          >
            <img src={ToEat} alt="Manger à emporter" className="size-15" />
            <p>Manger sur place</p>
          </Button>
          <Button
            onClick={() => {
              setVenue(venue ? false : true);
              // setProgress(28);
            }}
            variant={"secondary"}
            className="w-43 h-32 flex flex-col justify-center items-center gap-2 rounded-phone p-4"
          >
            <img src={ToGo} alt="Manger à emporter" className="size-15" />
            <p>A emporter</p>
          </Button>
        </section>
      )}
      {!venue && (
        <section className="w-screen h-[80vh] pt-1 flex items-center justify-around">
          <Button
            onClick={() => {
              setVenue(venue ? false : true);
              // setProgress(28);
            }}
            variant={"secondary"}
            className="w-43 h-32 flex flex-col justify-center items-center gap-2 rounded-phone p-4"
          >
            <img src={ToEat} alt="Manger à emporter" className="size-15" />
            <p>Manger sur place</p>
          </Button>
          <Button className="w-full bg-background border-primary border-2 text-primary text-2xl py-6 rounded-2xl">
            Voir le menu
          </Button>
        </section>
      )}
    </main>
  );
}
