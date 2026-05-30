import type { Report, Notification, ChatMessage, EmergencyAlert, AnalyticsData, DashboardStats } from '../types';

// Demo reports
export const DEMO_REPORTS: Report[] = [
  {
    id: 'r1',
    user_id: 'demo-user-1',
    symptoms: ['Headache', 'Fatigue', 'Dizziness'],
    ai_analysis: 'Based on the combination of headache, fatigue, and dizziness, the most likely conditions include tension headache with possible dehydration or mild anemia. The symptom pattern suggests stress-related causes with a low-to-medium risk level. Regular monitoring and lifestyle adjustments are recommended.',
    risk_level: 'medium',
    recommendations: ['Schedule a follow-up with your physician', 'Stay well-hydrated', 'Get 7-9 hours of sleep', 'Monitor blood pressure'],
    created_at: '2026-05-28T10:30:00Z',
    report_id: 'MR-LQ5F2K-A8B3',
  },
  {
    id: 'r2',
    user_id: 'demo-user-1',
    symptoms: ['Cough', 'Sore Throat', 'Fever'],
    ai_analysis: 'The symptoms of cough, sore throat, and fever are consistent with an upper respiratory tract infection, most likely viral in nature. The condition typically resolves within 7-10 days with supportive care. Antibiotic treatment is generally not recommended unless bacterial infection is confirmed.',
    risk_level: 'low',
    recommendations: ['Rest and stay hydrated', 'Gargle with warm salt water', 'Over-the-counter throat lozenges', 'Consult doctor if fever exceeds 39°C/102°F'],
    created_at: '2026-05-25T14:15:00Z',
    report_id: 'MR-KP3D1J-C7F9',
  },
  {
    id: 'r3',
    user_id: 'demo-user-1',
    symptoms: ['Chest Pain', 'Shortness of Breath'],
    ai_analysis: 'Chest pain combined with shortness of breath requires immediate medical evaluation. While causes range from anxiety to cardiac conditions, the symptom combination warrants urgent assessment. Given the potential cardiac involvement, seeking emergency evaluation is advised.',
    risk_level: 'high',
    recommendations: ['Seek immediate medical attention', 'Call emergency services if pain intensifies', 'Avoid physical exertion', 'Note timing and triggers of symptoms'],
    created_at: '2026-05-22T09:45:00Z',
    report_id: 'MR-JN8G4H-E2D6',
  },
  {
    id: 'r4',
    user_id: 'demo-user-1',
    symptoms: ['Joint Pain', 'Stiffness'],
    ai_analysis: 'Joint pain with stiffness may indicate early arthritis, overuse injury, or inflammatory condition. The symptoms are commonly seen in individuals with sedentary lifestyle or repetitive strain. Physical therapy and lifestyle modifications usually provide significant relief.',
    risk_level: 'low',
    recommendations: ['Apply ice/heat therapy', 'Gentle stretching exercises', 'Consider anti-inflammatory diet', 'Schedule appointment with rheumatologist if persistent'],
    created_at: '2026-05-20T16:00:00Z',
    report_id: 'MR-HM6E3G-B5A1',
  },
  {
    id: 'r5',
    user_id: 'demo-user-1',
    symptoms: ['Anxiety', 'Insomnia', 'Mood Swings'],
    ai_analysis: 'The combination of anxiety, insomnia, and mood swings suggests a stress-related mental health condition. These symptoms often co-occur and can significantly impact quality of life. A multi-faceted approach combining lifestyle changes, therapy, and possibly medication is recommended.',
    risk_level: 'medium',
    recommendations: ['Practice mindfulness meditation daily', 'Establish consistent sleep routine', 'Consider cognitive behavioral therapy', 'Limit caffeine and alcohol intake', 'Regular physical exercise'],
    created_at: '2026-05-18T11:30:00Z',
    report_id: 'MR-GL4C2F-D9H7',
  },
];

