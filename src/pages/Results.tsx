import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { FileDown, Share2, RefreshCw, AlertTriangle, Shield, Lightbulb, ScrollText, ChevronDown } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import RiskGauge from "@/components/shared/RiskGauge";

const barData = [
  { name: "Pharma Density", value: 78 },
  { name: "Waste Mgmt", value: 35 },
  { name: "Water Risk", value: 62 },
  { name: "AMR Signals", value: 85 },
  { name: "Population", value: 55 },
];

const lineData = [
  { month: "Jan", risk: 45, infra: 60 },
  { month: "Feb", risk: 52, infra: 58 },
  { month: "Mar", risk: 58, infra: 55 },
  { month: "Apr", risk: 55, infra: 52 },
  { month: "May", risk: 68, infra: 48 },
  { month: "Jun", risk: 72, infra: 45 },
];

const interventions = [
  { text: "Mandate effluent treatment for all pharma units in the cluster", priority: "Immediate" },
  { text: "Deploy continuous water quality monitoring sensors at discharge points", priority: "Immediate" },
  { text: "Establish AMR surveillance program at district hospitals", priority: "Mid-term" },
  { text: "Develop pharmaceutical waste recycling infrastructure", priority: "Mid-term" },
  { text: "Create public health awareness campaign on antimicrobial stewardship", priority: "Long-term" },
];

const policyAccordions = [
  { title: "Regulatory Framework Enhancement", content: "Implement stricter pharmaceutical discharge limits aligned with WHO guidelines. Require environmental impact assessments for all new pharmaceutical manufacturing facilities. Establish inter-agency coordination between environmental and health authorities." },
  { title: "Surveillance Infrastructure", content: "Deploy IoT-enabled water quality monitoring across high-risk districts. Create real-time dashboards for decision-makers. Integrate AMR surveillance data with environmental monitoring systems." },
  { title: "Industry Engagement Strategy", content: "Establish extended producer responsibility programs for pharmaceutical waste. Create incentive structures for green chemistry adoption. Develop industry-wide standards for effluent treatment." },
];

const Results = () => {
  const location = useLocation();
  const score = (location.state as any)?.score ?? 72;
  const district = (location.state as any)?.district ?? "Patancheru, Telangana";
  const [openPolicy, setOpenPolicy] = useState<number | null>(0);

  const priorityColor = (p: string) =>
    p === "Immediate" ? "text-destructive bg-destructive/10" : p === "Mid-term" ? "text-secondary bg-secondary/10" : "text-primary bg-primary/10";

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">AI Risk Assessment Results</h1>
          <p className="text-muted-foreground">{district}</p>
        </motion.div>

        {/* Score */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-card p-8 flex flex-col items-center mb-8">
          <RiskGauge score={score} size="lg" />
          <p className="mt-6 text-sm text-muted-foreground text-center max-w-lg">
            Based on multi-factor analysis of pharmaceutical manufacturing density, waste management infrastructure, population exposure, and water body proximity, this district exhibits {score >= 70 ? "elevated" : score >= 40 ? "moderate" : "low"} risk indicators for pharmaceutical pollution and associated antimicrobial resistance.
          </p>
        </motion.div>

        {/* 4 Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Contamination */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h3 className="font-semibold">Contamination Risk Analysis</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              The presence of major pharmaceutical manufacturing clusters combined with inadequate effluent treatment infrastructure creates significant contamination vectors. Active pharmaceutical ingredients including fluoroquinolones and macrolides have been detected in downstream water sources at concentrations exceeding safe environmental thresholds.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">Severity: High</span>
            </div>
          </motion.div>

          {/* AMR */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-secondary" />
              <h3 className="font-semibold">AMR Public Health Impact</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sub-inhibitory concentrations of <span className="text-foreground font-medium">antibiotics</span> in water bodies create selection pressure for <span className="text-foreground font-medium">drug-resistant bacteria</span>. District-level hospital data shows a 23% increase in <span className="text-foreground font-medium">multi-drug resistant</span> infections over 18 months, correlating with pharmaceutical discharge patterns upstream.
            </p>
          </motion.div>

          {/* Interventions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Recommended Interventions</h3>
            </div>
            <ul className="space-y-3">
              {interventions.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap mt-0.5 ${priorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                  <span className="text-muted-foreground">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Policy */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <ScrollText className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Policy Strategy Insights</h3>
            </div>
            <div className="space-y-2">
              {policyAccordions.map((item, i) => (
                <div key={i} className="border border-border/30 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenPolicy(openPolicy === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/30 transition-colors"
                  >
                    {item.title}
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openPolicy === i ? "rotate-180" : ""}`} />
                  </button>
                  {openPolicy === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="px-4 pb-3 text-xs text-muted-foreground leading-relaxed"
                    >
                      {item.content}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card p-6">
            <h3 className="font-semibold mb-4">Risk Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(220 20% 10%)", border: "1px solid hsl(220 15% 18%)", borderRadius: "0.75rem", color: "hsl(210 40% 96%)" }} />
                <Bar dataKey="value" fill="hsl(160 84% 39%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="glass-card p-6">
            <h3 className="font-semibold mb-4">Infrastructure vs Risk Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(220 20% 10%)", border: "1px solid hsl(220 15% 18%)", borderRadius: "0.75rem", color: "hsl(210 40% 96%)" }} />
                <Line type="monotone" dataKey="risk" stroke="hsl(0 72% 51%)" strokeWidth={2} dot={{ r: 4 }} name="Risk Score" />
                <Line type="monotone" dataKey="infra" stroke="hsl(160 84% 39%)" strokeWidth={2} dot={{ r: 4 }} name="Infrastructure" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Export */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="flex flex-wrap justify-center gap-4">
          <button className="btn-primary-gradient flex items-center gap-2">
            <FileDown className="w-4 h-4" /> Download AI Report
          </button>
          <button className="btn-glass flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Share Summary
          </button>
          <button className="btn-glass flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Regenerate Analysis
          </button>
        </motion.div>
      </div>
    </main>
  );
};

export default Results;
