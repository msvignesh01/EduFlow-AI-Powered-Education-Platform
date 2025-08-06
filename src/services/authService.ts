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

// Types
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

  // Email & Password Authentication
  async signUpWithEmail(email: string, password: string, displayName: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Create user profile in Firestore
      await this.createUserProfile(userCredential.user, 'email');

      return userCredential;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async signInWithEmail(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      await this.updateLastLogin(userCredential.user.uid);
      
      return userCredential;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Google Authentication
  async signInWithGoogle(): Promise<UserCredential> {
    try {
      const userCredential = await signInWithPopup(auth, this.googleProvider);
      
      // Check if this is a new user
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        // Create new user profile
        await this.createUserProfile(userCredential.user, 'google');
      } else {
        // Update last login time
        await this.updateLastLogin(userCredential.user.uid);
      }
      
      return userCredential;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Create user profile in Firestore
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

  // Update last login time
  private async updateLastLogin(uid: string): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      lastLoginAt: serverTimestamp()
    });
  }

  // Get user profile from Firestore
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

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    await updateDoc(doc(db, 'users', uid), updates);
  }

  // Password reset
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Update password
  async updateUserPassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('No authenticated user');
    }

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      await updatePassword(auth.currentUser, newPassword);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Delete account
  async deleteAccount(password?: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      // Re-authenticate if password provided (for email users)
      if (password && auth.currentUser.email) {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
        await reauthenticateWithCredential(auth.currentUser, credential);
      }

      const uid = auth.currentUser.uid;
      
      // Delete user data from Firestore
      // Note: In production, use Cloud Functions for complete cleanup
      await updateDoc(doc(db, 'users', uid), {
        deletedAt: serverTimestamp(),
        active: false
      });

      // Delete user account
      await deleteUser(auth.currentUser);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    await signOut(auth);
  }

  // Auth state observer
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Resend email verification
  async resendEmailVerification(): Promise<void> {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  }

  // Error handling
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
