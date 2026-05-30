import { motion } from 'framer-motion';
import { Construction, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto px-6"
      >
        {/* Animated icon */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-6"
        >
          <Construction className="w-10 h-10 text-cyan-500" />
        </motion.div>

        <h1 className="text-2xl font-bold font-display mb-3">{title}</h1>
        <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>

        <div className="glass-card p-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">Coming Soon</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            This feature is under active development and will be available shortly.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
