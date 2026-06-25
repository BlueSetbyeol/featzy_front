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
import type { FriendMember } from "@/types/reservationTypes";
import { ArrowLeft, ChevronRight, Send, SendHorizonal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchUsers } from "@/hooks/useUserSearch";
import { useNavigate, useParams } from "react-router";
import Search from "../../../assets/icon/search.svg";

import Placeholder from "../../../assets/julie_doublet.svg";
import PlaceholderQRcode from "../../../assets/image/qr code.svg";

interface InviteContactDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  numberOfGuest: string;
  guestsToContact: FriendMember[];
  toggleGuest: (guestsToContact: FriendMember) => void;
}

export default function InviteContactDrawer({
  open,
  onOpenChange,
  numberOfGuest,
  guestsToContact,
  toggleGuest,
}: InviteContactDrawerProps) {
  const [showCoMangeur, setShowCoMangeur] = useState(false);
  const [showPhoneContact, setShowPhoneContact] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Débounce la saisie avant de déclencher la query (throttle backend 30/min)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const searchQuery = useSearchUsers(debouncedQuery);
  const searching = searchQuery.isFetching;
  const results = searchQuery.data ?? [];

  const displayedFriends = [
    ...guestsToContact,
    ...results.filter(
      (found) => !guestsToContact.some((guest) => guest.id === found.id),
    ),
  ];

  // TODO récupérer un lien réel avec le numéro de la résa ? et changer la destination /restaurant/:id/new-reservation-confirmation
  const featzyLink = "featzy.app/groupe/FZT-204";

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent
        className="w-full h-auto flex flex-col flex-1 data-[vaul-drawer-direction=bottom]:max-h-dvh bg-white px-4 pb-6"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
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
                    Depuis vos contacts Featzy
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
                    Invitez un contact du téléphone ou saisir un numéro (V2)
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
                placeholder={"Rechercher un co-mangeur par son nom"}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </Card>
            <section className="flex flex-col gap-2 items-center w-full overflow-y-auto no-scrollbar">
              {searching ? (
                <p className="text-muted-foreground text-start mb-3">
                  Recherche…
                </p>
              ) : displayedFriends.length > 0 ? (
                displayedFriends.map((friend) => {
                  const isSelected = guestsToContact.some(
                    (guest) => guest.id === friend.id,
                  );
                  return (
                    <Button
                      key={friend.id}
                      onClick={() => toggleGuest(friend)}
                      className={
                        isSelected
                          ? "w-full h-auto p-3 flex flex-row items-center justify-between bg-accent"
                          : "w-full h-auto p-3 flex flex-row items-center justify-between bg-background"
                      }
                    >
                      <section className="flex flex-row items-center gap-4">
                        <img
                          src={Placeholder}
                          alt={`Photo de profil de ${friend.name}`}
                          className="size-[3em]"
                        />
                        <div className="flex flex-col items-start">
                          <p className="text-foreground">{friend.name}</p>
                          <p className="text-muted-foreground">
                            {isSelected ? "Invitation à envoyer" : "Inviter"}
                          </p>
                        </div>
                      </section>
                      {isSelected ? (
                        <Send className="text-foreground size-[1.5em]" />
                      ) : (
                        <SendHorizonal className="text-foreground size-[1.5em]" />
                      )}
                    </Button>
                  );
                })
              ) : query.trim().length >= 2 ? (
                <p className="text-muted-foreground text-start mb-3">
                  Aucun utilisateur trouvé
                </p>
              ) : (
                <p>
                  Recherchez le nom d'un de vos co-mangeurs utilisant Featzy
                </p>
              )}
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
                    onClick={() =>
                      navigate(`/command/${id}/new-reservation-confirmation`)
                    }
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
              onClick={() =>
                navigate(`/restaurant/${id}/new-reservation-confirmation`)
              }
            >
              Confirmer la réservation
            </Button>
          </section>
        )}
      </DrawerContent>
    </Drawer>
  );
}
