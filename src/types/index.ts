


export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ContentGenerationResponse {
  success: boolean;
  result: string;
  generation_id?: number;
}


export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface UserCreate {
  email: string;
  username: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}


export interface LegacyUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'teacher' | 'admin';
  joinedAt: Date;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailUpdates: boolean;
  soundEffects: boolean;
  language: 'en' | 'es' | 'fr' | 'de' | 'zh';
}

export interface StudySession {
  id: string;
  userId: string;
  date: Date;
  duration: number;
  subject: string;
  productivity: number;
  notes: string;
}


export interface ContentGeneration {
  id: number;
  user_id: number;
  input_text: string;
  output_type: string;
  generated_content: string;
  created_at: string;
}

export interface ContentGenerationCreate {
  input_text: string;
  output_type: string;
}

export interface FileUpload {
  id: number;
  user_id?: number;
  filename: string;
  file_type: string;
  file_size?: number;
  extracted_text?: string;
  created_at: string;
}

export interface StudySession {
  id: number;
  user_id: number;
  session_name: string;
  content?: string;
  duration_minutes?: number;
  created_at: string;
}

export interface StudyAnalysis {
  productivityScore: number;
  focusTime: number;
  breakPattern: string;
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  recommendedTechniques: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: string[];
}

export interface StatCard {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
}