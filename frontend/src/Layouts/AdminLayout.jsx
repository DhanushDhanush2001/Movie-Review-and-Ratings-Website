import React from "react";
import { Link, Outlet, Navigate, useLocation, NavLink } from "react-router-dom";
import Header from "../Components/Header";

const AdminLayout = () => {
  const location = useLocation();

  // Redirect from /admin to /admin/dashboard
  if (location.pathname === "/admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <Header />

      {/* Responsive Drawer Layout */}
      <div className="drawer lg:drawer-open">
        <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content p-4">
          {/* Toggle button for smaller screens */}
          <label
            htmlFor="admin-drawer"
            className="btn btn-primary drawer-button lg:hidden mb-4"
          >
            Open Menu
          </label>
          <Outlet />
        </div>

        <div className="drawer-side">
          <label htmlFor="admin-drawer" className="drawer-overlay"></label>
          <aside className="menu p-4 w-64 min-h-full bg-base-300 text-base-content shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-6">
              🎬 Dusty Admin
            </h2>
            <ul className="menu">
              <li>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `rounded-md ${
                      isActive
                        ? "bg-primary text-white"
                        : "hover:bg-primary hover:text-white"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/movies"
                  className={({ isActive }) =>
                    `rounded-md ${
                      isActive
                        ? "bg-primary text-white"
                        : "hover:bg-primary hover:text-white"
                    }`
                  }
                >
                  Movies Management
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `rounded-md ${
                      isActive
                        ? "bg-primary text-white"
                        : "hover:bg-primary hover:text-white"
                    }`
                  }
                >
                  User Management
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/reviews"
                  className={({ isActive }) =>
                    `rounded-md ${
                      isActive
                        ? "bg-primary text-white"
                        : "hover:bg-primary hover:text-white"
                    }`
                  }
                >
                  Review Management
                </NavLink>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
