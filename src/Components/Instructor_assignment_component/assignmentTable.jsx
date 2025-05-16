import AssignmentRow from '../Instructor_assignment_component/assignmentRow';

export default function AssignmentTable({ assignments }) {
  return (
    <div className="w-full">
      {/* TABLE VIEW for desktop and tablets (md and up) */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="min-w-full overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 w-12 bg-slate-100"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-slate-100 whitespace-nowrap">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-slate-100 whitespace-nowrap">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-slate-100 whitespace-nowrap">
                    Issue Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-slate-100 whitespace-nowrap">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-slate-100 whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment, index) => (
                  <AssignmentRow key={index} assignment={assignment} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-end px-6 py-4 bg-slate-50">
          <button className="px-4 py-2 bg-[#49BBBD] text-sm text-gray-700 rounded hover:bg-[#49BBBD] cursor-pointer">
            Next
          </button>
        </div>
      </div>

      {/* CARD VIEW for mobile */}
      <div className="md:hidden space-y-4">
        {assignments.map((assignment, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 space-y-2">
            <div><strong>Unit:</strong> {assignment.unit}</div>
            <div><strong>Subject:</strong> {assignment.subject}</div>
            <div><strong>Issue Date:</strong> {assignment.issuesDate}</div>
            <div><strong>Deadline:</strong> {assignment.deadline}</div>
            <div className="flex items-center gap-2">
              <strong>Status:</strong>
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
          </div>
        ))}
      </div>
    </div>
  );
}
