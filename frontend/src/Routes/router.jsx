import { createBrowserRouter } from "react-router-dom";
import { Navigate } from "react-router-dom";

import UserLayouts from "../Layouts/UserLayouts";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import LandingPage from "../Pages/LandingPage";
import UserHomePage from "../Pages/UserHomePage";
import PrivateRoute from "../Components/PrivateRoute";
import Movies from "../Pages/Movies";
import MovieDetails from "../Pages/MovieDetails";
import Watchlist from "../Pages/Watchlist";
import AddReview from "../Components/AddReview";
import UserDashboard from "../Pages/UserDashboard";
import EditProfile from "../Pages/EditProfile";
// Admin
import AdminLayout from "../Layouts/AdminLayout";
import AdminDashboard from "../Pages/AdminDashboard";
import MoviesManagement from "../Pages/MoviesManagement";
import CreateMovie from "../Pages/CreateMovie";
import EditMovie from "../Pages/EditMovie";
import UserManagement from "../Pages/UserManagement";
import UserEdit from "../Pages/UserEdit";
import CreateUserByAdmin from "../Pages/CreateUserByAdmin";
import ReviewManagement from "../Pages/ReviewManagement";
// import Unauthorized from "../Pages/Unauthorized";  // You can make a simple Unauthorized page

export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayouts />,
    children: [
      {
        path: "",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/User-Home",
        element: (
          <PrivateRoute>
            <UserHomePage />
          </PrivateRoute>
        ),
      },
      {
        path: "/movies",
        element: <Movies />,
      },
      {
        path: "/movie-details/:movieId",
        element: <MovieDetails />,
      },
      {
        path: "watchlist",
        element: <Watchlist />,
      },
      {
        path: "review",
        element: <AddReview />,
      },
      {
        path: "/UserDashboard",
        element: <UserDashboard />,
      },
      {
        path: "/edit-profile",
        element: <EditProfile />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute role="admin">
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "movies", element: <MoviesManagement /> },
      {
        path: "/admin/movies/create",
        element: <CreateMovie />,
      },
      {
        path: "/admin/movies/edit/:movieId",
        element: <EditMovie />,
      },
      { path: "users", element: <UserManagement /> },
      {
        path:"/admin/users/edit/:id" ,
        element:<UserEdit/>
      },
      {
        path:"/admin/users/create" ,
        element:<CreateUserByAdmin/>
      },
      { path: "reviews", element: <ReviewManagement /> },
    ],
  },
  // {
  //   path: "/unauthorized",
  //   element: <Unauthorized />
  // }
]);
