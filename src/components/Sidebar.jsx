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
import { useState } from "react";

export default function Sidebar() {
  const [openDocs, setOpenDocs] = useState(true);

  return (
    <aside className="w-72 h-screen bg-white border-r shadow-sm">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">
          DocuCraft
        </h1>
      </div>

      {/* Menu */}
      <div className="p-4 space-y-2">

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-blue-50">
          <LayoutDashboard size={20}/>
          Dashboard
        </button>

        <button
          onClick={() => setOpenDocs(!openDocs)}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-blue-50"
        >
          <div className="flex items-center gap-3">
            <FolderOpen size={20}/>
            Documents
          </div>

          <ChevronDown
            className={`duration-300 ${openDocs ? "rotate-180" : ""}`}
            size={18}
          />
        </button>

        {openDocs && (
          <div className="ml-10 space-y-2">

            <button className="block w-full text-left hover:text-blue-600">
              Invoice
            </button>

            <button className="block w-full text-left hover:text-blue-600">
              Quotation
            </button>

            <button className="block w-full text-left hover:text-blue-600">
              Agreement
            </button>

          </div>
        )}

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-blue-50">
          <FileText size={20}/>
          Saved Documents
        </button>

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-blue-50">
          <Users size={20}/>
          Clients
        </button>

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-blue-50">
          <Building2 size={20}/>
          Company
        </button>

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-blue-50">
          <Palette size={20}/>
          Templates
        </button>

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-blue-50">
          <Droplets size={20}/>
          Watermark
        </button>

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-blue-50">
          <BarChart3 size={20}/>
          Analytics
        </button>

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-blue-50">
          <Settings size={20}/>
          Settings
        </button>

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-blue-50">
          <User size={20}/>
          Profile
        </button>

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-blue-50">
          <HelpCircle size={20}/>
          Help
        </button>

      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <button className="flex items-center justify-center gap-3 w-full bg-red-500 text-white py-3 rounded-xl">
          <LogOut size={18}/>
          Logout
        </button>
      </div>
    </aside>
  );
}