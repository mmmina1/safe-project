export function Skeleton({ width, height, borderRadius = '8px', style = {} }) {
  return (
    <div
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius,
        background: 'linear-gradient(90deg, #363a4d 25%, #2C2F40 50%, #363a4d 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div style={{ padding: '20px' }}>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '12px',
            alignItems: 'center',
          }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              width={colIdx === 0 ? '60px' : colIdx === columns - 1 ? '120px' : '100%'}
              height="40px"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div
      style={{
        background: '#363a4d',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #545763',
      }}
    >
      <Skeleton width="60%" height="24px" style={{ marginBottom: '16px' }} />
      <Skeleton width="100%" height="40px" style={{ marginBottom: '12px' }} />
      <Skeleton width="80%" height="40px" style={{ marginBottom: '12px' }} />
      <Skeleton width="40%" height="40px" />
    </div>
  );
}
