import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Stethoscope, MessageSquare, FileText, Shield, BarChart3, AlertTriangle,
  ChevronRight, Star, ArrowRight, Heart, Brain, Activity, Zap,
  Globe, Users, CheckCircle, Sparkles, Bot, Plus, Minus
} from 'lucide-react';
import { useState } from 'react';
import Footer from '../components/Footer';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const }
  }),
};

const features = [
  {
    icon: Stethoscope,
    title: 'AI Symptom Checker',
    description: 'Advanced AI analyzes your symptoms and provides detailed health assessments with confidence scores.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: MessageSquare,
    title: 'Healthcare Chatbot',
    description: 'Get instant health guidance through our intelligent conversational AI assistant.',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: FileText,
    title: 'Medical Reports',
    description: 'Generate comprehensive PDF reports with AI analysis, risk assessment, and recommendations.',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: AlertTriangle,
    title: 'Emergency Detection',
    description: 'Real-time severity analysis identifies critical symptoms and triggers immediate alerts.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: BarChart3,
    title: 'Health Analytics',
    description: 'Interactive dashboards with symptom trends, risk distributions, and AI usage metrics.',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Enterprise-grade security with encrypted data, role-based access, and HIPAA-ready architecture.',
    color: 'from-emerald-500 to-teal-500',
  },
];

const testimonials = [
  {
    name: 'Dr. Emily Roberts',
    role: 'Family Physician',
    content: 'MediAssist AI has transformed how our clinic handles preliminary patient assessments. The symptom analysis is remarkably accurate.',
    rating: 5,
  },
  {
    name: 'James Peterson',
    role: 'Patient',
    content: 'The AI chatbot helped me understand my symptoms before my doctor visit. The report feature made it easy to share information with my physician.',
    rating: 5,
  },
  {
    name: 'Metro Health Center',
    role: 'Healthcare Provider',
    content: 'The admin dashboard gives us real-time insights into patient trends. Emergency detection has literally saved lives.',
    rating: 5,
  },
];

const faqs = [
  {
    q: 'Is MediAssist AI a replacement for a doctor?',
    a: 'No. MediAssist AI provides preliminary health guidance and educational information. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers.',
  },
  {
    q: 'How accurate is the AI symptom analysis?',
    a: 'Our AI is trained on extensive medical data and provides preliminary assessments with confidence scores. However, accuracy varies and should be used as a supplementary tool alongside professional medical evaluation.',
  },
  {
    q: 'Is my health data secure?',
    a: 'Yes. We use industry-standard encryption, secure authentication, and role-based access controls. Your data is never shared without consent and stored in compliance with healthcare data regulations.',
  },
  {
    q: 'Can clinics and hospitals use MediAssist AI?',
    a: 'Absolutely! We offer dedicated client dashboards for healthcare providers with patient report access, critical case alerts, and analytics tools.',
  },
  {
    q: 'What is SDG 3 and how does MediAssist AI support it?',
    a: 'UN Sustainable Development Goal 3 aims to ensure healthy lives and promote well-being for all. MediAssist AI supports this by making preliminary healthcare guidance accessible, especially in underserved areas.',
  },
];

