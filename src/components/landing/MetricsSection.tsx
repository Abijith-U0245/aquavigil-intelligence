import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const metrics = [
  { value: 312, suffix: "+", label: "Districts Covered" },
  { value: 48000, suffix: "+", label: "Risk Signals Processed" },
  { value: 1240, suffix: "", label: "AI Reports Generated" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [started, target]);

  return (
    <div ref={ref} className="mono text-4xl md:text-5xl font-bold gradient-text">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

const MetricsSection = () => (
  <section className="py-24 px-4">
    <div className="container mx-auto">
      <div className="grid md:grid-cols-3 gap-8">
        {metrics.map((m) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Counter target={m.value} suffix={m.suffix} />
            <p className="text-muted-foreground mt-2 text-sm">{m.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default MetricsSection;
