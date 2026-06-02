import { useEffect, useState } from "react";

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState("enter"); // enter → drive → exit → done

  useEffect(() => {
    // Phase timeline
    const t1 = setTimeout(() => setPhase("drive"), 400);
    const t2 = setTimeout(() => setPhase("reveal"), 1800);
    const t3 = setTimeout(() => setPhase("exit"), 3200);
    const t4 = setTimeout(() => onComplete(), 4000);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transition: phase === "exit" ? "opacity 0.8s ease, transform 0.8s ease" : "none",
        opacity: phase === "exit" ? 0 : 1,
        transform: phase === "exit" ? "scale(1.05)" : "scale(1)",
      }}
    >
      {/* Animated road bg lines */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.15 }}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${i * 14}%`,
              top: 0,
              width: "1px",
              height: "100%",
              background: "linear-gradient(to bottom, transparent, #F5C518 50%, transparent)",
              animation: `vertLine 2s linear infinite`,
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}
      </div>

      {/* Glow orb */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,197,24,0.08) 0%, transparent 70%)",
        transition: "opacity 0.8s",
        opacity: phase === "reveal" || phase === "exit" ? 1 : 0,
      }} />

      {/* Road strip */}
      <div style={{
        position: "absolute",
        bottom: "30%",
        left: 0,
        right: 0,
        height: "3px",
        background: "linear-gradient(to right, transparent, #F5C518 20%, #F5C518 80%, transparent)",
        opacity: 0.3,
      }} />
      <div style={{
        position: "absolute",
        bottom: "32%",
        left: 0,
        right: 0,
        height: "1px",
        background: "linear-gradient(to right, transparent, rgba(245,197,24,0.15) 20%, rgba(245,197,24,0.15) 80%, transparent)",
      }} />

      {/* Dashed road center line */}
      <div style={{
        position: "absolute",
        bottom: "30.5%",
        left: 0,
        right: 0,
        height: "2px",
        overflow: "hidden",
      }}>
        <div style={{
          display: "flex",
          gap: "20px",
          animation: "dashMove 0.4s linear infinite",
          width: "200%",
        }}>
          {[...Array(40)].map((_, i) => (
            <div key={i} style={{ width: "40px", height: "2px", background: "rgba(245,197,24,0.4)", flexShrink: 0 }} />
          ))}
        </div>
      </div>

      {/* CAR */}
      <div style={{
        position: "absolute",
        bottom: "31%",
        left: phase === "enter" ? "-15%" : phase === "drive" || phase === "reveal" ? "50%" : "115%",
        transform: "translateX(-50%)",
        transition: phase === "drive"
          ? "left 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
          : phase === "exit"
          ? "left 0.8s cubic-bezier(0.55, 0, 1, 0.45)"
          : "left 0.4s ease",
        zIndex: 10,
      }}>
        {/* Car SVG */}
        <svg width="120" height="52" viewBox="0 0 120 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Car body */}
          <rect x="8" y="22" width="104" height="22" rx="4" fill="#F5C518"/>
          {/* Cabin */}
          <path d="M28 22 L38 8 L82 8 L92 22 Z" fill="#FFD84D"/>
          {/* Windows */}
          <path d="M42 10 L40 20 L60 20 L60 10 Z" fill="#0A0A0A" opacity="0.8"/>
          <path d="M62 10 L62 20 L80 20 L78 10 Z" fill="#0A0A0A" opacity="0.8"/>
          {/* Wheels */}
          <circle cx="32" cy="44" r="8" fill="#222"/>
          <circle cx="32" cy="44" r="4" fill="#555"/>
          <circle cx="88" cy="44" r="8" fill="#222"/>
          <circle cx="88" cy="44" r="4" fill="#555"/>
          {/* Headlight */}
          <rect x="108" y="27" width="8" height="6" rx="2" fill="#FFF9C4"/>
          {/* Tail light */}
          <rect x="4" y="27" width="6" height="6" rx="2" fill="#FF4444"/>
          {/* Door line */}
          <line x1="60" y1="22" x2="60" y2="44" stroke="#D4A800" strokeWidth="1.5" opacity="0.5"/>
        </svg>

        {/* Headlight beam */}
        <div style={{
          position: "absolute",
          right: "-60px",
          top: "28px",
          width: "60px",
          height: "10px",
          background: "linear-gradient(to right, rgba(255,249,196,0.6), transparent)",
          borderRadius: "0 50% 50% 0",
          opacity: 0.7,
        }} />

        {/* Speed lines */}
        {phase === "drive" && [0, 8, 16].map((offset, i) => (
          <div key={i} style={{
            position: "absolute",
            left: "-50px",
            top: `${20 + offset}px`,
            width: `${30 + i * 10}px`,
            height: "1.5px",
            background: "linear-gradient(to left, transparent, rgba(245,197,24,0.4))",
            animation: "speedLine 0.3s linear infinite",
            animationDelay: `${i * 0.1}s`,
          }} />
        ))}
      </div>

      {/* Logo & text - reveal phase */}
      <div style={{
        position: "relative",
        zIndex: 20,
        textAlign: "center",
        transform: phase === "reveal" || phase === "exit" ? "translateY(0)" : "translateY(30px)",
        opacity: phase === "reveal" || phase === "exit" ? 1 : 0,
        transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        {/* Logo icon */}
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "20px",
          background: "#F5C518",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          boxShadow: "0 0 40px rgba(245,197,24,0.4)",
          fontSize: "36px",
        }}>
          🚗
        </div>

        <h1 style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "2.5rem",
          fontWeight: 800,
          color: "#ffffff",
          letterSpacing: "-0.02em",
          margin: "0 0 8px",
          lineHeight: 1,
        }}>
          GetYourRide
        </h1>

        <p style={{
          color: "#F5C518",
          fontSize: "0.8rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontWeight: 600,
          opacity: 0.8,
        }}>
          Fast · Safe · Comfortable
        </p>

        {/* Loading dots */}
        <div style={{
          display: "flex",
          gap: "6px",
          justifyContent: "center",
          marginTop: "24px",
        }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#F5C518",
              animation: "dotPulse 1s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes vertLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes dashMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-60px); }
        }
        @keyframes speedLine {
          0% { opacity: 0.6; width: 40px; }
          100% { opacity: 0; width: 0; }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}