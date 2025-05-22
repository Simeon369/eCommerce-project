import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const ImageUpload = ({ onImageCropped }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const cropToSquare = (img) => {
    const canvas = document.createElement("canvas");
    const size = Math.min(img.width, img.height);
    const offsetX = (img.width - size) / 2;
    const offsetY = (img.height - size) / 2;

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
        setPreviewUrl(URL.createObjectURL(blob));
        onImageCropped(file);
        resolve();
      }, "image/jpeg");
    });
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => cropToSquare(img);
    };
    reader.readAsDataURL(file);
  }, [onImageCropped]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div className="w-full p-4 border-2 border-dashed rounded-xl border-gray-300">
      <div
        {...getRootProps()}
        className="flex items-center justify-center h-32 bg-gray-100 cursor-pointer rounded-xl"
      >
        <input {...getInputProps()} />
        <p className="text-gray-500 text-center">
          Drag & drop or click to upload (auto square crop)
        </p>
      </div>

      {previewUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">Auto-Cropped Preview:</p>
          <img
            src={previewUrl}
            alt="Cropped"
            className="w-32 h-32 object-cover rounded border mt-2"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
