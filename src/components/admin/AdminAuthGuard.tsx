import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { firebaseAuth } from '../../lib/firebase';
import { AdminLoginPage } from './AdminLoginPage';

export interface AdminUserSession {
  email: string | null;
  uid: string;
  displayName?: string | null;
}

interface AdminAuthGuardProps {
  children: (user: User | AdminUserSession) => React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const [user, setUser] = useState<User | AdminUserSession | null>(() => {
    try {
      const saved = localStorage.getItem('bs_admin_auth_fallback');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFallback = () => {
      try {
        const saved = localStorage.getItem('bs_admin_auth_fallback');
        if (saved) {
          setUser(JSON.parse(saved));
        } else if (!firebaseAuth.currentUser) {
          setUser(null);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('bs-auth-change', checkFallback);

    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        checkFallback();
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      window.removeEventListener('bs-auth-change', checkFallback);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#04060A] flex flex-col items-center justify-center text-white">
        <div className="relative w-16 h-16 flex items-center justify-center mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-white/10 border-t-[#008CFF] animate-spin" />
          <span className="font-mono text-xs font-bold text-[#008CFF]">BS</span>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/50">
          Authenticating Admin Portal...
        </p>
      </div>
    );
  }

  if (!user) {
    return <AdminLoginPage />;
  }

  return <>{children(user)}</>;
};
