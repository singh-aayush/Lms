import { useState, useEffect } from 'react';
import GeneralInfo from './generalInfo';
// import Contents from './contents_components/contents';
// import PublishPage from './publishPage'
import PreviewModal from './previewPage';
// import Assignment from "../Instructor_addAssignments_component/addAssignments";

function CreateCourse() {
  const [activeTab, setActiveTab] = useState('General');
  const [coverImage, setCoverImage] = useState(null);

  // Use new course fields based on your API schema
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [language, setLanguage] = useState('English');
  const [level, setLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [prerequisites, setPrerequisites] = useState([]);
  const [learningOutcomes, setLearningOutcomes] = useState([]);

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
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-10 py-[5px]">
      {/* Cover Image Upload */}
      {/* <div className="relative w-full h-48 sm:h-60 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
        {coverImage ? (
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500 text-sm sm:text-base">Upload cover</span>
        )}
        <label className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-md text-sm cursor-pointer shadow-md hover:bg-gray-100 transition">
          Upload cover
          <input type="file" onChange={handleCoverChange} className="hidden" />
        </label>
      </div> */}

      {/* Course Form Container */}
      <div className="w-full mx-auto bg-white  p-4 sm:p-6 rounded-xl shadow-md">
        {/* Title input moved to GeneralInfo */}
        
        {/* Tabs */}
        {/* <div className="flex flex-wrap sm:space-x-6 border-b">
          {['General'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 pr-4 sm:pr-0 border-b-2 text-sm sm:text-base cursor-pointer ${
                activeTab === tab
                  ? 'border-teal-600 text-teal-600 font-medium'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div> */}

        {/* Conditional Rendering */}
        {activeTab === 'General' && (
          <GeneralInfo
            title={title}
            setTitle={setTitle}
            subtitle={subtitle}
            setSubtitle={setSubtitle}
            description={description}
            setDescription={setDescription}
            category={category}
            setCategory={setCategory}
            subCategory={subCategory}
            setSubCategory={setSubCategory}
            language={language}
            setLanguage={setLanguage}
            level={level}
            setLevel={setLevel}
            duration={duration}
            setDuration={setDuration}
            price={price}
            setPrice={setPrice}
            discountPrice={discountPrice}
            setDiscountPrice={setDiscountPrice}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            learningOutcomes={learningOutcomes}
            setLearningOutcomes={setLearningOutcomes}
            onPreview={() => setShowPreview(true)}
          />
        )}

        {/* {activeTab === 'Contents' && <Contents />} */}
        {/* {activeTab === 'Assignment' && <Assignment />}
        {activeTab === 'Publish-Page' && <PublishPage />} */}
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
