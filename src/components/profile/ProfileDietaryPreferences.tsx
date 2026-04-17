import ProfileNavigation from "./ProfileNavigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

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

  return (
    <>
      <nav className="w-screen h-20">
        <ProfileNavigation content={"Préférences Alimentaires"} />
      </nav>
      <main className="h-[87%] px-5 w-full flex flex-col gap-4 pb-4">
        {dietaryPreferences.map((preference, index) => (
          <FieldGroup className="mx-auto w-90" key={index}>
            <Field orientation="horizontal">
              <FieldLabel
                htmlFor="terms-checkbox-basic"
                className="text-[20px]"
              >
                {preference}
              </FieldLabel>
              <Checkbox
                id="terms-checkbox-basic"
                name="terms-checkbox-basic"
                className="size-6"
              />
            </Field>
          </FieldGroup>
        ))}
      </main>
    </>
  );
}
