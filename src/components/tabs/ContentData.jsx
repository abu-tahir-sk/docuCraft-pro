import React from 'react';
import { Plus, Trash2, AlignLeft, AlignCenter, AlignRight, Type, Image as ImageIcon } from 'lucide-react';

const ContentData = ({ appState, appSetters, actions, theme }) => {
  const { items, financials, labels, blocks } = appState;
  const { setFinancials } = appSetters;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Data Grid (Spreadsheet) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-[12px] font-bold text-gray-800 uppercase">Data Grid</h3>
          <button onClick={actions.addItem} className="text-[11px] px-3 py-1.5 bg-gray-800 text-white rounded font-bold hover:bg-gray-700 flex items-center gap-1">
            <Plus size={12}/> Add Row
          </button>
        </div>
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-gray-100 border-b border-gray-300 text-gray-600">
              <tr>
                <th className="p-2 w-8 text-center">#</th>
                <th className="p-2">{labels.desc}</th>
                <th className="p-2 w-16 text-center">{labels.qty}</th>
                <th className="p-2 w-20 text-right">{labels.rate}</th>
                <th className="p-2 w-20 text-center">⚙️</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-1 text-center bg-gray-50 text-gray-400">{index + 1}</td>
                  <td className="p-1"><input value={item.desc} onChange={(e) => actions.handleItemChange(index, 'desc', e.target.value)} className="w-full bg-transparent outline-none p-1" /></td>
                  <td className="p-1"><input type="number" value={item.qty} onChange={(e) => actions.handleItemChange(index, 'qty', e.target.value)} className="w-full bg-transparent outline-none text-center p-1" /></td>
                  <td className="p-1"><input type="number" value={item.rate} onChange={(e) => actions.handleItemChange(index, 'rate', e.target.value)} className="w-full bg-transparent outline-none text-right p-1" /></td>
                  <td className="p-1 text-center"><button onClick={() => actions.removeItem(index)} className="text-gray-400 hover:text-red-600"><Trash2 size={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Adjustments */}
      <div className="bg-[#f8f9fa] p-4 rounded-lg border border-gray-200 space-y-3">
        <h3 className="text-[11px] font-bold text-gray-600 uppercase">Financial Adjustments</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">{labels.discount}</label>
            <input type="number" value={financials.discount} onChange={e => setFinancials({...financials, discount: parseFloat(e.target.value)||0})} className="w-full px-2 py-1.5 border rounded text-sm outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">{labels.tax} (%)</label>
            <input type="number" value={financials.taxRate} onChange={e => setFinancials({...financials, taxRate: parseFloat(e.target.value)||0})} className="w-full px-2.5 py-1.5 border rounded text-sm outline-none" />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-gray-500 mb-1">{labels.shipping}</label>
            <input type="number" value={financials.shipping} onChange={e => setFinancials({...financials, shipping: parseFloat(e.target.value)||0})} className="w-full px-2.5 py-1.5 border rounded text-sm outline-none" />
          </div>
        </div>
      </div>

      {/* 3. Modular Block Builder */}
      <div className="bg-blue-50/30 p-4 border border-blue-100 rounded-xl space-y-4">
        <h3 className="text-[14px] font-bold text-gray-800">Custom Content Blocks</h3>
        {blocks.map((block, index) => (
          <div key={block.id} className="bg-white border p-3 rounded-lg relative group">
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100">
               <button onClick={() => actions.removeBlock(block.id)} className="text-red-500"><Trash2 size={12}/></button>
            </div>
            {block.type === 'heading' && <input value={block.content} onChange={(e) => actions.updateBlock(block.id, e.target.value)} className="w-full font-bold outline-none" placeholder="Heading..." />}
            {block.type === 'paragraph' && <textarea rows="2" value={block.content} onChange={(e) => actions.updateBlock(block.id, e.target.value)} className="w-full text-sm outline-none resize-none" placeholder="Paragraph..." />}
          </div>
        ))}
        <div className="flex gap-2">
          <button onClick={() => actions.addBlock('heading')} className="text-[10px] bg-white border px-2 py-1 rounded flex items-center gap-1"><Type size={10}/> Title</button>
          <button onClick={() => actions.addBlock('paragraph')} className="text-[10px] bg-white border px-2 py-1 rounded flex items-center gap-1"><AlignLeft size={10}/> Text</button>
        </div>
      </div>

    </div>
  );
};

export default ContentData;