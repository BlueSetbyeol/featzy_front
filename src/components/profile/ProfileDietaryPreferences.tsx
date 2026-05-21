import ProfileNavigation from "./ProfileNavigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProfileDietaryPreferences() {
  const dietaryPreferences = [
    "Végétarien",
    "Végétalien",
    "Sans gluten",
    "Sans produits laitiers",
    "Sans noix",
    "Casher",
    "Halal",
    "Cétogène",
    "Pescatérien",
    "Sans viande rouge",
    "Sans fruits de mer",
    "Sans viande blanche",
  ];

  const form = useForm({
    defaultValues: [],
  });

  function onSubmit(data: string[]) {
    toast("Tu as ajouté ces préférences:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
    // TODO modification des préférences de l'utilisateur
  }

  return (
    <>
      <nav className="w-screen h-20">
        <ProfileNavigation content={"Préférences Alimentaires"} />
      </nav>
      <main className="h-[87%] px-5 pb-4 flex flex-col justify-between">
        <form
          id="form-preferences"
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          {dietaryPreferences.map((preference, index) => (
            <FieldGroup className="mx-auto w-full" key={index}>
              <Field orientation="horizontal">
                <FieldLabel htmlFor="terms-checkbox-basic">
                  {preference}
                </FieldLabel>
                <Checkbox
                  id="terms-checkbox-basic"
                  name="terms-checkbox-basic"
                  className="size-6"
                  // TODO si préférence déjà enregistré chez l'utilisateur, changé en defaultchecked
                />
              </Field>
            </FieldGroup>
          ))}
        </form>
        <Field orientation="horizontal">
          <Button
            type="submit"
            form="form-preferences"
            className="w-full rounded-sm"
          >
            Enregistrer mes préférences alimentaires
          </Button>
        </Field>
      </main>
    </>
  );
}
