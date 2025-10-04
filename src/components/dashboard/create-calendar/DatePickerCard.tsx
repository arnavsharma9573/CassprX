import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Calendar as CalendarIcon,
  CheckCircle,
  Clock
} from "lucide-react";
import { format } from "date-fns";

interface DatePickerCardProps {
  onConfirm: (startDate: string) => void;
  onCancel: () => void;
  isCreating?: boolean;
}

export default function DatePickerCard({ 
  onConfirm, 
  onCancel, 
  isCreating = false 
}: DatePickerCardProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleConfirm = () => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      onConfirm(formattedDate);
    }
  };

  const isDateValid = selectedDate && selectedDate >= new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-2xl mx-auto p-4"
    >
      <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-blue-500" />
              Select Campaign Start Date
            </CardTitle>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Choose Date
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-neutral-300">
              When would you like your campaign to start?
            </div>
            
            <div className="flex justify-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full max-w-xs justify-start text-left font-normal border-neutral-600 bg-neutral-800/50 text-white hover:bg-neutral-700"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-neutral-800 border-neutral-600" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="bg-neutral-800 text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Campaign Timeline Preview */}
          {selectedDate && (
            <div className="p-4 bg-neutral-800/30 rounded-lg border border-neutral-700">
              <div className="text-sm font-medium text-neutral-300 mb-2">Campaign Timeline:</div>
              <div className="text-white text-sm space-y-1">
                <div>Start Date: {format(selectedDate, "PPP")}</div>
                <div>Duration: 6 weeks (as recommended)</div>
                <div>End Date: {format(new Date(selectedDate.getTime() + 6 * 7 * 24 * 60 * 60 * 1000), "PPP")}</div>
                <div>Total Posts: 24 posts</div>
              </div>
            </div>
          )}

          {/* Info Message */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-300">
                <div className="font-medium mb-1">Calendar Generation Process:</div>
                <div className="text-xs text-blue-400">
                  Once you confirm, we'll create your personalized content calendar. This process typically takes 2-3 minutes.
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-neutral-700">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              Go Back
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isDateValid || isCreating}
              className="flex-1 bg-gradient-to-r from-[#E6A550] to-[#BC853B] hover:from-[#BC853B] hover:to-[#E6A550] text-black font-semibold disabled:opacity-50"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Creating Calendar...
                </div>
              ) : (
                "Create Calendar"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

