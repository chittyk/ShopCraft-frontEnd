export const getCroppedImg = async (imageSrc, cropPixels) => {
  const image = new Image();
  image.src = imageSrc;

  await new Promise(resolve => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height
  );

  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
    }, "image/jpeg");
  });
};
