"use client";

import React, { useEffect, useState, useRef } from "react";

interface SpotlightProps {
  className?: string;
  size?: number;
}

export function Spotlight({
  className = "from-emerald-800 via-emerald-600 to-emerald-400 blur-xl",
  size = 350,
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: -500, y: -500 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPosition({ x, y });
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-3xl ${className}`}
      style={{
        opacity,
        background: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, rgba(16, 185, 129, 0.28), rgba(5, 150, 105, 0.12) 45%, transparent 80%)`,
      }}
    />
  );
}
