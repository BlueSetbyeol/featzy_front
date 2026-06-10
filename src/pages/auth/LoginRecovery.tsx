import UserCreateNewPassword from "@/components/auth/UserCreateNewPasseword";
import { Card } from "@/components/ui/card";
import Logo from "../../assets/logo_white.svg";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Separator } from "@/components/ui/separator";

type ChangePasswordFormHandle = {
  submit: () => void;
};

export default function LoginRecovery() {
  const formRef = useRef<ChangePasswordFormHandle>(null);
  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen gap-4 pb-4">
      <section className="w-full flex flex-col items-center justify-center">
        <img src={Logo} alt="Featzy's logo" className="w-[12em]" />
        <p className="text-primary font-title">Partager un repas, c'est Easy</p>
      </section>
      <Card className="p-4 w-[90%] h-min-[60%] gap-2 rounded-[0.8em]">
        <section className="text-start">
          <h1>Réinitialiser le mot de passe</h1>
          <p className="text-muted-foreground">
            Choisissez un nouveau mot de passe sécurisé pour accéder à votre
            compte Featzy.
          </p>
        </section>
        <Separator />
        <UserCreateNewPassword />
        <Button
          onClick={() => formRef.current?.submit()}
          className="bg-primary rounded-[0.5em] flex items-center justify-center gap-2 p-2 text-[0.9em] text-white"
        >
          Enregistrer le nouveau mot de passe
        </Button>
      </Card>
    </main>
  );
}
