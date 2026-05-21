import { Button } from "../ui/button";
import { Controller, useForm } from "react-hook-form";
import { Separator } from "../ui/separator";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { CreateUserSchema } from "@/services/userSchema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/services/authApi";
import { toast, Toaster } from "sonner";
import Google from "../../assets/icon/googlepay.svg";
import Apple from "../../assets/icon/apple.svg";

export default function UserRegistration() {
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
      <Button
        variant="outline"
        className="w-full text-foreground border text-[1em] mt-2"
      >
        <img src={Google} alt="compte Google" className="size-[1em]" />
        Continuer avec Google
      </Button>
      <Button
        variant="outline"
        className="w-full text-foreground border text-[1em] mt-2"
      >
        <img src={Apple} alt="compte Apple" className="size-[1em]" />
        Continuer avec Apple
      </Button>
      <Separator className="my-4" />
      <form
        id="form-register"
        onSubmit={registerForm.handleSubmit(createNewUser)}
      >
        <section className="w-full flex flex-row gap-2">
          <Controller
            name="firstname"
            control={registerForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1 mt-2">
                <FieldLabel
                  htmlFor="form-register-firstname"
                  className="text-[0.9em]"
                >
                  Prénom
                </FieldLabel>
                <Input
                  {...field}
                  id="form-register-firstname"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  className="text-[1em] text-muted-foreground"
                  required
                  placeholder="Leïla"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="lastname"
            control={registerForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1 mt-2">
                <FieldLabel
                  htmlFor="form-register-lastname"
                  className="text-[0.9em]"
                >
                  Nom
                </FieldLabel>
                <Input
                  {...field}
                  id="form-register-lastname"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  className="text-[1em] text-muted-foreground"
                  required
                  placeholder="Dubois"
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
          control={registerForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1 mt-2">
              <FieldLabel
                htmlFor="form-register-email"
                className="text-[0.9em]"
              >
                Votre E-mail
              </FieldLabel>
              <Input
                {...field}
                id="form-register-email"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                className="text-[0.9em] text-muted-foreground"
                required
                placeholder="email@example.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="phone_number"
          control={registerForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1 mt-2">
              <FieldLabel
                htmlFor="form-register-phone_number"
                className="text-[0.9em]"
              >
                Votre numéro de téléphone
              </FieldLabel>
              <Input
                {...field}
                id="form-register-phone_number"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                className="text-[0.9em] text-muted-foreground"
                required
                placeholder="01 23 45 67 89"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
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
