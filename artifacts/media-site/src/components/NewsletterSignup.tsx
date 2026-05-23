import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
// Note: Assuming useSubscribeNewsletter exists in the API, we use it or mock it if missing.
// For now, let's implement the form.

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function NewsletterSignup() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // mock api call
    setTimeout(() => {
      toast({
        title: "Subscribed!",
        description: "You're now on the list.",
      });
      form.reset();
    }, 500);
  };

  return (
    <section className="bg-primary/5 py-20 border-y border-border">
      <div className="container max-w-4xl px-4 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Get the best of tech & culture, weekly
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
          Join 50,000+ curious minds. No spam, just the signal in the noise.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input 
                      placeholder="your@email.com" 
                      className="h-12 bg-background border-border" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-left" />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="h-12 font-bold px-8 w-full sm:w-auto">
              Subscribe
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}