import { Button } from "../ui/button";
import { Controller, useForm } from "react-hook-form";
import { Separator } from "../ui/separator";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { CreateUserSchema } from "@/services/userSchema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/api/authApi";
import { toast, Toaster } from "sonner";
import Google from "../../assets/icon/googlepay.svg";
import Apple from "../../assets/icon/apple.svg";
import { useAuth0 } from "@auth0/auth0-react";
import UserInformationsForm from "./UserInformationsForm";

export default function UserRegistration() {
  const { loginWithRedirect } = useAuth0();

  const registerForm = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone_number: "",
      password: "",
      password_confirmation: "",
    },
  });

  async function createNewUser(data: z.infer<typeof CreateUserSchema>) {
    const response = await authApi.register(data);
    if (response) {
      toast("Ton compte à bien été créé, tu peux te connecter", {
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

  return (
    <>
      <Toaster />
      <Button
        variant="outline"
        className="w-full text-foreground border text-[1em] mt-2"
        onClick={() =>
          loginWithRedirect({
            authorizationParams: {
              connection: "google-oauth2",
              screen_hint: "signup",
              // TODO : adding the user and token in the DB
            },
          })
        }
      >
        <img src={Google} alt="compte Google" className="size-[1em]" />
        Continuer avec Google
      </Button>
      <Button
        variant="outline"
        className="w-full text-foreground border text-[1em] mt-2"
        disabled
      >
        <img src={Apple} alt="compte Apple" className="size-[1em]" />
        Continuer avec Apple
      </Button>
      <Separator className="my-4" />
      <form
        id="form-register"
        onSubmit={registerForm.handleSubmit(createNewUser)}
      >
        <UserInformationsForm form={registerForm} formName={"form-register"} />
        <section className="w-full flex flex-row gap-2">
          <Controller
            name="password"
            control={registerForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1 mt-2">
                <FieldLabel
                  htmlFor="form-register-password"
                  className="text-[0.9em]"
                >
                  Mot de passe
                </FieldLabel>
                <Input
                  {...field}
                  id="form-register-password"
                  aria-invalid={fieldState.invalid}
                  className="text-[0.9em] text-muted-foreground"
                  required
                  type="password"
                  placeholder="••••••••"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password_confirmation"
            control={registerForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1 mt-2">
                <FieldLabel
                  htmlFor="form-register-password_confirmation"
                  className="text-[0.9em]"
                >
                  Confirmation
                </FieldLabel>
                <Input
                  {...field}
                  id="form-register-password_confirmation"
                  aria-invalid={fieldState.invalid}
                  className="text-[0.9em] text-muted-foreground"
                  required
                  type="password"
                  placeholder="••••••••"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </section>
      </form>
      <Button
        variant="default"
        className="rounded-sm mt-6 w-full text-[1em]"
        type="submit"
        form="form-register"
      >
        Créer mon compte
      </Button>
    </>
  );
}
