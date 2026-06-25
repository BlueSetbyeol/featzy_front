import UserContext from "@/context/UserContext";
import ProfileNavigation from "./ProfileNavigation";
import { useContext } from "react";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { useUpdateNotificationPreferences } from "@/hooks/useAccount";
import { extractApiError } from "@/lib/axios";
import type { NotificationPreferences } from "@/types/authTypes";

export default function ProfileNotifications() {
  const { user } = useContext(UserContext);
  const updateNotifications = useUpdateNotificationPreferences();
  const saving = updateNotifications.isPending;

  async function updatePreference(
    key: keyof NotificationPreferences,
    value: boolean,
  ) {
    try {
      await updateNotifications.mutateAsync({ [key]: value });
      toast.success("Tes préférences de notifications sont à jour.");
    } catch (error) {
      toast.error(extractApiError(error).message);
    }
  }

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
                <Switch
                  className="py-2"
                  checked={user.notification_preferences.email}
                  disabled={saving}
                  onCheckedChange={(checked) =>
                    updatePreference("email", checked)
                  }
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
                <h2>Notifications Push</h2>
                <Switch
                  className="py-2"
                  checked={user.notification_preferences.push}
                  disabled={saving}
                  onCheckedChange={(checked) =>
                    updatePreference("push", checked)
                  }
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
                <h2>Mises à jour importantes</h2>
                <Checkbox
                  id="notif-important-updates"
                  name="notif-important-updates"
                  className="size-6"
                  checked={user.notification_preferences.important_updates}
                  disabled={saving}
                  onCheckedChange={(checked) =>
                    updatePreference("important_updates", checked === true)
                  }
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
                <h2>Annonces et promotions</h2>
                <Checkbox
                  id="notif-promotions"
                  name="notif-promotions"
                  className="size-6"
                  checked={user.notification_preferences.promotions}
                  disabled={saving}
                  onCheckedChange={(checked) =>
                    updatePreference("promotions", checked === true)
                  }
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
