"use client";

// REACT //
import Cropper, { Area } from "react-easy-crop";
import { useCallback, useEffect, useRef, useState } from "react";

// COMPONENTS //
import { Button } from "@/components/ui/button";
import Paperclip1 from "@/components/icons/neevo-icons/Paperclip1";
import Add1 from "@/components/icons/neevo-icons/Add1";

// NEXT //
import Image from "next/image";

interface ImageUploadProps {
  /** Callback when image is cropped */
  onImageCropped?: (base64Image: string) => void;

  /** Existing image */
  imageUrl?: string;

  /** Fallback initials */
  avatarLabel?: string;
}

export default function ImageUpload({
  onImageCropped,
  imageUrl,
  avatarLabel = "RS",
}: ImageUploadProps) {
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);

  // States
  const [image, setImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });

  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  // Open gallery
  const openGallery = () => {
    inputRef.current?.click();
  };

  // Crop complete
  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // File select
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(URL.createObjectURL(file));
  };

  // Create cropped image
  const createCroppedImage = async () => {
    if (!image) return;

    const img = await createImage(image);

    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
    );

    const base64 = canvas.toDataURL("image/jpeg");

    setCroppedImage(base64);

    onImageCropped?.(base64);

    setImage(null);
  };

  // Sync external image
  useEffect(() => {
    queueMicrotask(() => {
      setCroppedImage(imageUrl || null);
    });
  }, [imageUrl]);

  return (
    <>
      {/* Profile Section */}
      <div className="flex flex-col items-center gap-2">
        {/* Avatar */}
        <div
          onClick={openGallery}
          className="relative flex size-24 cursor-pointer items-center justify-center"
        >
          {/* Circle Wrapper */}
          <div className="relative h-full w-full overflow-hidden rounded-full border border-blue-300 bg-blue-100">
            {croppedImage ? (
              <Image
                src={croppedImage}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <p className="font-primary text-3xl font-semibold text-blue-600">
                  {avatarLabel}
                </p>
              </div>
            )}
          </div>

          {/* Remove Button */}
          {croppedImage && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();

                setCroppedImage(null);

                setImage(null);

                onImageCropped?.("");
              }}
              className="bg-n-100 border-n-300 absolute -right-1 bottom-0 z-20 flex size-8 items-center justify-center rounded-full border shadow-sm"
            >
              <Add1
                primaryColor="var(--color-n-700)"
                className="size-3 rotate-45"
              />
            </button>
          )}
        </div>

        {/* Change Photo Button */}
        <Button
          type="button"
          variant="secondary"
          onClick={openGallery}
          className="border-n-300 bg-n-100 h-auto w-auto gap-2 rounded-[7px] px-[13px] py-[9px] text-xs"
        >
          <Paperclip1 primaryColor="var(--color-n-700)" className="size-4" />
          Change Photo
        </Button>
      </div>

      {/* Crop Modal */}
      {image && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/70 p-4">
          <div className="relative h-[60vh] w-full max-w-md overflow-hidden rounded-xl bg-black">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <Button type="button" variant="primary" onClick={createCroppedImage}>
            Crop & Save
          </Button>
        </div>
      )}

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFile}
      />
    </>
  );
}

/* Helper */
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();

    img.src = url;

    img.onload = () => resolve(img);

    img.onerror = reject;
  });
}
