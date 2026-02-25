import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Activity } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const floatingCards = [
  { label: "Risk Level", value: "87%", color: "destructive", delay: 0.8 },
  { label: "Water Index", value: "4.2/10", color: "primary", delay: 1.0 },
  { label: "AMR Alert", value: "Active", color: "secondary", delay: 1.2 },
];

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
    {/* Background */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
    </div>

    <div className="container relative z-10 px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-8">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary tracking-wide uppercase">Real-Time Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            AI-Powered{" "}
            <span className="gradient-text">Pharmaceutical Pollution</span>{" "}
            Intelligence
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
            Monitor antimicrobial resistance risks, track pharmaceutical contamination in water bodies, and generate actionable policy insights — all powered by advanced AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/analyzer" className="btn-primary-gradient inline-flex items-center gap-2">
              Start Risk Assessment <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/results" className="btn-glass inline-flex items-center gap-2">
              View Demo
            </Link>
          </div>
        </motion.div>

        {/* Floating cards */}
        <div className="mt-16 flex flex-wrap justify-center gap-4">
          {floatingCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: card.delay, duration: 0.5 }}
              className="glass-card px-6 py-4 animate-float"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
              <p className="text-xl font-bold mono">{card.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
