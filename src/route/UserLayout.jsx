import Navbar from "../user/components/Navbar";
import Footer from "../user/components/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => (
  <div className="bg-gray-900 flex flex-col text-white min-h-screen">
    <Navbar />
    <main className="flex justify-center py-20">
      <div className="flex-1">
        <Outlet />
      </div>
    </main>
    <Footer />
  </div>
);

export default UserLayout;