const stats = [
  { value: '50K+', label: 'Health Assessments', icon: Activity },
  { value: '12K+', label: 'Active Users', icon: Users },
  { value: '99.9%', label: 'Uptime', icon: Zap },
  { value: '4.9/5', label: 'User Rating', icon: Star },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* ═══════════ HERO ═══════════ */}
      <section className="hero-bg relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[150px]" />
          <div className="dot-grid-bg absolute inset-0 opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Powered by Advanced AI</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-xs font-bold">SDG 3</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white leading-tight">
                Your Intelligent
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400">
                  Healthcare Assistant
                </span>
              </h1>

              <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
                AI-powered symptom analysis, personalized health recommendations, and comprehensive 
                medical reports — accessible anywhere, anytime. Supporting UN SDG 3: Good Health & Well-Being.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white
                    bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500
                    shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold
                    text-cyan-400 border-2 border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-300"
                >
                  <Bot className="w-5 h-5" />
                  Try AI Demo
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-2">
                  {['S', 'M', 'J', 'A', 'L'].map((letter, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: `hsl(${180 + i * 20}, 70%, 40%)` }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Trusted by 12,000+ users worldwide</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Interactive Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main dashboard preview card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-xs text-gray-500 ml-2">MediAssist AI Dashboard</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-1 bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/20">
                        <p className="text-xs text-cyan-400 mb-1">Risk Level</p>
                        <p className="text-lg font-bold text-white">Low</p>
                        <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
                          <div className="w-1/4 h-full bg-emerald-400 rounded-full" />
                        </div>
                      </div>
                      <div className="flex-1 bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                        <p className="text-xs text-blue-400 mb-1">Confidence</p>
                        <p className="text-lg font-bold text-white">87%</p>
                        <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
                          <div className="w-[87%] h-full bg-blue-400 rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-xs text-gray-400 mb-2">AI Analysis</p>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        Based on symptoms: <span className="text-cyan-400">headache, fatigue</span>
                        <br />Possible condition: <span className="text-white font-medium">Tension Headache</span>
                        <br />Recommended: <span className="text-emerald-400">Rest, hydration, stress management</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating notification card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -right-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Analysis Complete</p>
                      <p className="text-[10px] text-gray-400">Low risk detected</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating chat bubble */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-4 -left-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl rounded-bl-none p-3 shadow-xl max-w-[180px]"
                >
                  <p className="text-xs text-white font-medium">How can I improve my sleep quality?</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative">
          <svg className="w-full h-16 text-background" viewBox="0 0 1440 64" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,32L60,37.3C120,43,240,53,360,53.3C480,53,600,43,720,37.3C840,32,960,32,1080,34.7C1200,37,1320,43,1380,45.3L1440,48L1440,64L1380,64C1320,64,1200,64,1080,64C960,64,840,64,720,64C600,64,480,64,360,64C240,64,120,64,60,64L0,64Z" />
          </svg>
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 mb-3">
                  <stat.icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <p className="text-2xl md:text-3xl font-bold font-display gradient-text">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SDG 3 MISSION ═══════════ */}
      <section className="py-20 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              UN Sustainable Development Goal 3
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
              Good Health & <span className="gradient-text">Well-Being</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              MediAssist AI is committed to supporting SDG 3 by making healthcare guidance accessible 
              to everyone, everywhere. Through AI-powered tools, we aim to reduce health disparities, 
              provide early detection support, and promote preventive healthcare practices globally.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mt-12">
              {[
                { icon: Heart, title: 'Accessible Healthcare', desc: 'Breaking barriers to health information access' },
                { icon: Brain, title: 'AI-Powered Insights', desc: 'Intelligent analysis for early health awareness' },
                { icon: Globe, title: 'Global Impact', desc: 'Supporting health outcomes across communities' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  custom={i + 1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="glass-card p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-xl medical-gradient-bg flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="py-20" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need for intelligent healthcare management, all in one platform.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="glass-card p-6 card-hover group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 
                  group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-cyan-600 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ AI DEMO PREVIEW ═══════════ */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-slate-950/50 dark:to-cyan-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              See <span className="gradient-text">AI in Action</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Experience how MediAssist AI analyzes symptoms and provides healthcare guidance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass-card-strong p-1 rounded-2xl shadow-2xl shadow-cyan-500/10">
              <div className="bg-card rounded-xl overflow-hidden">
                {/* Chat preview header */}
                <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-accent/30">
                  <div className="w-8 h-8 rounded-lg medical-gradient-bg flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">MediAssist AI Chat</p>
                    <p className="text-xs text-emerald-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
                    </p>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="p-5 space-y-4 min-h-[300px]">
                  <div className="flex justify-end">
                    <div className="chat-bubble-user">
                      <p className="text-sm">I've been having headaches and feeling tired lately. What could it be?</p>
                    </div>
                  </div>
                  <div className="flex justify-start gap-3">
                    <div className="w-7 h-7 rounded-lg medical-gradient-bg flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="chat-bubble-ai">
                      <p className="text-sm leading-relaxed">
                        I understand you're experiencing <strong>headaches</strong> and <strong>fatigue</strong>. These symptoms can have several causes:
                      </p>
                      <ul className="text-sm mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Tension headache with dehydration</li>
                        <li>Sleep deficiency</li>
                        <li>Stress-related symptoms</li>
                      </ul>
                      <p className="text-sm mt-2">
                        I recommend using our <span className="text-cyan-600 dark:text-cyan-400 font-medium">AI Symptom Checker</span> for a detailed analysis with risk assessment and personalized recommendations.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input preview */}
                <div className="px-5 py-3 border-t border-border">
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-2.5 rounded-xl bg-accent/50 text-sm text-muted-foreground">
                      Type your health question...
                    </div>
                    <div className="px-4 py-2.5 rounded-xl medical-gradient-bg text-white text-sm font-medium">
                      Send
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Trusted by <span className="gradient-text">Healthcare Professionals</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              See what our users and healthcare providers say about MediAssist AI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="glass-card p-6 card-hover"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full medical-gradient-bg flex items-center justify-center text-white text-xs font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950/50 dark:to-blue-950/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-accent/30 transition-colors"
                >
                  <span className="font-medium pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <Minus className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card-strong p-12 md:p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Ready to Transform Your <span className="gradient-text">Healthcare Experience</span>?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust MediAssist AI for intelligent healthcare guidance. 
                Start your free account today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white
                    bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500
                    shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                >
                  Start Free Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold
                    border-2 border-border hover:bg-accent transition-all duration-300"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
