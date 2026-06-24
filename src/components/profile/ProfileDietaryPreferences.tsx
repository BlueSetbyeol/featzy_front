import { useContext, useEffect, useState } from "react";
import UserContext from "@/context/UserContext";
import ProfileNavigation from "./ProfileNavigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { referenceApi } from "@/api/referenceApi";
import { accountApi } from "@/api/accountApi";
import { extractApiError } from "@/lib/axios";
import type { DietaryPreferenceOption } from "@/types/restaurantTypes";

export default function ProfileDietaryPreferences() {
  const { user, setUser } = useContext(UserContext);
  const [options, setOptions] = useState<DietaryPreferenceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<string[]>(
    user?.dietary_preferences ?? [],
  );

  useEffect(() => {
    let cancelled = false;
    referenceApi
      .getDietaryPreferences()
      .then((data) => {
        if (!cancelled) {
          setOptions(data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(extractApiError(error).message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (user) {
      setSelected(user.dietary_preferences);
    }
  }, [user]);

  function togglePreference(value: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...current, value] : current.filter((v) => v !== value),
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await accountApi.updateDietaryPreferences(selected);
      setUser(updated);
      toast.success("Tes préférences alimentaires ont bien été enregistrées.");
    } catch (error) {
      toast.error(extractApiError(error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <nav className="w-screen h-20">
        <ProfileNavigation content={"Préférences Alimentaires"} />
      </nav>
      <main className="h-[87%] px-5 pb-4 flex flex-col justify-between">
        <form
          id="form-preferences"
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 overflow-y-auto no-scrollbar"
        >
          {loading ? (
            <p className="text-muted-foreground">Chargement des préférences…</p>
          ) : (
            options.map((option) => (
              <FieldGroup className="mx-auto w-full" key={option.value}>
                <Field orientation="horizontal">
                  <FieldLabel htmlFor={`diet-${option.value}`}>
                    {option.label}
                  </FieldLabel>
                  <Checkbox
                    id={`diet-${option.value}`}
                    name={`diet-${option.value}`}
                    className="size-6"
                    checked={selected.includes(option.value)}
                    onCheckedChange={(checked) =>
                      togglePreference(option.value, checked === true)
                    }
                  />
                </Field>
              </FieldGroup>
            ))
          )}
        </form>
        <Field orientation="horizontal">
          <Button
            type="submit"
            form="form-preferences"
            disabled={loading || saving}
            className="w-full rounded-sm"
          >
            Enregistrer vos préférences alimentaires
          </Button>
        </Field>
      </main>
    </>
  );
}
