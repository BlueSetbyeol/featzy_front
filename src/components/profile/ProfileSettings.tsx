import ProfileNavigation from "./ProfileNavigation";
import ArrowRight from "../../assets/icon/arrow_right.svg";
import { Link } from "react-router";
import { Button } from "../ui/button";

export default function ProfileSettings() {
  return (
    <>
      <nav className="w-screen h-20">
        <ProfileNavigation content={"Paramètres"} />
      </nav>
      <main className="h-[87%] px-5 w-full flex flex-col justify-between pb-4">
        <section className="">
          <Link
            to=""
            className="w-full bg-secondary text-foreground text-[20px] flex justify-between items-center py-3"
          >
            <p>Informations du profil</p>
            <img src={ArrowRight} alt="Go into Contacts menu" />
          </Link>
          <Link
            to=""
            className="w-full bg-secondary text-foreground text-[20px] flex justify-between items-center py-3"
          >
            <p>Modes de paiement</p>
            <img src={ArrowRight} alt="Go into Contacts menu" />
          </Link>
        </section>
        <Button className="font-title bg-background border-primary border text-primary h-14 rounded-[20px]">
          Se déconnecter
        </Button>
      </main>
    </>
  );
}
