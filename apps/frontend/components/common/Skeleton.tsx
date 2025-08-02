"use client";

/**
 * Skeleton
 * Magyar: Egyszerű, téglalap alakú csontváz komponens pulzáló háttérrel.
 * - width/height: szám (px) vagy string (pl. "100%")
 * - Minimális inline stílus, külső függőség nélkül.
 */
export default function Skeleton(props: { width?: number | string; height?: number | string }) {
  const { width = "100%", height = 16 } = props;

  // Egyszerű pulzáló animáció CSS nélkül (inline keyframes nem támogatott),
  // ezért egy halványodó/erősödő árnyalat helyett egyszerű, visszafogott háttér.
  const style: { [k: string]: string | number } = {
    width,
    height,
    borderRadius: 6,
    background:
      "linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 20%, #f3f4f6 40%, #f3f4f6 100%)",
    backgroundSize: "200% 100%",
    animation: "skeletonPulse 1.2s ease-in-out infinite",
  };

  return (
    <>
      <style>{`
        @keyframes skeletonPulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div role="status" aria-live="polite" aria-busy="true" style={style} />
    </>
  );
}