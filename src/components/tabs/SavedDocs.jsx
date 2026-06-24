import React from 'react';
import { Trash2 } from 'lucide-react';
import { formatDate } from '../../utils';

const SavedDocs = ({ savedDocs, loadDocument, deleteDocument }) => {
  return (
    <div className="space-y-2 animate-in fade-in duration-200">
      <h3 className="text-[12px] font-bold text-gray-800 uppercase border-b pb-2 mb-4">Saved Documents</h3>
      {savedDocs.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No saved documents.</p>}
      {savedDocs.map(doc => (
        <div key={doc.meta.id} className="flex items-center justify-between p-3 border rounded shadow-sm bg-white">
          <div>
             <span className="text-sm font-bold block">{doc.meta.id}</span>
             <span className="text-[10px] text-gray-500">{doc.to?.name} • {formatDate(doc.meta?.date)}</span>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={() => loadDocument(doc)} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 font-bold rounded">Load</button>
            <button onClick={() => deleteDocument(doc.meta.id)} className="text-red-500 p-1.5 hover:bg-red-50 rounded"><Trash2 size={14}/></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedDocs;