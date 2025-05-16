import { useState } from 'react';
import AssignmentTable from '../Instructor_assignment_component/assignmentTable';
import SearchBar from '../Instructor_assignment_component/searchBar';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const assignmentsData = [
    { unit: '03', subject: 'CRP', issuesDate: '03/02/2023', deadline: '03/05/2023', status: 'Submitted' },
    { unit: '01', subject: 'Programming', issuesDate: '03/09/2023', deadline: '03/09/2025', status: 'Pending' },
    { unit: '01', subject: 'Database', issuesDate: '03/02/2024', deadline: '03/10/2026', status: 'Pending' },
    { unit: '01', subject: 'Networking', issuesDate: '02/05/2022', deadline: '03/11/2023', status: 'Pending' },
    { unit: '02', subject: 'Security', issuesDate: '02/08/2022', deadline: '03/10/2023', status: 'Late Submission' },
    { unit: '03', subject: 'CRP', issuesDate: '03/02/2023', deadline: '03/05/2023', status: 'Submitted' },
    { unit: '01', subject: 'Programming', issuesDate: '03/09/2023', deadline: '03/09/2025', status: 'Pending' },
    { unit: '01', subject: 'Database', issuesDate: '03/02/2024', deadline: '03/10/2026', status: 'Pending' },
    { unit: '01', subject: 'Networking', issuesDate: '02/05/2022', deadline: '03/11/2023', status: 'Pending' },
    { unit: '02', subject: 'Security', issuesDate: '02/08/2022', deadline: '03/10/2023', status: 'Late Submission' },
  ];

  const filteredAssignments = assignmentsData.filter(assignment =>
    assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-0 px-4 lg:px-6 py-4 lg:py-12">
      {/* Heading */}
      <div className="flex items-center justify-between mb-8 mt-2">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900">
          Dashboard
        </h1>
      </div>

      {/* Search and Table */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <AssignmentTable assignments={filteredAssignments} />
    </div>
  );
}

export default Home;
