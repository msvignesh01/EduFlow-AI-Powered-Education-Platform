import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export interface StudySessionData {
  userId: string;
  duration: number; // in minutes
  subject: string;
  score?: number;
  completedAt: Timestamp;
  type: 'quiz' | 'chat' | 'material' | 'career';
}

export interface UserStudyStats {
  totalSessions: number;
  totalHours: number;
  averageScore: number;
  currentStreak: number;
  weeklyGoal: number;
  completedQuizzes: number;
  lastSessionDate?: Date;
}

class StudyService {
  // Save a study session
  async saveStudySession(session: Omit<StudySessionData, 'userId' | 'completedAt'>) {
    if (!auth.currentUser) return;
    
    const sessionData: StudySessionData = {
      ...session,
      userId: auth.currentUser.uid,
      completedAt: serverTimestamp() as Timestamp
    };
    
    const sessionId = `session_${Date.now()}`;
    await setDoc(doc(db, 'studySessions', sessionId), sessionData);
    
    // Update user stats
    await this.updateUserStats();
  }

  // Get user's study stats
  async getUserStats(): Promise<UserStudyStats> {
    if (!auth.currentUser) {
      return {
        totalSessions: 0,
        totalHours: 0,
        averageScore: 0,
        currentStreak: 0,
        weeklyGoal: 20,
        completedQuizzes: 0
      };
    }

    const statsDoc = await getDoc(doc(db, 'userStats', auth.currentUser.uid));
    
    if (statsDoc.exists()) {
      return statsDoc.data() as UserStudyStats;
    }
    
    // Return default stats if no data exists
    return {
      totalSessions: 0,
      totalHours: 0,
      averageScore: 0,
      currentStreak: 0,
      weeklyGoal: 20,
      completedQuizzes: 0
    };
  }

  // Update user stats
  async updateUserStats() {
    if (!auth.currentUser) return;
    
    const sessionsQuery = query(
      collection(db, 'studySessions'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('completedAt', 'desc')
    );
    
    const sessionsSnapshot = await getDocs(sessionsQuery);
    const sessions = sessionsSnapshot.docs.map(doc => doc.data() as StudySessionData);
    
    // Calculate stats
    const totalSessions = sessions.length;
    const totalHours = sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60;
    const quizSessions = sessions.filter(s => s.type === 'quiz' && s.score !== undefined);
    const averageScore = quizSessions.length > 0 
      ? quizSessions.reduce((sum, s) => sum + (s.score || 0), 0) / quizSessions.length 
      : 0;
    
    // Calculate streak
    const currentStreak = this.calculateStreak(sessions);
    
    const stats: UserStudyStats = {
      totalSessions,
      totalHours: Math.round(totalHours * 10) / 10,
      averageScore: Math.round(averageScore),
      currentStreak,
      weeklyGoal: 20,
      completedQuizzes: quizSessions.length,
      lastSessionDate: sessions[0]?.completedAt?.toDate()
    };
    
    await setDoc(doc(db, 'userStats', auth.currentUser.uid), stats);
  }

  // Calculate study streak
  private calculateStreak(sessions: StudySessionData[]): number {
    if (sessions.length === 0) return 0;
    
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastSession = sessions[0]?.completedAt?.toDate();
    if (!lastSession) return 0;
    
    const daysSinceLastSession = Math.floor((today.getTime() - lastSession.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceLastSession > 1) return 0;
    
    // Check consecutive days
    for (let i = 1; i < sessions.length; i++) {
      const currentDate = sessions[i - 1]?.completedAt?.toDate();
      const previousDate = sessions[i]?.completedAt?.toDate();
      
      if (!currentDate || !previousDate) break;
      
      const daysDiff = Math.floor((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        streak++;
      } else if (daysDiff > 1) {
        break;
      }
    }
    
    return streak;
  }

  // Get recent sessions for analytics
  async getRecentSessions(days: number = 7): Promise<StudySessionData[]> {
    if (!auth.currentUser) return [];
    
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    const sessionsQuery = query(
      collection(db, 'studySessions'),
      where('userId', '==', auth.currentUser.uid),
      where('completedAt', '>=', Timestamp.fromDate(daysAgo)),
      orderBy('completedAt', 'desc')
    );
    
    const snapshot = await getDocs(sessionsQuery);
    return snapshot.docs.map(doc => doc.data() as StudySessionData);
  }
}

export const studyService = new StudyService();
