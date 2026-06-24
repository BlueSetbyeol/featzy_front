import { toast } from "sonner";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordSchema,
  ResetPasswordSchema,
} from "@/services/userSchema";
import { authApi } from "@/api/authApi";
import { accountApi } from "@/api/accountApi";
import { extractApiError } from "@/lib/axios";
import UserPasswordCheck from "./UserPasswordCheck";
import { Button } from "../ui/button";
import { useLocation, useNavigate, useSearchParams } from "react-router";

type UserCreateNewPasswordProps = {
  /** "reset" : via le lien email (token+email dans l'URL) — "change" : depuis le profil */
  mode?: "reset" | "change";
  onSuccess?: () => void;
};

function ResetPasswordForm({ onSuccess }: { onSuccess?: () => void }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token: searchParams.get("token") ?? "",
      email: searchParams.get("email") ?? "",
      password: "",
      password_confirmation: "",
    },
  });

  const password = useWatch({ control: form.control, name: "password" });
  const confirmation = useWatch({
    control: form.control,
    name: "password_confirmation",
  });

  async function submit(data: z.infer<typeof ResetPasswordSchema>) {
    try {
      await authApi.resetPassword(data);
      toast.success(
        "Votre mot de passe a bien été changé, vous pouvez vous connecter.",
      );
      onSuccess?.();
      navigate("/login");
    } catch (error) {
      const { status, errors, message } = extractApiError(error);
      if (status === 422) {
        form.setError("password", {
          message: errors.email?.[0] ?? errors.password?.[0] ?? message,
        });
      } else {
        toast.error(message);
      }
    }
  }

  return (
    <section className="flex flex-col-reverse gap-2">
      <UserPasswordCheck password={password} confirmation={confirmation} />
      <form
        id="form-reset-password"
        onSubmit={form.handleSubmit(submit)}
        className="w-full flex flex-col gap-2"
      >
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel
                htmlFor="form-reset-password-psw"
                className="text-[0.9em]"
              >
                Nouveau mot de passe
              </FieldLabel>
              <Input
                {...field}
                id="form-reset-password-psw"
                aria-invalid={fieldState.invalid}
                className="text-[0.9em] text-muted-foreground rounded-[0.6em]"
                required
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password_confirmation"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel
                htmlFor="form-reset-password-psw-confirm"
                className="text-[0.9em]"
              >
                Confirmez le mot de passe
              </FieldLabel>
              <Input
                {...field}
                id="form-reset-password-psw-confirm"
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
                className="text-[1em] text-muted-foreground rounded-[0.6em]"
                required
                type="password"
                placeholder="••••••••"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="bg-primary rounded-[0.5em] flex items-center justify-center gap-2 p-2 text-[0.9em] text-white"
        >
          Enregistrer le nouveau mot de passe
        </Button>
      </form>
    </section>
  );
}

function ChangePasswordForm({ onSuccess }: { onSuccess?: () => void }) {
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const password = useWatch({ control: form.control, name: "password" });
  const confirmation = useWatch({
    control: form.control,
    name: "password_confirmation",
  });

  async function submit(data: z.infer<typeof ChangePasswordSchema>) {
    try {
      await accountApi.changePassword(data);
      toast.success("Ton mot de passe a bien été changé.");
      form.reset();
      onSuccess?.();
    } catch (error) {
      const { status, errors, message } = extractApiError(error);
      if (status === 422) {
        form.setError(
          errors.current_password ? "current_password" : "password",
          {
            message:
              errors.current_password?.[0] ?? errors.password?.[0] ?? message,
          },
        );
      } else {
        toast.error(message);
      }
    }
  }

  return (
    <section className="flex flex-col">
      <UserPasswordCheck password={password} confirmation={confirmation} />
      <form
        id="form-change-password"
        onSubmit={form.handleSubmit(submit)}
        className="w-full flex flex-col gap-2"
      >
        <Controller
          name="current_password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel
                htmlFor="form-change-password-current"
                className="text-[0.9em]"
              >
                Mot de passe actuel
              </FieldLabel>
              <Input
                {...field}
                id="form-change-password-current"
                aria-invalid={fieldState.invalid}
                className="text-[0.9em] text-muted-foreground rounded-[0.6em]"
                required
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel
                htmlFor="form-change-password-psw"
                className="text-[0.9em]"
              >
                Nouveau mot de passe
              </FieldLabel>
              <Input
                {...field}
                id="form-change-password-psw"
                aria-invalid={fieldState.invalid}
                className="text-[0.9em] text-muted-foreground rounded-[0.6em]"
                required
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password_confirmation"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel
                htmlFor="form-change-password-psw-confirm"
                className="text-[0.9em]"
              >
                Confirmez le mot de passe
              </FieldLabel>
              <Input
                {...field}
                id="form-change-password-psw-confirm"
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
                className="text-[1em] text-muted-foreground rounded-[0.6em]"
                required
                type="password"
                placeholder="••••••••"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="bg-primary rounded-[0.5em] flex items-center justify-center gap-2 p-2 text-[0.9em] text-white"
        >
          Changer le mot de passe
        </Button>
      </form>
    </section>
  );
}

export default function UserCreateNewPassword({
  mode,
  onSuccess,
}: UserCreateNewPasswordProps) {
  const location = useLocation();
  const resolvedMode =
    mode ?? (location.pathname === "/reset-password" ? "reset" : "change");

  return resolvedMode === "reset" ? (
    <ResetPasswordForm onSuccess={onSuccess} />
  ) : (
    <ChangePasswordForm onSuccess={onSuccess} />
  );
}
