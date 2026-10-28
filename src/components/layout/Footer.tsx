import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, ExternalLink, Globe, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                ScholarMatch <span className="text-blue-400 font-extrabold text-xs px-1.5 py-0.5 rounded bg-blue-900/60 border border-blue-700">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Democratizing global education funding. We analyze your academic profile against official government and university scholarship eligibility criteria to recommend real, verified opportunities.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 bg-teal-950/60 border border-teal-800/60 rounded-md p-2.5 max-w-sm">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Official Source Verification Policy — Zero invented scholarships.</span>
            </div>
          </div>

          {/* Links Col 1: Discovery */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/scholarships" className="text-slate-400 hover:text-white transition">
                  Browse All Scholarships
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="text-slate-400 hover:text-white transition flex items-center gap-1">
                  AI Match Engine <Sparkles className="w-3 h-3 text-amber-400" />
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-slate-400 hover:text-white transition">
                  Side-by-Side Comparison
                </Link>
              </li>
              <li>
                <Link to="/applications" className="text-slate-400 hover:text-white transition">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link to="/scholarships?funding=fully_funded" className="text-slate-400 hover:text-white transition">
                  Fully Funded Opportunities
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 2: Destinations */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Destinations</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/scholarships?country=United%20Kingdom" className="text-slate-400 hover:text-white transition flex items-center gap-1">
                  <span>🇬🇧</span> United Kingdom (Chevening, Gates)
                </Link>
              </li>
              <li>
                <Link to="/scholarships?country=United%20States" className="text-slate-400 hover:text-white transition flex items-center gap-1">
                  <span>🇺🇸</span> United States (Fulbright)
                </Link>
              </li>
              <li>
                <Link to="/scholarships?country=Germany" className="text-slate-400 hover:text-white transition flex items-center gap-1">
                  <span>🇩🇪</span> Germany (DAAD)
                </Link>
              </li>
              <li>
                <Link to="/scholarships?country=European%20Union" className="text-slate-400 hover:text-white transition flex items-center gap-1">
                  <span>🇪🇺</span> European Union (Erasmus)
                </Link>
              </li>
              <li>
                <Link to="/scholarships?country=Australia" className="text-slate-400 hover:text-white transition flex items-center gap-1">
                  <span>🇦🇺</span> Australia (Australia Awards)
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 3: Trust & Company */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Trust & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition">
                  About the Platform
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-white transition">
                  Privacy Policy & Student Data
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-white transition">
                  Terms of Service & Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-slate-400 hover:text-white transition">
                  Methodology & Evaluation
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 hover:text-white transition inline-flex items-center gap-1"
                >
                  Source Provenance <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer Bar */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 space-y-3">
          <p className="leading-relaxed">
            <strong className="text-slate-400">Important Disclaimer:</strong> ScholarMatch AI provides informational recommendation estimates based on published public criteria. Match scores do not constitute an admission guarantee or award decision. Eligibility criteria and deadlines can change at any time. Applicants must always verify requirements directly on official government or university portals prior to submitting applications.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p>© {new Date().getFullYear()} ScholarMatch AI Inc. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verified Catalog V1.0
              </span>
              <span className="text-slate-600">|</span>
              <span>Protected Student Data (Zero Third-Party Ads)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
