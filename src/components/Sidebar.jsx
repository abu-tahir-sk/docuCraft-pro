import React, { useState } from 'react';
import GeneralInfo from './tabs/GeneralInfo';

// import PaymentDetails from './tabs/PaymentDetails';
import SettingsThemes from './tabs/SettingsThemes';
import SavedDocs from './tabs/SavedDocs';

const Sidebar = ({ activeTab, theme, appState, appSetters, actions, themes, savedDocs, loadDocument, deleteDocument }) => {
  // সাব-ট্যাবের স্টেট (শুধুমাত্র মাঝখানের প্যানেলের জন্য)
  const [innerTab, setInnerTab] = useState('general'); // 'general', 'content', 'settings'

  // যদি ইউজার "Saved Documents" এ ক্লিক করে
  if (activeTab === 'saved') {
    return (
      <div className="h-full bg-white flex flex-col p-4">
         <SavedDocs savedDocs={savedDocs} loadDocument={loadDocument} deleteDocument={deleteDocument} />
      </div>
    );
  }

  // ================= ৩টি সাব-ট্যাবের ডিজাইন =================
  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* Tab Navigation Menu */}
      <div className="flex items-center p-2 bg-[#F9F7F4] border-b border-gray-200 shrink-0 gap-1 sticky top-0 z-10">
        <button 
          onClick={() => setInnerTab('general')} 
          className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${innerTab === 'general' ? 'bg-white shadow-sm border border-gray-200 text-[#9A4D2E]' : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-800'}`}
        >
          General Info
        </button>
        <button 
          onClick={() => setInnerTab('content')} 
          className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${innerTab === 'content' ? 'bg-white shadow-sm border border-gray-200 text-[#9A4D2E]' : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-800'}`}
        >
          Content Data
        </button>
        <button 
          onClick={() => setInnerTab('settings')} 
          className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${innerTab === 'settings' ? 'bg-white shadow-sm border border-gray-200 text-[#9A4D2E]' : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-800'}`}
        >
          Settings
        </button>
      </div>

      {/* Tab Content Area (যেখানে ফর্মগুলো দেখাবে) */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
         
         {/* ১. General Info Tab */}
         {innerTab === 'general' && (
            <div className="animate-in fade-in duration-300">
              <GeneralInfo appState={appState} appSetters={appSetters} theme={theme} />
            </div>
         )}
         
         {/* ২. Content Data Tab (এখানে Items এবং Payment দুটোই থাকবে) */}
         {/* {innerTab === 'content' && (
           <div className="space-y-8 animate-in fade-in duration-300">
             <ItemsPricing appState={appState} appSetters={appSetters} actions={actions} theme={theme} />
             <div className="h-px bg-gray-200 w-full"></div>
             <PaymentDetails appState={appState} appSetters={appSetters} theme={theme} />
           </div>
         )}
          */}
         {/* ৩. Settings Themes Tab */}
         {innerTab === 'settings' && (
            <div className="animate-in fade-in duration-300">
              <SettingsThemes appState={appState} appSetters={appSetters} themes={themes} />
            </div>
         )}

      </div>
    </div>
  );
};

export default Sidebar;