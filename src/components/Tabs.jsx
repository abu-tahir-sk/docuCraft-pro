import React from 'react';
import { Building2, ListOrdered, Settings, FolderOpen } from 'lucide-react';

const Tabs = ({ activeTab, setActiveTab, theme, savedDocsCount }) => {
  return (
    <div className="flex px-6 border-t border-gray-100 bg-[#fafafa] overflow-x-auto w-full">
      <button 
        onClick={() => setActiveTab('info')} 
        className={`px-5 py-2.5 text-[13px] font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
          activeTab === 'info' ? (theme?.activeTab || 'border-blue-600 text-blue-600 bg-blue-50/50') : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'
        }`}
      >
        <Building2 size={14} /> General Info
      </button>

      <button 
        onClick={() => setActiveTab('items')} 
        className={`px-5 py-2.5 text-[13px] font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
          activeTab === 'items' ? (theme?.activeTab || 'border-blue-600 text-blue-600 bg-blue-50/50') : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'
        }`}
      >
        <ListOrdered size={14} /> Content & Data
      </button>

      <button 
        onClick={() => setActiveTab('settings')} 
        className={`px-5 py-2.5 text-[13px] font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
          activeTab === 'settings' ? (theme?.activeTab || 'border-blue-600 text-blue-600 bg-blue-50/50') : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'
        }`}
      >
        <Settings size={14} /> Settings & Themes
      </button>

      <button 
        onClick={() => setActiveTab('history')} 
        className={`px-5 py-2.5 text-[13px] font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
          activeTab === 'history' ? (theme?.activeTab || 'border-blue-600 text-blue-600 bg-blue-50/50') : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'
        }`}
      >
        <FolderOpen size={14} /> Saved Docs ({savedDocsCount || 0})
      </button>
    </div>
  );
};

export default Tabs;