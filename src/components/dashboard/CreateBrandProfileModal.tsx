"use client";

import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Globe,
  Upload,
  FileSpreadsheet,
  ExternalLink,
  CheckCircle,
} from "lucide-react";

export default function BrandProfileDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  onSubmit: (formData: FormData) => void;
}) {
  const [sourceType, setSourceType] = useState("website");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("source_type", sourceType);

    if (sourceType === "website") {
      formData.append("url", url);
    } else if (sourceType === "csv" && file) {
      formData.append("file", file);
    }

    onSubmit(formData);
    onOpenChange(false);
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const canSubmit =
    (sourceType === "website" && url && isValidUrl(url)) ||
    (sourceType === "csv" && file);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-neutral-900/95 backdrop-blur-sm text-neutral-100 border border-neutral-700/50 shadow-2xl">
        <DialogHeader className="pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-[#E6A550] to-[#BC853B] rounded-lg">
              <Globe className="w-5 h-5 text-black" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#E6A550] to-[#BC853B] bg-clip-text text-transparent">
              Create Brand Profile
            </DialogTitle>
          </div>
          <p className="text-neutral-400 text-sm">
            Generate a comprehensive brand profile from your website or data
            files
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Source Type Selection */}
          <div className="space-y-4">
            <Label className="text-neutral-200 font-medium text-base">
              Choose Your Data Source
            </Label>
            <RadioGroup
              defaultValue="website"
              onValueChange={(val) => setSourceType(val)}
              className="grid grid-cols-1 gap-4"
            >
              {/* Website Option */}
              <div className="relative">
                <input
                  type="radio"
                  id="website"
                  name="source"
                  value="website"
                  checked={sourceType === "website"}
                  onChange={() => setSourceType("website")}
                  className="sr-only peer"
                />
                <label
                  htmlFor="website"
                  className={`
                    flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${
                      sourceType === "website"
                        ? "border-[#E6A550] bg-gradient-to-r from-[#E6A550]/10 to-[#BC853B]/10 shadow-lg shadow-[#E6A550]/20"
                        : "border-neutral-600 bg-neutral-800/30 hover:border-neutral-500 hover:bg-neutral-800/50"
                    }
                  `}
                >
                  <div
                    className={`
                    p-3 rounded-full transition-all
                    ${
                      sourceType === "website"
                        ? "bg-gradient-to-r from-[#E6A550] to-[#BC853B] text-black"
                        : "bg-neutral-700 text-neutral-300"
                    }
                  `}
                  >
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div
                      className={` ${
                        sourceType === "website"
                          ? "text-[#E6A550]"
                          : "text-neutral-200"
                      }`}
                    >
                      Website Analysis
                    </div>
                    <div className="text-sm text-neutral-400">
                      Analyze your website's content, design, and messaging
                    </div>
                  </div>
                  {sourceType === "website" && (
                    <CheckCircle className="w-5 h-5 text-[#E6A550]" />
                  )}
                </label>
              </div>

              {/* CSV Option */}
              <div className="relative">
                <input
                  type="radio"
                  id="csv"
                  name="source"
                  value="csv"
                  checked={sourceType === "csv"}
                  onChange={() => setSourceType("csv")}
                  className="sr-only peer"
                />
                <label
                  htmlFor="csv"
                  className={`
                    flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${
                      sourceType === "csv"
                        ? "border-[#E6A550] bg-gradient-to-r from-[#E6A550]/10 to-[#BC853B]/10 shadow-lg shadow-[#E6A550]/20"
                        : "border-neutral-600 bg-neutral-800/30 hover:border-neutral-500 hover:bg-neutral-800/50"
                    }
                  `}
                >
                  <div
                    className={`
                    p-3 rounded-full transition-all
                    ${
                      sourceType === "csv"
                        ? "bg-gradient-to-r from-[#E6A550] to-[#BC853B] text-black"
                        : "bg-neutral-700 text-neutral-300"
                    }
                  `}
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div
                      className={` ${
                        sourceType === "csv"
                          ? "text-[#E6A550]"
                          : "text-neutral-200"
                      }`}
                    >
                      Data File Upload
                    </div>
                    <div className="text-sm text-neutral-400">
                      Upload CSV or Excel files with your brand data
                    </div>
                  </div>
                  {sourceType === "csv" && (
                    <CheckCircle className="w-5 h-5 text-[#E6A550]" />
                  )}
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Dynamic Input Section */}
          <div
            key={sourceType}
            className="p-6 bg-neutral-800/30 rounded-lg border border-neutral-700"
          >
            {sourceType === "website" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4 text-[#E6A550]" />
                  <Label htmlFor="url" className="text-neutral-200 font-medium">
                    Website URL
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="url"
                    placeholder="https://your-website.com"
                    value={url || ""}
                    onChange={(e) => setUrl(e.target.value)}
                    className={`
                      bg-neutral-800/50 border-neutral-600 text-white placeholder-neutral-400 
                      pl-10 pr-10 transition-all duration-200
                      ${
                        url && isValidUrl(url)
                          ? "border-green-500 focus:border-green-400 focus:ring-1 focus:ring-green-400/30"
                          : url && !isValidUrl(url)
                          ? "border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400/30"
                          : "focus:border-[#E6A550] focus:ring-1 focus:ring-[#E6A550]/30"
                      }
                    `}
                  />
                  <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  {url && isValidUrl(url) && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
                {url && !isValidUrl(url) && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    Please enter a valid URL (including https://)
                  </p>
                )}
                <div className="bg-neutral-700/30 p-3 rounded border-l-4 border-[#E6A550]/50">
                  <p className="text-neutral-300 text-xs">
                    💡 <strong>Tip:</strong> We'll analyze your website's
                    content, design elements, and messaging to create a
                    comprehensive brand profile automatically.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Upload className="w-4 h-4 text-[#E6A550]" />
                  <Label
                    htmlFor="file"
                    className="text-neutral-200 font-medium"
                  >
                    Upload Data File
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="file"
                    type="file"
                    accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={(e) =>
                      setFile(e.target.files ? e.target.files[0] : null)
                    }
                    className="bg-neutral-800/50 border-neutral-600 text-neutral-300 file:bg-gradient-to-r file:from-[#E6A550] file:to-[#BC853B] file:text-white file:border-0 file:rounded file:px-4 file:mr-4 file:font-medium hover:file:opacity-90 transition-all cursor-pointer "
                  />
                </div>
                {file && (
                  <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-green-400 text-sm font-medium">
                      {file.name}
                    </span>
                    <span className="text-neutral-400 text-xs">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                )}
                <div className="bg-neutral-700/30 p-3 rounded border-l-4 border-[#E6A550]/50">
                  <p className="text-neutral-300 text-xs">
                    📊 <strong>Supported formats:</strong> CSV, Excel (.xlsx,
                    .xls). Include columns like brand_name, description, values,
                    target_audience, etc.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-6 border-t border-neutral-800">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-neutral-800/50 border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:border-neutral-500 transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`
               px-6 transition-all shadow-lg
              ${
                canSubmit
                  ? "bg-gradient-to-r from-[#E6A550] to-[#BC853B] hover:from-[#E6A550]/90 hover:to-[#BC853B]/90 text-black shadow-[#E6A550]/20"
                  : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
              }
            `}
          >
            {sourceType === "website" ? "Analyze Website" : "Process File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
