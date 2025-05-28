import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronDown, HelpCircle, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function CoursePlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [courseTitle, setCourseTitle] = useState('Course Player');
  const [instructorName, setInstructorName] = useState('Unknown Instructor');
  const [courses, setCourses] = useState([]);
  const [activeLecture, setActiveLecture] = useState({ moduleIndex: null, lessonIndex: null });
  const [assessments, setAssessments] = useState([]);
  const [isAssessmentsModalOpen, setIsAssessmentsModalOpen] = useState(false);
  const [isHelpSidebarOpen, setIsHelpSidebarOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [assessmentsError, setAssessmentsError] = useState('');
  const [contentError, setContentError] = useState('');
  const [form, setForm] = useState({
    name: '',
    subject: '',
    message: '',
    category: 'course',
    relatedCourse: courseId || '',
  });
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: '',
  });
  // const [feedbackLoading, setFeedbackLoading] = useState(false);
  // const [feedbackSuccess, setFeedbackSuccess] = useState('');
  // const [feedbackError, setFeedbackError] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [successMsg, setSuccessMsg] = useState('');
  // const [errorMsg, setErrorMsg] = useState('');
  // const [contactCourses, setContactCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added for loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
  
        const [courseRes, enrollmentRes, coursesRes, assessmentsRes, profileRes] = await Promise.all([
          axios.get(`https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch((err) => ({ data: { success: false }, error: err })),
          axios.get('https://lms-backend-flwq.onrender.com/api/v1/students/courses', {
            headers: { Authorization: `Bearer ${token}` },
          }).catch((err) => ({ data: { success: false }, error: err })),
          axios.get('https://lms-backend-flwq.onrender.com/api/v1/courses', {
            headers: { Authorization: `Bearer ${token}` },
          }).catch((err) => ({ data: { success: false }, error: err })),
          axios.get(`https://lms-backend-flwq.onrender.com/api/v1/students/courses/${courseId}/assessments`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch((err) => ({ data: { success: false }, error: err })),
          axios.get('https://lms-backend-flwq.onrender.com/api/v1/students/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }).catch((err) => ({ data: { success: false }, error: err })),
        ]);
  
        console.log('Course API Response:', courseRes); // Debugging log
        console.log('Enrollment API Response:', enrollmentRes); // Debugging log
  
        if (profileRes.data.data) {
          const { firstName, lastName } = profileRes.data.data;
          setForm((prev) => ({ ...prev, name: `${firstName} ${lastName}` }));
        }
  
        if (courseRes.data.success && courseRes.data.data) {
          // Set courseTitle from course API response
          setCourseTitle(courseRes.data.data.title || 'Course Not Found');
          
          // Set a fallback instructor name since instructor details are not in course API
          setInstructorName('Unknown Instructor'); // Fallback if enrollment doesn't provide instructor
  
          if (enrollmentRes.data.success) {
            const enrolledCourses = enrollmentRes.data.data || [];
            const course = enrolledCourses.find(
              (enrollment) => enrollment.course && String(enrollment.course._id) === String(courseId)
            );
            if (course?.course?.instructor) {
              setInstructorName(`${course.course.instructor.firstName} ${course.course.instructor.lastName}`);
            }
          }
  
          const formattedModules = courseRes.data.data.curriculum.map((section) => ({
            title: section.sectionTitle || 'Untitled Section',
            lessons: (section.lectures || []).map((lecture, index) => ({
              title: lecture.title || `Lesson ${index + 1}`,
              time: lecture.duration
                ? `${Math.floor(lecture.duration / 60)}:${(lecture.duration % 60).toString().padStart(2, '0')}`
                : '0:00',
              content: lecture.content || {},
              isPreview: lecture.isPreview || false,
            })),
            active: false,
          }));
  
          console.log('Formatted Modules:', formattedModules); // Debugging log
          setModules(formattedModules);
  
          if (formattedModules.length > 0 && formattedModules[0].lessons.length > 0) {
            const firstLecture = formattedModules[0].lessons[0];
            if (firstLecture.content?.url) {
              setSelectedVideo({
                title: firstLecture.content.title || firstLecture.title,
                description: firstLecture.content.description || 'No description available.',
                url: firstLecture.content.url,
              });
              setActiveLecture({ moduleIndex: 0, lessonIndex: 0 });
              setModules((prev) => [
                { ...prev[0], active: true },
                ...prev.slice(1),
              ]);
            } else {
              setContentError('No playable videos available for this course.');
              console.warn('First lecture has no valid video URL:', firstLecture); // Debugging
            }
          } else {
            setContentError('No lessons available for this course.');
            console.warn('No modules or lessons found:', formattedModules); // Debugging
          }
        } else {
          setContentError('Failed to load course content.');
          console.error('Course API Error:', courseRes.error?.message || 'Unknown error'); // Debugging
        }
  
        if (enrollmentRes.data.success) {
          const enrolledCourses = enrollmentRes.data.data || [];
          setContactCourses(
            enrolledCourses
              .filter((enrollment) => enrollment.course && enrollment.course._id)
              .map((enrollment) => ({
                _id: enrollment.course._id,
                title: enrollment.course.title,
              }))
          );
        } else {
          console.warn('Enrollment API failed:', enrollmentRes.error?.message); // Debugging
        }
  
        if (coursesRes.data.success) {
          setCourses(coursesRes.data.data.filter((course) => String(course._id) !== String(courseId)));
        } else {
          console.warn('Courses API failed:', coursesRes.error?.message); // Debugging
        }
  
        if (assessmentsRes.data.success) {
          setAssessments(assessmentsRes.data.data);
        } else {
          setAssessmentsError('No assessments found for this course.');
          console.warn('Assessments API failed:', assessmentsRes.error?.message); // Debugging
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setErrorMsg(
          error.message === 'No authentication token found' || error.response?.status === 401
            ? 'Unauthorized access. Please log in again.'
            : 'Failed to load course data. Please try again later.'
        );
        setContentError('Failed to load course data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [courseId]);

  const toggleModule = (index) => {
    setModules((prevModules) =>
      prevModules.map((mod, i) => ({
        ...mod,
        active: i === index ? !mod.active : mod.active,
      }))
    );
  };

  // const toggleAssessmentsModal = () => {
  //   setIsAssessmentsModalOpen(!isAssessmentsModalOpen);
  // };

  const toggleHelpSidebar = () => {
    setIsHelpSidebarOpen(!isHelpSidebarOpen);
  };

  const toggleFeedback = () => {
    setIsFeedbackOpen(!isFeedbackOpen);
  };

  const handleAttemptAssessment = (assessmentId) => {
    navigate(`/courses/${courseId}/assessments/${assessmentId}`);
    setIsAssessmentsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const handleStarClick = (rating) => {
    setFeedback((prev) => ({ ...prev, rating }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackLoading(true);
    setFeedbackSuccess('');
    setFeedbackError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `https://lms-backend-flwq.onrender.com/api/v1/courses/${courseId}/reviews`,
        {
          rating: feedback.rating,
          comment: feedback.comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setFeedbackSuccess('Feedback submitted successfully.');
        setFeedback({ rating: 0, comment: '' });
      } else {
        setFeedbackError('Failed to submit feedback. Server returned success: false.');
      }
    } catch (error) {
      setFeedbackError(
        error?.response?.data?.message ||
        'Failed to submit feedback due to a network or server error.'
      );
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://lms-backend-flwq.onrender.com/api/v1/students/support',
        {
          subject: form.subject,
          message: form.message,
          category: 'course',
          relatedCourse: form.relatedCourse || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setSuccessMsg('Support ticket submitted successfully.');
        setForm((prev) => ({
          ...prev,
          subject: '',
          message: '',
          category: 'course',
          relatedCourse: courseId || '',
        }));
      } else {
        setErrorMsg('Failed to submit the ticket. Server returned success: false.');
      }
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message ||
        'Failed to submit the ticket due to a network or server error.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#eaf5ff] p-4 flex flex-col min-h-[calc(100vh-3.5rem)] w-full mt-[1.5rem] items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-4 border-[#49BBBD] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 text-base font-semibold">Loading course content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#eaf5ff] p-4 flex flex-col min-h-[calc(100vh-3.5rem)] w-full mt-[1.5rem]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white px-3 py-2 rounded-sm shadow w-full gap-y-2"
      >
        <div className="flex items-center gap-3 min-w-0 w-full sm:flex-1">
          <div className="min-w-0 flex-1">
            <h1 className="!text-[1rem] h-[1.2rem] truncate">
              Course: {courseTitle}
            </h1>
            {/* <p className="text-xs w-fit text-white bg-green-300 px-2 py-1 rounded">
              {instructorName}
            </p> */}
          </div>
        </div>
      </motion.div>

      {/* Content Error */}
      {contentError && (
        <div className="bg-red-100 p-2 rounded-md mt-2 text-sm text-center">
          {contentError}
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 mt-2 w-full max-w-7xl mx-auto flex-1">
        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 flex flex-col gap-4"
        >
          <div className="bg-white rounded-lg overflow-hidden shadow p-3 flex flex-col">
            {selectedVideo?.url ? (
              <video
                src={selectedVideo.url}
                controls
                controlsList="nodownload"
                className="rounded-lg object-cover w-full max-h-[500px]"
                autoPlay="false"
              />
            ) : (
              <div className="rounded-lg w-full bg-gray-200 h-[400px] flex items-center justify-center">
                <p className="text-gray-600 text-sm">Select a lesson to play the video.</p>
              </div>
            )}
            {selectedVideo && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold mb-1">{selectedVideo.title || 'Untitled Video'}</h2>
                <p className="text-sm text-gray-600">{selectedVideo.description || 'No description available.'}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Course Contents */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 flex flex-col"
        >
          <div className="bg-white p-3 rounded-lg shadow h-fit flex flex-col overflow-hidden">
            <div>
              {/* <h2 className="font-bold text-base">{instructorName}</h2> */}
              <p className="text-xs text-green-600">{modules.length} Modules</p>
            </div>
            <div className="flex-1 overflow-y-auto mt-3 pr-2" style={{ maxHeight: 'calc(100vh - 230px)' }}>
              {modules.length === 0 ? (
                <p className="text-gray-600 text-sm">No modules available.</p>
              ) : (
                modules.map((mod, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={i !== mod.length - 1 ? 'mb-3' : ''}
                  >
                    <div className="border rounded-lg p-2">
                      <div
                        className={`flex justify-between font-semibold items-center cursor-pointer ${mod.active ? 'text-black' : ''}`}
                        onClick={() => toggleModule(i)}
                      >
                        <span className="truncate text-sm">{mod.title}</span>
                        {mod.active ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <span className="text-xs">{mod.lessons.length} Lessons</span>
                        )}
                      </div>
                      {mod.active && (
                        <div className="mt-1 space-y-1 text-sm">
                          {mod.lessons.map((lesson, idx) => (
                            <div
                              key={idx}
                              className={`flex justify-between items-center p-1 bg-gray-50 hover:bg-gray-100 text-[#00c8a0] cursor-pointer ${
                                activeLecture.moduleIndex === i && activeLecture.lessonIndex === idx ? 'bg-green-50' : ''
                              }`}
                              onClick={() => {
                                if (lesson.content?.url) {
                                  setSelectedVideo({
                                    title: lesson.content.title || lesson.title,
                                    description: lesson.content.description || 'No description available.',
                                    url: lesson.content.url,
                                  });
                                  setActiveLecture({ moduleIndex: i, lessonIndex: idx });
                                }
                              }}
                            >
                              <span>{lesson.title || `Lesson ${idx + 1}`}</span>
                              <span className="text-[10px]">{lesson.time || '0:00'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}