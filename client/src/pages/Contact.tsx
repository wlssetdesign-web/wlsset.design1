import { useI18n } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().min(10, "Please provide more details"),
});

export default function Contact() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxWVnj9zrbB3VnRrrBMdxpp-b2Z2YDd8kMPDI4oiiwZVmo045TnxHl1kti0CHeZWU4/exec";
      
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: "",
          service: "General Inquiry",
          preferredColors: "",
          fontStyle: "",
          designNotes: values.message,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Request Sent",
          description: "We'll get back to you shortly.",
        });
        form.reset();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to submit form",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  }

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-2xl bg-card/50 backdrop-blur border-white/5">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">
            {t("contact.getInTouchTitle")}
          </CardTitle>
          <p className="text-center text-muted-foreground mt-3 text-base">
            {t("contact.getInTouchDescription")}
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.name")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.email")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Example@gmail.com" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("contact.company")}</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("contact.message")}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t("contact.messageLabel")}
                        className="min-h-[120px] bg-background/50" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full text-lg h-12 font-bold" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  t("contact.submit")
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
