
import { Outlet } from "react-router-dom";
import Navbar from "../admin/components/Navbar";
import SideBar from "../admin/components/SideBar/SideBar";


const AdminLayout = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <main className="flex-1 p-6 pt-20 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


