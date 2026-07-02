import React from 'react';
import { Sun, Bell } from 'lucide-react';

const TopHeader = ({ currentUser }) => {
  return (
    <header className="h-[70px] bg-white flex items-center justify-end px-6 shrink-0 z-20 border-b border-gray-200 shadow-sm">
      {/* Right Icons */}
      <div className="flex items-center gap-5">
         <button className="text-gray-400 hover:text-gray-700 transition">
           <Sun size={18} />
         </button>
         <button className="text-gray-400 hover:text-gray-700 transition relative">
           <Bell size={18} />
           <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
         </button>
         <div className="w-px h-6 bg-gray-200 mx-1"></div>
         <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300 shadow-sm cursor-pointer hover:ring-2 ring-gray-200 transition">
            <img 
              src={`https://ui-avatars.com/api/?name=${currentUser || 'Admin'}&background=f3f4f6&color=374151`} 
              alt="User" 
              className="w-full h-full object-cover"
            />
         </div>
      </div>
    </header>
  );
};

export default TopHeader;