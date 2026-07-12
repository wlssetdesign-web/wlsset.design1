import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { useBasket } from "@/lib/BasketContext";

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  tags?: string | null;
};

const userInfoSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email address"),
});

const projectDetailsSchema = z.object({
  requiredProduct: z.string().min(1, "Please select a required product"),
  designNotes: z.string().optional(),
});

type UserInfoFormData = z.infer<typeof userInfoSchema>;
type ProjectDetailsFormData = z.infer<typeof projectDetailsSchema>;

interface ServiceRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  serviceKey: string;
  productOptions: string[];
}

export default function ServiceRequestForm({
  isOpen,
  onClose,
  serviceName,
  serviceKey,
  productOptions,
}: ServiceRequestFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoFormData | null>(null);
  const [projectDetails, setProjectDetails] = useState<ProjectDetailsFormData | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();
  const { addItem } = useBasket();

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
      designNotes: "",
    },
  });

  const handleUserInfoSubmit = (values: UserInfoFormData) => {
    setUserInfo(values);
    setStep(2);
  };

  const handleProjectDetailsSubmit = (values: ProjectDetailsFormData) => {
    setProjectDetails(values);
    setStep(3);
  };

  const handleFinalSubmit = () => {
    if (!projectDetails) return;
    addItem({
      id: "",
      serviceKey,
      title: serviceName,
      details: {
        name: userInfo?.name || "",
        phone: userInfo?.phone || "",
        email: userInfo?.email || "",
        requiredProduct: projectDetails.requiredProduct,
        designNotes: projectDetails.designNotes || "",
      },
    });

    toast({
      title: "Added to basket",
      description: `${serviceName} has been added to your request basket.`,
    });

    setIsSubmitted(true);
  };

  useEffect(() => {
    if (step === 3 && projectDetails?.requiredProduct) {
      setPortfolioLoading(true);
      fetch(`/api/portfolio/by-tag/${encodeURIComponent(projectDetails.requiredProduct)}`)
        .then((res) => res.json())
        .then((data) => setPortfolioItems(data))
        .catch(() => setPortfolioItems([]))
        .finally(() => setPortfolioLoading(false));
    }
  }, [step, projectDetails?.requiredProduct]);

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
                    Step {step} of 3
                  </p>
                  <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#A30A0A]"
                      initial={{ width: 0 }}
                      animate={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
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
                                  <Input placeholder="Your Name" {...field} className="bg-white border-2 border-gray-300 text-black text-sm sm:text-base placeholder:text-gray-500" />
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
                                  <Input placeholder="Example@gmail.com" type="email" {...field} className="bg-white border-2 border-gray-300 text-black text-sm sm:text-base placeholder:text-gray-500" />
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
                  ) : step === 2 ? (
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
                                  <SelectContent position="item-aligned" className="bg-white border-gray-300 text-black">
                                    {productOptions.map((product) => (
                                      <SelectItem key={product} value={product}>{product}</SelectItem>
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
                          <FormLabel className="text-sm sm:text-base font-semibold text-black">Description</FormLabel>
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
                              className="flex-1 bg-[#A30A0A] hover:bg-[#8B0808] text-white text-sm sm:text-base font-semibold py-3"
                            >
                              Next
                              <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-black">Here's some of our related work</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Examples matching "{projectDetails?.requiredProduct}"
                          </p>
                        </div>

                        {portfolioLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-[#A30A0A]" />
                          </div>
                        ) : portfolioItems.length > 0 ? (
                          <div className="grid grid-cols-2 gap-3">
                            {portfolioItems.map((item) => (
                              <div
                                key={item.id}
                                className="group rounded-lg overflow-hidden border border-gray-200 bg-white hover:border-[#A30A0A]/30 hover:shadow-md transition-all"
                              >
                                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "";
                                      (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                  />
                                </div>
                                <div className="p-2.5">
                                  <p className="text-sm font-medium text-black truncate">{item.title}</p>
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500 font-medium">More examples coming soon!</p>
                            <p className="text-xs text-gray-400 mt-1">
                              We're building more portfolio examples for this category.
                            </p>
                          </div>
                        )}

                        <div className="flex gap-3 pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(2)}
                            className="flex-1 border-2 border-gray-300 text-black text-sm sm:text-base font-semibold hover:bg-gray-100"
                          >
                            <ChevronLeft className="mr-2 w-4 h-4" />
                            Back
                          </Button>
                          <Button
                            type="button"
                            onClick={handleFinalSubmit}
                            className="flex-1 bg-[#A30A0A] hover:bg-[#8B0808] text-white text-sm sm:text-base font-semibold py-3"
                          >
                            Looks good, Add to Basket
                          </Button>
                        </div>
                      </div>
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
                
                <h3 className="text-xl font-bold mb-2">Added to Basket!</h3>
                <p className="text-muted-foreground mb-6">
                  {serviceName} has been added to your request basket. View the basket icon in the navbar to review all items.
                </p>
                
                <Button
                  onClick={handleClose}
                  className="w-full bg-[#A30A0A] hover:bg-[#8B0808] text-white"
                >
                  Done
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
