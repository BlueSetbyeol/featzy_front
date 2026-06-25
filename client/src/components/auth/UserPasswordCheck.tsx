import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { useLocation } from "react-router";

type UserPasswordCheckProps = {
  password: string;
  confirmation: string;
};

export default function UserPasswordCheck({
  password,
  confirmation,
}: UserPasswordCheckProps) {
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  const location = useLocation();
  const isRecoveryPage = location.pathname === "/reset-password";

  const criteria = [
    { label: "Au moins 12 caractères", checked: password.length >= 12 },
    { label: "Une majuscule", checked: hasUppercase },
    { label: "Un chiffre", checked: hasNumber },
    { label: "Un symbole", checked: hasSymbol },
    {
      label: "Mots de passe identiques",
      checked: password.length >= 12 && password === confirmation,
    },
  ];

  return (
    <Card
      className={
        isRecoveryPage
          ? "w-full border-0 flex flex-col items-start gap-1/2 p-4 shadow-none"
          : "w-full bg-accent flex flex-col items-start gap-1/2 p-4 rounded-[0.6em]"
      }
    >
      {isRecoveryPage ? (
        <p className="pb-1">Critère du mot de passe</p>
      ) : (
        <h2>Critère du mot de passe</h2>
      )}
      {criteria.map((criterion) => (
        <article
          key={criterion.label}
          className="flex flex-row w-full items-center gap-2"
        >
          <Checkbox
            className="size-3.5 bg-background"
            checked={criterion.checked}
            disabled
          />
          <p>{criterion.label}</p>
        </article>
      ))}
    </Card>
  );
}
