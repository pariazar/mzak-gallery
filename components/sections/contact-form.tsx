"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Tell us your name"),
  email: z.email("We need a valid email to reply"),
  company: z.string().optional(),
  budget: z.string().min(1, "Pick an interest — rough is fine"),
  message: z.string().min(20, "Give us at least a couple of sentences"),
});

type ContactValues = z.infer<typeof contactSchema>;

const BUDGETS = [
  "Commission",
  "Acquisition",
  "Atelier visit",
  "Press / other",
];

/**
 * Contact form — react-hook-form + zod validation, animated submit
 * states. The submit handler is a stub: wire it to a route handler,
 * server action or service (Resend, Formspree…) per project.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { budget: "" },
  });

  // useWatch (not watch()) — safe with the React Compiler
  const budget = useWatch({ control, name: "budget" });

  const onSubmit = async (values: ContactValues) => {
    // Demo stub — replace with a real submission per project
    await new Promise((r) => setTimeout(r, 1200));
    console.info("[contact] payload ready to send:", values);
    setSent(true);
  };

  return (
    <div aria-live="polite">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-96 flex-col items-start justify-center"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Check className="size-6" />
            </span>
            <h2 className="mt-8 font-display text-4xl">
              Message received<span className="text-accent">.</span>
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Thanks for writing — MZAK reads every note and usually replies
              within a few days.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-10"
          >
            <div className="grid gap-10 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Ada Lovelace"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                {errors.name && (
                  <p role="alert" className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ada@company.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <p role="alert" className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="company">Organization</Label>
              <Input
                id="company"
                placeholder="Optional — gallery, press, private"
                {...register("company")}
              />
            </div>

            <fieldset>
              <legend className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Interest *
              </legend>
              <div className="mt-4 flex flex-wrap gap-3">
                {BUDGETS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() =>
                      setValue("budget", b, { shouldValidate: true })
                    }
                    aria-pressed={budget === b}
                    data-cursor="hover"
                    className={
                      budget === b
                        ? "rounded-full border border-accent bg-accent px-5 py-2 text-sm text-accent-foreground"
                        : "rounded-full border border-border px-5 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                    }
                  >
                    {b}
                  </button>
                ))}
              </div>
              {errors.budget && (
                <p role="alert" className="mt-3 text-sm text-destructive">
                  {errors.budget.message}
                </p>
              )}
            </fieldset>

            <div className="space-y-3">
              <Label htmlFor="message">Note *</Label>
              <Textarea
                id="message"
                placeholder="A series that spoke to you, a wall size, a visit date…"
                aria-invalid={!!errors.message}
                {...register("message")}
              />
              {errors.message && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.message.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              data-cursor="hover"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> Sending…
                </>
              ) : (
                "Send the note"
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
