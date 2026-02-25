import { Droplets } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/30 py-12 px-4">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Droplets className="w-5 h-5 text-primary" />
        <span className="font-semibold">AquaVigil</span>
      </div>
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <Link to="/analyzer" className="hover:text-foreground transition-colors">Analyzer</Link>
        <Link to="/results" className="hover:text-foreground transition-colors">Dashboard</Link>
      </div>
      <p className="text-xs text-muted-foreground">© 2026 AquaVigil. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
