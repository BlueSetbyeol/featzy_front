import { ChevronRight, Mail, Phone } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import ProfileNavigation from "./ProfileNavigation";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Textarea } from "../ui/textarea";

export default function ProfileSupport() {
  return (
    <>
      <nav className="w-screen h-20">
        <ProfileNavigation content={"Support"} />
      </nav>
      <main className="h-[87%] w-screen px-5 flex flex-col gap-3 pb-4 overflow-y-auto no-scrollbar">
        <Card className="w-full flex flex-col items-start justify-between p-4 bg-muted gap-1">
          <h2>Besoin d'aide ?</h2>
          <p className="text-[0.8em] text-start">
            On est là pour toi. Réponse rapide en quelques minutes.
          </p>
          <section className="w-full flex flex-row justify-between items-center gap-4">
            <Button className="bg-secondary text-accent-foreground w-[48%] h-7 rounded-xl text-[0.7em] py-0">
              <Mail /> Email
            </Button>
            <Button className="bg-secondary text-accent-foreground w-[48%] h-7 rounded-xl text-[0.7em] py-0">
              <Phone /> Appeler
            </Button>
          </section>
        </Card>
        <article className="w-full flex flex-col items-start gap-3">
          <h2>Questions Fréquentes</h2>
          <section className="w-full flex flex-col gap-1">
            <Button className="bg-secondary text-accent-foreground w-full h-7 rounded-sm text-[0.7em] py-0 flex justify-between items-center">
              <p>Comment réserver un restaurant ?</p>
              <ChevronRight />
            </Button>
            <Button className="bg-secondary text-accent-foreground w-full h-7 rounded-sm text-[0.7em] py-0 flex justify-between items-center">
              <p>Comment annuler une réservation ?</p>
              <ChevronRight />
            </Button>
            <Button className="bg-secondary text-accent-foreground w-full h-7 rounded-sm text-[0.7em] py-0 flex justify-between items-center">
              <p>Comment ajouter un moyen de paiement ?</p>
              <ChevronRight />
            </Button>
            <Button className="bg-secondary text-accent-foreground w-full h-7 rounded-sm text-[0.7em] py-0 flex justify-between items-center">
              <p>Comment ajouter après pré-commande sur place ?</p>
              <ChevronRight />
            </Button>
          </section>
          <div className="w-full flex justify-end">
            <Button className="bg-secondary text-secondary-foreground rounded-sm text-[0.9em]">
              Consulter plus de questions
            </Button>
          </div>
        </article>
        <Card className="p-4 rounded-sm mt-5">
          <FieldSet className="w-full max-w-xs">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="feedback">Écris-nous</FieldLabel>
                <Textarea
                  id="feedback"
                  placeholder="Laisse nous un message ..."
                  rows={10}
                  className="text-[0.8em] min-h-36"
                />
                <Button className="rounded-sm text-[0.8em] mt-2">
                  Envoyer le message
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </Card>
      </main>
    </>
  );
}
