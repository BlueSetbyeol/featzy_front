import ProfileNavigation from "./ProfileNavigation";
import { Card } from "../ui/card";
import Delete from "../../assets/icon/delete.svg";
import { useContext } from "react";
import UserContext from "@/context/UserContext";

export default function ProfileSettings() {
  const { user } = useContext(UserContext);

  //type à repréciser, surement User[]
  let userFriends: {
    id: number;
    firstname: string;
    lastname: string;
    image: string;
  }[] = [];

  if (user && user.friends) {
    userFriends = user?.friends;
  }

  function handleDeleteClick(index: number) {
    userFriends.splice(
      userFriends.findIndex((a) => a.id === index),
      1,
    );

    return userFriends;
  }
  return (
    <>
      <nav className="w-screen h-20">
        <ProfileNavigation content={"Contacts"} />
      </nav>
      <main className="h-[87%] px-5 w-full flex flex-col gap-4 pb-4">
        {userFriends.map((friend) => (
          <Card
            className="p-3 flex-row items-center justify-between bg-background border border-primary rounded-[10px] relative"
            key={friend.id}
          >
            <div className="flex flex-row items-center gap-4">
              <img
                src={friend.image}
                alt="Friend's profile picture"
                className="size-16"
              />
              <p className="text-foreground">
                {friend.firstname} {friend.lastname}
              </p>
            </div>
            <button
              type="button"
              className="absolute p-0 m-0 border-0 size-8 -right-3 -top-3"
              onClick={() => handleDeleteClick(friend.id)}
            >
              <img src={Delete} alt="delete this friend from your contact" />
            </button>
          </Card>
        ))}
      </main>
    </>
  );
}
