import { useState, useEffect } from 'react';
import GeneralInfo from './generalInfo';
import Contents from './contents_components/contents';
import PreviewModal from './previewPage';
import Assignment from "../Instructor_addAssignments_component/addAssignments";

function CreateCourse() {
  const [activeTab, setActiveTab] = useState('General');
  const [coverImage, setCoverImage] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [instructor, setInstructor] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('English');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [lessons, setLessons] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showPreview ? 'hidden' : 'auto';
  }, [showPreview]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(URL.createObjectURL(file));
    }
  };

  const courseData = {
    courseTitle, author, instructor, category,
    language, description, startDate, endDate, lessons, duration,
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-10 py-6">
      {/* Cover Image Upload */}
      <div className="relative w-full h-48 sm:h-60 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
        {coverImage ? (
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500 text-sm sm:text-base">Upload cover</span>
        )}
        <label className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-md text-sm cursor-pointer shadow-md hover:bg-gray-100 transition">
          Upload cover
          <input type="file" onChange={handleCoverChange} className="hidden" />
        </label>
      </div>

      {/* Course Form Container */}
      <div className="w-full sm:w-[95%] md:w-[90%] mx-auto bg-white mt-6 p-4 sm:p-6 rounded-xl shadow-md">
        <input
          type="text"
          placeholder="Introduce the course title"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          className="w-full text-lg sm:text-xl md:text-2xl font-semibold text-slate-800 border p-2 rounded-md focus:ring-0 mb-6"
        />

        {/* Tabs */}
        <div className="flex flex-wrap sm:space-x-6 border-b">
          {['General', 'Contents', 'Assignment'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 pr-4 sm:pr-0 border-b-2 text-sm sm:text-base cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#49BBBD] text-teal-600 font-medium'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Conditional Rendering */}
        {activeTab === 'General' && (
          <GeneralInfo
            author={author}
            setAuthor={setAuthor}
            instructor={instructor}
            setInstructor={setInstructor}
            category={category}
            setCategory={setCategory}
            language={language}
            setLanguage={setLanguage}
            description={description}
            setDescription={setDescription}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            lessons={lessons}
            setLessons={setLessons}
            duration={duration}
            setDuration={setDuration}
            onPreview={() => setShowPreview(true)}
            onSave={() => {
              console.log('Course data to save:', {
                courseTitle, author, instructor, category,
                language, description, startDate, endDate, lessons, duration,
              });
            }}
          />
        )}

        {activeTab === 'Contents' && <Contents />}
        {activeTab === 'Assignment' && <Assignment />}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          courseData={courseData}
          coverImage={coverImage}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

export default CreateCourse;
