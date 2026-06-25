import { useContext, useRef, useState } from "react";
import UserContext from "@/context/UserContext";
import ProfileNavigation from "./ProfileNavigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { ChangeUserSchema } from "@/services/userSchema";
import { useUpdateProfile, useUploadAvatar } from "@/hooks/useAccount";
import { extractApiError } from "@/lib/axios";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { X } from "lucide-react";
import { Separator } from "../ui/separator";
import UserCreateNewPassword from "../auth/UserCreateNewPasseword";
import UserInformationsForm from "../auth/UserInformationsForm";

import Placeholder from "../../assets/image/image.png";

const AVATAR_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const AVATAR_MAX_SIZE = 5 * 1024 * 1024;

export default function ProfileInformations() {
  const { user } = useContext(UserContext);
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [passwordDrawerOpen, setPasswordDrawerOpen] = useState(false);

  const form = useForm<z.infer<typeof ChangeUserSchema>>({
    resolver: zodResolver(ChangeUserSchema),
    defaultValues: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    },
  });

  async function onSubmit(data: z.infer<typeof ChangeUserSchema>) {
    try {
      await updateProfile.mutateAsync({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
      });
      setUser(updated);
      toast.success("Votre compte a bien été mis à jour.");
    } catch (error) {
      const { status, errors, message } = extractApiError(error);
      if (status === 422) {
        for (const [field, messages] of Object.entries(errors)) {
          form.setError(field as keyof z.infer<typeof ChangeUserSchema>, {
            message: messages[0],
          });
        }
      } else {
        toast.error(message);
      }
    }
  }

  async function handleUploadAvatar() {
    const file = avatarInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Choisis d'abord une image.");
      return;
    }
    if (!AVATAR_ALLOWED_TYPES.includes(file.type)) {
      toast.error("Le format doit être JPEG, PNG ou WebP.");
      return;
    }
    if (file.size > AVATAR_MAX_SIZE) {
      toast.error("L'image ne doit pas dépasser 5 Mo.");
      return;
    }
    try {
      await uploadAvatar.mutateAsync(file);
      toast.success("Ta photo de profil a bien été mise à jour.");
      setAvatarDialogOpen(false);
    } catch (error) {
      toast.error(extractApiError(error).message);
    }
  }

  return (
    <>
      <nav className="w-screen h-20">
        <ProfileNavigation content={"Informations du profil"} />
      </nav>
      <main
        className="h-[87%] px-5 w-full flex flex-col gap-4 pb-4 justify-between"
        aria-hidden="false"
      >
        <section className="w-full flex flex-col gap-4 pb-4 items-center">
          <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
            <DialogTrigger asChild>
              <div className="w-full flex flex-col gap-1 items-center">
                <img
                  src={user?.avatar_url || Placeholder}
                  alt="Photo de profil"
                  className="size-24 rounded-full"
                />
                <p className="text-primary">Changer la photo</p>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Changer la photo</DialogTitle>
                <DialogDescription className="sr-only">
                  Changez votre photo de profil en sélectionnant une nouvelle
                  image.
                </DialogDescription>
                <p>
                  Changez votre photo de profil en sélectionnant une nouvelle
                  image.
                </p>
              </DialogHeader>
              <Field>
                <Input
                  id="picture"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  ref={avatarInputRef}
                />
              </Field>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleUploadAvatar}
                  disabled={uploadAvatar.isPending}
                >
                  Utiliser la photo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Card className="w-full sm:max-w-md">
            <CardContent>
              <form
                id="form-profil-informations"
                onSubmit={form.handleSubmit(onSubmit)}
                className="pb-4"
              >
                <UserInformationsForm
                  form={form}
                  formName={"form-profil-informations"}
                  emailDisabled={true}
                />
              </form>
              <Drawer
                open={passwordDrawerOpen}
                onOpenChange={setPasswordDrawerOpen}
              >
                <DrawerTrigger asChild>
                  <Button
                    variant="secondary"
                    className="bg-accent w-full rounded-[0.5em]"
                  >
                    Modifier le mot de passe
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="w-full max-w-sm px-4">
                  <DrawerHeader className="flex flex-col items-start w-full px-0">
                    <section className="flex flex-row justify-between items-center w-full pb-4">
                      <DrawerTitle className="font-light">
                        Modifier le mot de passe
                      </DrawerTitle>
                      <DrawerDescription className="sr-only">
                        Modifier le mot de passe
                      </DrawerDescription>
                      <DrawerClose asChild>
                        <X className="size-6 p-0 font-light" />
                      </DrawerClose>
                    </section>
                    <Separator />
                  </DrawerHeader>
                  <UserCreateNewPassword
                    onSuccess={() => setPasswordDrawerOpen(false)}
                  />
                </DrawerContent>
              </Drawer>
            </CardContent>
          </Card>
        </section>
        <Field orientation="horizontal">
          <Button
            type="submit"
            form="form-profil-informations"
            disabled={updateProfile.isPending}
            className="w-full rounded-[0.5em] text-[1em]"
          >
            Enregistrer vos informations
          </Button>
        </Field>
      </main>
    </>
  );
}
