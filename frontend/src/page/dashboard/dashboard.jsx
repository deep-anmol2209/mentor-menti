import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import Sidebar from '@/components/Sidebar';
const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const toggleSidebar = React.useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      // Close sidebar by default on mobile
      if (isMobileView && !isSidebarOpen) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-800 dark:from-gray-900 dark:to-gray-950 dark:text-white">
      {/* Your existing header */}
      <header className="fixed w-full top-0 z-50 shadow-md bg-white/80 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 lg:max-w-screen-3xl">
        <DashboardNavbar />
      </header>

      <div className="flex">
        {/* Your sidebar */}
        <aside
  className={`${
    isMobile
      ? `fixed top-[52px] left-0 z-40` // On mobile: overlay sidebar below navbar
      : `relative h-[calc(100vh-100px)] top-[100px]`        // On desktop: part of layout
  } transform transition-all duration-300 ease-in-out ${
    isSidebarOpen ? 'w-[250px]' : 'w-[60px]'
  } overflow-hidden border-r border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900 backdrop-blur-md`}
>
  <Sidebar
    toggleSidebar={toggleSidebar}
    isSidebarOpen={isSidebarOpen}
    isMobile={isMobile}
    onClose={() => setIsSidebarOpen(false)}
  />
</aside>

        {/* Main content area with Outlet */}
        <main
  className={`flex-1 overflow-y-auto p-0 scrollbar-hidden ml-[60px] lg:ml-0 transition-all duration-300`}
  style={{
    marginTop: '50px', // same height as your navbar (adjust as needed)
    maxHeight: 'calc(100vh - 100px)' // ensure full height minus navbar
  }}
>
<div className="max-w-7xl mx-auto">
          <Outlet /> {/* This renders the nested routes */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard