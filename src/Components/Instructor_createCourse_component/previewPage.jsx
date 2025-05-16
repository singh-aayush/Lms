function PreviewModal({ courseData, coverImage, onClose }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB'); // dd/mm/yyyy
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm px-4">
      <div className="relative bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl shadow-xl p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
          aria-label="Close preview"
        >
          ✕
        </button>

        {/* Cover Image */}
        <div className="w-full h-52 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center mb-5">
          {coverImage ? (
            <img
              src={coverImage}
              alt="Preview Cover"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-gray-500">No Cover Image</div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-800 mb-1">
          {courseData.courseTitle || 'Untitled Course'}
        </h2>
        <p className="text-sm text-gray-600 mb-4 border-b pb-2">
          <strong>Author:</strong> {courseData.author || 'N/A'}<br />
          <strong>Instructor:</strong> {courseData.instructor || 'N/A'}<br />
          <strong>Language:</strong> {courseData.language || 'English'} &nbsp;|&nbsp;
          <strong>Category:</strong> {courseData.category || 'N/A'}
        </p>

        {/* Description */}
        <div className="mb-4">
          <h3 className="font-medium text-gray-800 mb-1">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap text-sm p-3 ">
            {courseData.description || 'No description provided.'}
          </p>
        </div>

        {/* Dates & Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 border-t pt-4">
          <p><strong>Start Date:</strong> {formatDate(courseData.startDate)}</p>
          <p><strong>End Date:</strong> {formatDate(courseData.endDate)}</p>
          <p><strong>Lessons:</strong> {courseData.lessons || 0}</p>
          <p><strong>Duration:</strong> {courseData.duration || 0} hours</p>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;
