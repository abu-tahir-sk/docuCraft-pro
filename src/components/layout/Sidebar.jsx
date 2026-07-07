import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Users,
  Building2,
  Palette,
  Droplets,
  BarChart3,
  Settings,
  User,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";

export default function Sidebar() {
  const [openDocs, setOpenDocs] = useState(true);

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300
    ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }`;


    
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      navigate("/login");
    } catch (error) {
     toast.error(error);
    }
  };

  return (
    <aside className="w-72 h-screen bg-white border-r shadow-sm flex flex-col">

      {/* Logo */}
      

      <div className="h-16 flex items-center px-6 border-b">

        <h1 className="text-2xl font-bold text-blue-600">
          DocuCraft
        </h1>

      </div>

      {/* Menu */}

      <div className="flex-1 overflow-y-auto p-4 space-y-2">

        {/* Dashboard */}

        <NavLink to="/dashboard" end className={menuClass}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        {/* Documents */}

        <button
          onClick={() => setOpenDocs(!openDocs)}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
        >
          <div className="flex items-center gap-3">
            <FolderOpen size={20} />
            Documents
          </div>

          <ChevronDown
            size={18}
            className={`transition-transform ${
              openDocs ? "rotate-180" : ""
            }`}
          />
        </button>

        {openDocs && (
          <div className="ml-6 mt-2 space-y-1">

            <NavLink
              to="/dashboard/documents"
              className={menuClass}
            >
              <FileText size={18} />
              Invoice
            </NavLink>

            <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600">

              <FileText size={18} />

              Quotation

            </button>

            <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600">

              <FileText size={18} />

              Agreement

            </button>

          </div>
        )}

        {/* Saved Documents */}

        <NavLink
          to="/dashboard/saved-documents"
          className={menuClass}
        >
          <FileText size={20} />
          Saved Documents
        </NavLink>

        {/* Clients */}

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">

          <Users size={20} />

          Clients

        </button>

        {/* Company */}

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">

          <Building2 size={20} />

          Company

        </button>

        {/* Templates */}

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">

          <Palette size={20} />

          Templates

        </button>

        {/* Watermark */}

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">

          <Droplets size={20} />

          Watermark

        </button>

        {/* Analytics */}

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">

          <BarChart3 size={20} />

          Analytics

        </button>

        {/* Settings */}

        <NavLink
          to="/dashboard/settings"
          className={menuClass}
        >
          <Settings size={20} />
          Settings
        </NavLink>

        {/* Profile */}

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">

          <User size={20} />

          Profile

        </button>

        {/* Help */}

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">

          <HelpCircle size={20} />

          Help

        </button>

      </div>

      {/* Logout */}

      <div className="border-t p-4">

        <button  onClick={handleLogout} className="w-full flex items-center justify-center gap-3 rounded-xl bg-red-500 hover:bg-red-600 text-white py-3 font-semibold transition">

          <LogOut size={18} />

          Logout
           
             
             
             

        </button>

      </div>

    </aside>
  );
}