import { useRef, useEffect, useState } from "react";

// Utility for formatting numbers
const formatNumber = (value, digits = 2) =>
  Number.isFinite(value) ? value.toFixed(digits) : "0.00";

// Reusable slider control
const Control = ({ label, value, unit, min, max, step, onChange }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between text-sm text-slate-300">
      <span>{label}</span>
      <span className="font-semibold text-white">
        {formatNumber(value)} {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-blue-500"
    />
    <div className="flex items-center justify-between text-xs text-slate-400">
      <span>{min}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-24 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-right text-white"
      />
      <span>{max}</span>
    </div>
  </div>
);

export default function ElectricFieldVisualizer() {
  const canvasRef = useRef(null);
  const [charge1, setCharge1] = useState(1);
  const [charge2, setCharge2] = useState(-1);
  const [distance, setDistance] = useState(200);

  const width = 600;
  const height = 500;
  const k = 9000;

  const drawArrow = (ctx, x1, y1, x2, y2) => {
    const headlen = 5;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(
      x2 - headlen * Math.cos(angle - Math.PI / 6),
      y2 - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headlen * Math.cos(angle + Math.PI / 6),
      y2 - headlen * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };

  const drawField = (ctx) => {
    ctx.clearRect(0, 0, width, height);
    const q1 = { x: width / 2 - distance / 2, y: height / 2, q: charge1 };
    const q2 = { x: width / 2 + distance / 2, y: height / 2, q: charge2 };
    const charges = [q1, q2];

    const spacing = 25;
    for (let x = 0; x < width; x += spacing) {
      for (let y = 0; y < height; y += spacing) {
        let Ex = 0,
          Ey = 0;
        for (let c of charges) {
          const dx = x - c.x;
          const dy = y - c.y;
          const r2 = dx * dx + dy * dy;
          const r = Math.sqrt(r2);
          if (r < 10) continue;
          const E = (k * c.q) / r2;
          Ex += E * (dx / r);
          Ey += E * (dy / r);
        }

        const len = Math.sqrt(Ex * Ex + Ey * Ey);
        const scale = 1000 / (len + 1000);
        ctx.strokeStyle = "rgba(147,197,253,0.8)";
        drawArrow(ctx, x, y, x + Ex * scale, y + Ey * scale);
      }
    }

    // Draw charges
    for (let c of charges) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 12, 0, 2 * Math.PI);
      ctx.fillStyle = c.q > 0 ? "#60a5fa" : "#f87171";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    drawField(ctx);
  }, [charge1, charge2, distance]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-blue-500/20 shadow-2xl rounded-2xl p-8 flex flex-col lg:flex-row gap-8">
          {/* Canvas Section */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                  Electric Field Visualizer
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Electric Fields and Coulomb’s Law in Action
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-950/80 to-slate-900/80 p-6 shadow-inner flex justify-center">
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="rounded-lg border border-slate-700 shadow-lg"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 text-center">
                <div className="text-xs text-blue-400 mb-1 font-semibold tracking-wide">
                  Charge 1 (q₁)
                </div>
                <div className="text-2xl font-bold text-white">
                  {charge1 > 0 ? "+" : ""}
                  {charge1} <span className="text-sm text-slate-400">C</span>
                </div>
              </div>
              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-center">
                <div className="text-xs text-red-400 mb-1 font-semibold tracking-wide">
                  Charge 2 (q₂)
                </div>
                <div className="text-2xl font-bold text-white">
                  {charge2 > 0 ? "+" : ""}
                  {charge2} <span className="text-sm text-slate-400">C</span>
                </div>
              </div>
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 text-center">
                <div className="text-xs text-cyan-400 mb-1 font-semibold tracking-wide">
                  Separation
                </div>
                <div className="text-2xl font-bold text-white">
                  {distance} <span className="text-sm text-slate-400">px</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            <div className="flex flex-col gap-5 rounded-2xl border border-slate-700/50 bg-slate-950/60 p-6">
              <Control
                label="Charge 1 (q₁)"
                value={charge1}
                unit="C"
                min={-3}
                max={3}
                step={0.5}
                onChange={setCharge1}
              />
              <Control
                label="Charge 2 (q₂)"
                value={charge2}
                unit="C"
                min={-3}
                max={3}
                step={0.5}
                onChange={setCharge2}
              />
              <Control
                label="Distance Between Charges"
                value={distance}
                unit="px"
                min={100}
                max={400}
                step={10}
                onChange={setDistance}
              />
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <div className="text-xs text-amber-400 mb-3 font-semibold tracking-wide">
                💡 Quick Presets
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setCharge1(1);
                    setCharge2(-1);
                    setDistance(200);
                  }}
                  className="text-xs text-left px-3 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/50 transition-all duration-200"
                >
                  ⚡ Dipole
                </button>
                <button
                  onClick={() => {
                    setCharge1(1);
                    setCharge2(1);
                    setDistance(200);
                  }}
                  className="text-xs text-left px-3 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/50 transition-all duration-200"
                >
                  ➕➕ Like Charges
                </button>
                <button
                  onClick={() => {
                    setCharge1(-1);
                    setCharge2(-1);
                    setDistance(200);
                  }}
                  className="text-xs text-left px-3 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/50 transition-all duration-200"
                >
                  ➖➖ Negative Pair
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}