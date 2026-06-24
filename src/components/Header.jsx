import React from 'react';
import { FileText, Download, Save, LogOut, Building2, ListOrdered, Settings, FolderOpen } from 'lucide-react';
import Tabs from './Tabs';

const Header = ({
  theme, currentUser, handleLogout, handleSaveDocument, downloadPDF,
  isGenerating, activeTab, setActiveTab, savedDocsCount
}) => {
  return (
    <header className="bg-white border-b border-gray-200 shrink-0 z-20 shadow-sm flex flex-col w-full">
      <div className="h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${theme?.bg || 'bg-blue-600'} flex items-center justify-center text-white shadow-md`}>
            <FileText size={16} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-gray-900 leading-none tracking-tight">
              DocuCraft <span className="text-gray-400 font-medium">Workstation</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold uppercase">
              {currentUser ? currentUser.charAt(0) : 'U'}
            </div>
            <span className="text-xs font-bold text-gray-600 hidden md:block">{currentUser}</span>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 ml-2" title="Logout">
              <LogOut size={14} />
            </button>
          </div>
          <button onClick={handleSaveDocument} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-1.5 rounded-md text-sm font-bold transition-all shadow-sm">
            <Save size={14} /> Save
          </button>
          <button onClick={downloadPDF} disabled={isGenerating} className={`flex items-center gap-2 ${theme?.bg || 'bg-blue-600'} hover:opacity-90 text-white px-5 py-1.5 rounded-md text-sm font-bold shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed`}>
            {isGenerating ? <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" /> : <Download size={14} />}
            {isGenerating ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Tabs Component */}
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        savedDocsCount={savedDocsCount}
      />
    </header>
  );
};

export default Header;