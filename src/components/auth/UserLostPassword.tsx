import { toast, Toaster } from "sonner";
import { Button } from "../ui/button";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Send } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LostPasswordSchema } from "@/services/userSchema";
import { authApi } from "@/services/authApi";

export default function UserLostPassword() {
  const LostPassword = useForm<z.infer<typeof LostPasswordSchema>>({
    resolver: zodResolver(LostPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function PasswordForgotten(data: z.infer<typeof LostPasswordSchema>) {
    const response = await authApi.forgotPassword(data);
    toast(
      "Ton email nous a été transmise. Si un compte existe, un email te sera envoyé",
      {
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
        } as React.CSSProperties,
      },
    );
    console.info(response);
  }
  return (
    <>
      <Toaster />

      <Dialog>
        <form
          id="form-forgotten-password"
          onSubmit={LostPassword.handleSubmit(PasswordForgotten)}
        >
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-sm w-full text-[0.8em] justify-start p-0 text-primary h-5"
            >
              Mot de passe oublié ?
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Tu as oublié ton mot de passe ?</DialogTitle>
              <DialogDescription>
                Saisie ton e-mail d'inscription.
              </DialogDescription>
              <p className="text-[0.9em]">
                Nous t'enverons un lien si le compte existe.
              </p>
            </DialogHeader>
            <section className="w-full flex gap-2 justify-center items-center">
              <Controller
                name="email"
                control={LostPassword.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <Input
                      {...field}
                      id="form-forgotten-password-email"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      className="text-[1em] text-muted-foreground"
                      required
                      placeholder="email@example.com"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button type="submit" form="form-reset-password">
                <Send />
              </Button>
            </section>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
