import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSubscribeNewsletter } from "@workspace/api-client-react";
import { Mail, Zap } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function NewsletterSignup() {
  const { toast } = useToast();
  const { mutate, isPending } = useSubscribeNewsletter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(
      { data: { email: values.email } },
      {
        onSuccess: () => {
          toast({
            title: "You're in! 🎉",
            description: "Welcome to Scrolltek. Check your inbox for a confirmation.",
          });
          form.reset();
        },
        onError: () => {
          toast({
            title: "Something went wrong",
            description: "Please try again in a moment.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <section className="relative py-20 overflow-hidden border-t border-border">
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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <Input
                        placeholder="your@email.com"
                        className="h-12 pl-10 bg-background border-border text-base"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-left" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="h-12 font-bold px-8 w-full sm:w-auto shrink-0"
            >
              {isPending ? "Subscribing…" : "Subscribe Free"}
            </Button>
          </form>
        </Form>

        <p className="text-xs text-muted-foreground mt-4">
          No spam. Unsubscribe anytime. Free forever.
        </p>
      </div>
    </section>
  );
}
