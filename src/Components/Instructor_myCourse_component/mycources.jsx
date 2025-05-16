import { Bell, MessageSquare } from 'lucide-react';

const courses = [
  { title: 'Product Design v1.0', completed: 14, total: 24, color: 'bg-pink-200', playColor: 'bg-pink-500' },
  { title: 'Java Development', completed: 12, total: 18, color: 'bg-blue-200', playColor: 'bg-blue-500' },
  { title: 'Product Design v1.0', completed: 14, total: 24, color: 'bg-pink-200', playColor: 'bg-pink-500' },
  { title: 'Java Development', completed: 12, total: 18, color: 'bg-blue-200', playColor: 'bg-blue-500' },
  { title: 'Product Design v1.0', completed: 14, total: 24, color: 'bg-pink-200', playColor: 'bg-pink-500' },
  { title: 'Java Development', completed: 12, total: 18, color: 'bg-blue-200', playColor: 'bg-blue-500' },
];

export default function MyCourses() {
  return (
    <div className="h-full w-full bg-sky-50 p-4 lg:py-12 sm:py-6 sm:px-4 md:p-8 overflow-auto">
      {/* Page Heading */}
      <div className="flex justify-between items-start mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">My Courses</h1>
      </div>

      {/* Subheading */}
      <h2 className="text-base sm:text-lg font-medium text-slate-600 mb-4">All Courses</h2>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 cursor-pointer">
        {courses.map((course, index) => (
          <div
            key={index}
            className={`${course.color} p-4 sm:p-5 rounded-xl shadow-md relative transition-transform transform hover:scale-105`}
          >
            {/* Course Title */}
            <h3 className="text-base sm:text-md md:text-lg font-semibold text-slate-800 mb-2">{course.title}</h3>
            <p className="text-sm text-gray-700">Completed</p>

            {/* Progress Bar */}
            <div className="w-full bg-white h-2 rounded-full my-2">
              <div
                className={`${course.playColor} h-2 rounded-full`}
                style={{ width: `${(course.completed / course.total) * 100}%` }}
              />
            </div>

            {/* Progress Info */}
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium text-gray-700">
                {course.completed}/{course.total}
              </span>
              <button className={`w-8 h-8 ${course.playColor} rounded-full flex items-center justify-center cursor-pointer`}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 4l10 6-10 6V4z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
