import { useContext, useRef, useState } from "react";
import UserContext from "@/context/UserContext";
import ProfileNavigation from "./ProfileNavigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { ChangeUserSchema } from "@/services/userSchema";
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
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { X } from "lucide-react";
import { Separator } from "../ui/separator";
import UserCreateNewPassword from "../auth/UserCreateNewPasseword";
import UserInformationsForm from "../auth/UserInformationsForm";
// import { authApi } from "@/services/authApi";

import Placeholder from "../../assets/image/image.png";

type ChangePasswordFormHandle = {
  submit: () => void;
};

export default function ProfileInformations() {
  const { user } = useContext(UserContext);

  function handleChangePicture(e: { preventDefault: () => void }) {
    e.preventDefault();
    // TODO modifier la photo de profil de l'utilisateur
  }

  const form = useForm<z.infer<typeof ChangeUserSchema>>({
    resolver: zodResolver(ChangeUserSchema),
    defaultValues: {
      firstname: user?.user.firstname ?? "",
      lastname: user?.user.lastname ?? "",
      email: user?.user.email ?? "",
      phone_number: user?.user.phone_number ?? "",
    },
  });

  async function onSubmit(data: z.infer<typeof ChangeUserSchema>) {
    const response = data;
    // const response = await authApi.register(data);
    if (response) {
      toast("Ton compte à bien été mis à jour.", {
        position: "top-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
        } as React.CSSProperties,
      });
    } else {
      console.info(response);
    }
  }

  const formRef = useRef<ChangePasswordFormHandle>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Toaster />
      <nav className="w-screen h-20">
        <ProfileNavigation content={"Informations du profil"} />
      </nav>
      <main
        className="h-[87%] px-5 w-full flex flex-col gap-4 pb-4 justify-between"
        aria-hidden="false"
      >
        <section className="w-full flex flex-col gap-4 pb-4 items-center">
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <div className="w-full flex flex-col gap-1 items-center">
                  <img
                    src={user?.user.profile_picture_url || Placeholder}
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
                    Change ta photo de profile en sélectionnant une nouvelle
                    image.
                  </DialogDescription>
                  <p>
                    Change ta photo de profile en sélectionnant une nouvelle
                    image.
                  </p>
                </DialogHeader>
                <Field>
                  <Input id="picture" type="file" />
                </Field>
                <DialogFooter>
                  <Button type="submit" onClick={(e) => handleChangePicture(e)}>
                    Utiliser la photo
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
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
                />
              </form>
              <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                  <Button
                    variant="secondary"
                    className="bg-accent w-full rounded-[0.5em]"
                  >
                    Modifier le mot de passe
                  </Button>
                </DrawerTrigger>
                <DrawerContent
                  className="w-full max-w-sm px-4"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
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
                  <UserCreateNewPassword onSuccess={() => setOpen(false)} />
                  <DrawerFooter className="w-full px-0 my-4 pt-0">
                    <Button
                      onClick={() => formRef.current?.submit()}
                      className="bg-primary rounded-[0.5em] flex items-center justify-center gap-2 p-2 text-[0.9em] text-white"
                    >
                      Enregistrer le mot de passe
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </CardContent>
          </Card>
        </section>
        <Field orientation="horizontal">
          <Button
            type="submit"
            form="form-profil-informations"
            className="w-full rounded-[0.5em] text-[1em]"
          >
            Enregistrer mes informations
          </Button>
        </Field>
      </main>
    </>
  );
}
