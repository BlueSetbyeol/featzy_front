import ContactCard from "@/components/profile/contact/ContactCard";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserRoundPlus } from "lucide-react";
import InviteContactDrawer from "@/components/profile/contact/InviteContactDrawer";

import Placeholder from "../../../../assets/julie_doublet.svg";

// TODO replace by right type when received from back
type userFriend = {
  id: number;
  firstname: string;
  lastname: string;
  image: string;
};

interface ReservationGuestsProps {
  numberOfGuest: string;
  guestsToContact: userFriend[];
  setGuestsToContact: (guestsToContact: userFriend[]) => void;
}

export default function ReservationGuest({
  numberOfGuest,
  guestsToContact,
  setGuestsToContact,
}: ReservationGuestsProps) {
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

  const progressOfInvitation =
    (guestsToContact.length * 100) / Number(numberOfGuest);

  const [open, setOpen] = useState(false);

  return (
    <>
      <article className="w-full flex flex-col items-start">
        <Card className="w-full bg-primary text-primary-foreground flex flex-col items-start p-4 gap-1 rounded-[0.8em]">
          <p>Table pour {numberOfGuest} personne(s)</p>
          <p className="text-[1.2em] font-medium">
            {guestsToContact.length}/{numberOfGuest} réservée(s)
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
        </article>
      </article>
      <InviteContactDrawer
        open={open}
        onOpenChange={setOpen}
        guestsToContact={guestsToContact}
        setGuestsToContact={setGuestsToContact}
        numberOfGuest={numberOfGuest}
      />
    </>
  );
}
