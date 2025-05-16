import { useState } from 'react';

function Assignment() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');

  const assignmentsData = [
    { studentName: 'Ashutosh', studentId: '155258', email: 'ashutosh@example.com', status: 'Active', course: 'React JS' },
    { studentName: 'Navneet', studentId: '165482', email: 'navneet@example.com', status: 'Active', course: 'Node JS' },
    { studentName: 'Brijesh', studentId: '245756', email: 'brijesh@example.com', status: 'InActive', course: 'MongoDB' },
    { studentName: 'Sanskar', studentId: '854625', email: 'sanskar@example.com', status: 'Active', course: 'React JS' },
    { studentName: 'Riya', studentId: '136428', email: 'riya@example.com', status: 'InActive', course: 'Node JS' },
  ];

  const uniqueCourses = ['All', ...new Set(assignmentsData.map(a => a.course))];

  const filteredAssignments = assignmentsData.filter((assignment) => {
    const matchesSearch = assignment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.studentId.includes(searchTerm) ||
                          assignment.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse = selectedCourse === 'All' || assignment.course === selectedCourse;

    return matchesSearch && matchesCourse;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-6 lg:py-16 sm:py-6 text-sm sm:text-sm md:text-base lg:text-base">
      
      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-base sm:text-lg md:text-xl lg:text-3xl font-bold text-slate-900">
          Dashboard
        </h1>
      </div>

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
    <button // Replace this with your actual search function
      className="absolute h-full w-[10%] top-1/2 transform -translate-y-1/2 bg-[#49BBBD] text-white px-4 py-2 cursor-pointer rounded-md text-sm"
    >
      Search
    </button>
  </div>
</div>


       {/* Course Filter */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Filter by Course</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="sm:w-[35%] md:w-[25%] p-2 border-2 border-gray-300 rounded-md text-black cursor-pointer focus:outline-none"
        >
          {uniqueCourses.map((course, index) => (
            <option key={index} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

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
              {filteredAssignments.map((assignment, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                  <td className="p-4">{assignment.studentName}</td>
                  <td className="p-4">{assignment.studentId}</td>
                  <td className="p-4">{assignment.email}</td>
                  <td className="p-4">{assignment.course}</td>
                  <td className="p-4">
                    <span className={`font-medium ${
                      assignment.status === 'Active' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {assignment.status}
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
        {filteredAssignments.map((assignment, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 space-y-2 text-sm">
            <div><strong>Student Name:</strong> {assignment.studentName}</div>
            <div><strong>Student ID:</strong> {assignment.studentId}</div>
            <div><strong>Email:</strong> {assignment.email}</div>
            <div><strong>Course:</strong> {assignment.course}</div>
            <div>
              <strong>Status:</strong>{' '}
              <span className={`font-medium ${
                assignment.status === 'Active' ? 'text-green-600' : 'text-red-600'
              }`}>
                {assignment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Assignment;
