import { Link } from 'react-router-dom';
import { Heart, Mail, Globe } from 'lucide-react';

function Github({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function Twitter({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function Linkedin({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 border-t border-white/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl medical-gradient-bg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <div>
                <span className="text-lg font-bold font-display text-white">MediAssist</span>
                <span className="text-cyan-400 text-xs block -mt-1">AI POWERED</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              AI-powered healthcare assistant aligned with UN Sustainable Development Goal 3: 
              Good Health & Well-Being. Making healthcare guidance accessible to everyone.
            </p>
            <div className="flex items-center gap-2">
              <img
                src="https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-03.jpg"
                alt="SDG 3"
                className="h-10 rounded"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span className="text-xs text-cyan-400 font-medium">Supporting SDG 3</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/features" className="text-sm hover:text-cyan-400 transition-colors">Features</Link></li>
              <li><Link to="/about" className="text-sm hover:text-cyan-400 transition-colors">About</Link></li>
              <li><Link to="/login" className="text-sm hover:text-cyan-400 transition-colors">AI Symptom Checker</Link></li>
              <li><Link to="/login" className="text-sm hover:text-cyan-400 transition-colors">Healthcare Chat</Link></li>
              <li><Link to="/login" className="text-sm hover:text-cyan-400 transition-colors">Medical Reports</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/faq" className="text-sm hover:text-cyan-400 transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-cyan-400 transition-colors">Contact</Link></li>
              <li><a href="#" className="text-sm hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm hover:text-cyan-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm hover:text-cyan-400 transition-colors">API Documentation</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:hello@mediassist.ai" className="flex items-center gap-2 text-sm hover:text-cyan-400 transition-colors">
                  <Mail className="w-4 h-4" /> hello@mediassist.ai
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-sm hover:text-cyan-400 transition-colors">
                  <Globe className="w-4 h-4" /> mediassist.ai
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-cyan-400 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-cyan-400 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-cyan-400 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} MediAssist AI. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400" fill="currentColor" /> for better healthcare
          </p>
          <p className="text-[10px] text-gray-600 max-w-md text-center sm:text-right">
            Disclaimer: MediAssist AI provides health information for educational purposes only and is not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
