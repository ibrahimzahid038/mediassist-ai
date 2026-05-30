import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'stable';
  };
  color?: 'cyan' | 'green' | 'orange' | 'red' | 'blue' | 'purple';
  delay?: number;
}

const colorMap = {
  cyan: {
    iconBg: 'bg-cyan-100 dark:bg-cyan-500/15',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    shadow: 'shadow-cyan-500/10',
  },
  green: {
    iconBg: 'bg-emerald-100 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    shadow: 'shadow-emerald-500/10',
  },
  orange: {
    iconBg: 'bg-orange-100 dark:bg-orange-500/15',
    iconColor: 'text-orange-600 dark:text-orange-400',
    shadow: 'shadow-orange-500/10',
  },
  red: {
    iconBg: 'bg-red-100 dark:bg-red-500/15',
    iconColor: 'text-red-600 dark:text-red-400',
    shadow: 'shadow-red-500/10',
  },
  blue: {
    iconBg: 'bg-blue-100 dark:bg-blue-500/15',
    iconColor: 'text-blue-600 dark:text-blue-400',
    shadow: 'shadow-blue-500/10',
  },
  purple: {
    iconBg: 'bg-purple-100 dark:bg-purple-500/15',
    iconColor: 'text-purple-600 dark:text-purple-400',
    shadow: 'shadow-purple-500/10',
  },
};

export default function StatCard({ title, value, icon: Icon, trend, color = 'cyan', delay = 0 }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className={cn('glass-card p-5 card-hover', colors.shadow)}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold font-display tracking-tight">{value}</p>
          {trend && (
            <div className="flex items-center gap-1.5">
              {trend.direction === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
              {trend.direction === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
              {trend.direction === 'stable' && <Minus className="w-3.5 h-3.5 text-gray-400" />}
              <span className={cn(
                'text-xs font-medium',
                trend.direction === 'up' ? 'text-emerald-600 dark:text-emerald-400' :
                trend.direction === 'down' ? 'text-red-600 dark:text-red-400' :
                'text-gray-500'
              )}>
                {trend.direction === 'up' ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', colors.iconBg)}>
          <Icon className={cn('w-5 h-5', colors.iconColor)} />
        </div>
      </div>
    </motion.div>
  );
}
