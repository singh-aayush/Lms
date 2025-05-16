import { useState } from 'react';
import { FiDownload } from "react-icons/fi";
import SearchBar from '../Instructor_assignment_component/searchBar';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const assignmentsData = [
    {
      course: 'CRP',
      unit: '03',
      issuesDate: '03/02/2023',
      deadline: '03/05/2023',
      status: 'Submitted',
      file: '/files/crp-unit3.pdf',
    },
    {
      course: 'Programming',
      unit: '01',
      issuesDate: '03/09/2023',
      deadline: '03/09/2025',
      status: 'Pending',
      file: null,
    },
    {
      course: 'Database',
      unit: '01',
      issuesDate: '03/02/2024',
      deadline: '03/10/2026',
      status: 'Pending',
      file: null,
    },
    {
      course: 'Networking',
      unit: '01',
      issuesDate: '02/05/2022',
      deadline: '03/11/2023',
      status: 'Pending',
      file: null,
    },
    {
      course: 'Security',
      unit: '02',
      issuesDate: '02/08/2022',
      deadline: '03/10/2023',
      status: 'Late Submission',
      file: '/files/security-unit2-late.pdf',
    },
  ];

  const filteredAssignments = assignmentsData.filter(assignment =>
    assignment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-12">
      {/* Heading */}
      <div className="flex items-center justify-between mb-8 mt-2">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900">
          Assignments
        </h1>
      </div>

      {/* Search Bar */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Table view for tablet/desktop */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto bg-white rounded-lg shadow mt-4">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="text-left p-4">Course</th>
                <th className="text-left p-4">Unit</th>
                <th className="text-left p-4">Issue Date</th>
                <th className="text-left p-4">Deadline</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Download</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((assignment, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4">{assignment.course}</td>
                  <td className="p-4">{assignment.unit}</td>
                  <td className="p-4">{assignment.issuesDate}</td>
                  <td className="p-4">{assignment.deadline}</td>
                  <td className="p-4">
                    <span className={`font-medium ${
                      assignment.status === 'Submitted' ? 'text-green-600'
                      : assignment.status === 'Late Submission' ? 'text-yellow-600'
                      : 'text-red-600'
                    }`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {assignment.file ? (
                      <a
                        href={assignment.file}
                        download
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-400">No File</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card view for mobile */}
      <div className="sm:hidden mt-4 space-y-4">
        {filteredAssignments.map((assignment, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-4">
            <p><span className="font-semibold">Course:</span> {assignment.course}</p>
            <p><span className="font-semibold">Unit:</span> {assignment.unit}</p>
            <p><span className="font-semibold">Issue Date:</span> {assignment.issuesDate}</p>
            <p><span className="font-semibold">Deadline:</span> {assignment.deadline}</p>
            <p>
              <span className="font-semibold">Status:</span>{' '}
              <span className={`font-medium ${
                assignment.status === 'Submitted' ? 'text-green-600'
                : assignment.status === 'Late Submission' ? 'text-yellow-600'
                : 'text-red-600'
              }`}>
                {assignment.status}
              </span>
            </p>
            <p className="mt-2">
  {assignment.file ? (
    <a
      href={assignment.file}
      download
      className="inline-flex items-center gap-2 text-white font-medium px-3 py-1 rounded bg-[#49BBBD] hover:opacity-90 transition"
    >
      <FiDownload className="text-lg" />
      Download
    </a>
  ) : (
    <span className="text-gray-400">No File</span>
  )}
</p>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
