'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: string;
  photoURL?: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_AUTH = 'imobiliaria_crm_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check local demo cache first
    try {
      const cached = localStorage.getItem(STORAGE_KEY_AUTH);
      if (cached) {
        setUser(JSON.parse(cached));
      }
    } catch (e) {
      console.warn('Auth cache parse error:', e);
    }

    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const appUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Corretor Associado',
            role: 'Admin / Diretor',
            photoURL: firebaseUser.photoURL
          };
          setUser(appUser);
          localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(appUser));
        } else {
          // Only clear if not in offline demo mode
          const cached = localStorage.getItem(STORAGE_KEY_AUTH);
          if (!cached) setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // In demo mode without Firebase keys yet
      setLoading(false);
    }
  }, []);

  const signInWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isFirebaseConfigured) {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const appUser: AppUser = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || 'Guilherme Martins',
          role: 'Admin / Diretor',
          photoURL: cred.user.photoURL
        };
        setUser(appUser);
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(appUser));
        return { success: true };
      } else {
        // Local simulation fallback
        if (pass.length < 4) {
          return { success: false, error: 'A senha deve conter no mínimo 4 caracteres.' };
        }
        const appUser: AppUser = {
          uid: `user-${Date.now()}`,
          email,
          displayName: email.includes('guilherme') ? 'Guilherme Martins' : 'Corretor Associado',
          role: 'Admin / Diretor'
        };
        setUser(appUser);
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(appUser));
        return { success: true };
      }
    } catch (error: any) {
      let message = 'Falha ao realizar login.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'E-mail ou senha incorretos.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'E-mail em formato inválido.';
      } else if (error.message) {
        message = error.message;
      }
      return { success: false, error: message };
    }
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isFirebaseConfigured) {
        const result = await signInWithPopup(auth, googleProvider);
        const appUser: AppUser = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || 'Guilherme Martins',
          role: 'Admin / Diretor',
          photoURL: result.user.photoURL
        };
        setUser(appUser);
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(appUser));
        return { success: true };
      } else {
        // Local simulation fallback
        const appUser: AppUser = {
          uid: `google-${Date.now()}`,
          email: 'guilherme.martins@nossonegocio.com.br',
          displayName: 'Guilherme Martins',
          role: 'Admin / Diretor'
        };
        setUser(appUser);
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(appUser));
        return { success: true };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro na autenticação com Google.' };
    }
  };

  const signOut = async () => {
    try {
      if (isFirebaseConfigured) {
        await firebaseSignOut(auth);
      }
    } catch (e) {
      console.warn('Sign out error:', e);
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY_AUTH);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConfigured,
        signInWithEmail,
        signInWithGoogle,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
