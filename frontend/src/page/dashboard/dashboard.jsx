// import React from "react";
// import Sidebar from "../../components/Sidebar";
// import DashboardNavbar from "../../components/DashboardNavbar";

// const Dashboard = ({ children }) => {
//   return (
//     <div>
//       <DashboardNavbar />
//       <div className="flex">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main Content Area */}
//         <main className="flex-1">{children}</main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// import React from "react";
// import Sidebar from "../../components/Sidebar";
// import DashboardNavbar from "../../components/DashboardNavbar";

// const Dashboard = ({ children }) => {
//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white text-gray-800 dark:from-gray-900 dark:to-gray-950 dark:text-white">
//       {/* Sticky Top Navbar */}
//       <header className="sticky top-0 z-50 shadow-md bg-white/80 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
//         <DashboardNavbar />
//       </header>

//       {/* Sidebar + Main Layout */}
//       <div className="fixed top-24 left-0 flex flex-1 overflow-y-auto">
//         {/* Sidebar */}
//         <aside className="hidden md:block w-64 border-r border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900 backdrop-blur-md">
//           <Sidebar />
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-6 overflow-y-auto">
//           <div className="max-w-7xl mx-auto">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import React from "react";
import Sidebar from "../../components/Sidebar";
import DashboardNavbar from "../../components/DashboardNavbar";

const Dashboard = ({ children }) => {
  const sidebarWidth = 256; // 64 (w-64) * 4 = 256px

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-800 dark:from-gray-900 dark:to-gray-950 dark:text-white">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 shadow-md bg-white/80 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <DashboardNavbar />
      </header>

      {/* Sidebar - Fixed */}
      <aside
        className="block fixed top-[104px] left-0 w-64 h-[calc(100vh-64px)] border-r border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900 backdrop-blur-md overflow-y-auto scrollbar-hidden"
      >
        <Sidebar />
      </aside>

      {/* Main Content - Scrollable */}
      <main
        className="ml-0 md:ml-64 p-6 overflow-y-auto scrollbar-hidden"
        style={{ maxHeight: "calc(100vh - 64px)" }} // 64px = height of the navbar
      >
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default Dashboard;

