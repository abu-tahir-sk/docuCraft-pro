import React from 'react';
import { FileText, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const SavedDocs = ({ savedDocs = [], loadDocument, deleteDocument }) => {
  
  if (savedDocs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4 animate-in fade-in duration-300">
        <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-3">
          <FileText size={24} />
        </div>
        <h3 className="text-xs font-bold text-gray-800 mb-1">No Saved Documents</h3>
        <p className="text-[11px] text-gray-500">Click the 'Save' button in the top header to save your work.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-20">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
        <h3 className="text-[12px] font-bold text-gray-800 uppercase tracking-wider">Saved Database</h3>
        <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{savedDocs.length} Docs</span>
      </div>

      <div className="space-y-2.5">
        {savedDocs.map((doc) => (
          <div 
            key={doc.id}
            onClick={() => loadDocument && loadDocument(doc)}
            className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-500 shadow-sm hover:shadow transition-all cursor-pointer relative group flex flex-col justify-between gap-2"
          >
            {/* Top Row: ID & Type Badge */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
              <div className="flex items-center gap-1.5">
                <FileText size={14} className="text-blue-500 shrink-0" />
                <span className="text-xs font-bold text-gray-900">{doc.id}</span>
              </div>
              <span className="text-[9px] font-extrabold uppercase bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                {doc.docType}
              </span>
            </div>

            {/* Middle Content: Company & Client Details */}
            <div className="grid grid-cols-2 gap-1 text-[11px] py-0.5">
              <div>
                <p className="text-gray-400 font-medium uppercase text-[9px]">From (Company)</p>
                <p className="text-gray-800 font-bold truncate pr-2">{doc.companyName}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium uppercase text-[9px]">Billed To (Client)</p>
                <p className="text-gray-800 font-bold truncate">{doc.clientName}</p>
              </div>
            </div>

            {/* Bottom Row: Amount, Status & Actions */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-1.5 mt-0.5 bg-gray-50/50 -mx-3 -mb-3 p-3 rounded-b-lg">
              <div>
                <p className="text-[9px] text-gray-400 uppercase">Total Value</p>
                <p className="text-xs font-black text-gray-900">₹ {doc.amount?.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
              </div>

              <div className="flex items-center gap-2">
                {/* Status Badge */}
                <span className={`flex items-center gap-1 px-2 py-0.5 border rounded-full text-[9px] font-bold uppercase ${
                  doc.status === 'Paid' ? 'text-green-700 bg-green-50 border-green-200' :
                  doc.status === 'Partial' ? 'text-orange-700 bg-orange-50 border-orange-200' :
                  'text-red-700 bg-red-50 border-red-200'
                }`}>
                  {doc.status === 'Paid' ? <CheckCircle2 size={10}/> : <Clock size={10}/>}
                  {doc.status}
                </span>

                {/* Delete Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // টেবিল ক্লিকে যাতে লোড না হয়ে ডিলিট হয়
                    deleteDocument && deleteDocument(doc.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete Document"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedDocs;