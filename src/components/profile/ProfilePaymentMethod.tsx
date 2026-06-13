import { ChevronRight, Trash2, X } from "lucide-react";
import { Card } from "../ui/card";
import ProfileNavigation from "./ProfileNavigation";
import { Link } from "react-router";
import VisaCard from "../../assets/icon/card_visa.svg";
import VisaCardWhite from "../../assets/icon/card_visa_white.svg";
import TickerRestaurant from "../../assets/icon/ticket.svg";
import ApplePay from "../../assets/icon/apple.svg";
import GooglePay from "../../assets/icon/googlepay.svg";
import Paypal from "../../assets/icon/paypal.svg";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { useState } from "react";

export default function ProfilePaymentMethod() {
  const [addCardNumber, setAddCardNumber] = useState<string>();
  const [addExpirationDate, setAddExpirationDate] = useState<string>();
  const [addCCV, setAddCCV] = useState<string>();

  function handleAddCardSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    // TODO ajouter une méthode de paiement en lien avec l'utilisateur actuel
  }

  return (
    <>
      <nav className="w-screen h-20">
        <ProfileNavigation content={"Moyens de paiement"} />
      </nav>
      <main className="h-[87%] w-screen px-5 flex flex-col gap-3 pb-4 overflow-y-auto no-scrollbar">
        <Card className="w-full h-[30%] flex flex-col items-start justify-between p-4 bg-primary">
          <section className="w-full flex flex-row justify-between">
            <div className="flex flex-col items-start">
              <p className="text-[0.7em] font-light text-accent">
                Carte bancaire
              </p>
              <p className="text-[1em] text-background">**** 1234</p>
            </div>
            <Trash2 className="text-background" />
          </section>
          <section className="w-full flex flex-row justify-between">
            <div className="flex flex-col items-start">
              <p className="text-[0.7em] font-light text-accent">Titulaire</p>
              <p className="text-[1em] text-background">Nom Prénom</p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-[0.7em] font-light text-accent">Expire</p>
              <p className="text-[1em] text-background">Date</p>
            </div>
          </section>
        </Card>
        <section className="flex flex-col items-start mt-4">
          <h2>Moyens de paiement</h2>
          <p className="text-muted-foreground text-[0.9em] mb-2">
            Choisis ou ajoute une méthode
          </p>
          <Drawer>
            <DrawerTrigger asChild>
              <Card className="w-full p-3 flex flex-row items-center justify-between mb-2">
                <section className="flex flex-row items-center gap-4">
                  <div className="bg-muted rounded-sm w-9 h-9 flex items-center justify-center">
                    <img
                      src={VisaCard}
                      alt="Carte de crédit"
                      className="size-4"
                    />
                  </div>
                  <div className="text-start">
                    <p className="text-[0.9em]">Carte bancaire</p>
                    <p className="font-light text-[0.7em]">
                      Visa, Mastercard, Carte virtuelle
                    </p>
                  </div>
                </section>
                <ChevronRight />
              </Card>
            </DrawerTrigger>
            <DrawerContent className="w-full max-w-sm px-4">
              <DrawerHeader className="flex flex-col items-start w-full px-0">
                <section className="flex flex-row justify-between items-center w-full">
                  <DrawerTitle>Ajouter une carte bancaire</DrawerTitle>
                  <DrawerClose asChild>
                    <X className="size-6 p-0" />
                  </DrawerClose>
                </section>
                <DrawerDescription className="sr-only">
                  Renseigne les informations de ta carte bancaire
                </DrawerDescription>
                <p className="text-[0.8em]">
                  Renseigne les informations de ta carte bancaire
                </p>
              </DrawerHeader>
              <p className="text-[0.7em] text-start mb-1">Numéro de carte</p>
              <input
                type="text"
                className="bg-background w-full p-2 mb-5 rounded-sm text-foreground text-[0.9em] focus:border-foreground border"
                placeholder={addCardNumber ?? "1234 5678 9012 3456"}
                onChange={(e) => {
                  setAddCardNumber(e.target.value);
                }}
              />
              <article className="w-full flex flex-row justify-between items-start gap-2">
                <section>
                  <p className="text-[0.7em] text-start mb-1">Expiration</p>
                  <input
                    type="text"
                    className="bg-background w-full p-2 mb-5 rounded-sm text-foreground text-[0.9em] focus:border-foreground border"
                    placeholder={addExpirationDate ?? "MM/AA"}
                    onChange={(e) => {
                      setAddExpirationDate(e.target.value);
                    }}
                  />
                </section>
                <section>
                  <p className="text-[0.7em] text-start mb-1">CCV</p>
                  <input
                    type="text"
                    className="bg-background w-full p-2 mb-5 rounded-sm text-foreground text-[0.9em] focus:border-foreground border"
                    placeholder={addCCV ?? "126"}
                    onChange={(e) => {
                      setAddCCV(e.target.value);
                    }}
                  />
                </section>
              </article>
              <DrawerFooter className="w-full px-0 pb-4">
                <DrawerClose asChild>
                  <button
                    type="button"
                    onClick={(e) => handleAddCardSubmit(e)}
                    className="bg-primary rounded-sm flex items-center justify-center gap-2 p-2"
                  >
                    <img
                      src={VisaCardWhite}
                      alt="ajouter une carte bancaire"
                      className="size-5"
                    />
                    <p className="text-[0.7em] text-white">
                      Enregistrer la carte
                    </p>
                  </button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <Card className="w-full p-3 flex flex-row items-center justify-between mb-2">
            <section className="flex flex-row items-center gap-4">
              <div className="bg-muted rounded-sm w-9 h-9 flex items-center justify-center">
                <img
                  src={TickerRestaurant}
                  alt="Ticket Restaurant"
                  className="size-4"
                />
              </div>
              <div className="text-start">
                <p className="text-[0.9em]">Ticket Restaurant</p>
                <p className="font-light text-[0.7em]">
                  Swile, Edenred, UpDéjeuner
                </p>
              </div>
            </section>
            <Link to="">
              <ChevronRight />
            </Link>
          </Card>
          <Card className="w-full p-3 flex flex-row items-center justify-between mb-2">
            <section className="flex flex-row items-center gap-4">
              <div className="bg-muted rounded-sm w-9 h-9 flex items-center justify-center">
                <img src={Paypal} alt="Carte de crédit" className="size-4" />
              </div>
              <div className="text-start">
                <p className="text-[0.9em]">Paypal</p>
                <p className="font-light text-[0.7em]">
                  Paiement rapide avec ton compte Paypal
                </p>
              </div>
            </section>
            <Link to="">
              <ChevronRight />
            </Link>
          </Card>
          <Card className="w-full p-3 flex flex-row items-center justify-between mb-2">
            <section className="flex flex-row items-center gap-4">
              <div className="bg-muted rounded-sm w-9 h-9 flex items-center justify-center">
                <img src={GooglePay} alt="Carte de crédit" className="size-4" />
              </div>
              <div className="text-start">
                <p className="text-[0.9em]">Google Pay</p>
                <p className="font-light text-[0.7em]">
                  Paiment sécurisé avec Google Wallet
                </p>
              </div>
            </section>
            <Link to="">
              <ChevronRight />
            </Link>
          </Card>
          <Card className="w-full p-3 flex flex-row items-center justify-between mb-2">
            <section className="flex flex-row items-center gap-4">
              <div className="bg-muted rounded-sm w-9 h-9 flex items-center justify-center">
                <img src={ApplePay} alt="Apple Pay" className="size-4" />
              </div>
              <div className="text-start">
                <p className="text-[0.9em]">Apple Pay</p>
                <p className="font-light text-[0.7em]">
                  Paiement sécurisé avec Appel Wallet
                </p>
              </div>
            </section>
            <Link to="">
              <ChevronRight />
            </Link>
          </Card>
        </section>
      </main>
    </>
  );
}
