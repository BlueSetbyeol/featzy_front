import { Link } from "react-router";
import UserContext from "@/context/UserContext";
import { useContext } from "react";
import Contact from "./../../assets/icon/contacts_white.svg";
import Pay from "./../../assets/icon/card.svg";
import Favorite from "./../../assets/icon/heart_white.svg";
import IdCard from "./../../assets/icon/contact_id.svg";
import FoodPreferences from "./../../assets/icon/leaf_black.svg";
import Offers from "./../../assets/icon/piggy-bank.svg";
import Notifications from "./../../assets/icon/bell.svg";
import Support from "./../../assets/icon/chat-dots.svg";
import Legals from "./../../assets/icon/file-text.svg";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

import Placeholder from "../../assets/image/image.png";

export default function ProfileOverview() {
  const { user } = useContext(UserContext);
  return (
    <>
      {user && (
        <>
          <nav className="flex flex-row justify-between w-full h-[10%] gap-3 px-5 mt-8">
            <div className="flex gap-3">
              <img
                src={user.user.profile_picture_url || Placeholder}
                alt={`${user.user.firstname} ${user.user.lastname} profil picture`}
                className="size-12 rounded-full"
              />
              <h1 className="font-light font-title">
                {user.user.firstname} {user.user.lastname}
              </h1>
            </div>
          </nav>
          <section className="w-screen h-[85%] pb-4 px-5 flex flex-col justify-between">
            <section className="">
              <section className="w-full pb-3 flex flex-row justify-evenly items-center gap-2">
                <Link to="contacts">
                  <Card className="flex flex-col gap-1 justify-between items-center h-[7em] w-[7em] py-3 px-1 border-secondary">
                    <img
                      src={Contact}
                      alt="liste des contacts"
                      className="h-[3.2em] w-[3.2em] pt-2"
                    />
                    <p className="font-text font-light text-[0.75em]">
                      Contacts
                    </p>
                  </Card>
                </Link>
                <Link to="payment-method">
                  <Card className="flex flex-col gap-2 justify-between items-center h-[7em] w-[7em] py-3 px-1 border-secondary">
                    <img
                      src={Pay}
                      alt="Moyen de paiement"
                      className="h-[2.7em] w-[2.7em]"
                    />
                    <p className="font-text font-light text-[0.75em]">
                      Moyens de paiement
                    </p>
                  </Card>
                </Link>
                <Link to="favorites">
                  <Card className="flex flex-col gap-2 justify-between items-center h-[7em] w-[7em] py-3 px-1 border-secondary">
                    <img
                      src={Favorite}
                      alt="liste des favoris"
                      className="h-[2.7em] w-[2.7em] pt-1"
                    />
                    <p className="font-text font-light text-[0.75em]">
                      Favoris
                    </p>
                  </Card>
                </Link>
              </section>
              <section className="flex flex-col w-full p-4 gap-3 font-light">
                <Link
                  to="informations"
                  className="w-full flex flex-row justify-between items-center"
                >
                  <div className="w-4/5 flex flex-row gap-2">
                    <img src={IdCard} alt="Identité" />
                    <p>Informations du profil</p>
                  </div>
                  <ChevronRight />
                </Link>
                <Link
                  to="diet"
                  className="w-full flex flex-row justify-between items-center"
                >
                  <div className="w-4/5 flex flex-row gap-2">
                    <img src={FoodPreferences} alt="Préférences Alimentaires" />
                    <p>Préférences Alimentaires</p>
                  </div>
                  <ChevronRight />
                </Link>
                <Link
                  to="offers"
                  className="w-full flex flex-row justify-between items-center"
                >
                  <div className="w-4/5 flex flex-row gap-2">
                    <img src={Offers} alt="Bons et remises" />
                    <p>Bons & remises</p>
                  </div>
                  <ChevronRight />
                </Link>
                <Link
                  to="notifications"
                  className="w-full flex flex-row justify-between items-center"
                >
                  <div className="w-4/5 flex flex-row gap-2">
                    <img src={Notifications} alt="Notifications" />
                    <p>Notifications</p>
                  </div>
                  <ChevronRight />
                </Link>
                <Link
                  to="support"
                  className="w-full flex flex-row justify-between items-center"
                >
                  <div className="w-4/5 flex flex-row gap-2">
                    <img src={Support} alt="Support" />
                    <p>Support</p>
                  </div>
                  <ChevronRight />
                </Link>
                <Link
                  to="legals"
                  className="w-full flex flex-row justify-between items-center"
                >
                  <div className="w-4/5 flex flex-row gap-2">
                    <img src={Legals} alt="Mention légales" />
                    <p>Mention légales</p>
                  </div>
                  <ChevronRight />
                </Link>
              </section>
            </section>
            <Button className="font-title bg-accent border-accent border text-secondary-foreground font-normal h-10 rounded-sm">
              Se déconnecter
            </Button>
          </section>
        </>
      )}
    </>
  );
}
