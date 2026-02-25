import { motion } from "framer-motion";
import { Droplets, Bug, MapPin } from "lucide-react";

const problems = [
  {
    icon: Droplets,
    title: "Invisible Water Contamination",
    description: "Pharmaceutical residues in water sources remain undetected without specialized monitoring, threatening ecosystems and public health silently.",
  },
  {
    icon: Bug,
    title: "Rising Antimicrobial Resistance",
    description: "Sub-therapeutic concentrations of antibiotics in the environment accelerate AMR, creating drug-resistant pathogens that pose global health emergencies.",
  },
  {
    icon: MapPin,
    title: "Lack of District-Level Monitoring",
    description: "Most pollution tracking systems operate at national scale, missing critical district-level hotspots where pharmaceutical manufacturing clusters exist.",
  },
];

const ProblemSection = () => (
  <section className="py-24 px-4">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">The Growing Crisis</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Pharmaceutical pollution is an invisible yet accelerating threat to global water safety and public health.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {problems.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="glass-card-hover p-8"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-primary/10">
              <p.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-3">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
