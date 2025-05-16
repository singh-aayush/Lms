// import { useState } from 'react';
// import AssignmentTable from '../Instructor_assignment_component/assignmentTable';
// import SearchBar from '../Instructor_assignment_component/searchBar';

// function Home() {
//   const [searchTerm, setSearchTerm] = useState('');

//   const assignmentsData = [
//     { unit: '03', subject: 'CRP', issuesDate: '03/02/2023', deadline: '03/05/2023', status: 'Submitted' },
//     { unit: '01', subject: 'Programming', issuesDate: '03/09/2023', deadline: '03/09/2025', status: 'Pending' },
//     { unit: '01', subject: 'Database', issuesDate: '03/02/2024', deadline: '03/10/2026', status: 'Pending' },
//     { unit: '01', subject: 'Networking', issuesDate: '02/05/2022', deadline: '03/11/2023', status: 'Pending' },
//     { unit: '02', subject: 'Security', issuesDate: '02/08/2022', deadline: '03/10/2023', status: 'Late Submission' },
//     { unit: '03', subject: 'CRP', issuesDate: '03/02/2023', deadline: '03/05/2023', status: 'Submitted' },
//     { unit: '01', subject: 'Programming', issuesDate: '03/09/2023', deadline: '03/09/2025', status: 'Pending' },
//     { unit: '01', subject: 'Database', issuesDate: '03/02/2024', deadline: '03/10/2026', status: 'Pending' },
//     { unit: '01', subject: 'Networking', issuesDate: '02/05/2022', deadline: '03/11/2023', status: 'Pending' },
//     { unit: '02', subject: 'Security', issuesDate: '02/08/2022', deadline: '03/10/2023', status: 'Late Submission' },
//   ];

//   const filteredAssignments = assignmentsData.filter(assignment =>
//     assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     assignment.unit.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="max-w-7xl mx-auto px-0 px-4 lg:px-6 py-4 lg:py-12">
//       {/* Heading */}
//       <div className="flex items-center justify-between mb-8 mt-2">
//         <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900">
//           Dashboard
//         </h1>
//       </div>

//       {/* Search and Table */}
//       <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//       <AssignmentTable assignments={filteredAssignments} />
//     </div>
//   );
// }

// export default Home;


import { useState } from 'react';
import { FiDownload } from 'react-icons/fi';

function Assignment() {
  const [searchTerm, setSearchTerm] = useState('');

  const assignmentsData = [
    { studentName: 'Ashutosh', studentId: '155258', email: 'ashutosh@example.com', status: 'Active', file: '/files/assignment1.pdf' },
    { studentName: 'Navneet', studentId: '165482', email: 'navneet@example.com', status: 'Active', file: '/files/assignment2.pdf' },
    { studentName: 'Brijesh', studentId: '245756', email: 'brijesh@example.com', status: 'InActive', file: '/files/assignment3.pdf' },
    { studentName: 'Sanskar', studentId: '854625', email: 'sanskar@example.com', status: 'Active', file: '/files/assignment4.pdf' },
    { studentName: 'Riya', studentId: '136428', email: 'riya@example.com', status: 'InActive', file: '/files/assignment5.pdf' },
  ];

  const filteredAssignments = assignmentsData.filter((assignment) =>
    assignment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.studentId.includes(searchTerm) ||
    assignment.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <button className="absolute right-0 top-0 h-full bg-[#49BBBD] text-white px-5 font-semibold rounded-r-md cursor-pointer text-sm sm:text-sm md:text-base">
            Search
          </button>
        </div>
      </div>

      {/* Table on medium+ screens */}
      <div className="hidden md:block">
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="text-left p-4">Student Name</th>
                <th className="text-left p-4">Student ID</th>
                <th className="text-left p-4">Email ID</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Download</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((assignment, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                  <td className="p-4">{assignment.studentName}</td>
                  <td className="p-4">{assignment.studentId}</td>
                  <td className="p-4">{assignment.email}</td>
                  <td className="p-4">
                    <span className={`font-medium ${
                      assignment.status === 'Active'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <a
                      href={assignment.file}
                      download
                      className="inline-flex items-center gap-1 bg-[#49BBBD] text-white px-2 py-1 rounded hover:bg-[#49BBBD] transition whitespace-nowrap"
                    >
                      <FiDownload className="w-4 h-4" />
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card layout on small screens */}
      <div className="md:hidden space-y-4">
        {filteredAssignments.map((assignment, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 space-y-2 text-sm">
            <div><strong>Student Name:</strong> {assignment.studentName}</div>
            <div><strong>Student ID:</strong> {assignment.studentId}</div>
            <div><strong>Email:</strong> {assignment.email}</div>
            <div>
              <strong>Status:</strong>{' '}
              <span className={`font-medium ${
                assignment.status === 'Submitted'
                  ? 'text-green-600'
                  : assignment.status === 'Pending'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                {assignment.status}
              </span>
            </div>
            <div>
              <a
                href={assignment.file}
                download
                className="inline-flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
              >
                <FiDownload className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Assignment;
