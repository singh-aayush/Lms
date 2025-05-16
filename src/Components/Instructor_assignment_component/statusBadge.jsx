export default function StatusBadge({ status }) {
  const getStatusClasses = () => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'late submission':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusClasses()}`}>
      {status}
    </span>
  );
}
