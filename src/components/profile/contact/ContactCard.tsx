import { Send, SendHorizonal } from "lucide-react";
import DeleteContact from "./../../../assets/icon/contact_delete.svg";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type userFriend = {
  id: number;
  firstname: string;
  lastname: string;
  image: string;
};

interface ContactCardProps {
  friend: {
    id: number;
    firstname: string;
    lastname: string;
    image: string;
  };
  handleDeleteClick?: (index: number) => {
    id: number;
    firstname: string;
    lastname: string;
    image: string;
  }[];
  profileOrResa: string;
  guestsToContact?: userFriend[];
  setGuestsToContact?: (guestToContact: userFriend[]) => void;
  numberOfGuest?: string;
}

export default function ContactCard({
  friend,
  handleDeleteClick,
  profileOrResa,
  guestsToContact,
  setGuestsToContact,
  numberOfGuest,
}: ContactCardProps) {
  const [guestSelected, setGuestSelected] = useState(false);
  function handleAddGuestClick(friend: userFriend) {
    if (guestsToContact) {
      if (!guestSelected && Number(numberOfGuest) !== guestsToContact.length) {
        setGuestsToContact?.([...guestsToContact, friend]);
        setGuestSelected(true);
      } else if (guestSelected) {
        const guestToKeep = guestsToContact.filter(
          (guest) => guest.id !== friend.id,
        );
        setGuestsToContact?.(guestToKeep);
        setGuestSelected(false);
      }
    }
  }

  if (profileOrResa === "profil") {
    return (
      <div
        className="w-full p-3 flex flex-row items-center justify-between"
        key={friend.id}
      >
        <div className="flex flex-row items-center gap-4">
          <img
            src={friend.image}
            alt="Friend's profile picture"
            className="size-[3em]"
          />
          <p className="font-light">
            {friend.firstname} {friend.lastname}
          </p>
        </div>

        <button type="button" onClick={() => handleDeleteClick?.(friend.id)}>
          <img
            src={DeleteContact}
            alt="supprimer ce contact de votre liste de contact"
            className="size-5"
          />
        </button>
      </div>
    );
  }
  if (profileOrResa === "resa") {
    return (
      <Button
        onClick={() => handleAddGuestClick?.(friend)}
        className={
          guestSelected
            ? "w-full h-auto p-3 flex flex-row items-center justify-between bg-accent"
            : "w-full h-auto p-3 flex flex-row items-center justify-between bg-background"
        }
        key={friend.id}
      >
        <section className="flex flex-row items-center gap-4">
          <img
            src={friend.image}
            alt="Friend's profile picture"
            className="size-[3em]"
          />
          <div className="flex flex-col items-start">
            <p className="text-foreground">
              {friend.firstname} {friend.lastname}
            </p>
            {guestSelected ? (
              <p className="text-muted-foreground">Invitation à envoyer</p>
            ) : (
              <p className="text-muted-foreground">Inviter</p>
            )}
          </div>
        </section>
        {guestSelected ? (
          <Send className="text-foreground size-[1.5em]" />
        ) : (
          <SendHorizonal className="text-foreground size-[1.5em]" />
        )}
      </Button>
    );
  }
}
