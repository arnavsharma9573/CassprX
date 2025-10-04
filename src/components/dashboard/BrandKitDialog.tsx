"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronRight, UploadCloud, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useAppSelector } from "@/hooks/redux-hooks";
import { RootState } from "@/store/store";

// HELPER COMPONENT for better file inputs with previews
const ImagePreviewInput = ({
  id,
  label,
  file,
  onFileChange,
  multiple = false,
}: {
  id: string;
  label: string;
  file: File | FileList | null;
  onFileChange: (file: any) => void;
  multiple?: boolean;
}) => {
  const previews = useMemo(() => {
    if (!file) return [];
    const files = "length" in file ? Array.from(file) : [file];
    return files.map((f) => URL.createObjectURL(f));
  }, [file]);

  return (
    <div className="p-4 bg-neutral-800/40 rounded-lg border border-neutral-700/80 space-y-3">
      <Label htmlFor={id} className="text-neutral-200 font-medium">
        {label}
      </Label>
      <Input
        id={id}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) =>
          onFileChange(
            multiple
              ? e.target.files
              : e.target.files
              ? e.target.files[0]
              : null
          )
        }
        className="bg-neutral-800/50 border-neutral-600 text-neutral-300 file:bg-gradient-to-r file:from-[#E6A550] file:to-[#BC853B] file:text-white file:border-0 file:rounded-lg file:px-2 file:mr-4 hover:file:opacity-90 transition-all cursor-pointer"
      />
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {previews.map((src, index) => (
            <div key={index} className="relative w-20 h-20">
              <Image
                src={src}
                alt="preview"
                layout="fill"
                objectFit="contain"
                className="rounded-md"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function BrandKitDialog({
  open,
  onOpenChange,
  onSubmit,
  isloading,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  onSubmit: (formData: FormData) => void;
  isloading: boolean;
}) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [brandName, setBrandName] = useState("");
  const [primaryFont, setPrimaryFont] = useState("Inter");
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#E6A550");
  const [colorDesc, setColorDesc] = useState("");
  const [valueProp, setValueProp] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [mascot, setMascot] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<FileList | null>(
    null
  );
  const activeBrand = useAppSelector((state: RootState) =>
    state.brand.brands.find((b) => b.id === state.brand.activeBrandId)
  );
  const profileId = activeBrand?.profileId;
  console.log(profileId, "in the kit modal");

  const steps = [
    { number: 1, title: "Identity", description: "Basic Info" },
    { number: 2, title: "Design", description: "Colors & Fonts" },
    { number: 3, title: "Message", description: "Value Prop" },
    { number: 4, title: "Assets", description: "File Uploads" },
  ];

  const handleSubmit = () => {
    // Build JSON for kit_data_json
    const kitData = {
      brand_name: brandName,
      assets: {},
      visual_identity: {
        color_palette: {
          primary_colors: [
            {
              name: colorName,
              hex: colorHex,
              description: colorDesc,
            },
          ],
        },
        typography: {
          primary_font: primaryFont,
        },
      },
      tone_and_messaging: {
        messaging: {
          value_proposition: valueProp,
        },
      },
    };
    const formData = new FormData();
    formData.append("brandProfileId", profileId!);
    formData.append("kit_data_json", JSON.stringify(kitData));
    if (logo) formData.append("logo_file", logo);
    if (mascot) formData.append("mascot_file", mascot);
    if (additionalImages) {
      Array.from(additionalImages).forEach((file) =>
        formData.append("additional_images", file)
      );
    }
    onSubmit(formData);
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    console.log(kitData);
    onOpenChange(false);
    setStep(1);
  };

  const StepIndicator = () => (
    <div className="flex flex-col gap-6 pr-8 border-r border-neutral-800">
      {steps.map((stepItem) => (
        <div key={stepItem.number} className="flex items-start">
          <div className="flex flex-col items-center mr-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                stepItem.number < step
                  ? "bg-gradient-to-r from-[#E6A550] to-[#BC853B] text-black"
                  : stepItem.number === step
                  ? "bg-gradient-to-r from-[#E6A550] to-[#BC853B] text-black ring-4 ring-[#E6A550]/20"
                  : "bg-neutral-800 border-2 border-neutral-700 text-neutral-400"
              }`}
            >
              {stepItem.number < step ? <Check size={16} /> : stepItem.number}
            </div>
          </div>
          <div>
            <div
              className={`font-semibold ${
                stepItem.number <= step ? "text-white" : "text-neutral-500"
              }`}
            >
              {stepItem.title}
            </div>
            <div className="text-sm text-neutral-500">
              {stepItem.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    const stepVariants = {
      hidden: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? 50 : -50, // Enter from right if forward, left if back
      }),
      visible: {
        opacity: 1,
        x: 0,
      },
      exit: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? -50 : 50, // Exit to left if forward, right if back
      }),
    };
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={stepVariants}
          custom={direction}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {step === 1 && (
            <div className="space-y-4">
              <Label
                htmlFor="brandName"
                className="text-neutral-200 font-medium text-lg"
              >
                What is the name of your brand?
              </Label>
              <Input
                id="brandName"
                placeholder="e.g., Stellar AI"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="mt-2 bg-neutral-800/50 border-neutral-600 text-white placeholder-neutral-400 focus:border-[#E6A550] focus:ring-1 focus:ring-[#E6A550]/30 transition-all text-base py-6"
              />
              <p className="text-neutral-500 text-sm">
                This is the primary name that will be used across all generated
                content.
              </p>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-neutral-800/40 rounded-lg border border-neutral-700/80">
                  <Label className="text-neutral-200 font-medium mb-3 block">
                    Primary Color
                  </Label>
                  <div className="space-y-3">
                    <Input
                      placeholder="e.g., Stellar Gold"
                      value={colorName}
                      onChange={(e) => setColorName(e.target.value)}
                      className="bg-neutral-800/50 border-neutral-600 focus:border-[#E6A550]"
                    />
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        value={colorHex}
                        onChange={(e) => setColorHex(e.target.value)}
                        className="w-16 h-10 p-1 bg-neutral-800 border-neutral-600 cursor-pointer"
                      />
                      <Input
                        value={colorHex}
                        onChange={(e) => setColorHex(e.target.value)}
                        className="bg-neutral-800/50 border-neutral-600 focus:border-[#E6A550]"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-neutral-800/40 rounded-lg border border-neutral-700/80">
                  <Label
                    htmlFor="font"
                    className="text-neutral-200 font-medium mb-3 block"
                  >
                    Primary Font
                  </Label>
                  <Input
                    id="font"
                    placeholder="e.g., Inter, Roboto"
                    value={primaryFont}
                    onChange={(e) => setPrimaryFont(e.target.value)}
                    className="bg-neutral-800/50 border-neutral-600 focus:border-[#E6A550]"
                  />
                </div>
              </div>
              <Textarea
                placeholder="Describe your color's meaning and font's personality..."
                value={colorDesc}
                onChange={(e) => setColorDesc(e.target.value)}
                className="bg-neutral-800/50 border-neutral-600 focus:border-[#E6A550] resize-none"
                rows={4}
              />
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <Label className="text-neutral-200 font-medium text-lg">
                What is your brand's core value proposition?
              </Label>
              <Textarea
                placeholder="e.g., The intelligent platform for scaling your business with AI-powered automation."
                value={valueProp}
                onChange={(e) => setValueProp(e.target.value)}
                className="mt-2 bg-neutral-800/50 border-neutral-600 text-base focus:border-[#E6A550] resize-none min-h-40"
              />
              <p className="text-neutral-500 text-sm">
                Clearly communicate the primary value your brand provides to
                customers.
              </p>
            </div>
          )}
          {step === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImagePreviewInput
                id="logo"
                label="Logo File"
                file={logo}
                onFileChange={setLogo}
              />
              <ImagePreviewInput
                id="mascot"
                label="Mascot / Secondary Logo"
                file={mascot}
                onFileChange={setMascot}
              />
              <div className="md:col-span-2">
                <ImagePreviewInput
                  id="additional"
                  label="Additional Brand Images"
                  file={additionalImages}
                  onFileChange={setAdditionalImages}
                  multiple
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-neutral-950 text-neutral-100 border-neutral-800 shadow-2xl p-0">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr]">
          {/* Left Column: Step Indicator */}
          <div className="p-8 bg-black/20 hidden md:block">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-[#E6A550] to-[#BC853B] bg-clip-text text-transparent">
                Create Brand Kit
              </DialogTitle>
            </DialogHeader>
            <div className="mt-12">
              <StepIndicator />
            </div>
          </div>

          {/* Right Column: Form Content */}
          <div className="p-8 flex flex-col">
            <div className="flex-1 min-h-[24rem]">{renderStep()}</div>
            <DialogFooter className="pt-6 border-t border-neutral-800 mt-auto">
              {step > 1 ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStep((s) => s - 1);
                    setDirection(-1);
                  }}
                  className="text-neutral-300 hover:text-white hover:bg-neutral-900"
                >
                  Back
                </Button>
              ) : (
                <div /> /* Spacer */
              )}
              {step < 4 ? (
                <Button
                  onClick={() => {
                    setDirection(1);
                    setStep((s) => s + 1);
                  }}
                  className="bg-gradient-to-r from-[#E6A550] to-[#BC853B] hover:opacity-90 text-white px-6 ml-auto"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 text-white px-8 ml-auto"
                >
                  Create Brand Kit
                </Button>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
