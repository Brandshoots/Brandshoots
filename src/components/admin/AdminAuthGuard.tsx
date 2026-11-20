import React, { useEffect, useState } from 'react';
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#04060A] text-white">
        <div className="relative mb-4 flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-[#008CFF]" />
          <span className="font-mono text-xs font-bold text-[#008CFF]">BS</span>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/50">
          Authenticating Admin Portal...
        </p>
      </div>
    );
  }

  if (!user) return <AdminLoginPage />;
  return <>{children(user)}</>;
};
