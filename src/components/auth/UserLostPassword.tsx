import { toast } from "sonner";
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
import { authApi } from "@/api/authApi";
import { extractApiError } from "@/lib/axios";
import { useState } from "react";

export default function UserLostPassword() {
  const [open, setOpen] = useState(false);

  const LostPassword = useForm<z.infer<typeof LostPasswordSchema>>({
    resolver: zodResolver(LostPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function PasswordForgotten(data: z.infer<typeof LostPasswordSchema>) {
    try {
      await authApi.forgotPassword(data);
      toast.success(
        "Votre email nous a été transmis. Si un compte existe, un lien de réinitialisation vous sera envoyé.",
      );
      setOpen(false);
      LostPassword.reset();
    } catch (error) {
      toast.error(extractApiError(error).message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <DialogTitle>Vous avez oublié votre mot de passe ?</DialogTitle>
          <DialogDescription className="sr-only">
            Récupération d'un mot de passe
          </DialogDescription>
          <p className="text-[1em]">Saisissez votre e-mail d'inscription.</p>
          <p className="text-[0.9em]">
            Nous vous enverrons un lien si le compte existe.
          </p>
        </DialogHeader>
        <form
          id="form-forgotten-password"
          onSubmit={LostPassword.handleSubmit(PasswordForgotten)}
          className="w-full flex gap-2 justify-center items-center"
        >
          <Controller
            name="email"
            control={LostPassword.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <Input
                  {...field}
                  id="form-forgotten-password-email"
                  aria-invalid={fieldState.invalid}
                  autoComplete="email"
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
          <Button
            type="submit"
            disabled={LostPassword.formState.isSubmitting}
            aria-label="Envoyer le lien de réinitialisation"
          >
            <Send />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
