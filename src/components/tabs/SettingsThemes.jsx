import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const SettingsThemes = ({ appState, appSetters, themes }) => {
  const { settings, labels } = appState;
  const { setSettings, setLabels } = appSetters;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Theme Colors */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
        <h3 className="text-[12px] font-bold text-gray-800 uppercase">1. Theme Colors</h3>
        <div className="flex gap-3">
          {Object.keys(themes || {}).map(color => (
            <button 
              key={color} 
              onClick={() => setSettings({...settings, themeColor: color})}
              className={`w-8 h-8 rounded-full shadow-sm border-4 ${settings.themeColor === color ? 'border-gray-800 scale-110' : 'border-transparent'} ${themes[color].bg} transition-all`}
            />
          ))}
        </div>
      </div>

      {/* 2. Spreadsheet Columns */}
      <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg space-y-3 shadow-inner">
        <h3 className="text-[12px] font-bold text-blue-800 uppercase">2. Spreadsheet Columns</h3>
        <p className="text-[11px] text-gray-600">Add arbitrary columns (e.g. HSN, Size) to your table.</p>
        <div className="space-y-2">
          {settings.customCols?.map((col) => (
            <div key={col.id} className="flex items-center gap-2">
              <input type="text" value={col.name} onChange={(e) => setSettings({...settings, customCols: settings.customCols.map(c => c.id === col.id ? {...c, name: e.target.value} : c)})} className="w-full px-2 py-1.5 text-xs bg-white border border-gray-300 rounded outline-none focus:border-blue-500" />
              <button onClick={() => setSettings({...settings, customCols: settings.customCols.filter(c => c.id !== col.id)})} className="p-1.5 text-gray-400 hover:text-red-600 bg-white border border-gray-300 rounded transition"><Trash2 size={14}/></button>
            </div>
          ))}
          <button onClick={() => setSettings({...settings, customCols: [...(settings.customCols || []), {id: 'col_' + Date.now(), name: 'New Column'}]})} className="text-[11px] px-3 py-1.5 border border-blue-300 bg-white text-blue-700 font-bold rounded hover:bg-blue-50 flex items-center gap-1 transition-colors">
            <Plus size={12}/> Add Custom Column
          </button>
        </div>
      </div>

      {/* 3. Rename PDF Text Labels */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
        <h3 className="text-[12px] font-bold text-gray-800 uppercase">3. Rename PDF Text Labels</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries({
            billedTo: 'Billed To', invoiceDetails: 'Doc Info', invDate: 'Date', dueDate: 'Due Date',
            poNumber: 'PO Number', status: 'Payment Status', companyTaxId: 'Company Tax ID', clientTaxId: 'Client Tax ID',
            desc: 'Table: Description', qty: 'Table: Qty', rate: 'Table: Rate', amount: 'Table: Amount',
            subtotal: 'Subtotal', discount: 'Discount', tax: 'Tax', shipping: 'Shipping', total: 'Total'
          }).map(([key, label]) => (
            <div key={key}>
              <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">{label}</label>
              <input 
                type="text" 
                value={labels[key] || ''} 
                onChange={(e) => setLabels({...labels, [key]: e.target.value})} 
                className="w-full px-2 py-1.5 text-xs bg-white border border-gray-300 rounded focus:border-blue-500 outline-none" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsThemes;