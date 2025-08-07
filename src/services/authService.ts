import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
  sendEmailVerification,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';


export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'email' | 'google';
  createdAt: any;
  lastLoginAt: any;
  isEmailVerified: boolean;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    aiModel: 'gemini' | 'ollama';
  };
  studyStats: {
    totalSessions: number;
    totalHours: number;
    averageScore: number;
    currentStreak: number;
  };
}

export interface AuthError {
  code: string;
  message: string;
}

class AuthService {
  private googleProvider: GoogleAuthProvider;

  constructor() {
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.addScope('email');
    this.googleProvider.addScope('profile');
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  }


  async signUpWithEmail(email: string, password: string, displayName: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      

      await updateProfile(userCredential.user, {
        displayName: displayName
      });


      await sendEmailVerification(userCredential.user);


      await this.createUserProfile(userCredential.user, 'email');

      return userCredential;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async signInWithEmail(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      

      await this.updateLastLogin(userCredential.user.uid);
      
      return userCredential;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }


  async signInWithGoogle(): Promise<UserCredential> {
    try {
      const userCredential = await signInWithPopup(auth, this.googleProvider);
      

      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {

        await this.createUserProfile(userCredential.user, 'google');
      } else {

        await this.updateLastLogin(userCredential.user.uid);
      }
      
      return userCredential;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }


  private async createUserProfile(user: User, provider: 'email' | 'google'): Promise<void> {
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL || undefined,
      provider,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      isEmailVerified: user.emailVerified,
      preferences: {
        theme: 'light',
        notifications: true,
        aiModel: 'gemini'
      },
      studyStats: {
        totalSessions: 0,
        totalHours: 0,
        averageScore: 0,
        currentStreak: 0
      }
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
  }


  private async updateLastLogin(uid: string): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      lastLoginAt: serverTimestamp()
    });
  }


  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }


  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    await updateDoc(doc(db, 'users', uid), updates);
  }


  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }


  async updateUserPassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('No authenticated user');
    }

    try {

      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      

      await updatePassword(auth.currentUser, newPassword);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }


  async deleteAccount(password?: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('No authenticated user');
    }

    try {

      if (password && auth.currentUser.email) {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
        await reauthenticateWithCredential(auth.currentUser, credential);
      }

      const uid = auth.currentUser.uid;
      


      await updateDoc(doc(db, 'users', uid), {
        deletedAt: serverTimestamp(),
        active: false
      });


      await deleteUser(auth.currentUser);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }


  async signOut(): Promise<void> {
    await signOut(auth);
  }


  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }


  getCurrentUser(): User | null {
    return auth.currentUser;
  }


  async resendEmailVerification(): Promise<void> {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  }


  private handleAuthError(error: any): AuthError {
    let message = 'An error occurred during authentication';

    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No account found with this email address';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Sign-in popup was closed before completion';
        break;
      case 'auth/cancelled-popup-request':
        message = 'Only one popup request is allowed at a time';
        break;
      case 'auth/popup-blocked':
        message = 'Popup was blocked by browser. Please allow popups for this site';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection';
        break;
      case 'auth/requires-recent-login':
        message = 'Please sign in again to perform this action';
        break;
      default:
        message = error.message || message;
    }

    return {
      code: error.code || 'auth/unknown',
      message
    };
  }
}

export const authService = new AuthService();
export default authService;
