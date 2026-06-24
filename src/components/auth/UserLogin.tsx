import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import UserContext from "@/context/UserContext";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserSchema } from "@/services/userSchema";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { authApi } from "@/api/authApi";
import { extractApiError } from "@/lib/axios";
import UserLostPassword from "./UserLostPassword";
import { useAuth0 } from "@auth0/auth0-react";
import { Separator } from "../ui/separator";
import Google from "../../assets/icon/googlepay.svg";
import Apple from "../../assets/icon/apple.svg";

export default function UserLogin() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const LoginForm = useForm<z.infer<typeof LoginUserSchema>>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function loginUser(data: z.infer<typeof LoginUserSchema>) {
    try {
      const user = await authApi.login(data);
      setUser(user);
      toast.success(`Featzy est ready, ${user.first_name} !`);
      navigate("/");
    } catch (error) {
      const { status, errors, message } = extractApiError(error);
      if (status === 422) {
        LoginForm.setError("password", {
          message: errors.email?.[0] ?? message,
        });
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
      <Separator className="my-4" />
      <form id="form-login" onSubmit={LoginForm.handleSubmit(loginUser)}>
        <Controller
          name="email"
          control={LoginForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1 mt-2">
              <FieldLabel htmlFor="form-login-email" className="text-[1em]">
                Adresse email
              </FieldLabel>
              <Input
                {...field}
                id="form-login-email"
                aria-invalid={fieldState.invalid}
                autoComplete="email"
                className="text-[1em] text-muted-foreground"
                required
                placeholder="email@example.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={LoginForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1 mt-2">
              <FieldLabel htmlFor="form-login-password" className="text-[1em]">
                Mot de passe
              </FieldLabel>
              <Input
                {...field}
                id="form-login-password"
                aria-invalid={fieldState.invalid}
                autoComplete="current-password"
                className="text-[0.9em] text-muted-foreground"
                required
                type="password"
                placeholder="••••••••"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </form>
      <UserLostPassword />
      <Button
        variant="default"
        className="rounded-sm mt-6 w-full text-[1em]"
        type="submit"
        form="form-login"
        disabled={LoginForm.formState.isSubmitting}
      >
        Se connecter
      </Button>
    </>
  );
}
