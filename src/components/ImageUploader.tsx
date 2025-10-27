import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onSearchClick: () => void;
}

export const ImageUploader = ({ onImageSelect, onSearchClick }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const clearImage = () => {
    setPreview(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300",
          isDragging ? "border-primary bg-primary/5 scale-105" : "border-border",
          preview ? "p-0" : ""
        )}
      >
        {!preview ? (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-12 h-12 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">Drop your image here</p>
              <p className="text-muted-foreground text-sm mb-4">or click to browse</p>
            </div>
            <label htmlFor="file-upload">
              <Button variant="hero" size="lg" className="cursor-pointer" asChild>
                <span>Choose File</span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto rounded-2xl"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={clearImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {preview && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="hero"
            size="lg"
            onClick={onSearchClick}
            className="px-12"
          >
            Find Similar Products
          </Button>
        </div>
      )}
    </div>
  );
};
