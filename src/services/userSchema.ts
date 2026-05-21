import { z } from "zod";

export const ChangeUserSchema = z.object({
  firstname: z
    .string()
    .min(1, { message: "Merci de saisir votre prénom" })
    .min(3, { message: "La saisie doit avoir au moins 3 caractères" }),
  lastname: z
    .string()
    .min(1, { message: "Merci de saisir votre nom de famille" })
    .min(3, { message: "La saisie doit avoir au moins 3 caractères" }),
  email: z.email().min(1, { message: "Merci de saisir votre adresse email" }),
  phone_number: z
    .string()
    .min(1, { message: "Merci de saisir votre numéro de téléphone" })
    .min(10, { message: "La saisie doit avoir au moins 10 caractères" })
    .max(20, { message: "La saisie doit avoir au maximum 20 caractères" }),
});

export type ChangeUserSchemaType = z.infer<typeof ChangeUserSchema>;

//

export const CreateUserSchema = z
  .object({
    firstname: z
      .string()
      .min(1, { message: "Merci de saisir votre prénom" })
      .min(3, { message: "La saisie doit avoir au moins 3 caractères" })
      .max(100, { message: "La saisie doit avoir au maximum 100 caractères" }),
    lastname: z
      .string()
      .min(1, { message: "Merci de saisir votre nom de famille" })
      .min(3, { message: "La saisie doit avoir au moins 3 caractères" })
      .max(100, { message: "La saisie doit avoir au maximum 100 caractères" }),
    email: z.email().min(1, { message: "Merci de saisir votre adresse email" }),
    phone_number: z
      .string()
      .min(1, { message: "Merci de saisir votre numéro de téléphone" })
      .min(10, { message: "La saisie doit avoir au moins 10 caractères" })
      .max(20, { message: "La saisie doit avoir au maximum 20 caractères" }),
    password: z
      .string()
      .min(1, { message: "Merci de saisir votre mot de passe" })
      .min(12, { message: "La saisie doit avoir au moins 12 caractères" }),
    password_confirmation: z
      .string()
      .min(1, { message: "Merci de confirmer votre mot de passe" })
      .min(12, { message: "La saisie doit avoir au moins 12 caractères" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Le mot de passe et sa confirmation ne correspondent pas",
    path: ["confirmPassword"],
  });

export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;

//

export const LoginUserSchema = z.object({
  email: z.email().min(1, { message: "Merci de saisir votre adresse email" }),
  password: z
    .string()
    .min(1, { message: "Merci de saisir votre mot de passe" })
    .min(12, { message: "La saisie doit avoir au moins 12 caractères" }),
});

export type LoginUserSchemaType = z.infer<typeof LoginUserSchema>;

//

export const LostPasswordSchema = z.object({
  email: z.email().min(1, { message: "Merci de saisir votre adresse email" }),
});

export type LostPasswordSchemaType = z.infer<typeof LostPasswordSchema>;
