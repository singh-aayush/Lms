import StatusBadge from '../Instructor_assignment_component/statusBadge';

export default function AssignmentRow({ assignment }) {
  const unitColors = {
    '01': 'bg-gray-300',
    '02': 'bg-red-600',
    '03': 'bg-green-500',
  };

  return (
    <tr className="hover:bg-gray-50 text-sm">
      <td className="px-4 py-4 whitespace-nowrap">
        <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
      </td>

      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
        <div className="flex items-center gap-2">
          <span className={`w-4 h-4 rounded-full ${unitColors[assignment.unit] || 'bg-gray-400'}`} />
          {assignment.unit}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
        {assignment.subject}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
        {assignment.issuesDate}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
        {assignment.deadline}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={assignment.status} />
      </td>
    </tr>
  );
}
