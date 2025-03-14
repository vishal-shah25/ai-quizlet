"use client";

import {FileUp} from "lucide-react";
import {toast} from "sonner";
import {AnimatePresence, motion} from "framer-motion";
import {useState} from "react";

interface FileUploadProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

export default function PdfUpload({files, setFiles}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const processFiles = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024,
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF files under 5MB are allowed.");
    }

    setFiles(validFiles);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50 w-full"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center text-white text-lg"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
          >
            <p>Drop your PDF here</p>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        type="file"
        onChange={handleFileChange}
        accept="application/pdf"
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
      <p className="text-sm text-muted-foreground text-center">
        {files.length > 0 ? (
          <span className="font-medium text-foreground">{files[0].name}</span>
        ) : (
          <span>Drop your PDF here or click to browse.</span>
        )}
      </p>
    </div>
  );
}
