export default function Loading() {
  return (
    <div className="wrap loading-page">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" />

      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="skeleton-card" key={index}>
            <div className="skeleton skeleton-image" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text short" />
            <div className="skeleton skeleton-price" />
          </div>
        ))}
      </div>
    </div>
  );
}