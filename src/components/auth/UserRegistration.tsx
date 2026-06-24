import { Button } from "../ui/button";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { CreateUserSchema } from "@/services/userSchema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/api/authApi";
import { extractApiError } from "@/lib/axios";
import { toast } from "sonner";
import UserInformationsForm from "./UserInformationsForm";
import Google from "../../assets/icon/googlepay.svg";
import Apple from "../../assets/icon/apple.svg";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

type UserRegistrationProps = {
  onRegistered?: () => void;
};

export default function UserRegistration({
  onRegistered,
}: UserRegistrationProps) {
  const registerForm = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
  });

  async function createNewUser(data: z.infer<typeof CreateUserSchema>) {
    try {
      await authApi.register(data);
      toast.success(
        "Ton compte a bien été créé, tu peux te connecter. Un email de vérification t'a été envoyé.",
      );
      onRegistered?.();
    } catch (error) {
      const { status, errors, message } = extractApiError(error);
      if (status === 422) {
        for (const [field, messages] of Object.entries(errors)) {
          registerForm.setError(
            field as keyof z.infer<typeof CreateUserSchema>,
            {
              message: messages[0],
            },
          );
        }
      } else {
        toast.error(message);
      }
    }
  }

  const { loginWithRedirect } = useAuth0();

  const { isAuthenticated, user, isLoading } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      // user.email, user.name, user.picture are available here
      // sync with your backend if needed
      // const data: z.infer<typeof LoginUserSchema> = {
      //   email: user.email,
      //   password: user.,
      // };
      // loginUser(data);
    }
  }, [isAuthenticated, user]);

  if (isLoading) return "Loading...";

  return (
    <>
      {isLoading ? (
        <p>"Module externe Loading..."</p>
      ) : (
        <>
          <Button
            variant="outline"
            className="w-full text-foreground border text-[1em] mt-2"
            onClick={() =>
              loginWithRedirect({
                authorizationParams: { connection: "google-oauth2" },
                // TODO : adding the user and token in the DB
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
        </>
      )}
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
                  autoComplete="new-password"
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
                  autoComplete="new-password"
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
        disabled={registerForm.formState.isSubmitting}
      >
        Créer mon compte
      </Button>
    </>
  );
}