// Demo notifications
export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    user_id: 'demo-user-1',
    title: 'Report Ready',
    message: 'Your symptom analysis report MR-LQ5F2K-A8B3 is ready for download.',
    read_status: false,
    created_at: '2026-05-28T10:35:00Z',
    type: 'success',
  },
  {
    id: 'n2',
    user_id: 'demo-user-1',
    title: 'Health Reminder',
    message: 'Don\'t forget your daily wellness check! Stay hydrated and take regular breaks.',
    read_status: false,
    created_at: '2026-05-28T08:00:00Z',
    type: 'info',
  },
  {
    id: 'n3',
    user_id: 'demo-user-1',
    title: 'High-Risk Alert Follow-up',
    message: 'Your recent high-risk assessment requires follow-up. Please consult a healthcare provider.',
    read_status: true,
    created_at: '2026-05-22T10:00:00Z',
    type: 'warning',
  },
  {
    id: 'n4',
    user_id: 'demo-user-1',
    title: 'New Feature Available',
    message: 'Voice input is now available in the AI Symptom Checker! Try it out.',
    read_status: true,
    created_at: '2026-05-20T12:00:00Z',
    type: 'info',
  },
];

// Demo chat history
export const DEMO_CHAT_HISTORY: ChatMessage[] = [
  {
    id: 'c1',
    user_id: 'demo-user-1',
    message: 'Hello, I have been feeling tired lately',
    sender: 'user',
    timestamp: '2026-05-28T09:00:00Z',
  },
  {
    id: 'c2',
    user_id: 'demo-user-1',
    message: "I understand you're experiencing fatigue. This is a common symptom that can have many causes. Could you tell me more about:\n\n- **How long** have you been feeling tired?\n- **Quality of sleep** - Are you getting 7-9 hours?\n- **Diet** - Have you been eating regularly?\n- **Stress levels** - Any recent changes?\n\nThis information will help me provide better guidance.",
    sender: 'ai',
    timestamp: '2026-05-28T09:00:05Z',
  },
];

// Demo emergency alerts
export const DEMO_EMERGENCY_ALERTS: EmergencyAlert[] = [
  {
    id: 'e1',
    user_id: 'demo-user-1',
    severity: 'critical',
    symptoms: ['Severe Chest Pain', 'Difficulty Breathing'],
    created_at: '2026-05-15T14:30:00Z',
  },
];

// Demo analytics data
export const DEMO_ANALYTICS: AnalyticsData = {
  user_activity: [
    { date: '2026-05-23', count: 12 },
    { date: '2026-05-24', count: 18 },
    { date: '2026-05-25', count: 15 },
    { date: '2026-05-26', count: 22 },
    { date: '2026-05-27', count: 28 },
    { date: '2026-05-28', count: 35 },
    { date: '2026-05-29', count: 42 },
  ],
  symptom_trends: [
    { symptom: 'Headache', count: 156, trend: 'up' },
    { symptom: 'Fever', count: 134, trend: 'stable' },
    { symptom: 'Fatigue', count: 128, trend: 'up' },
    { symptom: 'Cough', count: 98, trend: 'down' },
    { symptom: 'Anxiety', count: 87, trend: 'up' },
    { symptom: 'Back Pain', count: 76, trend: 'stable' },
    { symptom: 'Nausea', count: 65, trend: 'down' },
    { symptom: 'Dizziness', count: 54, trend: 'stable' },
  ],
  common_conditions: [
    { condition: 'Tension Headache', count: 89 },
    { condition: 'Common Cold', count: 76 },
    { condition: 'Anxiety Disorder', count: 64 },
    { condition: 'Gastritis', count: 52 },
    { condition: 'Muscle Strain', count: 45 },
  ],
  risk_distribution: [
    { level: 'low', count: 245, percentage: 48 },
    { level: 'medium', count: 156, percentage: 31 },
    { level: 'high', count: 78, percentage: 15 },
    { level: 'critical', count: 31, percentage: 6 },
  ],
  daily_reports: [
    { date: '2026-05-23', reports: 8, emergencies: 1 },
    { date: '2026-05-24', reports: 12, emergencies: 0 },
    { date: '2026-05-25', reports: 10, emergencies: 2 },
    { date: '2026-05-26', reports: 15, emergencies: 1 },
    { date: '2026-05-27', reports: 18, emergencies: 0 },
    { date: '2026-05-28', reports: 22, emergencies: 1 },
    { date: '2026-05-29', reports: 25, emergencies: 2 },
  ],
  ai_usage: [
    { date: '2026-05-23', symptom_checks: 15, chat_messages: 45, reports_generated: 8 },
    { date: '2026-05-24', symptom_checks: 22, chat_messages: 58, reports_generated: 12 },
    { date: '2026-05-25', symptom_checks: 18, chat_messages: 52, reports_generated: 10 },
    { date: '2026-05-26', symptom_checks: 28, chat_messages: 67, reports_generated: 15 },
    { date: '2026-05-27', symptom_checks: 35, chat_messages: 78, reports_generated: 18 },
    { date: '2026-05-28', symptom_checks: 42, chat_messages: 89, reports_generated: 22 },
    { date: '2026-05-29', symptom_checks: 48, chat_messages: 95, reports_generated: 25 },
  ],
};

