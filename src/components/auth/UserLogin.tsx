import { useContext } from "react";
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

  return (
    <>
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
