import React from "react";
import { Message } from "@/types/common";
import { motion } from "framer-motion";
import { FileText, BarChart3, Image as ImageIcon, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";

interface BloggerResultCardProps {
  message: Message;
}

export const BloggerResultCard = ({ message }: BloggerResultCardProps) => {
  const data = message.resultData;

  if (!data) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-500/10 p-2 rounded-lg">
          <FileText className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-400">Blog Post Generated</p>
          <h2 className="text-lg font-semibold text-white">{data.title}</h2>
        </div>
      </div>

      <p className="text-sm text-neutral-300 mb-5 border-l-2 border-green-500 pl-3">
        {data.meta_description}
      </p>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-neutral-800/50 p-3 rounded-lg">
          <p className="text-xs text-neutral-400">Word Count</p>
          <p className="text-lg font-bold text-white">{data.word_count}</p>
        </div>
        <div className="bg-neutral-800/50 p-3 rounded-lg">
          <p className="text-xs text-neutral-400">SEO Keyword</p>
          <p className="text-lg font-bold text-white">{data.primary_keyword}</p>
        </div>
        <div className="bg-neutral-800/50 p-3 rounded-lg col-span-2 md:col-span-1">
          <p className="text-xs text-neutral-400">Post Type</p>
          <p className="text-lg font-bold text-white capitalize">
            {data.post_type_used.replace(/_/g, " ")}
          </p>
        </div>
      </div>

      {/* Image Suggestions */}
      {data.image_suggestions && data.image_suggestions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-neutral-300 mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Image Suggestions
          </h3>
          <ul className="space-y-2">
            {data.image_suggestions.map((suggestion: string, index: number) => (
              <li key={index} className="text-sm text-neutral-400 bg-neutral-800/50 p-3 rounded-md">
                - {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* View Full Post Button */}
      <Dialog>
        <DialogTrigger asChild>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <ExternalLink className="w-4 h-4" /> View Full Post
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-[90vh] bg-neutral-900 border-neutral-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">{data.title}</DialogTitle>
          </DialogHeader>
          <div className="prose prose-invert prose-sm md:prose-base max-w-none overflow-y-auto h-full pr-4">
             {/* Yahan hum markdown render karenge */}
             <ReactMarkdown>{data.full_text}</ReactMarkdown>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};