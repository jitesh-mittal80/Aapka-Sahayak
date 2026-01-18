type Status =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED_PENDING_VERIFICATION"
  | "RESOLVED_CONFIRMED"
  | "REOPENED";

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusClass = () => {
    switch (status) {
      case "OPEN":
        return "status-badge bg-red-100 text-red-700";
      case "IN_PROGRESS":
        return "status-badge bg-yellow-100 text-yellow-700";
      case "RESOLVED_PENDING_VERIFICATION":
        return "status-badge bg-blue-100 text-blue-700";
      case "RESOLVED_CONFIRMED":
        return "status-badge bg-green-100 text-green-700";
      case "REOPENED":
        return "status-badge bg-purple-100 text-purple-700";
      default:
        return "status-badge";
    }
  };

  return (
    <span className={`${getStatusClass()} px-2 py-1 rounded text-xs font-medium`}>
      {status.split("_").join(" ")}
    </span>
  );
};

export default StatusBadge;
