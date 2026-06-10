import { toast, Toaster } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/services/userSchema";
import { authApi } from "@/api/authApi";
import { useContext } from "react";
import UserContext from "@/context/UserContext";
import UserPasswordCheck from "./UserPasswordCheck";
import { useLocation } from "react-router";

interface UserCreateNewPassewordProps {
  onSuccess?: () => void;
}

export default function UserCreateNewPassword({
  onSuccess,
}: UserCreateNewPassewordProps) {
  const { user } = useContext(UserContext);

  const NewPassword = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token: user?.token,
      email: user?.user.email,
      password: "",
      password_confirmation: "",
    },
  });

  //   const [changePassword, setChangePassword] = useState<string | undefined>();

  async function PasswordReset(data: z.infer<typeof ResetPasswordSchema>) {
    const response = await authApi.resetPassword(data);
    toast("Ton nouveau mot de passe nous a été transmis et a bien été changé", {
      position: "top-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
    console.info(response);
    onSuccess?.();
  }

  const location = useLocation();

  return (
    <>
      <Toaster />
      <section
        className={
          location.pathname === "/login/recovery"
            ? "flex flex-col-reverse gap-2"
            : "flex flex-col"
        }
      >
        <UserPasswordCheck newPassword={NewPassword} />
        <form
          id="form-creat-new-password"
          onSubmit={NewPassword.handleSubmit(PasswordReset)}
          className="w-full flex flex-col gap-2"
        >
          {/* <label
              htmlFor="form-creat-new-password-old-psw"
              className="text-[0.9em] text-start w-full"
            >
              Ancien mot de passe
            </label>
            <Input
              id="form-creat-new-password-old-psw"
              autoComplete="off"
              className="text-[1em] text-muted-foreground"
              required
              type="password"
              placeholder="••••••••"
            /> */}
          <Controller
            name="password"
            control={NewPassword.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel
                  htmlFor="form-register-password"
                  className="text-[0.9em]"
                >
                  Nouveau mot de passe
                </FieldLabel>
                <Input
                  {...field}
                  id="form-creat-new-password-psw"
                  aria-invalid={fieldState.invalid}
                  className="text-[0.9em] text-muted-foreground rounded-[0.6em]"
                  required
                  type="password"
                  placeholder="••••••••"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password_confirmation"
            control={NewPassword.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel
                  htmlFor="form-register-password"
                  className="text-[0.9em]"
                >
                  Confirmez le mot de passe
                </FieldLabel>
                <Input
                  {...field}
                  id="form-creat-new-password-psw-confirm"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  className="text-[1em] text-muted-foreground rounded-[0.6em]"
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
        </form>
      </section>
    </>
  );
}
