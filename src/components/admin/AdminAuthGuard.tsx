import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { firebaseAuth } from '../../lib/firebase';
import { AdminLoginPage } from './AdminLoginPage';

interface AdminAuthGuardProps {
  children: (user: User) => React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
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
