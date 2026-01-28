export default function GridBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      {/* Grid */}
      <div className="absolute inset-0 bg-grid" />
      {/* Fade mask */}
      <div className="absolute inset-0 bg-grid-fade" />
    </div>
  );
}
