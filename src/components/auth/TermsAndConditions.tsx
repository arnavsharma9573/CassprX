"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function TermsModal({
  isOpen,
  onClose,
  onAccept,
}: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.3 }}
        className="bg-white text-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>

        <div className="max-h-[60vh] overflow-y-auto space-y-4 text-sm leading-relaxed">
          <p>
            Welcome to our application. By registering, you agree to abide by
            our terms and conditions.
          </p>
          <p>1. You must provide accurate information when registering.</p>
          <p>
            2. Your account is personal and cannot be shared without permission.
          </p>
          <p>
            3. We may update these terms occasionally. You will be notified of
            significant changes.
          </p>
          <p>4. Any misuse of the platform may lead to account suspension.</p>
          <p>
            By clicking "I Agree", you confirm that you have read and understood
            these terms.
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Close
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 rounded-lg bg-[var(--primary2)] text-black"
          >
            I Agree
          </button>
        </div>
      </motion.div>
    </div>
  );
}
