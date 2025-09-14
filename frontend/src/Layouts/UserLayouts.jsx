import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const UserLayouts = () => {
  return (
    <div className="bg-white text-white min-h-screen flex flex-col">
      <Header/>
      
      <main className="flex-1 p-6 container mx-auto">
        <Outlet />
      </main>

      <Footer/>
    </div>
  );
};

export default UserLayouts;
