import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Send, UserRoundPlus } from "lucide-react";
import { toast } from "sonner";
import InviteContactDrawer from "@/components/profile/contact/InviteContactDrawer";
import type { FriendMember } from "@/types/reservationTypes";

import Placeholder from "../../../assets/julie_doublet.svg";

interface ReservationGuestsProps {
  numberOfGuest: string;
  guestsToContact: FriendMember[];
  setGuestsToContact: (guestsToContact: FriendMember[]) => void;
  maxGuests: number;
}

export default function ReservationGuest({
  numberOfGuest,
  guestsToContact,
  setGuestsToContact,
  maxGuests,
}: ReservationGuestsProps) {
  const [open, setOpen] = useState(false);

  const progressOfInvitation =
    maxGuests > 0 ? (guestsToContact.length * 100) / maxGuests : 0;

  function toggleGuest(friend: FriendMember) {
    const isSelected = guestsToContact.some((guest) => guest.id === friend.id);
    if (isSelected) {
      setGuestsToContact(
        guestsToContact.filter((guest) => guest.id !== friend.id),
      );
      return;
    }
    if (guestsToContact.length >= maxGuests) {
      toast.error(
        maxGuests === 0
          ? "Votre table est prévue pour une seule personne"
          : `Vous ne pouvez inviter que ${maxGuests} personne(s)`,
      );
      return;
    }
    setGuestsToContact([...guestsToContact, friend]);
  }

  return (
    <>
      <article className="w-full flex flex-col items-start">
        <Card className="w-full bg-primary text-primary-foreground flex flex-col items-start p-4 gap-1 rounded-[0.8em]">
          <p>Table pour {numberOfGuest} personne(s)</p>
          {maxGuests !== 0 && (
            <>
              <p className="text-[1.2em] font-medium">
                {guestsToContact.length}/{maxGuests} invité(s)
              </p>

              <Progress
                value={progressOfInvitation}
                id="progress-selection-guests"
                className='bg-secondary-foreground w-full *:data-[slot="progress-indicator"]:bg-background'
              />
              <p className="text-start font-light">
                Si vous êtes plus ou moins nombreux que prévu : Table adaptée si
                disponible
              </p>
            </>
          )}
        </Card>

        <article className="w-full">
          <section className="flex justify-between items-center w-full my-5">
            <p className="text-[1.3em]">Groupe invité</p>
            <Button
              onClick={() => setOpen(true)}
              className="rounded-[0.5em] font-light"
            >
              <UserRoundPlus />
              Inviter
            </Button>
          </section>
          <section className="w-full flex flex-col gap-3">
            {guestsToContact.length > 0 ? (
              guestsToContact.map((friend) => (
                <Button
                  key={friend.id}
                  onClick={() => toggleGuest(friend)}
                  className="w-full h-auto p-3 flex flex-row items-center justify-between bg-accent"
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
                        Invitation à envoyer
                      </p>
                    </div>
                  </section>
                  <Send className="text-foreground size-[1.5em]" />
                </Button>
              ))
            ) : (
              <p>Aucun co-mangeur ajouté à cette réservation</p>
            )}
          </section>
        </article>
      </article>
      <InviteContactDrawer
        open={open}
        onOpenChange={setOpen}
        guestsToContact={guestsToContact}
        numberOfGuest={numberOfGuest}
        toggleGuest={toggleGuest}
      />
    </>
  );
}
