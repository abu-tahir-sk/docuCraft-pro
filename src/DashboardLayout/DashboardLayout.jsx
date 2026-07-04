import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const DashboardLayout = () => {
  // সাইডবার ডিফল্টভাবে ছোট (false) থাকবে, ক্লিক করলে বড় হবে (true)
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  // মেনু আইটেম এবং সেগুলোর জন্য মানানসই SVG আইকন
  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> 
    },
    { 
      name: 'Documents', 
      path: '/dashboard/documents', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /> 
    },
    { 
      name: 'Invoice', 
      path: '/dashboard/invoice', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> 
    },
    { 
      name: 'Quotation', 
      path: '/dashboard/quotation', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /> 
    },
    { 
      name: 'Agreement', 
      path: '/dashboard/agreement', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /> 
    },
    { 
      name: 'Saved', 
      path: '/dashboard/saved-documents', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /> 
    },
    { 
      name: 'Settings', 
      path: '/dashboard/settings', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /> 
    },
  ];

   const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden w-full relative">
      
      {/* ========================================== */}
      {/* ১. মিনি সাইডবার (Collapsible Sidebar) */}
      {/* ========================================== */}
      <aside 
        className={`bg-white border-r border-gray-200 z-20 flex flex-col justify-between transition-all duration-300 ease-in-out
        ${isExpanded ? 'w-64' : 'w-20'}`}
      >
        <div className="flex flex-col mt-4">
          <nav className="flex flex-col gap-2 px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link 
                  key={item.name}
                  to={item.path} 
                  title={!isExpanded ? item.name : ""} // যখন ছোট থাকবে তখন হোভার করলে নাম দেখাবে
                  className={`flex items-center rounded-lg transition-colors overflow-hidden
                    ${isExpanded ? 'px-4 py-3 justify-start' : 'p-3 justify-center'}
                    ${isActive 
                      ? 'bg-[#E3EAF7] text-[#0A2647] font-semibold' // আপনার ছবির মতো হালকা নীল অ্যাক্টিভ কালার
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                    }
                  `}
                >
                  {/* আইকন */}
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                  
                  {/* টেক্সট (শুধুমাত্র যখন isExpanded = true হবে তখন দেখাবে) */}
                  <span 
                    className={`ml-4 whitespace-nowrap transition-opacity duration-300
                      ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}
                    `}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* লগআউট বাটন (নিচে) */}
        <div className="p-3 border-t border-gray-200">
          <button onClick={handleLogout}
            title={!isExpanded ? "Logout" : ""}
            className={`w-full flex items-center text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg
              ${isExpanded ? 'px-4 py-3 justify-start' : 'p-3 justify-center'}
            `}
          >
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span className={`ml-4 font-semibold whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      

      {/* ========================================== */}
      {/* ২. ডানদিকের মূল অংশ (Top Header + Content) */}
      {/* ========================================== */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        
        {/* টপ হেডার (Top Bar) */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10 border-b border-gray-200 shrink-0">
          
          <div className="flex items-center gap-4">
            {/* মেনু টগল বাটন */}
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="p-2 text-gray-500 rounded-md hover:bg-gray-100 transition-colors focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            
            {/* টপ লোগো */}
            <div className="flex items-center gap-2 cursor-pointer ml-2">
              <div className="w-8 h-8 bg-[#0A2647] text-white rounded flex items-center justify-center font-bold text-xl">D</div>
              <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Docu<span className="text-blue-600">Craft</span></h2>
            </div>
          </div>

          {/* ডান দিক: ইউজার প্রোফাইল */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">admin@company.com</p>
            </div>
            <div className="h-10 w-10 bg-gray-200 rounded-full border-2 border-[#0A2647] overflow-hidden cursor-pointer shadow-sm">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=0A2647&color=fff" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* মেইন কন্টেন্ট এরিয়া */}
        <main className="flex-1 overflow-y-auto bg-[#0F172A] relative">
          <Outlet /> 
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;