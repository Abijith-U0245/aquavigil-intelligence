import { motion } from "framer-motion";

interface RiskGaugeProps {
  score: number; // 0-100
  size?: "sm" | "lg";
}

const RiskGauge = ({ score, size = "sm" }: RiskGaugeProps) => {
  const radius = size === "lg" ? 80 : 50;
  const stroke = size === "lg" ? 10 : 7;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference * 0.75; // 270 degrees
  const svgSize = (radius + stroke) * 2;

  const level = score >= 70 ? "high" : score >= 40 ? "moderate" : "low";
  const color = score >= 70 ? "hsl(0 72% 51%)" : score >= 40 ? "hsl(38 92% 50%)" : "hsl(142 71% 45%)";
  const label = score >= 70 ? "High Risk" : score >= 40 ? "Moderate Risk" : "Low Risk";

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="-rotate-[135deg]">
          {/* Background track */}
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={stroke}
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeLinecap="round"
          />
          {/* Progress */}
          <motion.circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference * 0.75 }}
            animate={{ strokeDashoffset: circumference * 0.75 - progress }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-bold mono"
            style={{ fontSize: size === "lg" ? "2.5rem" : "1.5rem", color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <span
        className="mt-2 text-xs font-semibold px-3 py-1 rounded-full"
        style={{
          backgroundColor: `${color}20`,
          color,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default RiskGauge;
