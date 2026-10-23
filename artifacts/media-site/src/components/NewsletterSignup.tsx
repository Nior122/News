import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSubscribeNewsletter } from "@workspace/api-client-react";
import { Mail, Zap } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterSignup() {
  const { toast } = useToast();
  const { mutate, isPending } = useSubscribeNewsletter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setError("Please enter a valid email address");
      return;
    }
    setError(null);
    mutate(
      { data: { email: trimmed } },
      {
        onSuccess: () => {
          toast({
            title: "You're in! 🎉",
            description: "Welcome to Scrolltek. Check your inbox for a confirmation.",
          });
          setEmail("");
        },
        onError: () => {
          toast({
            title: "Something went wrong",
            description: "Please try again in a moment.",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <section className="cv-auto relative py-20 overflow-hidden border-t border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/10 blur-3xl rounded-full pointer-events-none" />

      <div className="container max-w-4xl px-4 text-center relative">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-primary/20">
          <Zap className="w-3.5 h-3.5" />
          Weekly Newsletter
        </div>

        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
          Stay ahead of the curve.
          <span className="block text-primary">Every week.</span>
        </h2>

        <p className="text-muted-foreground mb-10 max-w-xl mx-auto text-base md:text-lg">
          Join 50,000+ readers. The best of tech, culture & AI — curated and delivered every Sunday. No spam, ever.
        </p>

        <form
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <div className="flex-1 space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                aria-invalid={error ? "true" : "false"}
                placeholder="your@email.com"
                className="h-12 pl-10 bg-background border-border text-base"
              />
            </div>
            {error && (
              <p className="text-[0.8rem] font-medium text-destructive text-left">
                {error}
              </p>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="h-12 font-bold px-8 w-full sm:w-auto shrink-0"
          >
            {isPending ? "Subscribing…" : "Subscribe Free"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-4">
          No spam. Unsubscribe anytime. Free forever.
        </p>
      </div>
    </section>
  );
}
