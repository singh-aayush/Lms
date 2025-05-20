import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed top-2 sm:top-4 right-2 sm:right-4 p-3 sm:p-4 rounded-md shadow-lg text-white ${
        type === "error" ? "bg-red-500" : "bg-green-500"
      } transition-opacity duration-300 z-[1000] max-w-[90%] sm:max-w-md`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm sm:text-base">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 sm:ml-4 text-white hover:text-gray-200"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

function AssessmentsList() {
  const { courseId } = useParams();
  const [courseName, setCourseName] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  // Log courseId for debugging
  useEffect(() => {
    if (!courseId) {
      showNotification('Course ID is missing from the URL.');
      navigate('/dashboard');
    }
  }, [courseId, navigate]);

  // Fetch course name
  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          showNotification("Please log in to fetch course details.");
          return;
        }

        const response = await axios.get(
          `https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCourseName(response.data.data.title || 'Unknown Course');
      } catch (error) {
        console.error("Error fetching course name:", error);
        showNotification("Failed to fetch course name.");
      }
    };

    if (courseId) {
      fetchCourseName();
    }
  }, [courseId]);

  // Fetch assessments
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          showNotification("Please log in to fetch assessments.");
          return;
        }

        const response = await axios.get(
          `https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${courseId}/assessments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setAssessments(response.data.data);
        } else {
          showNotification("No assessments found for this course.");
        }
      } catch (error) {
        console.error("Error fetching assessments:", error);
        if (error.response?.status === 401) {
          showNotification("Session expired or invalid. Please log in again.");
          localStorage.removeItem("token");
          navigate('/');
          return;
        }
        showNotification("Failed to fetch assessments.");
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchAssessments();
    }
  }, [courseId, navigate]);

  // Delete assessment
  const handleDelete = async (assessmentId) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("Please log in to delete assessment.");
        return;
      }

      await axios.delete(
        `https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${courseId}/assessments/${assessmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAssessments((prev) => prev.filter((assessment) => assessment._id !== assessmentId));
      showNotification("Assessment deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting assessment:", error);
      if (error.response?.status === 401) {
        showNotification("Session expired or invalid. Please log in again.");
        localStorage.removeItem("token");
        navigate('/');
        return;
      }
      showNotification("Failed to delete assessment.");
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (assessmentId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("Please log in to update publish status.");
        return;
      }

      const newStatus = !currentStatus;
      await axios.put(
        `https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${courseId}/assessments/${assessmentId}`,
        { isPublished: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAssessments((prev) =>
        prev.map((assessment) =>
          assessment._id === assessmentId
            ? { ...assessment, isPublished: newStatus }
            : assessment
        )
      );
      showNotification(
        `Assessment ${newStatus ? 'published' : 'unpublished'} successfully!`,
        "success"
      );
    } catch (error) {
      console.error("Error toggling publish status:", error);
      if (error.response?.status === 401) {
        showNotification("Session expired or invalid. Please log in again.");
        localStorage.removeItem("token");
        navigate('/');
        return;
      }
      showNotification("Failed to update publish status.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
      <div className="w-full max-w-5xl sm:max-w-6xl lg:max-w-7xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
        <h1 className="!text-[2rem] sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 text-center mb-4 sm:mb-6 md:mb-8">
          Assessments for {courseName}
        </h1>

        {isLoading ? (
          <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg">
            Loading assessments...
          </p>
        ) : !courseId ? (
          <p className="text-center text-red-500 text-sm sm:text-base md:text-lg">
            Course ID is missing. Please select a course.
          </p>
        ) : assessments.length === 0 ? (
          <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg">
            No assessments available for this course.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {assessments.map((assessment) => (
              <div
                key={assessment._id}
                className="bg-gray-50 border rounded-lg p-4 sm:p-5 md:p-6 hover:shadow-xl transition duration-300"
              >
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-slate-800 line-clamp-2">
                    {assessment.title}
                  </h2>
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      assessment.isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {assessment.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                  {assessment.description}
                </p>

                <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Due Date:</span>{' '}
                    {assessment.dueDate
                      ? format(new Date(assessment.dueDate), 'dd/MM/yyyy HH:mm')
                      : 'Not set'}
                  </div>
                  <div>
                    <span className="font-medium">Total Points:</span>{' '}
                    {assessment.totalPoints}
                  </div>
                  <div>
                    <span className="font-medium">Passing Score:</span>{' '}
                    {assessment.passingScore}%
                  </div>
                  <div>
                    <span className="font-medium">Time Limit:</span>{' '}
                    {assessment.timeLimit} minutes
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>{' '}
                    {format(new Date(assessment.createdAt), 'dd/MM/yyyy HH:mm')}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span>{' '}
                    {format(new Date(assessment.updatedAt), 'dd/MM/yyyy HH:mm')}
                  </div>
                </div>

                <div className="mt-3 sm:mt-4">
                  <span className="font-medium text-slate-700 text-xs sm:text-sm">
                    Questions:
                  </span>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 mt-1 max-h-24 sm:max-h-32 overflow-y-auto">
                    {assessment.questions.map((question, index) => (
                      <li key={question._id} className="truncate">
                        {index + 1}. {question.questionText} ({question.points} points)
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 sm:mt-6 flex justify-end gap-2 sm:gap-3">
                  <Link
                    to={`/dashboard/course-editor/${courseId}/assessments/${assessment._id}`}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#49BBBD] text-white font-semibold rounded-md hover:bg-[#3AA8AA] transition duration-300 text-sm sm:text-base"
                    title="Update Assessment"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(assessment._id)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300 text-sm sm:text-base"
                    title="Delete Assessment"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleTogglePublish(assessment._id, assessment.isPublished)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 text-white font-semibold rounded-md transition duration-300 text-sm sm:text-base ${
                      assessment.isPublished
                        ? 'bg-gray-500 hover:bg-gray-600'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                    title={assessment.isPublished ? 'Unpublish Assessment' : 'Publish Assessment'}
                  >
                    {assessment.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 sm:mt-8 text-center">
          <Link
            to={`/dashboard/course-editor/${courseId}/assessments/new`}
            className="px-4 sm:px-6 py-1.5 sm:py-2 bg-[#49BBBD] text-white font-semibold rounded-md hover:bg-[#3AA8AA] transition duration-300 text-sm sm:text-base"
          >
            Add New Assessment
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AssessmentsList;