import { useEffect, useMemo, useRef, useState } from "react";
import { getAdminProfileImageUrl } from "../utils/adminProfileImage";

const CROP_SIZE = 260;
const OUTPUT_SIZE = 600;

const clamp = (value, minimum, maximum) => {
  return Math.min(maximum, Math.max(minimum, value));
};

const getGeometry = (image, zoom, position) => {
  if (!image) {
    return null;
  }

  const baseScale = Math.max(
    CROP_SIZE / image.width,
    CROP_SIZE / image.height
  );

  const scale = baseScale * zoom;
  const displayWidth = image.width * scale;
  const displayHeight = image.height * scale;

  const maxX = Math.max(0, (displayWidth - CROP_SIZE) / 2);
  const maxY = Math.max(0, (displayHeight - CROP_SIZE) / 2);

  const safePosition = {
    x: clamp(position.x, -maxX, maxX),
    y: clamp(position.y, -maxY, maxY),
  };

  return {
    scale,
    displayWidth,
    displayHeight,
    maxX,
    maxY,
    position: safePosition,
  };
};

const AdminProfileImageCropper = ({
  currentImage,
  fullName,
  uploading,
  onUpload,
}) => {
  const fileInputRef = useRef(null);
  const dragStateRef = useRef(null);

  const [sourceUrl, setSourceUrl] = useState("");
  const [image, setImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (sourceUrl.startsWith("blob:")) {
        URL.revokeObjectURL(sourceUrl);
      }
    };
  }, [sourceUrl]);

  const geometry = useMemo(
    () => getGeometry(image, zoom, position),
    [image, position, zoom]
  );

  const displayedPosition = geometry?.position || position;
  const currentImageUrl = getAdminProfileImageUrl(currentImage);

  const profileInitial = fullName?.trim().charAt(0).toUpperCase() || "U";

  const resetCrop = () => {
    setSourceUrl("");
    setImage(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 8 * 1024 * 1024) {
      setError("Selected image must be smaller than 8 MB");
      event.target.value = "";
      return;
    }

    const nextUrl = URL.createObjectURL(selectedFile);

    setSourceUrl(nextUrl);
    setImage(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setError("");
  };

  const handleImageLoad = (event) => {
    setImage({
      width: event.currentTarget.naturalWidth,
      height: event.currentTarget.naturalHeight,
      element: event.currentTarget,
    });
  };

  const handleZoomChange = (event) => {
    const nextZoom = Number(event.target.value);
    const nextGeometry = getGeometry(image, nextZoom, position);

    setZoom(nextZoom);

    if (nextGeometry) {
      setPosition(nextGeometry.position);
    }
  };

  const handlePointerDown = (event) => {
    if (!geometry) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      position: displayedPosition,
    };
  };

  const handlePointerMove = (event) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId || !geometry) {
      return;
    }

    const nextPosition = {
      x: dragState.position.x + event.clientX - dragState.startX,
      y: dragState.position.y + event.clientY - dragState.startY,
    };

    setPosition({
      x: clamp(nextPosition.x, -geometry.maxX, geometry.maxX),
      y: clamp(nextPosition.y, -geometry.maxY, geometry.maxY),
    });
  };

  const stopDragging = (event) => {
    if (dragStateRef.current?.pointerId === event.pointerId) {
      dragStateRef.current = null;
    }
  };

  const createCroppedFile = async () => {
    if (!image || !geometry) {
      throw new Error("Image is not ready");
    }

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Image crop is not supported");
    }

    const displayLeft =
      (CROP_SIZE - geometry.displayWidth) / 2 + displayedPosition.x;
    const displayTop =
      (CROP_SIZE - geometry.displayHeight) / 2 + displayedPosition.y;

    const sourceX = -displayLeft / geometry.scale;
    const sourceY = -displayTop / geometry.scale;
    const sourceSize = CROP_SIZE / geometry.scale;

    context.drawImage(
      image.element,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE
    );

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.9);
    });

    if (!blob) {
      throw new Error("Unable to crop image");
    }

    return new File([blob], `admin-profile-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });
  };

  const handleCropUpload = async () => {
    try {
      setError("");
      const croppedFile = await createCroppedFile();
      await onUpload(croppedFile);
      resetCrop();
    } catch (uploadError) {
      setError(uploadError?.message || "Unable to crop profile picture");
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-lg font-bold text-blue-700 sm:h-20 sm:w-20">
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt={fullName || "Profile"}
              className="h-full w-full object-cover"
            />
          ) : (
            profileInitial
          )}
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900 sm:text-base">
            Profile Photo
          </h2>
          <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
            Select an image, drag to position and zoom before uploading.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 rounded-md border border-blue-200 px-3 py-1.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-50 sm:text-xs"
          >
            Choose Picture
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {sourceUrl && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            className="relative mx-auto cursor-move touch-none overflow-hidden rounded-xl bg-slate-900"
            style={{
              width: CROP_SIZE,
              height: CROP_SIZE,
              maxWidth: "100%",
            }}
          >
            <img
              src={sourceUrl}
              alt="Crop preview"
              onLoad={handleImageLoad}
              draggable="false"
              className="pointer-events-none absolute max-w-none select-none"
              style={
                geometry
                  ? {
                      width: geometry.displayWidth,
                      height: geometry.displayHeight,
                      left:
                        (CROP_SIZE - geometry.displayWidth) / 2 +
                        displayedPosition.x,
                      top:
                        (CROP_SIZE - geometry.displayHeight) / 2 +
                        displayedPosition.y,
                    }
                  : undefined
              }
            />
            <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-white/80 shadow-[0_0_0_999px_rgba(0,0,0,0.35)]" />
          </div>

          <label className="mx-auto mt-3 block max-w-sm">
            <span className="mb-1 block text-[10px] font-semibold text-slate-600 sm:text-xs">
              Zoom
            </span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={handleZoomChange}
              className="w-full"
            />
          </label>

          <div className="mt-3 flex justify-center gap-2">
            <button
              type="button"
              onClick={resetCrop}
              disabled={uploading}
              className="rounded-md border border-slate-300 px-3 py-2 text-[10px] font-semibold text-slate-700 disabled:opacity-50 sm:text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCropUpload}
              disabled={uploading || !image}
              className="rounded-md bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white disabled:opacity-50 sm:text-xs"
            >
              {uploading ? "Uploading..." : "Crop & Upload"}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-md bg-red-50 px-2.5 py-2 text-[10px] text-red-700 sm:text-xs">
          {error}
        </p>
      )}
    </section>
  );
};

export default AdminProfileImageCropper;