import { useWatch, type UseFormReturn } from "react-hook-form";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import type { ResetPasswordSchema } from "@/services/userSchema";
import type z from "zod";
import { useLocation } from "react-router";

interface UserPasswordCheckProps {
  newPassword: UseFormReturn<z.infer<typeof ResetPasswordSchema>>;
}

export default function UserPasswordCheck({
  newPassword,
}: UserPasswordCheckProps) {
  const password = useWatch({
    control: newPassword.control,
    name: "password",
  });

  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  const confirmation = useWatch({
    control: newPassword.control,
    name: "password_confirmation",
  });

  const location = useLocation();

  return (
    <Card
      className={
        location.pathname === "/login/recovery"
          ? "w-full border-0 flex flex-col items-start gap-1/2 p-4 shadow-none"
          : "w-full bg-accent flex flex-col items-start gap-1/2 p-4 rounded-[0.6em]"
      }
    >
      {location.pathname === "/login/recovery" ? (
        <p className="pb-1">Critère du mot de passe</p>
      ) : (
        <h2>Critère du mot de passe</h2>
      )}
      <article className="flex flex-row w-full items-center gap-2">
        <Checkbox
          id="terms-checkbox-basic"
          name="terms-checkbox-basic"
          className="size-3.5 bg-background"
          checked={password.length >= 12}
        />
        <p>Au moins 12 caractères</p>
      </article>
      <article className="flex flex-row w-full items-center gap-2">
        <Checkbox
          id="terms-checkbox-basic"
          name="terms-checkbox-basic"
          className="size-3.5 bg-background"
          checked={hasUppercase}
        />
        <p>Une majuscule</p>
      </article>
      <article className="flex flex-row w-full items-center gap-2">
        <Checkbox
          id="terms-checkbox-basic"
          name="terms-checkbox-basic"
          className="size-3.5 bg-background"
          checked={hasNumber}
        />
        <p>Un chiffre</p>
      </article>
      <article className="flex flex-row w-full items-center gap-2">
        <Checkbox
          id="terms-checkbox-basic"
          name="terms-checkbox-basic"
          className="size-3.5 bg-background"
          checked={hasSymbol}
        />
        <p>Une symbole</p>
      </article>
      <article className="flex flex-row w-full items-center gap-2">
        <Checkbox
          id="terms-checkbox-basic"
          name="terms-checkbox-basic"
          className="size-3.5 bg-background"
          checked={password === confirmation && password.length > 12}
        />
        <p>Mots de passe identiques</p>
      </article>
    </Card>
  );
}
