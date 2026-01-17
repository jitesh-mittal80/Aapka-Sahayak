type Status = 'Pending' | 'In Progress' | 'Verified';

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusClass = () => {
    switch (status) {
      case 'Pending':
        return 'status-badge status-pending';
      case 'In Progress':
        return 'status-badge status-progress';
      case 'Verified':
        return 'status-badge status-verified';
      default:
        return 'status-badge';
    }
  };

  return <span className={getStatusClass()}>{status}</span>;
};

export default StatusBadge;
