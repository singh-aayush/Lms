import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import SearchBar from './searchBar';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed top-2 sm:top-4 right-2 sm:right-4 p-3 sm:p-4 rounded-md shadow-lg text-white ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
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

function Assignments() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('all'); // 'all' or course _id
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isCoursesLoading, setIsCoursesLoading] = useState(true);

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          showNotification('Please log in to fetch courses.');
          navigate('/');
          return;
        }

        const response = await axios.get(
          'https://lms-backend-flwq.onrender.com/api/v1/instructors/courses',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          console.log('Courses fetched:', response.data.data);
          setCourses(response.data.data);
          setSelectedCourseId('all');
        } else {
          showNotification('No courses found.');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        if (error.response?.status === 401) {
          showNotification('Session expired or invalid. Please log in again.');
          localStorage.removeItem('token');
          navigate('/');
        } else {
          showNotification('Failed to fetch courses.');
        }
      } finally {
        setIsCoursesLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  // Fetch submitted assessments based on selected course
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          showNotification('Please log in to fetch assessments.');
          navigate('/');
          return;
        }

        console.log('Fetching assessments for courseId:', selectedCourseId);
        let allAssessments = [];
        if (selectedCourseId === 'all') {
          for (const course of courses) {
            const response = await axios.get(
              `https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${course._id}/assessments/submitted`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (response.data.success) {
              allAssessments = [...allAssessments, ...response.data.data];
            }
          }
        } else {
          const response = await axios.get(
            `https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${selectedCourseId}/assessments/submitted`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data.success) {
            allAssessments = response.data.data;
          }
        }

        console.log('Assessments fetched:', allAssessments);
        setAssessments(allAssessments);
        if (allAssessments.length === 0) {
          showNotification('No submitted assessments found.');
        }
      } catch (error) {
        console.error('Error fetching assessments:', error);
        if (error.response?.status === 401) {
          showNotification('Session expired or invalid. Please log in again.');
          localStorage.removeItem('token');
          navigate('/');
        } else {
          showNotification('Failed to fetch assessments.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (courses.length > 0 && selectedCourseId) {
      fetchAssessments();
    }
  }, [selectedCourseId, courses, navigate]);

  // Filter assessments
  const filteredAssessments = assessments.filter(
    (assessment) =>
      assessment.assessmentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${assessment.student.firstName} ${assessment.student.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Format assessments for display
  const formattedAssessments = filteredAssessments.map((assessment) => ({
    assessmentId: assessment.assessmentId,
    studentId: assessment.student.id,
    studentFullName: `${assessment.student.firstName} ${assessment.student.lastName}`,
    assessmentTitle: assessment.assessmentTitle,
    dueDate: assessment.dueDate
      ? format(new Date(assessment.dueDate), 'dd/MM/yyyy')
      : 'Not set',
    submissionDate: assessment.submission.submissionDate
      ? format(new Date(assessment.submission.submissionDate), 'dd/MM/yyyy')
      : 'Not set',
    score: assessment.submission.score,
    status: assessment.submission.status,
    studentEmail: assessment.student.email,
  }));

  // Function to determine status background color
  const getStatusBackground = (status) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'late':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen w-full px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: '' })}
      />
      <div className="w-full max-w-5xl sm:max-w-6xl lg:max-w-7xl mx-auto">
        {/* Heading and Course Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
          <h1 className="!text-[2rem] sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900">
            Submitted Assessments
          </h1>
          <div className="w-full sm:w-auto">
            {isCoursesLoading ? (
              <p className="text-sm sm:text-base text-gray-600">Loading courses...</p>
            ) : courses.length === 0 ? (
              <p className="text-sm sm:text-base text-gray-600">No courses available.</p>
            ) : (
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  console.log('Selected course ID:', e.target.value);
                  setSelectedCourseId(e.target.value);
                }}
                className="w-full sm:w-auto border border-gray-300 rounded-md p-2 sm:p-2.5 text-sm sm:text-base text-gray-700 focus:ring-2 focus:ring-[#49BBBD] outline-none"
              >
                <option value="all">All Courses</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title || 'Unnamed Course'}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by assessment title or student name..."
            className="w-full border border-gray-300 rounded-md p-2 sm:p-2.5 text-sm sm:text-base text-gray-700 focus:ring-2 focus:ring-[#49BBBD] outline-none"
          />
        </div>

        {/* Loading State or Assessments Display */}
        {isLoading ? (
          <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg mt-4">
            Loading assessments...
          </p>
        ) : filteredAssessments.length === 0 ? (
          <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg mt-4">
            No submitted assessments found.
          </p>
        ) : (
          <>
            {/* Card Layout for Small Screens (<640px) */}
            <div className="sm:hidden space-y-4">
              {formattedAssessments.map((assessment) => (
                <div
                  key={assessment.assessmentId}
                  className="bg-white border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition duration-300"
                >
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-medium text-gray-700">Assessment ID:</span>{' '}
                      <span className="truncate">{assessment.assessmentId}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Student Name:</span>{' '}
                      <span className="truncate">{assessment.studentFullName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Assessment Title:</span>{' '}
                      <span className="truncate">{assessment.assessmentTitle}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Due Date:</span>{' '}
                      {assessment.dueDate}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Submission Date:</span>{' '}
                      {assessment.submissionDate}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Score:</span>{' '}
                      {assessment.score ?? 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>{' '}
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBackground(
                          assessment.status
                        )}`}
                      >
                        {assessment.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Student Email:</span>{' '}
                      <span className="truncate">{assessment.studentEmail}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Layout for Larger Screens (>=640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-md">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 sm:py-3 px-3 sm:px-4 border-b text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Assessment ID
                    </th>
                    <th className="py-2 sm:py-3 px-3 sm:px-4 border-b text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Student Name
                    </th>
                    <th className="py-2 sm:py-3 px-3 sm:px-4 border-b text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Assessment Title
                    </th>
                    <th className="py-2 sm:py-3 px-3 sm:px-4 border-b text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Due Date
                    </th>
                    <th className="py-2 sm:py-3 px-3 sm:px-4 border-b text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Submission Date
                    </th>
                    <th className="py-2 sm:py-3 px-3 sm:px-4 border-b text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Score
                    </th>
                    <th className="py-2 sm:py-3 px-3 sm:px-4 border-b text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="py-2 sm:py-3 px-3 sm:px-4 border-b text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Student Email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formattedAssessments.map((assessment) => (
                    <tr key={assessment.assessmentId} className="hover:bg-gray-50">
                      <td className="py-2 sm:py-3 px-3 sm:px-4 border-b text-xs sm:text-sm text-gray-700 truncate">
                        {assessment.assessmentId}
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 border-b text-xs sm:text-sm text-gray-700 truncate">
                        {assessment.studentFullName}
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 border-b text-xs sm:text-sm text-gray-700 truncate">
                        {assessment.assessmentTitle}
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 border-b text-xs sm:text-sm text-gray-700">
                        {assessment.dueDate}
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 border-b text-xs sm:text-sm text-gray-700">
                        {assessment.submissionDate}
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 border-b text-xs sm:text-sm text-gray-700">
                        {assessment.score ?? 'N/A'}
                      </td>
                      <td
                        className={`py-2 sm:py-3 px-3 sm:px-4 border-b text-xs sm:text-sm ${getStatusBackground(
                          assessment.status
                        )}`}
                      >
                        {assessment.status}
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 border-b text-xs sm:text-sm text-gray-700 truncate">
                        {assessment.studentEmail}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Assignments;