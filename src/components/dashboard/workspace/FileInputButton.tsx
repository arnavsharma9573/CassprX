"use client";
import { IconUpload } from "@tabler/icons-react";
import React, { useRef } from "react";

interface FileInputButtonProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const FileInputButton: React.FC<FileInputButtonProps> = ({ onFileSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-neutral-950 hover:bg-neutral-950/40 rounded-md  transition-colors disabled:bg-neutral-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <IconUpload size={16} />
        Upload File
      </button>
    </div>
  );
};