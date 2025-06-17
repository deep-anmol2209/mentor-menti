// import React from "react";
// import { NavLink } from "react-router-dom";
// import useUserStore from "../store/user";
// const Sidebar = () => {
//   const { user } = useUserStore();
//   return (
//     <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-gradient-to-r from-indigo-50 to-white border-r">
//       <div className="flex flex-col items-center mt-6 -mx-2">
//         <img
//           className="object-cover w-24 h-24 mx-2 rounded-full shadow-lg"
//           src={user.photoUrl || `https://ui-avatars.com/api?name=${user?.name}`}
//           alt={`${user?.name}'s avatar`}
//         />
//         <h4 className="mx-2 mt-2 font-medium text-gray-800 uppercase">{user?.name}</h4>
//         <p className="mx-2 mt-1 text-sm font-medium text-gray-600">
//           {user?.email}
//         </p>
//       </div>
//       <div className="flex flex-col justify-between flex-1 mt-6">
//         <nav>
//           {/* Profile - Accessible to all */}
//           <NavLink
//             to="/dashboard/profile"
//             className={({ isActive }) =>
//               `flex items-center px-4 py-2 mb-4 rounded-lg transition-all duration-300 transform ${
//                 isActive
//                   ? "bg-teal-700 text-white shadow-md"
//                   : "text-gray-600 hover:bg-teal-100 hover:text-gray-800"
//               }`
//             }
//           >
//             <span className="mx-4 font-medium">Profile</span>
//           </NavLink>

//           {/* Services - Only for Mentors */}
//           {user?.role === "mentor" && (
//             <NavLink
//               to="/dashboard/services"
//               className={({ isActive }) =>
//                 `flex items-center px-4 py-2 mb-4 rounded-lg transition-all duration-300 transform ${
//                 isActive
//                   ? "bg-teal-700 text-white shadow-md"
//                   : "text-gray-600 hover:bg-teal-100 hover:text-gray-800"
//               }`
//               }
//             >
//               <span className="mx-4 font-medium">Services</span>
//             </NavLink>
//           )}

//           {/* Schedule - Only for Mentors */}
//           {user?.role === "mentor" && (
//             <NavLink
//               to="/dashboard/schedule"
//               className={({ isActive }) =>
//                 `flex items-center px-4 py-2 mb-4 rounded-lg transition-all duration-300 transform ${
//                 isActive
//                   ? "bg-teal-700 text-white shadow-md"
//                   : "text-gray-600 hover:bg-teal-100 hover:text-gray-800"
//               }`
//               }
//             >
//               <span className="mx-4 font-medium">Schedule</span>
//             </NavLink>
//           )}

//           {/* Bookings - Accessible to both */}
//           {user?.role === "mentor" && (
//           <NavLink
//             to="/dashboard/bookings"
//             className={({ isActive }) =>
//               `flex items-center px-4 py-2 mb-4 rounded-lg transition-all duration-300 transform ${
//                 isActive
//                   ? "bg-teal-700 text-white shadow-md"
//                   : "text-gray-600 hover:bg-teal-100 hover:text-gray-800"
//               }`
//             }
//           >
//             <span className="mx-4 font-medium">Bookings</span>
//           </NavLink>)}
          
//           {/* Payment - Accessible to both */}
//           {user?.role === "mentor" && (
//           <NavLink
//             to="/dashboard/payment"
//             className={({ isActive }) =>
//               `flex items-center px-4 py-2 mb-4 rounded-lg transition-all duration-300 transform ${
//                 isActive
//                   ? "bg-teal-700 text-white shadow-md"
//                   : "text-gray-600 hover:bg-teal-100 hover:text-gray-800"
//               }`
//             }
//           >
//             <span className="mx-4 font-medium">Payment</span>
//           </NavLink>
//             )}
//         </nav>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;


import React from "react";
import { NavLink } from "react-router-dom";
import useUserStore from "../store/user";

const Sidebar = () => {
  const { user } = useUserStore();

  const navItems = [
    { label: "Profile", path: "/dashboard/profile" },
    { label: "Bookings", path: "/dashboard/bookings" },
    ...(user?.role === "mentor"
      ? [
          { label: "Services", path: "/dashboard/services" },
          { label: "Schedule", path: "/dashboard/schedule" },
          { label: "Payment", path: "/dashboard/payment" },
        ]
      : []),
  ];

  return (
    <aside className="w-64 min-h-screen px-6 py-8 bg-white/80 backdrop-blur-xl shadow-xl border-r border-gray-200 ">
      {/* User Info */}
      <div className="flex flex-col items-center text-center">
        <img
          className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-white"
          src={user.photoUrl || `https://ui-avatars.com/api?name=${user?.name}`}
          alt={`${user?.name}'s avatar`}
        />
        <h2 className="mt-4 text-lg font-bold text-gray-800">{user?.name}</h2>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-200" />

      {/* Navigation */}
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-sm"
                  : "text-gray-700 hover:bg-teal-100 hover:text-gray-900"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} Mentor Panel</p>
      </div>
    </aside>
  );
};

export default Sidebar;

