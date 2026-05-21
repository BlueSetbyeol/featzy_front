import { useContext } from "react";
import UserContext from "@/context/UserContext";
import ProfileNavigation from "./ProfileNavigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { ChangeUserSchema } from "@/services/userSchema";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
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
// import { authApi } from "@/services/authApi";

import Placeholder from "../../assets/image/image.png";

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
      toast("Ton compte à bien été créé, tu peux te connecter", {
        position: "bottom-right",
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

  return (
    <>
      <Toaster />
      <nav className="w-screen h-20">
        <ProfileNavigation content={"Informations du profil"} />
      </nav>
      <main className="h-[87%] px-5 w-full flex flex-col gap-4 pb-4 items-center">
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
                <DialogDescription>
                  Change ta photo de profile en sélectionnant une nouvelle
                  image.
                </DialogDescription>
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
            >
              <FieldGroup>
                <section className="w-full flex flex-row gap-2">
                  <Controller
                    name="firstname"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="gap-1"
                      >
                        <FieldLabel
                          htmlFor="form-profil-informations-firstname"
                          className="text-[0.9em]"
                        >
                          Prénom
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-profil-informations-firstname"
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                          className="text-[1em] text-muted-foreground"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="lastname"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="gap-1"
                      >
                        <FieldLabel
                          htmlFor="form-profil-informations-lastname"
                          className="text-[0.9em]"
                        >
                          Nom
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-profil-informations-lastname"
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                          className="text-[1em] text-muted-foreground"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </section>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <FieldLabel
                        htmlFor="form-profil-informations-email"
                        className="text-[0.9em]"
                      >
                        Adresse email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-profil-informations-email"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        className="text-[1em] text-muted-foreground"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="phone_number"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <FieldLabel
                        htmlFor="form-profil-informations-phone"
                        className="text-[0.9em]"
                      >
                        Téléphone
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-profil-informations-phone"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        className="text-[1em] text-muted-foreground"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        <Field orientation="horizontal">
          <Button
            type="submit"
            form="form-profil-informations"
            className="w-full rounded-sm text-[0.9em]"
          >
            Enregistrer mes informations
          </Button>
        </Field>
      </main>
    </>
  );
}
