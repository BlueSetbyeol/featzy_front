import { z } from "zod";

const passwordRules = z
  .string()
  .min(1, { message: "Merci de saisir votre mot de passe" })
  .min(12, { message: "La saisie doit avoir au moins 12 caractères" })
  .regex(/[A-Z]/, "Au moins 1 majuscule")
  .regex(/[0-9]/, "Au moins 1 chiffre")
  .regex(/[^a-zA-Z0-9]/, "Au moins 1 symbole");

export const ChangeUserSchema = z.object({
  first_name: z
    .string()
    .min(1, { message: "Merci de saisir votre prénom" })
    .max(64, { message: "La saisie doit avoir au maximum 64 caractères" }),
  last_name: z
    .string()
    .min(1, { message: "Merci de saisir votre nom de famille" })
    .max(64, { message: "La saisie doit avoir au maximum 64 caractères" }),
  email: z.email().min(1, { message: "Merci de saisir votre adresse email" }),
  phone: z
    .string()
    .min(1, { message: "Merci de saisir votre numéro de téléphone" })
    .min(10, { message: "La saisie doit avoir au moins 10 caractères" })
    .max(20, { message: "La saisie doit avoir au maximum 20 caractères" }),
});

export type ChangeUserSchemaType = z.infer<typeof ChangeUserSchema>;

export const CreateUserSchema = z
  .object({
    first_name: z
      .string()
      .min(1, { message: "Merci de saisir votre prénom" })
      .max(64, { message: "La saisie doit avoir au maximum 64 caractères" }),
    last_name: z
      .string()
      .min(1, { message: "Merci de saisir votre nom de famille" })
      .max(64, { message: "La saisie doit avoir au maximum 64 caractères" }),
    email: z.email().min(1, { message: "Merci de saisir votre adresse email" }),
    phone: z
      .string()
      .min(1, { message: "Merci de saisir votre numéro de téléphone" })
      .min(10, { message: "La saisie doit avoir au moins 10 caractères" })
      .max(20, { message: "La saisie doit avoir au maximum 20 caractères" }),
    password: passwordRules,
    password_confirmation: z
      .string()
      .min(1, { message: "Merci de confirmer votre mot de passe" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Le mot de passe et sa confirmation ne correspondent pas",
    path: ["password_confirmation"],
  });

export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;

export const LoginUserSchema = z.object({
  email: z.email().min(1, { message: "Merci de saisir votre adresse email" }),
  password: z
    .string()
    .min(1, { message: "Merci de saisir votre mot de passe" }),
});

export type LoginUserSchemaType = z.infer<typeof LoginUserSchema>;

export const LostPasswordSchema = z.object({
  email: z.email().min(1, { message: "Merci de saisir votre adresse email" }),
});

export type LostPasswordSchemaType = z.infer<typeof LostPasswordSchema>;

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1),
    email: z.email().min(1, { message: "Merci de saisir votre adresse email" }),
    password: passwordRules,
    password_confirmation: z
      .string()
      .min(1, { message: "Merci de confirmer votre mot de passe" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Le mot de passe et sa confirmation ne correspondent pas",
    path: ["password_confirmation"],
  });

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

export const ChangePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(1, { message: "Merci de saisir votre mot de passe actuel" }),
    password: passwordRules,
    password_confirmation: z
      .string()
      .min(1, { message: "Merci de confirmer votre mot de passe" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Le mot de passe et sa confirmation ne correspondent pas",
    path: ["password_confirmation"],
  });

export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;
