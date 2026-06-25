import { Link, useSearchParams } from "react-router";
import { Card } from "@/components/ui/card";
import Logo from "../../assets/logo_white.svg";
import { Button } from "@/components/ui/button";

const messages: Record<string, { title: string; description: string }> = {
  success: {
    title: "Adresse email vérifiée !",
    description: "Votre adresse email a bien été vérifiée. Bon appétit !",
  },
  already: {
    title: "Adresse déjà vérifiée",
    description: "Votre adresse email était déjà vérifiée, tout est en ordre.",
  },
  invalid: {
    title: "Lien invalide ou expiré",
    description:
      "Ce lien de vérification n'est plus valide. Connecte-toi pour en demander un nouveau.",
  },
};

export default function EmailVerified() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") ?? "invalid";
  const { title, description } = messages[status] ?? messages.invalid;

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen gap-4 pb-4">
      <section className="w-full flex flex-col items-center justify-center">
        <img src={Logo} alt="Featzy's logo" className="w-[12em]" />
        <p className="text-primary font-title">Partager un repas, c'est Easy</p>
      </section>
      <Card className="p-4 w-[90%] gap-2 rounded-[0.8em] text-center">
        <h1>{title}</h1>
        <p className="text-muted-foreground">{description}</p>
        <Button asChild className="mt-4">
          <Link to="/login">Se connecter</Link>
        </Button>
      </Card>
    </main>
  );
}
