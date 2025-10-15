import React from "react";
import { Message } from "@/types/common";
import { motion } from "framer-motion";
import { BookOpen, Clock, Quote, ListChecks, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";

interface MediumResultCardProps {
  message: Message;
}

export const MediumResultCard = ({ message }: MediumResultCardProps) => {
  const data = message.resultData;

  if (!data) {
    return <p className="text-red-400">Article data is missing.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-purple-500/10 p-2 rounded-lg">
          <BookOpen className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{data.title}</h2>
          <p className="text-sm font-medium text-neutral-400">
            {data.subtitle}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="flex items-center gap-2 text-sm text-neutral-300">
          <Clock className="w-4 h-4 text-purple-400" />
          <span>{data.read_time_minutes} min read</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-300">
          <span className="font-bold text-purple-400">#</span>
          <span>{data.word_count} words</span>
        </div>
      </div>

      {/* Universal Lesson / Takeaway */}
      {data.universal_lesson && (
        <blockquote className="mb-5 border-l-2 border-purple-500 pl-3 italic text-neutral-300">
          "{data.universal_lesson}"
        </blockquote>
      )}

      {/* Highlight Lines */}
      {data.highlight_potential_lines && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
            <ListChecks className="w-4 h-4" /> Key Highlights
          </h3>
          <ul className="space-y-1 list-disc list-inside">
            {data.highlight_potential_lines.map(
              (line: string, index: number) => (
                <li key={index} className="text-sm text-neutral-400">
                  {line}
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {/* View Full Article Button */}
      <Dialog>
        <DialogTrigger asChild>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <ExternalLink className="w-4 h-4" /> Read Full Article
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-[90vh] bg-neutral-900 border-neutral-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">{data.title}</DialogTitle>
            <p className="text-neutral-400">{data.subtitle}</p>
          </DialogHeader>
          <div className="prose prose-invert prose-sm md:prose-base max-w-none overflow-y-auto h-full pr-4 mt-4">
            <ReactMarkdown>{data.full_text}</ReactMarkdown>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
