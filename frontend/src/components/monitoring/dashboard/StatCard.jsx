const StatCard = ({ title, value, diff }) => {
  const isUp = diff > 0;

  return (
    <div className="stat-card">
      <h4>{title}</h4>
      <strong>{value}</strong>
      {diff !== undefined && (
        <span className={isUp ? "up" : "down"}>
          {isUp ? "▲" : "▼"} {Math.abs(diff)}%
        </span>
      )}
    </div>
  );
};

export default StatCard;
