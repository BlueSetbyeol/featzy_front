import DeleteContact from "./../../../assets/icon/contact_delete.svg";
import type { FriendMember } from "@/types/reservationTypes";

import Placeholder from "../../../assets/julie_doublet.svg";

interface ContactCardProps {
  friend: FriendMember;
  handleDeleteClick?: (index: number) => {
    id: number;
    firstname: string;
    lastname: string;
    image: string;
  }[];
  profileOrResa: string;
}

export default function ContactCard({
  friend,
  handleDeleteClick,
  profileOrResa,
}: ContactCardProps) {
  if (profileOrResa === "profil") {
    return (
      <div
        className="w-full p-3 flex flex-row items-center justify-between"
        key={friend.id}
      >
        <div className="flex flex-row items-center gap-4">
          <img
            src={Placeholder}
            alt="Friend's profile picture"
            className="size-[3em]"
          />
          <p className="font-light">
            {friend.first_name} {friend.last_name}
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
}
