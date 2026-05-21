import UserContext from "@/context/UserContext";
import ProfileNavigation from "./ProfileNavigation";
import { useContext } from "react";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";

export default function ProfileNotifications() {
  const { user } = useContext(UserContext);

  // TODO récupéré les préférences de notifications en fonction de user et afficher

  return (
    <>
      <nav className="w-screen h-20">
        <ProfileNavigation content={"Notifications"} />
      </nav>
      <main className="h-[87%] w-screen px-5 flex flex-col gap-3 pb-4 overflow-y-auto no-scrollbar">
        {user && (
          <>
            <article>
              <section className="flex justify-between items-center w-full">
                <h2>Email</h2>
                <Switch className="py-2" />
              </section>
              <p className="text-[0.9em] text-start mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </article>
            <Separator />
            <article>
              <section className="flex justify-between items-center w-full">
                <h2>Notifications Push</h2>
                <Switch className="py-2" />
              </section>
              <p className="text-[0.9em] text-start mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </article>
            <Separator />
            <article>
              <section className="flex justify-between items-center w-full">
                <h2>Mises à jour imortantes</h2>
                <Checkbox
                  id="terms-checkbox-basic"
                  name="terms-checkbox-basic"
                  className="size-6"
                  // TODO si préférence déjà enregistré chez l'utilisateur, changé en defaultchecked
                />
              </section>
              <p className="text-[0.9em] text-start mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </article>
            <Separator />
            <article>
              <section className="flex justify-between items-center w-full">
                <h2>Anonces et promotions</h2>
                <Checkbox
                  id="terms-checkbox-basic"
                  name="terms-checkbox-basic"
                  className="size-6"
                  // TODO si préférence déjà enregistré chez l'utilisateur, changé en defaultchecked
                />
              </section>
              <p className="text-[0.9em] text-start mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </article>
          </>
        )}
      </main>
    </>
  );
}
