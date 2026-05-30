// Types for the MediAssist AI application

export type UserRole = 'user' | 'admin' | 'client';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  phone?: string;
  blood_group?: string;
  allergies?: string;
  medical_conditions?: string;
  emergency_contact?: string;
  location?: string;
  role_selected?: boolean;
}

export interface Report {
  id: string;
  user_id: string;
  symptoms: string[];
  ai_analysis: string;
  risk_level: RiskLevel;
  recommendations: string[];
  created_at: string;
  report_id?: string;
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Symptom {
  id: string;
  symptom_name: string;
  category: SymptomCategory;
  severity: string;
}

export type SymptomCategory =
  | 'general'
  | 'respiratory'
  | 'cardiovascular'
  | 'neurological'
  | 'gastrointestinal'
  | 'musculoskeletal'
  | 'dermatological'
  | 'psychological'
  | 'urological'
  | 'other';

export interface RiskLevelInfo {
  id: string;
  level_name: RiskLevel;
  description: string;
  color_code: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read_status: boolean;
  created_at: string;
  type?: 'info' | 'warning' | 'success' | 'error';
}

export interface EmergencyAlert {
  id: string;
  user_id: string;
  severity: RiskLevel;
  symptoms: string[];
  created_at: string;
}

export interface SymptomAnalysis {
  conditions: PossibleCondition[];
  risk_level: RiskLevel;
  precautions: string[];
  next_steps: string[];
  lifestyle_recommendations: string[];
  emergency_warning?: string;
  confidence_score: number;
  specialist_type: string;
}

export interface PossibleCondition {
  name: string;
  probability: number;
  description: string;
}

export interface AnalyticsData {
  user_activity: ActivityPoint[];
  symptom_trends: SymptomTrend[];
  common_conditions: ConditionCount[];
  risk_distribution: RiskDistribution[];
  daily_reports: DailyReport[];
  ai_usage: AIUsageMetric[];
}

export interface ActivityPoint {
  date: string;
  count: number;
}

export interface SymptomTrend {
  symptom: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ConditionCount {
  condition: string;
  count: number;
}

export interface RiskDistribution {
  level: RiskLevel;
  count: number;
  percentage: number;
}

export interface DailyReport {
  date: string;
  reports: number;
  emergencies: number;
}

export interface AIUsageMetric {
  date: string;
  symptom_checks: number;
  chat_messages: number;
  reports_generated: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalReports: number;
  totalChats: number;
  emergencyAlerts: number;
  activeUsers: number;
  averageRisk: string;
}

export interface WellnessTip {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
}
