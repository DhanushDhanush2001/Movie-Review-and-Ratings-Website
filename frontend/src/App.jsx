import './App.css';
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from './Routes/router';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;


// import './App.css'
// import {
//   RouterProvider,
//   createBrowserRouter 
// } from "react-router-dom";
// import { router as userRouter } from './Routes/router';
// import { adminRouter } from './Routes/adminRoutes';
// function App() {
 
//    // Combine both user and admin routes
//    const combinedRouter = createBrowserRouter([
//     ...userRouter.routes,
//     ...adminRouter.routes,
//   ]);

//   return (
//     <>
    
//    <RouterProvider router={combinedRouter}/>
//     </>
//   )
// }

// export default App