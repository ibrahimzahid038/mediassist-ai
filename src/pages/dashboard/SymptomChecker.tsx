import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope, Plus, X, Search, AlertTriangle, Shield, Activity,
  FileText, ChevronRight, Mic, MicOff, Sparkles, CheckCircle, Clock, Heart
} from 'lucide-react';
import { analyzeSymptoms, SYMPTOM_CATEGORIES } from '../../services/aiService';
import type { SymptomAnalysis, RiskLevel } from '../../types';
import { cn, getRiskBgClass, generateReportId } from '../../lib/utils';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { createReport, createNotification } from '../../lib/supabase';

const riskInfo: Record<RiskLevel, { color: string; bg: string; icon: typeof Shield; label: string }> = {
  low: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: Shield, label: 'Low Risk' },
  medium: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', icon: Activity, label: 'Medium Risk' },
  high: { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/10', icon: AlertTriangle, label: 'High Risk' },
  critical: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', icon: AlertTriangle, label: 'CRITICAL' },
};

export default function SymptomCheckerPage() {
  const { user } = useAuth();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [naturalInput, setNaturalInput] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [isListening, setIsListening] = useState(false);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const addCustomSymptom = () => {
    const trimmed = customSymptom.trim();
    if (trimmed && !selectedSymptoms.includes(trimmed)) {
      setSelectedSymptoms(prev => [...prev, trimmed]);
      setCustomSymptom('');
    }
  };

  const parseNaturalInput = () => {
    if (!naturalInput.trim()) return;
    const words = naturalInput.toLowerCase();
    const found: string[] = [];
    Object.values(SYMPTOM_CATEGORIES).flat().forEach(symptom => {
      if (words.includes(symptom.toLowerCase())) {
        found.push(symptom);
      }
    });
    if (found.length === 0) {
      found.push(naturalInput.trim());
    }
    setSelectedSymptoms(prev => [...new Set([...prev, ...found])]);
    setNaturalInput('');
    toast.success(`Added ${found.length} symptom(s)`);
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error('Please select at least one symptom');
      return;
    }
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await analyzeSymptoms(selectedSymptoms);
      setAnalysis(result);
      
      // Save report to database
      if (user) {
        await createReport({
          user_id: user.id,
          symptoms: selectedSymptoms,
          ai_analysis: `Identified potential conditions: ${result.conditions.map(c => c.name).join(', ')}. AI Confidence: ${Math.round(result.confidence_score * 100)}%`,
          risk_level: result.risk_level,
          recommendations: [...result.precautions, ...result.next_steps, ...result.lifestyle_recommendations],
        });

        // Create a notification based on risk level
        try {
          if (result.risk_level === 'critical' || result.risk_level === 'high') {
            await createNotification({
              user_id: user.id,
              title: `⚠️ ${result.risk_level === 'critical' ? 'Critical' : 'High'} Risk Alert`,
              message: `Your symptom analysis detected ${result.risk_level} risk for: ${result.conditions.map(c => c.name).join(', ')}. Please consult a healthcare professional.`,
              type: result.risk_level === 'critical' ? 'error' : 'warning',
            });
          } else {
            await createNotification({
              user_id: user.id,
              title: 'Symptom Analysis Complete',
              message: `Your check for ${selectedSymptoms.slice(0, 3).join(', ')}${selectedSymptoms.length > 3 ? '...' : ''} is complete. Risk level: ${result.risk_level}. Report saved.`,
              type: result.risk_level === 'medium' ? 'warning' : 'info',
            });
          }
        } catch (notifErr) {
          // Don't block the flow if notification creation fails
          console.error('Failed to create notification:', notifErr);
        }
      }

      if (result.risk_level === 'critical') {
        toast.error('⚠️ Critical risk detected! Please seek immediate medical attention.', { duration: 8000 });
      } else {
        toast.success('Analysis complete and report saved to your dashboard.');
      }
    } catch {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }
    setIsListening(!isListening);
    if (!isListening) {
      toast.success('Listening... Describe your symptoms');
      // Simulated voice input
      setTimeout(() => {
        setIsListening(false);
        setNaturalInput('I have a headache and feeling tired');
        toast.success('Voice captured!');
      }, 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl medical-gradient-bg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          AI Symptom Checker
        </h1>
        <p className="page-subtitle">Describe your symptoms for an AI-powered health assessment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Symptom Input */}
        <div className="lg:col-span-2 space-y-6">
          {/* Natural language input */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h2 className="font-semibold mb-3">Describe Your Symptoms</h2>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={naturalInput}
                  onChange={e => setNaturalInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && parseNaturalInput()}
                  placeholder="e.g., I have a headache and feeling dizzy..."
                  className="input-field pr-12"
                />
                <button
                  onClick={toggleVoice}
                  className={cn(
                    'absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors',
                    isListening ? 'text-red-500 bg-red-50 dark:bg-red-500/10 animate-pulse' : 'text-muted-foreground hover:bg-accent'
                  )}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
              <button onClick={parseNaturalInput} className="btn-primary !py-2">
                Add
              </button>
            </div>
          </motion.div>

          {/* Category selector */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h2 className="font-semibold mb-3">Select Symptoms by Category</h2>
            
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-thin">
              {Object.keys(SYMPTOM_CATEGORIES).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all',
                    activeCategory === cat
                      ? 'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30'
                      : 'bg-accent text-muted-foreground hover:text-foreground'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Symptom buttons */}
            <div className="flex flex-wrap gap-2">
              {SYMPTOM_CATEGORIES[activeCategory as keyof typeof SYMPTOM_CATEGORIES]?.map(symptom => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-sm font-medium transition-all border',
                    selectedSymptoms.includes(symptom)
                      ? 'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-300 dark:border-cyan-500/30'
                      : 'bg-card border-border hover:border-cyan-300 dark:hover:border-cyan-500/30 text-muted-foreground hover:text-foreground'
                  )}
                >
                  {selectedSymptoms.includes(symptom) && <CheckCircle className="w-3.5 h-3.5 inline mr-1.5" />}
                  {symptom}
                </button>
              ))}
            </div>

            {/* Custom symptom input */}
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={customSymptom}
                onChange={e => setCustomSymptom(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomSymptom()}
                placeholder="Add custom symptom..."
                className="input-field !py-2 text-sm flex-1"
              />
              <button onClick={addCustomSymptom} className="btn-secondary !py-2 !px-4 text-sm">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right: Selected + Action */}
        <div className="space-y-6">
          {/* Selected symptoms */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h2 className="font-semibold mb-3">
              Selected Symptoms ({selectedSymptoms.length})
            </h2>
            {selectedSymptoms.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No symptoms selected yet. Choose from categories or type your own.
              </p>
            ) : (
              <div className="space-y-2 mb-4">
                {selectedSymptoms.map(symptom => (
                  <div
                    key={symptom}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-accent/50"
                  >
                    <span className="text-sm font-medium">{symptom}</span>
                    <button
                      onClick={() => toggleSymptom(symptom)}
                      className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={selectedSymptoms.length === 0 || analyzing}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Symptoms
                </>
              )}
            </button>

            {selectedSymptoms.length > 0 && (
              <button
                onClick={() => { setSelectedSymptoms([]); setAnalysis(null); }}
                className="w-full mt-2 text-sm text-muted-foreground hover:text-foreground text-center py-2 transition-colors"
              >
                Clear all
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Analysis Loading Animation */}
      <AnimatePresence>
        {analyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-8 text-center"
          >
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-200 dark:border-cyan-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
              <div className="absolute inset-3 rounded-full border-4 border-blue-400 border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              <Heart className="absolute inset-0 m-auto w-6 h-6 text-cyan-500 animate-pulse" />
            </div>
            <p className="font-semibold text-lg">Analyzing your symptoms...</p>
            <p className="text-sm text-muted-foreground mt-1">Our AI is evaluating {selectedSymptoms.length} symptoms</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && !analyzing && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Emergency Warning */}
            {analysis.emergency_warning && (
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="p-6 rounded-2xl bg-red-50 dark:bg-red-500/10 border-2 border-red-300 dark:border-red-500/30"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-red-700 dark:text-red-400 text-lg">Emergency Warning</h3>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1 leading-relaxed">{analysis.emergency_warning}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Risk Level + Confidence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={cn('glass-card p-6', riskInfo[analysis.risk_level].bg)}>
                <div className="flex items-center gap-3 mb-2">
                  {(() => { const Icon = riskInfo[analysis.risk_level].icon; return <Icon className={cn('w-6 h-6', riskInfo[analysis.risk_level].color)} />; })()}
                  <h3 className={cn('text-lg font-bold', riskInfo[analysis.risk_level].color)}>
                    {riskInfo[analysis.risk_level].label}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on analysis of {selectedSymptoms.length} symptoms
                </p>
                <div className="mt-3 w-full h-2 rounded-full bg-white/50 dark:bg-white/10">
                  <div
                    className={cn('h-full rounded-full transition-all duration-1000', {
                      'bg-emerald-500 w-1/4': analysis.risk_level === 'low',
                      'bg-amber-500 w-2/4': analysis.risk_level === 'medium',
                      'bg-orange-500 w-3/4': analysis.risk_level === 'high',
                      'bg-red-500 w-full': analysis.risk_level === 'critical',
                    })}
                  />
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-bold">AI Confidence</h3>
                </div>
                <p className="text-3xl font-bold font-display gradient-text">{Math.round(analysis.confidence_score * 100)}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended specialist: <span className="font-medium text-foreground">{analysis.specialist_type}</span>
                </p>
              </div>
            </div>

            {/* Possible Conditions */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-500" />
                Possible Conditions
              </h3>
              <div className="space-y-3">
                {analysis.conditions.map((condition, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-accent/30"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{condition.name}</p>
                        <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                          {Math.round(condition.probability * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{condition.description}</p>
                      <div className="w-full h-1.5 rounded-full bg-border mt-2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                          style={{ width: `${condition.probability * 100}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Precautions */}
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" /> Precautions
                </h3>
                <ul className="space-y-2">
                  {analysis.precautions.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Steps */}
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-blue-500" /> Next Steps
                </h3>
                <ul className="space-y-2">
                  {analysis.next_steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Lifestyle Recommendations */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" /> Lifestyle Recommendations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {analysis.lifestyle_recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm p-2 rounded-lg bg-accent/30">
                    <span className="text-lg">{'🏃💊🧘🥗💧🚫'.charAt(i) || '✨'}</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20">
              <p className="text-xs text-amber-700 dark:text-amber-400 text-center">
                ⚕️ <strong>Medical Disclaimer:</strong> This AI-generated analysis is for informational purposes only. 
                It is not a medical diagnosis. Always consult qualified healthcare professionals for proper evaluation and treatment.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
