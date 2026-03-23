import React, { useMemo } from "react";

type DetectionResult = {
  box: { xmin: number; ymin: number; xmax: number; ymax: number };
  label: string;
  score: number;
};

export default function BoundingBox({ object }: { object: DetectionResult }) {
  const { box, label, score } = object;
  const { xmax, xmin, ymax, ymin } = box;

  const color = useMemo(() => getLabelColor(label), [label]);
  const left = 100 * xmin + "%";
  const top = 100 * ymin + "%";
  const width = 100 * (xmax - xmin) + "%";
  const height = 100 * (ymax - ymin) + "%";

  return (
    <>
      <span
        className="absolute px-3 text-sm text-white"
        style={{
          left,
          top,
          backgroundColor: color,
        }}
      >
        {label} {(score * 100).toFixed(0)}%
      </span>
      <div
        className="absolute rounded-sm"
        style={{
          left,
          top,
          width,
          height,
          border: `2px solid ${color}`,
        }}
      />
    </>
  );
}

function getLabelColor(label: string): string {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  return "#" + ((hash & 0xffffff) >>> 0).toString(16).padStart(6, "0");
}
