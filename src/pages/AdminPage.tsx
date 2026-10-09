import React from 'react';
import { AdminAuthGuard } from '../components/admin/AdminAuthGuard';
import { AdminDashboard } from '../components/admin/AdminDashboard';

export const AdminPage: React.FC = () => {
  return (
    <AdminAuthGuard>
      {(user) => <AdminDashboard user={user} />}
    </AdminAuthGuard>
  );
};
