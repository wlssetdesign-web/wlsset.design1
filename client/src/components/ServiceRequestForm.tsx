import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

const serviceProductOptions: Record<string, string[]> = {
  "Brand Identity Design": ["Logo Design", "Brand Guidelines", "Color Palette", "Typography System", "Rebranding"],
  "Print Design": ["Business Cards", "Brochures", "Posters", "Menus", "Flyers", "Roll-Up Banners", "Packaging"],
  "Social Media Design": ["Instagram Posts", "Instagram Stories", "Facebook Covers", "Ad Creatives", "Content Grids"],
  "Image Editing": ["Retouching", "Background Removal", "Color Correction", "Compositing"],
  "Vector Tracing": ["Logo Vectorization", "Sketch to Vector", "High-Resolution Scaling"],
  "Infographic Design": ["Data Visualization", "Process Flowcharts", "Educational Graphics"],
  "Video & Motion": ["Video Editing", "Intro/Outro", "Social Media Video", "Motion Graphics", "VFX"],
};

const colorOptions = ["Red", "Blue", "Green", "Yellow", "Black", "White", "Gray", "Gold", "Silver", "Purple", "Orange", "Pink", "Brown"];
const englishFonts = ["Montserrat", "Playfair Display", "Helvetica", "Roboto", "Lora"];
const arabicFonts = ["Tajawal", "Cairo", "Almarai", "Amiri", "Dubai Font"];

const userInfoSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email address"),
});

const projectDetailsSchema = z.object({
  requiredProduct: z.string().min(1, "Please select a required product"),
  preferredColors: z.string().min(1, "Please select preferred colors"),
  fontStyle: z.string().min(1, "Please select a font style"),
  designNotes: z.string().min(10, "Please provide design details"),
});

type UserInfoFormData = z.infer<typeof userInfoSchema>;
type ProjectDetailsFormData = z.infer<typeof projectDetailsSchema>;

interface ServiceRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
}

