import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import placeholderImages from "@/lib/placeholder-images.json";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

interface PhotoUploadProps {
  value?: File | string;
  onChange: (file?: File | string) => void;
}

const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize keeping aspect ratio
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Fill with white background in case of transparent PNG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          // Export as compressed JPEG
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(event.target?.result as string); // Fallback
        }
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof value === 'string') {
        setPreview(value);
    } else if (value instanceof File) {
        const objectUrl = URL.createObjectURL(value);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    } else {
        setPreview(null);
    }
  }, [value]);

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      fileRejections.forEach(({ errors }) => {
        errors.forEach((err: any) => {
          if (err.code === 'file-too-large') {
            toast({ title: t("form.validation.file_size_limit"), variant: "destructive" });
          }
          if (err.code === 'file-invalid-type') {
            toast({ title: t("form.validation.invalid_file_type"), variant: "destructive" });
          }
        });
      });
      return;
    }

    if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        // Use the new compressImage function to drastically reduce string size before saving to MongoDB
        const compressedBase64 = await compressImage(file, 800, 0.7); 
        onChange(compressedBase64);
    }
  }, [onChange, t, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    maxSize: MAX_SIZE,
    multiple: false,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  const defaultAvatar = placeholderImages.placeholderImages.find(p => p.id === 'user-avatar')?.imageUrl;

  return (
    <div
      {...getRootProps()}
      className="relative group w-32 h-32 mx-auto border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer transition-colors hover:border-primary hover:bg-accent/10"
    >
      <input {...getInputProps()} />
      {preview ? (
        <>
          <img
            src={preview}
            alt="Profile Preview"
            width={128}
            height={128}
            className="rounded-full object-cover w-full h-full"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-0 right-0 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <div className="text-center text-muted-foreground">
          <Camera className="mx-auto h-8 w-8" />
          <p className="mt-1 text-xs">{t('personal.upload_prompt')}</p>
        </div>
      )}
    </div>
  );
}
