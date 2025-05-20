import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlay } from 'react-icons/fa';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://lms-backend-flwq.onrender.com/api/v1/instructors/courses',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourses(response.data.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handlePlay = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleCardClick = (courseId, courseTitle) => {
    navigate(`/dashboard/course-editor/${courseId}`, { state: { courseTitle } });
  };

  return (
    <div className="h-full w-full bg-sky-50 p-4 lg:py-12 sm:py-6 sm:px-4 md:p-8 overflow-auto">
      <div className="flex justify-between items-start mb-6 sm:mb-8">
        <h1 className="sm:text-4x1 md:text-3xl  font-bold text-slate-900">Manage Courses</h1>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-600">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white p-4 sm:p-5 rounded-xl shadow-md relative transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(course._id, course.title)}
            >
              {/* Thumbnail container with fixed height */}
              <div className="relative w-full h-32 bg-gray-200 rounded-md mb-3">
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Play button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event
                    handlePlay(course._id);
                  }}
                  className="absolute -bottom-4 right-0 bg-[#49BBBD] text-white p-3 rounded-full shadow-lg hover:scale-120 cursor-pointer z-50"
                  title="Play Course"
                >
                  <FaPlay />
                </button>
              </div>

              <h3 className="text-base sm:text-md md:text-lg font-semibold text-slate-800 mb-1 truncate">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2 truncate">{course.subtitle}</p>

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700">
                  ₹{course.discountPrice ?? course.price}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  ₹{course.price}
                </span>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-700">
                  👨‍🎓 {course.totalStudents} Students
                </span>
                <span className="text-sm text-yellow-500">
                  ⭐ {course.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}