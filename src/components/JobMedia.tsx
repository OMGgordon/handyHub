import { useState } from "react";

const JobMedia = ({ uploaded_files }: { uploaded_files: string[] }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div>
      <p className="text-[14px] lg:text-[16px] text-black leading-[20px] lg:leading-[24px] mb-3">
        Job Media:
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {uploaded_files.map((file, index) => (
          <div
            key={index}
            className="aspect-square rounded-[6px] overflow-hidden bg-gray-100 cursor-pointer"
            onClick={() => setSelectedImage(file)}
          >
            <img
              src={file}
              alt={`Job media ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        ))}
      </div>

      <p className="text-[12px] text-gray-600 mt-2">
        Click to images to view on a larger scale
      </p>

      {/* Fullscreen overlay */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50  bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Selected job media"
            className="w-4/5 h-4/5 object-contain rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default JobMedia;
