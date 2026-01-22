import React from 'react';
import { Outlet } from 'react-router-dom';
import DeveloperNavbar from './DeveloperNavbar';


function DeveloperDashboard() {
  return (
    <>
    <div>
      <DeveloperNavbar />
      <Outlet />
    </div>
    </>
  );
}

export default DeveloperDashboard;


