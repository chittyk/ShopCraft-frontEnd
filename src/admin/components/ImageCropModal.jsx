import Cropper from "react-easy-crop";
import { useState } from "react";
import { getCroppedImg } from "../utils/cropImage";

const ImageCropModal = ({ image, onClose, onCropDone }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState(null);

  const handleDone = async () => {
    const croppedFile = await getCroppedImg(image, cropPixels);
    onCropDone(croppedFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#0b0f1a] w-[90%] max-w-lg rounded-xl p-4">

        <div className="relative h-[300px] bg-black">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setCropPixels(pixels)}
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded-lg text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="px-4 py-2 bg-gray-600 rounded-lg text-gray-100"
          >
            Crop & Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default ImageCropModal;
