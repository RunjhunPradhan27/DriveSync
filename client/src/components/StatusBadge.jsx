const STATUS_STYLES = {
  Available: 'bg-green-100 text-green-800',
  Reserved: 'bg-yellow-100 text-yellow-800',
  Sold: 'bg-gray-200 text-gray-700',
  In_Maintenance: 'bg-red-100 text-red-800',
  'In Stock': 'bg-green-100 text-green-800',
  'Low Stock': 'bg-yellow-100 text-yellow-800',
  'Out of Stock': 'bg-red-100 text-red-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  In_Progress: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-200 text-gray-700'
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-700';

  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {typeof status === 'string' ? status.replace('_', ' ') : status}
    </span>
  );
};

export default StatusBadge;