// Dashboard stats
export const DEMO_DASHBOARD_STATS: DashboardStats = {
  totalUsers: 1247,
  totalReports: 3892,
  totalChats: 12450,
  emergencyAlerts: 31,
  activeUsers: 342,
  averageRisk: 'low',
};

// User-specific stats
export const USER_DASHBOARD_STATS = {
  totalReports: 5,
  totalChats: 23,
  riskAlerts: 1,
  wellnessScore: 82,
};

// Admin stats
export const ADMIN_STATS = {
  newUsersToday: 18,
  reportsToday: 25,
  emergenciesToday: 2,
  aiRequestsToday: 156,
  serverUptime: '99.97%',
  avgResponseTime: '1.2s',
};

// Client/Clinic stats
export const CLIENT_STATS = {
  patientsTotal: 342,
  criticalCases: 5,
  reportsThisWeek: 47,
  pendingFollowups: 12,
};

// Demo users for admin panel
export const DEMO_USERS_LIST = [
  { id: '1', full_name: 'Sarah Johnson', email: 'sarah@example.com', role: 'user' as const, created_at: '2026-01-15T10:00:00Z', avatar_url: '' },
  { id: '2', full_name: 'Dr. James Wilson', email: 'james@clinic.com', role: 'client' as const, created_at: '2025-11-20T10:00:00Z', avatar_url: '' },
  { id: '3', full_name: 'Emily Davis', email: 'emily@example.com', role: 'user' as const, created_at: '2026-02-08T10:00:00Z', avatar_url: '' },
  { id: '4', full_name: 'Metro Health Center', email: 'metro@health.com', role: 'client' as const, created_at: '2025-09-15T10:00:00Z', avatar_url: '' },
  { id: '5', full_name: 'Alex Kumar', email: 'alex@example.com', role: 'user' as const, created_at: '2026-03-22T10:00:00Z', avatar_url: '' },
  { id: '6', full_name: 'Dr. Lisa Park', email: 'lisa@hospital.org', role: 'admin' as const, created_at: '2025-06-01T10:00:00Z', avatar_url: '' },
  { id: '7', full_name: 'Maria Garcia', email: 'maria@example.com', role: 'user' as const, created_at: '2026-04-10T10:00:00Z', avatar_url: '' },
  { id: '8', full_name: 'Wellness Clinic', email: 'info@wellnessclinic.com', role: 'client' as const, created_at: '2025-12-05T10:00:00Z', avatar_url: '' },
];
