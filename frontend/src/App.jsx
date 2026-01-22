import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import SignUp from './pages/SignUp';
import Login from './pages/Login';
import DeveloperDashboard from './pages/DeveloperDashboard';
import DeveloperHomepage from './pages/DeveloperHomepage';
import MyTask from './pages/MyTask';

import ProjectManagerDashboard from './pages/ProjectManagerDashboard';
import ProjectManagerHomepage from './pages/ProjectManagerHomepage';
import MyProjects from './pages/MyProjects';

import AdminDashboard from './pages/AdminDashboard';
import ManageUser from './pages/ManageUser';
import ManageProjects from './pages/ManageProjects';
import AdminDashboardHome from './pages/AdminDashboardHome';


import { AuthProvider } from './context/AuthContext';



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />

          <Route path="/developer" element={<DeveloperDashboard />} >
            <Route index element={<DeveloperHomepage />} />
            <Route path="my-tasks" element={<MyTask />} />
          </Route>
         
          <Route path="/project-manager" element={<ProjectManagerDashboard />}>
            <Route index element={<ProjectManagerHomepage />} />
            <Route path="my-projects" element={<MyProjects />} />
          </Route>

          <Route path="/admin" element={<AdminDashboard />} >
            <Route index element={<AdminDashboardHome />} />
            <Route path="dashboard" element={<AdminDashboardHome />} />
            <Route path="users" element={<ManageUser />} />
            <Route path="projects" element={<ManageProjects />} />
          </Route>
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}



export default App;