export default function ServiceRequestForm({
  isOpen,
  onClose,
  serviceName,
}: ServiceRequestFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoFormData | null>(null);
  const { toast } = useToast();
  const { t } = useI18n();

  const userForm = useForm<UserInfoFormData>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const projectForm = useForm<ProjectDetailsFormData>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: {
      requiredProduct: "",
      preferredColors: "",
      fontStyle: "",
      designNotes: "",
    },
  });

  const handleUserInfoSubmit = (values: UserInfoFormData) => {
    setUserInfo(values);
    setStep(2);
  };

  const handleProjectDetailsSubmit = async (values: ProjectDetailsFormData) => {
    setIsSubmitting(true);
    
    const fullFormData = {
      name: userInfo?.name,
      email: userInfo?.email,
      phone: userInfo?.phone,
      service: serviceName,
      requiredProduct: values.requiredProduct,
      preferredColors: values.preferredColors,
      fontStyle: values.fontStyle,
      designNotes: values.designNotes,
    };

    try {
      const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxWVnj9zrbB3VnRrrBMdxpp-b2Z2YDd8kMPDI4oiiwZVmo045TnxHl1kti0CHeZWU4/exec";
      
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(fullFormData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setIsSubmitted(true);
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
  };

  const handleClose = () => {
    if (isSubmitted) {
      setStep(1);
      setIsSubmitted(false);
      setUserInfo(null);
      userForm.reset();
      projectForm.reset();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white border border-gray-300 rounded-2xl p-5 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-black" />
            </button>

            {!isSubmitted ? (
              <>
                <div className="mb-5 sm:mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#A30A0A] mb-2">
                    {serviceName}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    Step {step} of 2
                  </p>
                  <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#A30A0A]"
                      initial={{ width: 0 }}
                      animate={{ width: step === 1 ? "50%" : "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Form {...userForm}>
                        <form onSubmit={userForm.handleSubmit(handleUserInfoSubmit)} className="space-y-4">
                          <FormField
                            control={userForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                          <FormLabel className="text-sm sm:text-base font-semibold text-black">{t("form.fullName")}</FormLabel>
                                <FormControl>
                                  <Input placeholder="Mohammed Al Dmour" {...field} className="bg-white border-2 border-gray-300 text-black text-sm sm:text-base placeholder:text-gray-500" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={userForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                          <FormLabel className="text-sm sm:text-base font-semibold text-black">{t("form.phone")}</FormLabel>
                                <FormControl>
                                  <Input placeholder="+962 (799) 123-456" {...field} className="bg-white border-2 border-gray-300 text-black text-sm sm:text-base placeholder:text-gray-500" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={userForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                          <FormLabel className="text-sm sm:text-base font-semibold text-black">{t("form.email")}</FormLabel>
                                <FormControl>
                                  <Input placeholder="mohammed.aldmour@gmail.com" type="email" {...field} className="bg-white border-2 border-gray-300 text-black text-sm sm:text-base placeholder:text-gray-500" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex gap-3 pt-4">
                            <Button
                              type="submit"
                              className="flex-1 bg-[#A30A0A] hover:bg-[#8B0808] text-white text-sm sm:text-base font-semibold py-3"
                            >
                              {t("form.next")}
                              <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Form {...projectForm}>
                        <form onSubmit={projectForm.handleSubmit(handleProjectDetailsSubmit)} className="space-y-4">
                          <FormField
                            control={projectForm.control}
                            name="requiredProduct"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm sm:text-base font-semibold text-black">Required Product</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-white border-2 border-gray-300 text-black text-sm sm:text-base">
                                      <SelectValue placeholder="Select product" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-[#1E1E1E] border-white/10">
                                    {(serviceProductOptions[serviceName] || []).map((product) => (
                                      <SelectItem key={product} value={product} className="text-white">{product}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={projectForm.control}
                            name="preferredColors"
                            render={({ field }) => (
                              <FormItem>
                          <FormLabel className="text-sm sm:text-base font-semibold text-black">{t("form.preferredColors")}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-white border-2 border-gray-300 text-black text-sm sm:text-base">
                                      <SelectValue placeholder="Select colors" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-[#1E1E1E] border-white/10">
                                    {colorOptions.map((color) => (
                                      <SelectItem key={color} value={color} className="text-white">{color}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={projectForm.control}
                            name="fontStyle"
                            render={({ field }) => (
                              <FormItem>
                          <FormLabel className="text-sm sm:text-base font-semibold text-black">{t("form.fontStyle")}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-white border-2 border-gray-300 text-black text-sm sm:text-base">
                                      <SelectValue placeholder="Select font style" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-[#1E1E1E] border-white/10">
                                    <div className="px-3 py-2 text-xs uppercase tracking-wider text-white/60">English</div>
                                    {englishFonts.map((font) => (
                                      <SelectItem key={font} value={font} className="text-white">{font}</SelectItem>
                                    ))}
                                    <div className="px-3 py-2 text-xs uppercase tracking-wider text-white/60">Arabic</div>
                                    {arabicFonts.map((font) => (
                                      <SelectItem key={font} value={font} className="text-white">{font}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={projectForm.control}
                            name="designNotes"
                            render={({ field }) => (
                              <FormItem>
                          <FormLabel className="text-sm sm:text-base font-semibold text-black">{t("form.designNotes")}</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Tell us about your vision, specific requirements, inspiration, or any other details..."
                                    className="min-h-[100px] bg-white border-2 border-gray-300 text-black text-sm sm:text-base placeholder:text-gray-500"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex gap-3 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setStep(1)}
                              className="flex-1 border-2 border-gray-300 text-black text-sm sm:text-base font-semibold hover:bg-gray-100"
                            >
                              <ChevronLeft className="mr-2 w-4 h-4" />
                              {t("form.back")}
                            </Button>
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="flex-1 bg-[#A30A0A] hover:bg-[#8B0808] text-white text-sm sm:text-base font-semibold py-3"
                            >
                              {isSubmitting ? "Submitting..." : "Submit Request"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300 }}
                  className="w-16 h-16 bg-[#A30A0A]/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-8 h-8 text-[#A30A0A]" />
                </motion.div>
                
                <h3 className="text-xl font-bold mb-2">Request Sent Successfully!</h3>
                <p className="text-muted-foreground mb-6">
                  Thank you for your interest in our {serviceName} service. We'll review your request and get back to you shortly.
                </p>
                
                <Button
                  onClick={handleClose}
                  className="w-full bg-[#A30A0A] hover:bg-[#8B0808] text-white"
                >
                  Close
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
