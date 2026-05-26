import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-muted py-16 border-b border-border">
        <div className="container max-w-2xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Got a tip, feedback, or just want to say hi? Reach out below.
          </p>
        </div>
      </div>

      <div className="container max-w-2xl mx-auto px-4 mt-12">
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 md:p-8 rounded-xl border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input id="name" required placeholder="John Doe" className="bg-background" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" type="email" required placeholder="john@example.com" className="bg-background" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">Subject</label>
            <Input id="subject" required placeholder="Story pitch" className="bg-background" />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">Message</label>
            <Textarea id="message" required placeholder="Tell us more..." className="min-h-[150px] bg-background" />
          </div>

          <Button type="submit" size="lg" className="w-full font-bold">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}