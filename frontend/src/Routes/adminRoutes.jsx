import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../Layouts/AdminLayout";
import AdminDashboard from "../Pages/AdminDashboard";
// import MoviesManagement from "../Pages/MoviesManagement";
// import UserManagement from "../Pages/UserManagement";
// import ReviewManagement from "../Pages/ReviewManagement";
import PrivateRoute from "../Components/PrivateRoute"; // updated PrivateRoute (with role decoding)

export const adminRouter = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <PrivateRoute role="admin">
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        ),
      },
      // {
      //   path: "movies",
      //   element: (
      //     <PrivateRoute role="admin">
      //       <MoviesManagement />
      //     </PrivateRoute>
      //   ),
      // },
      // {
      //   path: "users",
      //   element: (
      //     <PrivateRoute role="admin">
      //       <UserManagement />
      //     </PrivateRoute>
      //   ),
      // },
      // {
      //   path: "reviews",
      //   element: (
      //     <PrivateRoute role="admin">
      //       <ReviewManagement />
      //     </PrivateRoute>
      //   ),
      // },
    ],
  },
]);
