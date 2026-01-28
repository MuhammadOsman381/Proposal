import { JSX, useEffect, useState } from "react";

const SnowFlower = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
  >
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="4.22" y1="4.22" x2="19.78" y2="19.78" />
    <line x1="19.78" y1="4.22" x2="4.22" y2="19.78" />
  </svg>
);

export default function GridBackground() {
  const [flakes, setFlakes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newFlakes = [...Array(40)].map((_, i) => {
      const size = 12 + Math.random() * 12; // 12px to 24px
      const left = Math.random() * 100; // %
      const top = -50 - Math.random() * 200; // px above viewport
      const duration = 5 + Math.random() * 5; // seconds
      const delay = Math.random() * 5; // seconds

      return (
        <div
          key={i}
          className="absolute animate-fall"
          style={{
            left: `${left}%`,
            top: `${top}px`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        >
          <SnowFlower />
        </div>
      );
    });
    setFlakes(newFlakes);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 bg-grid-fade" />
      <div className="absolute inset-0 pointer-events-none">{flakes}</div>
    </div>
  );
}
