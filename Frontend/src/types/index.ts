// API Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  level: number;
  is_active: boolean;
  created_at: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  subject: string;
  level: number;
  created_at: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  course: number;
  order: number;
  created_at: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: number;
  title: string;
  description: string;
  content: string;
  exercise_type: string;
  difficulty: number;
  lesson: number;
  points: number;
  created_at: string;
  expected_output?: string;
}

export interface ExerciseAttempt {
  id: number;
  student: number;
  exercise: number;
  student_answer: string;
  is_correct: boolean;
  score: number;
  time_spent: number;
  created_at: string;
  feedback?: string;
}

export interface ErrorAnalysis {
  id: number;
  attempt: number;
  error_type: string;
  concept_involved: string;
  misconception: string;
  root_cause: string;
  understanding_level: string;
  created_at: string;
}

export interface SmartExplanation {
  id: number;
  error_analysis: number;
  explanation_type: string;
  content: string;
  uses_examples: boolean;
  uses_analogies: boolean;
  is_interactive: boolean;
  was_helpful?: boolean;
  student_rating?: number;
  created_at: string;
}

export interface IntelligentRevisionItem {
  id: number;
  student: number;
  error_analysis: number;
  status: string;
  priority: number;
  mastery_score: number;
  next_review_date: string;
  created_at: string;
}

export interface RevisionPlan {
  total_items: number;
  completed_items: number;
  pending_items: number;
  high_priority_items: number;
  items: IntelligentRevisionItem[];
}

export interface ProgressData {
  total_exercises: number;
  completed_exercises: number;
  success_rate: number;
  average_score: number;
  total_points: number;
  courses_enrolled: number;
  last_activity: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

// App Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSignout: boolean;
  isSignup: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
