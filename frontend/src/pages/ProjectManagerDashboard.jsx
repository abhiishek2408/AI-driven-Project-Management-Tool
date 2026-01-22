import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './ProjectManagerNavbar'

function ProjectManagerDashboard() {
  return (
    <div>
  <Navbar />
      <Outlet/>
    </div>
  )
}

export default ProjectManagerDashboard