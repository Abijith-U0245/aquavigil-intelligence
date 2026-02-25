import { motion } from "framer-motion";
import { Database, Brain, BarChart3, FileText, ArrowRight } from "lucide-react";

const steps = [
  { icon: Database, label: "Input", desc: "District data & parameters" },
  { icon: Brain, label: "AI Risk Engine", desc: "Multi-factor analysis" },
  { icon: BarChart3, label: "Impact Analysis", desc: "Risk scoring & visualization" },
  { icon: FileText, label: "Policy Insights", desc: "Actionable recommendations" },
];

const SolutionSection = () => (
  <section className="py-24 px-4 relative overflow-hidden">
    <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-hero)" }} />
    <div className="container mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How AquaVigil Works</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          An end-to-end AI pipeline that transforms raw district data into actionable intelligence.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="flex items-center gap-2"
          >
            <div className="glass-card p-6 text-center min-w-[160px]">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3" style={{ background: "var(--gradient-primary)" }}>
                <step.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="font-semibold text-sm mb-1">{step.label}</p>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight className="w-5 h-5 text-primary hidden md:block flex-shrink-0" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionSection;
