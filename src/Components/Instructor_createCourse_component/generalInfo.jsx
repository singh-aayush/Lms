import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PreviewModal({ courseData, onClose }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-white/40 backdrop-blur-sm px-2 sm:px-4">
      <div className="relative bg-white w-full max-w-xl sm:max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl shadow-xl p-4 sm:p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 sm:top-3 right-2 sm:right-3 text-gray-500 hover:text-gray-700 text-lg sm:text-xl cursor-pointer"
          aria-label="Close preview"
        >
          ✕
        </button>

        {/* Title & Subtitle */}
        <h2 className="text-lg sm:text-2xl font-bold text-slate-800 mb-1">
          {courseData.title || 'Untitled Course'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 border-b pb-2">
          <strong>Subtitle:</strong> {courseData.subtitle || 'N/A'}<br />
          <strong>Language:</strong> {courseData.language || 'N/A'} |{' '}
          <strong>Category:</strong> {courseData.category || 'N/A'} |{' '}
          <strong>Subcategory:</strong> {courseData.subCategory || 'N/A'}
        </p>

        {/* Description */}
        <div className="mb-3 sm:mb-4">
          <h3 className="font-medium text-gray-800 mb-1 text-sm sm:text-base">
            Description
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap text-xs sm:text-sm p-2 sm:p-3 bg-gray-50 rounded-lg">
            {courseData.description || 'No description provided.'}
          </p>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-700 border-t pt-3 sm:pt-4">
          <p>
            <strong>Level:</strong> {courseData.level || 'N/A'}
          </p>
          <p>
            <strong>Duration:</strong> {courseData.duration || 0} hours
          </p>
          <p>
            <strong>Price:</strong> ₹{courseData.price || 0}
          </p>
          <p>
            <strong>Discount Price:</strong> ₹{courseData.discountPrice || 0}
          </p>
        </div>

        {/* Prerequisites */}
        <div className="mt-3 sm:mt-4">
          <h3 className="font-medium text-gray-800 mb-1 text-sm sm:text-base">
            Prerequisites
          </h3>
          {courseData.prerequisites?.length > 0 ? (
            <ul className="list-disc pl-4 text-xs sm:text-sm text-gray-700">
              {courseData.prerequisites.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs sm:text-sm text-gray-700">
              No prerequisites provided.
            </p>
          )}
        </div>

        {/* Learning Outcomes */}
        <div className="mt-3 sm:mt-4">
          <h3 className="font-medium text-gray-800 mb-1 text-sm sm:text-base">
            Learning Outcomes
          </h3>
          {courseData.learningOutcomes?.length > 0 ? (
            <ul className="list-disc pl-4 text-xs sm:text-sm text-gray-700">
              {courseData.learningOutcomes.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs sm:text-sm text-gray-700">
              No learning outcomes provided.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function GeneralInfo({
  title,
  setTitle,
  subtitle,
  setSubtitle,
  description,
  setDescription,
  category,
  setCategory,
  subCategory,
  setSubCategory,
  language,
  setLanguage,
  level,
  setLevel,
  duration,
  setDuration,
  price,
  setPrice,
  discountPrice,
  setDiscountPrice,
  prerequisites,
  setPrerequisites,
  learningOutcomes,
  setLearningOutcomes,
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const navigate = useNavigate();

  // State to hold the raw input strings for prerequisites and learning outcomes
  const [prerequisitesInput, setPrerequisitesInput] = useState(prerequisites?.join(', ') || '');
  const [learningOutcomesInput, setLearningOutcomesInput] = useState(learningOutcomes?.join(', ') || '');

  // Handle input changes for prerequisites and learning outcomes
  const handleArrayInput = (value, setter) => {
    const items = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    setter(items);
  };

  // Save course data to backend
  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Authorization token is missing.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://lms-backend-flwq.onrender.com/api/v1/instructors/courses',
        {
          title,
          subtitle,
          description,
          category,
          subCategory,
          language,
          level,
          duration,
          price,
          discountPrice,
          prerequisites,
          learningOutcomes,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessage('Course saved successfully!');
        navigate('/dashboard/my-courses');
      } else {
        setMessage('Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Failed to save course.');
    } finally {
      setLoading(false);
    }
  };

  // Open preview modal
  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
      {/* Preview Modal */}
      {isPreviewOpen && (
        <PreviewModal
          courseData={{
            title,
            subtitle,
            description,
            category,
            subCategory,
            language,
            level,
            duration,
            price,
            discountPrice,
            prerequisites,
            learningOutcomes,
          }}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

      {/* Title & Subtitle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Course Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Learn TypeScript"
            className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-teal-600 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Course Subtitle
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g. Build complex applications with Typescript"
            className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-teal-600 outline-none"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Course Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write course description..."
          rows={4}
          className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm resize-none focus:ring-2 focus:ring-teal-600 outline-none"
        />
      </div>

      {/* Category & Subcategory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Web Development"
            className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-teal-600 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Subcategory
          </label>
          <input
            type="text"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            placeholder="e.g. React"
            className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-teal-600 outline-none"
          />
        </div>
      </div>

      {/* Language & Level */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-teal-600 outline-none"
          >
            <option value="">Select Language</option>
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-teal-600 outline-none"
          >
            <option value="">Select Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Duration, Price & Discount Price */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Duration (hrs)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min={1}
            placeholder="1"
            className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-teal-600 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Price (₹)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min={0}
            placeholder="0"
            className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-teal-600 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Discount Price (₹)
          </label>
          <input
            type="number"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(Number(e.target.value))}
            min={0}
            placeholder="0"
            className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-teal-600 outline-none"
          />
        </div>
      </div>

      {/* Prerequisites & Learning Outcomes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Prerequisites (comma separated)
          </label>
          <input
            type="text"
            value={prerequisitesInput}
            onChange={(e) => {
              setPrerequisitesInput(e.target.value);
              handleArrayInput(e.target.value, setPrerequisites);
            }}
            placeholder="e.g. Basic JavaScript, React Basics"
            className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-teal-600 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Learning Outcomes (comma separated)
          </label>
          <input
            type="text"
            value={learningOutcomesInput}
            onChange={(e) => {
              setLearningOutcomesInput(e.target.value);
              handleArrayInput(e.target.value, setLearningOutcomes);
            }}
            placeholder="e.g. Build scalable apps, Master state"
            className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-teal-600 outline-none"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-teal-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-teal-700 disabled:opacity-50 text-xs sm:text-sm"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={handlePreview}
          className="border border-teal-600 text-teal-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-teal-50 text-xs sm:text-sm"
        >
          Preview
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <p
          className={`mt-3 sm:mt-4 text-xs sm:text-sm ${
            message.includes('successfully')
              ? 'text-green-600'
              : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default GeneralInfo;