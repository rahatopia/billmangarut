import imageCompression from "browser-image-compression";

export async function compressImage(
  file: File
) {

  const options = {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
  };

  return await imageCompression(
    file,
    options
  );
}