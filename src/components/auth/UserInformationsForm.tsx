import { Controller, type Control, type UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import type { ChangeUserSchemaType } from "@/services/userSchema";

type UserInformationsFormProps<T extends ChangeUserSchemaType> = {
  form: UseFormReturn<T>;
  formName: string;
  /** L'email n'est pas modifiable via l'API une fois le compte créé */
  emailDisabled?: boolean;
};

export default function UserInformationsForm<T extends ChangeUserSchemaType>({
  form,
  formName,
  emailDisabled = false,
}: UserInformationsFormProps<T>) {
  const control = form.control as unknown as Control<ChangeUserSchemaType>;

  return (
    <FieldGroup className="gap-3">
      <section className="w-full flex flex-row gap-2">
        <Controller
          name="first_name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel
                htmlFor={`${formName}-first_name`}
                className="text-[1em]"
              >
                Prénom
              </FieldLabel>
              <Input
                {...field}
                id={`${formName}-first_name`}
                aria-invalid={fieldState.invalid}
                autoComplete="given-name"
                className="text-[1em] text-muted-foreground rounded-[0.5em]"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="last_name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel
                htmlFor={`${formName}-last_name`}
                className="text-[1em]"
              >
                Nom
              </FieldLabel>
              <Input
                {...field}
                id={`${formName}-last_name`}
                aria-invalid={fieldState.invalid}
                autoComplete="family-name"
                className="text-[1em] text-muted-foreground rounded-[0.5em]"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </section>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="gap-1">
            <FieldLabel htmlFor={`${formName}-email`} className="text-[1em]">
              Email
            </FieldLabel>
            <Input
              {...field}
              id={`${formName}-email`}
              aria-invalid={fieldState.invalid}
              autoComplete="email"
              disabled={emailDisabled}
              className="text-[1em] text-muted-foreground rounded-[0.5em]"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="gap-1">
            <FieldLabel htmlFor={`${formName}-phone`} className="text-[1em]">
              Téléphone
            </FieldLabel>
            <Input
              {...field}
              id={`${formName}-phone`}
              aria-invalid={fieldState.invalid}
              autoComplete="tel"
              className="text-[1em] text-muted-foreground rounded-[0.5em]"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
