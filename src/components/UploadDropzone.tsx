"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";

export default function MediaUploader({
  onFilesChange,
}: {
  onFilesChange?: (files: File[]) => void;
}) {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);

  //TODO:upload files to Supabase Storage

  const onDrop = useCallback(
    (acceptedFilesFromDropzone: File[]) => {
      const newFiles = [...acceptedFiles, ...acceptedFilesFromDropzone];
      setAcceptedFiles(newFiles);
      onFilesChange?.(newFiles);
    },
    [acceptedFiles, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    noClick: true, // disables automatic open on click (we control it via the Browse button)
    noKeyboard: true, // disables keyboard events on root
  });

  const removeFile = (fileName: string) => {
    const updated = acceptedFiles.filter((file) => file.name !== fileName);
    setAcceptedFiles(updated);
    onFilesChange?.(updated);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className="border border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-accent transition-colors"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <UploadCloud className="h-10 w-10" />

          {isDragActive ? (
            <p className="text-sm text-muted-foreground">
              Drop the file here ...
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Drag and drop an image or video, or click to browse
              </p>
              <Button
                variant="secondary"
                className="mt-2"
                type="button"
                onClick={open}
              >
                Browse Files
              </Button>
            </>
          )}
        </div>
      </div>

      {acceptedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {acceptedFiles.map((file) => (
            <div
              key={file.name}
              className="text-sm border flex flex-row justify-between items-center rounded-xl p-2 px-4"
            >
              <div className="flex flex-row items-center gap-3">
                <Image
                  src="/attach-file.png"
                  width={20}
                  height={20}
                  alt="file icon"
                />
                <div className="text-left">
                  <span className="block font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              </div>
              <X
                className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive"
                onClick={() => removeFile(file.name)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
