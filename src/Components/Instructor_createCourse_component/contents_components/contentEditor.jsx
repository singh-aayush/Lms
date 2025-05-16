import React, { useState } from "react";
import FilePreview from "./filePreview";
import { FaEdit } from "react-icons/fa";

const TopicEditor = ({ topic, updateTopic }) => {
  const [title, setTitle] = useState(topic.title || "");
  const [type, setType] = useState(topic.type || "Theory");
  const [desc, setDesc] = useState(topic.description || "");
  const [resources, setResources] = useState(topic.resources || []);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const uploaded = files.map((file) => ({
      type: file.type.includes("video")
        ? "video"
        : file.type.includes("pdf")
        ? "pdf"
        : "image",
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    const newResources = [...resources, ...uploaded];
    setResources(newResources);
  };

  const handleSave = () => {
    updateTopic({
      title,
      type,
      description: desc,
      resources,
    });
  };

  return (
    <div className="py-4 px-0 bg-white rounded-md space-y-6">

      {/* Title input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md p-3 pr-10 text-lg font-medium"
        />
        {/* <FaEdit className="absolute top-3.5 right-3 text-gray-400 cursor-pointer" /> */}
      </div>

      {/* Unit type & topic select */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium">Unit type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full mt-1 border p-2 rounded-md"
          >
            <option value="Theory">Video Lecture</option>
            <option value="Practical">Theory</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium">Topic</label>
          <select
            className="w-full mt-1 border p-2 rounded-md"
            disabled
            value=""
          >
            <option>No topics yet</option>
          </select>
        </div>
      </div>

      {/* Description input */}
      <div className="relative">
        <textarea
          rows="3"
          placeholder="Unit description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full border rounded-md p-3 pr-10"
        />
        {/* <FaEdit className="absolute top-3.5 right-3 text-gray-400 cursor-pointer" /> */}
      </div>

      {/* Upload buttons (conditionally rendered) */}
      <div className="flex flex-wrap gap-4">
        {/* Only for Theory */}
        {type === "Theory" && (
          <label className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 cursor-pointer hover:bg-gray-50">
            📹 Add video
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        )}

        {/* Common file upload for all types */}
        <label className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 cursor-pointer hover:bg-gray-50">
          📁 Add files
          <input
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>

        {/* Only for Theory */}
        {type === "Theory" && (
          <>
            <button className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50">
              🔗 Add link
            </button>
          </>
        )}
      </div>

      {/* Resource preview (optional display) */}
      {resources.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {resources.map((file, idx) => (
            <FilePreview key={idx} file={file} />
          ))}
        </div>
      )}

      {/* Save button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default TopicEditor;
