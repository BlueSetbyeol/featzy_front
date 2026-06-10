import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import ContactCard from "./ContactCard";
import Search from "../../../assets/icon/search.svg";
import { useNavigate, useParams } from "react-router";

import Placeholder from "../../../assets/julie_doublet.svg";
import PlaceholderQRcode from "../../../assets/image/qr code.svg";
// TODO replace by right type when received from back
type userFriend = {
  id: number;
  firstname: string;
  lastname: string;
  image: string;
};

interface InviteContactDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  numberOfGuest: string;
  guestsToContact: userFriend[];
  setGuestsToContact: (guestsToContact: userFriend[]) => void;
}

export default function InviteContactDrawer({
  open,
  onOpenChange,
  numberOfGuest,
  guestsToContact,
  setGuestsToContact,
}: InviteContactDrawerProps) {
  const [showCoMangeur, setShowCoMangeur] = useState(false);
  const [showPhoneContact, setShowPhoneContact] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  //TODO à remplacer par la liste d'ami de l'utilisateur

  const friends: userFriend[] = [
    {
      id: 1,
      firstname: "julien",
      lastname: "Dubois",
      image: Placeholder,
    },
    {
      id: 2,
      firstname: "Lena",
      lastname: "Jeon",
      image: Placeholder,
    },
  ];

  const [filter, setFilter] = useState("Rechercher un contact");

  function handleFilterSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    // TODO appeler la liste des contacts par nom, numéro de tel ou email
    //setFilter(resultat)
  }

  // TODO récupérer un lien réel avec le numéro de la résa ? et changer la destination /restaurant/${id}/early-command
  const featzyLink = "featzy.app/groupe/FZT-204";

  //

  return (
    // TODO à finir une fois squelette reservation finis
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent className="w-full h-auto flex flex-col flex-1 data-[vaul-drawer-direction=bottom]:max-h-dvh bg-white px-4 pb-6">
        <DrawerHeader className="relative px-0 py-3">
          <DrawerDescription className="sr-only">
            Inviter des co-mangeurs à la réservation
          </DrawerDescription>
          <section className="flex flex-row justify-between items-center w-full">
            <article className="flex flex-col items-start">
              <DrawerTitle>Inviter</DrawerTitle>
              <p>Ajoutez des co-mangeurs à la réservation</p>
            </article>
            <DrawerClose asChild>
              <Button variant="ghost" className="has-[>svg]:px-0 p-0">
                <X className="size-6" />
              </Button>
            </DrawerClose>
          </section>
          <Separator className="border-[#F7F3EE] my-3" />
        </DrawerHeader>
        {!showCoMangeur && !showPhoneContact && !showLink && !showQrCode && (
          <section className="flex flex-col gap-2 items-center w-full">
            <Card
              className="w-full p-4 bg-primary-foreground border-border gap-0"
              onClick={() => setShowCoMangeur(true)}
            >
              <CardHeader className="px-0 bg-primary-foreground gap-0">
                <section className="w-full flex flex-col items-start">
                  <CardTitle className="text-[1.2em] text-start">
                    Depuis mes contacts Featzy
                  </CardTitle>
                  <CardDescription className="sr-only">
                    Contacts Featzy
                  </CardDescription>
                  <p className="text-[0.7em] text-muted-foreground">
                    Sélectionner un co-mangeur Featzy
                  </p>
                </section>
                <CardAction>
                  <Button variant="ghost" className="has-[>svg]:px-0 p-0">
                    <ChevronRight className="size-[2em] text-foreground" />
                  </Button>
                </CardAction>
              </CardHeader>
            </Card>
            <Card
              className="w-full p-4 bg-primary-foreground border-border gap-0"
              onClick={() => setShowPhoneContact(true)}
            >
              <CardHeader className="px-0 bg-primary-foreground gap-0">
                <section className="w-full flex flex-col items-start">
                  <CardTitle className="text-[1.2em] text-start">
                    Avec un numéro de téléphone
                  </CardTitle>
                  <CardDescription className="sr-only">
                    Contacts Téléphone
                  </CardDescription>
                  <p className="text-[0.7em] text-muted-foreground">
                    Invite un contact du téléphone ou saisir un numéro (V2)
                  </p>
                </section>
                <CardAction>
                  <Button variant="ghost" className="has-[>svg]:px-0 p-0">
                    <ChevronRight className="size-[2em] text-foreground" />
                  </Button>
                </CardAction>
              </CardHeader>
            </Card>
            <Card
              className="w-full p-4 bg-primary-foreground border-border gap-0"
              onClick={() => setShowLink(true)}
            >
              <CardHeader className="px-0 bg-primary-foreground gap-0">
                <section className="w-full flex flex-col items-start">
                  <CardTitle className="text-[1.2em] text-start">
                    Partager le lien
                  </CardTitle>
                  <CardDescription className="sr-only">
                    Partager le lien
                  </CardDescription>
                  <p className="text-[0.7em] text-muted-foreground">
                    Ouvre le partage natif : SMS, mail, WhatsApp...
                  </p>
                </section>
                <CardAction>
                  <Button variant="ghost" className="has-[>svg]:px-0 p-0">
                    <ChevronRight className="size-[2em] text-foreground" />
                  </Button>
                </CardAction>
              </CardHeader>
            </Card>
            <Card
              className="w-full p-4 bg-primary-foreground border-border gap-0"
              onClick={() => setShowQrCode(true)}
            >
              <CardHeader className="px-0 bg-primary-foreground gap-0">
                <section className="w-full flex flex-col items-start">
                  <CardTitle className="text-[1.2em] text-start">
                    Afficher le QR Code
                  </CardTitle>
                  <CardDescription className="sr-only">
                    Afficher le QR Code
                  </CardDescription>
                  <p className="text-[0.7em] text-muted-foreground">
                    A scanner pour rejoindre la réservation
                  </p>
                </section>
                <CardAction>
                  <Button variant="ghost" className="has-[>svg]:px-0 p-0">
                    <ChevronRight className="size-[2em] text-foreground" />
                  </Button>
                </CardAction>
              </CardHeader>
            </Card>
          </section>
        )}
        {showCoMangeur && (
          <section className="flex flex-col gap-2 items-center w-full">
            <div className="w-full flex justify-between items-center">
              <Button
                variant="ghost"
                className="has-[>svg]:px-0 p-0 text-primary"
                onClick={() => setShowCoMangeur(false)}
              >
                <ArrowLeft className="text-primary" /> Retour
              </Button>
              <p className="text-[1.2em] font-medium">
                {guestsToContact.length}/{numberOfGuest} réservée(s)
              </p>
            </div>
            <Card className="bg-background flex flex-row w-full p-2 mb-5 rounded-sm gap-2">
              <img
                src={Search}
                alt="click to look for the contact you want"
                className="size-6 pt-1"
              />
              <input
                type="text"
                id="search-contact"
                className="w-[80%] mr-2 pl-4 text-foreground rounded-sm focus:border-foreground border-0"
                placeholder={filter ?? "Rechercher un contact"}
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFilterSubmit(e);
                  }
                }}
              />
            </Card>
            <section className="flex flex-col gap-2 items-center w-full overflow-y-auto no-scrollbar">
              {friends.length > 0 &&
                friends.map((friend) => (
                  <ContactCard
                    key={friend.id}
                    friend={friend}
                    profileOrResa={"resa"}
                    guestsToContact={guestsToContact}
                    setGuestsToContact={setGuestsToContact}
                    numberOfGuest={numberOfGuest}
                  />
                ))}
            </section>
          </section>
        )}
        {showPhoneContact && (
          <section className="flex flex-col gap-2 items-center w-full">
            <div className="w-full flex justify-between items-center">
              <Button
                variant="ghost"
                className="has-[>svg]:px-0 p-0 text-primary"
                onClick={() => setShowPhoneContact(false)}
              >
                <ArrowLeft className="text-primary" /> Retour
              </Button>
              <p className="text-[1.2em] font-medium">
                {guestsToContact.length}/{numberOfGuest} réservée(s)
              </p>
            </div>
            <Card className="bg-background flex flex-row w-full p-2 mb-5 rounded-sm gap-2">
              <img
                src={Search}
                alt="click to look for the contact you want"
                className="size-6 pt-1"
              />
              <input
                type="text"
                id="search-contact"
                className="w-[80%] mr-2 pl-4 text-foreground rounded-sm focus:border-foreground border-0"
                placeholder={"Rechercher un contact du téléphone"}
              />
            </Card>
            <p>To be done soon !</p>
          </section>
        )}
        {showLink && (
          <section className="flex flex-col gap-2 items-center w-full">
            <div className="w-full flex justify-between items-center">
              <Button
                variant="ghost"
                className="has-[>svg]:px-0 p-0 text-primary"
                onClick={() => setShowLink(false)}
              >
                <ArrowLeft className="text-primary" /> Retour
              </Button>
              <p className="text-[1.2em] font-medium">
                {guestsToContact.length}/{numberOfGuest} réservée(s)
              </p>
            </div>
            <Card className="w-full p-4 bg-primary-foreground border-border gap-0">
              <CardHeader className="px-0 bg-primary-foreground gap-3 flex-col">
                <section className="w-full flex flex-col items-start">
                  <CardDescription className="sr-only">
                    Partager le lien
                  </CardDescription>
                  <p className="text-[0.7em] font-light">Lien d'invitation</p>
                  <p className="text-[1em]">{featzyLink}</p>
                </section>
                <section className="flex flex-col w-full gap-2">
                  <Button
                    variant="default"
                    className="font-light"
                    onClick={() => navigate(`/restaurant/${id}/early-command`)}
                  >
                    Partager le lien
                  </Button>
                  <Button variant="secondary" className="bg-muted font-light">
                    Copier le lien
                  </Button>
                </section>
              </CardHeader>
            </Card>
          </section>
        )}
        {showQrCode && (
          <section className="flex flex-col gap-2 items-center w-full">
            <div className="w-full flex justify-between items-center">
              <Button
                variant="ghost"
                className="has-[>svg]:px-0 p-0 text-primary"
                onClick={() => setShowQrCode(false)}
              >
                <ArrowLeft className="text-primary" /> Retour
              </Button>
              <p className="text-[1.2em] font-medium">
                {guestsToContact.length}/{numberOfGuest} réservée(s)
              </p>
            </div>
            <Card className="w-full p-4 bg-primary-foreground border-border gap-0">
              <section className="flex flex-col w-full gap-2">
                <img src={PlaceholderQRcode} alt="QR code de la réservation" />
                <p>
                  Affichez ce QR Code pour permettre à quelqu’un de rejoindre la
                  réservation.
                </p>
              </section>
            </Card>
            <Button
              variant="default"
              className="font-light w-full"
              onClick={() => navigate(`/restaurant/${id}/early-command`)}
            >
              Confirmer la réservation
            </Button>
          </section>
        )}
      </DrawerContent>
    </Drawer>
  );
}
