import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Check, ImageIcon, X } from "lucide-react";

import getCroppedImage from "../../utils/getCroppedImage";

const ProfileImageCropModal = ({
  imageSource,
  onClose,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCropAreaComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApplyCrop = async () => {
    if (!croppedAreaPixels) {
      return;
    }

    setErrorMessage("");
    setIsProcessing(true);

    try {
      const croppedBlob = await getCroppedImage(
        imageSource,
        croppedAreaPixels
      );

      const croppedFile = new File(
        [croppedBlob],
        `profile-${Date.now()}.jpg`,
        { type: "image/jpeg" }
      );

      onCropComplete(croppedFile);
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to crop the selected image"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5 lg:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-profile-photo-title"
    >
      <div className="flex max-h-[calc(100dvh-24px)] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-40px)] sm:rounded-3xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5 sm:py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-600 sm:text-xs">
              Profile picture
            </p>

            <h2
              id="crop-profile-photo-title"
              className="mt-1 truncate text-base font-bold text-slate-950 sm:text-lg"
            >
              Select and crop picture area
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-3 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            aria-label="Close image crop"
          >
            <X size={17} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="relative h-[min(52dvh,360px)] min-h-[240px] overflow-hidden rounded-xl bg-slate-950 sm:h-[min(56dvh,400px)] sm:rounded-2xl">
            <Cropper
              image={imageSource}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropAreaComplete}
            />
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="profile-photo-zoom"
                className="flex items-center gap-2 text-xs font-semibold text-slate-700 sm:text-sm"
              >
                <ImageIcon size={15} className="text-sky-600" />
                Zoom picture
              </label>

              <span className="text-xs font-semibold text-slate-500">
                {zoom.toFixed(1)}x
              </span>
            </div>

            <input
              id="profile-photo-zoom"
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="mt-2 w-full accent-sky-600"
            />
          </div>

          {errorMessage && (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 sm:text-sm">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-slate-200 bg-white p-3 sm:p-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="min-h-10 rounded-xl border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 sm:text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={isProcessing || !croppedAreaPixels}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 text-xs font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
          >
            <Check size={16} />
            {isProcessing ? "Processing..." : "Use photo"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageCropModal;