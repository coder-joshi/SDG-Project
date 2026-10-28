import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface PhotoUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
  error?: string;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  images,
  onChange,
  maxFiles = 5,
  error
}) => {
  const [fileError, setFileError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setFileError(null);

      if (rejectedFiles && rejectedFiles.length > 0) {
        const firstRejection = rejectedFiles[0];
        if (firstRejection.errors[0]?.code === 'file-too-large') {
          setFileError('File size exceeds the 5MB limit.');
        } else if (firstRejection.errors[0]?.code === 'file-invalid-type') {
          setFileError('Only JPG or PNG images are supported.');
        } else {
          setFileError(firstRejection.errors[0]?.message || 'Invalid file.');
        }
        return;
      }

      if (images.length + acceptedFiles.length > maxFiles) {
        setFileError(`You can upload a maximum of ${maxFiles} evidence photos.`);
        return;
      }

      const newUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
      onChange([...images, ...newUrls]);
    },
    [images, maxFiles, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: images.length >= maxFiles
  });

  const removePhoto = (indexToRemove: number) => {
    onChange(images.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      {/* Dropzone container */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-emerald-600 bg-emerald-50/50'
            : images.length >= maxFiles
            ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-75'
            : 'border-slate-300 hover:border-emerald-500 bg-white'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {isDragActive
                ? 'Drop the evidence photos here'
                : 'Drag & drop photos or click to browse'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              JPG or PNG, max 5MB each (up to {maxFiles} images)
            </p>
          </div>
          <div className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1">
            {images.length} / {maxFiles} uploaded
          </div>
        </div>
      </div>

      {/* Errors */}
      {(fileError || error) && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{fileError || error}</span>
        </div>
      )}

      {/* Thumbnails Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="group relative rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-100 shadow-sm"
            >
              <img
                src={url}
                alt={`Evidence proof ${idx + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(idx);
                }}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full flex items-center justify-center transition-colors shadow"
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-slate-900/60 text-white text-[10px] px-1.5 py-0.5 truncate text-center">
                Photo {idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
