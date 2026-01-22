

import React from 'react';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

function AdminDashboard() {
  return (
    <>
      <AdminSidebar />
      <div style={{ marginLeft: 280, padding: 32 }}>
      <Outlet />
      </div>
    </>
  );
}

export default AdminDashboard;
