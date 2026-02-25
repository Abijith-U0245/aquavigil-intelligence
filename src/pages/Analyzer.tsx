import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Factory, Gauge, Users, Droplets, Loader2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RiskGauge from "@/components/shared/RiskGauge";

const densityOptions = ["Low", "Medium", "High", "Very High"];

const Analyzer = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    district: "",
    pharmaPresence: "moderate",
    wasteScore: 50,
    density: "Medium",
    waterProximity: true,
  });
  const [loading, setLoading] = useState(false);

  // Live risk preview calculation
  const presenceWeight = form.pharmaPresence === "high" ? 30 : form.pharmaPresence === "moderate" ? 18 : 8;
  const wasteWeight = ((100 - form.wasteScore) / 100) * 25;
  const densityWeight = densityOptions.indexOf(form.density) * 8;
  const waterWeight = form.waterProximity ? 12 : 0;
  const liveScore = Math.min(100, Math.round(presenceWeight + wasteWeight + densityWeight + waterWeight + 10));

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/results", { state: { score: liveScore, district: form.district || "Sample District" } });
    }, 2000);
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Risk Intelligence Analyzer</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Enter district parameters to generate an AI-powered pharmaceutical pollution risk assessment.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8">
            <h2 className="text-lg font-semibold mb-6">Assessment Parameters</h2>
            <div className="space-y-6">
              {/* District */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">City / District</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="e.g., Hyderabad, Patancheru"
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="w-full bg-muted/50 border border-border/50 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              {/* Pharma Presence */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Pharma Manufacturing Presence</label>
                <div className="relative">
                  <Factory className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={form.pharmaPresence}
                    onChange={(e) => setForm({ ...form, pharmaPresence: e.target.value })}
                    className="w-full bg-muted/50 border border-border/50 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="low">Low — Few Facilities</option>
                    <option value="moderate">Moderate — Regional Hub</option>
                    <option value="high">High — Major Industrial Cluster</option>
                  </select>
                </div>
              </div>

              {/* Waste Score */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1"><Gauge className="w-4 h-4" /> Waste Infrastructure Score</span>
                  <span className="mono text-primary font-semibold">{form.wasteScore}/100</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={form.wasteScore}
                  onChange={(e) => setForm({ ...form, wasteScore: +e.target.value })}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                  style={{
                    background: `linear-gradient(to right, hsl(160 84% 39%) ${form.wasteScore}%, hsl(var(--muted)) ${form.wasteScore}%)`,
                  }}
                />
              </div>

              {/* Density */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <Users className="w-4 h-4" /> Population Density
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {densityOptions.map((d) => (
                    <button
                      key={d}
                      onClick={() => setForm({ ...form, density: d })}
                      className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                        form.density === d
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Water Proximity */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Droplets className="w-4 h-4" /> Near Water Body
                </label>
                <button
                  onClick={() => setForm({ ...form, waterProximity: !form.waterProximity })}
                  className={`w-12 h-7 rounded-full transition-all relative ${
                    form.waterProximity ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-foreground absolute top-1 transition-all ${
                      form.waterProximity ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full btn-primary-gradient flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                ) : (
                  <>Generate Risk Assessment <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </motion.div>

          {/* Live Preview */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-8 flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold mb-8">Live Risk Preview</h2>
            <RiskGauge score={liveScore} size="lg" />
            <div className="mt-8 w-full space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">District</span>
                <span className="font-medium">{form.district || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pharma Presence</span>
                <span className="font-medium capitalize">{form.pharmaPresence}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Infrastructure</span>
                <span className="font-medium mono">{form.wasteScore}/100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Population</span>
                <span className="font-medium">{form.density}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Analyzer;
