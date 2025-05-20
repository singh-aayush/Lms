import React from "react";

const FilePreview = ({ file, onDelete }) => {
  if (!file) return null;

  const { type, name, url } = file;

  return (
    <div className="border rounded-md p-3 shadow-sm bg-gray-50 relative">
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 w-[20px] h-[20px] text-white bg-black hover:text-black hover:bg-white text-sm cursor-pointer"
        >
          ✖
        </button>
      )}

      {/* Video preview */}
      {type === "video" && (
        <video
          controls
          className="w-full h-40 object-cover rounded-md mb-2"
          src={url}
        />
      )}

      {/* PDF preview */}
      {type === "pdf" && (
        <div className="h-40 overflow-hidden flex items-center justify-center bg-white border rounded-md mb-2">
          <embed src={url} type="application/pdf" width="100%" height="100%" />
        </div>
      )}

      {/* Image preview */}
      {type === "image" && (
        <img
          src={url}
          alt={name}
          className="w-full h-40 object-cover rounded-md mb-2"
        />
      )}

      {/* File name */}
      <p className="text-sm truncate text-center">{name}</p>
    </div>
  );
};

export default FilePreview;
