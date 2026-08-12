const createImage = (source) =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);

    image.setAttribute("crossOrigin", "anonymous");
    image.src = source;
  });

const getCroppedImage = async (imageSource, cropArea) => {
  const image = await createImage(imageSource);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to prepare image crop");
  }

  const outputSize = 600;

  canvas.width = outputSize;
  canvas.height = outputSize;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  context.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to crop the selected image"));
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      0.9
    );
  });
};

export default getCroppedImage;
