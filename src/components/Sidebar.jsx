import React from 'react';
import GeneralInfo from './tabs/alInfo';
import ContentData from './tabs/ContentData';
import SettingsThemes from './tabs/SettingsThemes';
import SavedDocs from './tabs/SavedDocs';


const Sidebar = ({ 
  activeTab, theme, themes, appState, appSetters, actions, savedDocs, loadDocument, deleteDocument 
}) => {
  if (!appState) return <div className="w-[500px] p-5">Loading...</div>;

  return (
    <aside className="w-full lg:w-[500px] xl:w-[550px] h-[calc(100vh-100px)] bg-white border-r border-gray-200 overflow-y-auto p-5 flex-shrink-0 custom-scrollbar shadow-lg z-10">
      
      {activeTab === 'info' && (
        <GeneralInfo appState={appState} appSetters={appSetters} actions={actions} theme={theme} />
      )}

      {activeTab === 'items' && (
        <ContentData appState={appState} appSetters={appSetters} actions={actions} />
      )}

      {activeTab === 'settings' && (
        <SettingsThemes appState={appState} appSetters={appSetters} themes={themes} />
      )}

      {activeTab === 'history' && (
        <SavedDocs savedDocs={savedDocs} loadDocument={loadDocument} deleteDocument={deleteDocument} />
      )}

    </aside>
  );
};

export default Sidebar;