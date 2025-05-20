import { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in again.");

        const res = await axios.get(
          "https://lms-backend-flwq.onrender.com/api/v1/instructors/courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCourses(res.data.data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.message || "Failed to fetch courses.");
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch students when selectedCourse changes
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in again.");

        let allStudentsData = [];

        if (selectedCourse === "All") {
          for (const course of courses) {
            const res = await axios.get(
              `https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${course._id}/students`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            const studentsWithCourse = (res.data.data || []).map((enrollment) => ({
              ...enrollment,
              courseTitle: course.title,
            }));

            allStudentsData = allStudentsData.concat(studentsWithCourse);
          }
        } else {
          const selectedCourseObj = courses.find((c) => c._id === selectedCourse);
          const res = await axios.get(
            `https://lms-backend-flwq.onrender.com/api/v1/instructors/courses/${selectedCourse}/students`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          allStudentsData = (res.data.data || []).map((enrollment) => ({
            ...enrollment,
            courseTitle: selectedCourseObj?.title || "Unknown Course",
          }));
        }

        setStudents(allStudentsData);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err.message || "Failed to fetch students.");
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    if (!loadingCourses && courses.length > 0) {
      fetchStudents();
    }
  }, [selectedCourse, courses, loadingCourses]);

  // Filter students based on searchTerm
  const filteredStudents = students.filter(({ student, courseTitle, status }) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      (fullName.includes(search) ||
        student._id.includes(searchTerm) ||
        student.email.toLowerCase().includes(search)) &&
      (selectedCourse === "All" || courseTitle === courses.find((c) => c._id === selectedCourse)?.title)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-6 lg:py-16 sm:py-6 text-sm sm:text-sm md:text-base lg:text-base">
      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-base sm:text-lg md:text-xl lg:text-3xl font-bold text-slate-900">
          Dashboard
        </h1>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pr-24 border-2 border-gray-300 rounded-md text-black focus:outline-none text-sm sm:text-sm md:text-base"
          />
          <button
            className="absolute right-0 top-0 h-full px-4 bg-[#49BBBD] text-white text-sm sm:text-base rounded-r-md"
            onClick={(e) => e.preventDefault()} // no special search action, filtering is live
          >
            Search
          </button>
        </div>
      </div>

      {/* Course Filter */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Filter by Course</label>
        {loadingCourses ? (
          <div>Loading courses...</div>
        ) : (
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="sm:w-[35%] md:w-[25%] p-2 border-2 border-gray-300 rounded-md text-black cursor-pointer focus:outline-none"
          >
            <option value="All">All</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title || "Unnamed Course"}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Loading students */}
      {loadingStudents && <div>Loading students...</div>}

      {/* Table for medium+ screens */}
      <div className="hidden md:block">
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="text-left p-4">Student Name</th>
                <th className="text-left p-4">Student ID</th>
                <th className="text-left p-4">Email ID</th>
                <th className="text-left p-4">Course</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
              {filteredStudents.map(({ student, courseTitle, status }) => (
                <tr
                  key={`${student._id}-${courseTitle}`}
                  className="border-b border-gray-200 hover:bg-gray-50 text-sm"
                >
                  <td className="p-4">{`${student.firstName} ${student.lastName}`}</td>
                  <td className="p-4">{student._id}</td>
                  <td className="p-4">{student.email}</td>
                  <td className="p-4">{courseTitle}</td>
                  <td className="p-4">
                    <span
                      className={`font-medium ${
                        status === "active" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card layout for small screens */}
      <div className="md:hidden space-y-4">
        {filteredStudents.map(({ student, courseTitle, status }) => (
          <div
            key={`${student._id}-${courseTitle}`}
            className="bg-white rounded-lg shadow p-4 space-y-2 text-sm"
          >
            <div>
              <strong>Student Name:</strong> {`${student.firstName} ${student.lastName}`}
            </div>
            <div>
              <strong>Student ID:</strong> {student._id}
            </div>
            <div>
              <strong>Email:</strong> {student.email}
            </div>
            <div>
              <strong>Course:</strong> {courseTitle}
            </div>
            <div>
              <strong>Status:</strong>{" "}
              <span
                className={`font-medium ${
                  status === "active" ? "text-green-600" : "text-red-600"
                }`}
              >
                {status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
