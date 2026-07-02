import React from 'react';
import { Building2, User, ImagePlus, Edit3, FileSignature } from 'lucide-react';

const GeneralInfo = ({ appState, appSetters, actions, theme }) => {
  const { docType, meta, from, to } = appState || {};
  const { setMeta, setFrom, setTo } = appSetters || {};
  const { handleDocTypeChange, handleImageUpload } = actions || {};

  if (!from || !to) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Document Type Switcher */}
      <div className="flex bg-gray-100 p-1 rounded-md border border-gray-200">
        {['invoice', 'quotation', 'agreement'].map(type => (
          <button 
            key={type} 
            onClick={() => handleDocTypeChange && handleDocTypeChange(type)} 
            className={`flex-1 py-1.5 text-[13px] font-bold rounded capitalize transition-all duration-200 ${
              docType === type ? `bg-white shadow-sm ${theme?.main || 'text-blue-600'}` : 'text-gray-500'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 2. Metadata Section */}
      <div className="grid grid-cols-2 gap-3 bg-[#f8f9fa] p-4 rounded-lg border border-gray-200">
        <div className="col-span-2 md:col-span-1">
          <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Document ID</label>
          <input type="text" value={meta.id} onChange={(e) => setMeta({...meta, id: e.target.value})} className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-sm font-semibold outline-none focus:border-blue-500" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Currency</label>
          <input type="text" value={meta.currency} onChange={(e) => setMeta({...meta, currency: e.target.value})} className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-sm font-semibold outline-none focus:border-blue-500" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Date</label>
          <input type="date" value={meta.date} onChange={(e) => setMeta({...meta, date: e.target.value})} className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
        </div>
        
        {docType !== 'agreement' && (
          <>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Due Date / Validity</label>
              <input type="date" value={meta.dueDate} onChange={(e) => setMeta({...meta, dueDate: e.target.value})} className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">PO Number</label>
              <input type="text" value={meta.poNumber} onChange={(e) => setMeta({...meta, poNumber: e.target.value})} placeholder="e.g. PO-9981" className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Payment Status</label>
              <select value={meta.status} onChange={(e) => setMeta({...meta, status: e.target.value})} className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-sm font-bold outline-none focus:border-blue-500 cursor-pointer">
                <option value="Unpaid">🔴 Unpaid</option>
                <option value="Partial">🟠 Partial</option>
                <option value="Paid">🟢 Paid</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Payment Terms</label>
              <input type="text" value={meta.paymentTerms} onChange={(e) => setMeta({...meta, paymentTerms: e.target.value})} className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
            </div>
          </>
        )}
        <div className="col-span-2 border-t border-gray-200 mt-2 pt-3">
          <label className="flex items-center gap-2 text-[11px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Main Subject / Reference Title</label>
          <input type="text" placeholder="e.g. Invoice for Web Development" value={meta.subject || ''} onChange={(e) => setMeta({...meta, subject: e.target.value})} className="w-full px-2.5 py-2 bg-white border border-blue-200 rounded text-sm font-semibold outline-none focus:border-blue-500" />
        </div>
      </div>

      {/* 3. My Company Details */}
      <div className="space-y-4">
        <h3 className="text-[12px] font-bold text-gray-800 uppercase flex items-center gap-1.5 border-b border-gray-200 pb-1">
          <Building2 size={14} className={theme?.main || 'text-blue-600'}/> My Company Details
        </h3>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-center p-2 border border-gray-200 bg-gray-50 rounded text-center">
            {from.logo ? <img src={from.logo} className="h-10 object-contain mb-2" alt="Logo" /> : <ImagePlus size={20} className="text-gray-400 mb-1" />}
            <label className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${theme?.bgLight || 'bg-blue-50'} ${theme?.main || 'text-blue-600'} hover:opacity-80`}>
              {from.logo ? 'Change Logo' : 'Upload Logo'}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload && handleImageUpload(e, 'from', 'logo')} className="hidden" />
            </label>
            {from.logo && <button onClick={() => setFrom({...from, logo: null})} className="text-[10px] text-red-500 hover:underline mt-1">Remove</button>}
          </div>
          <div className="flex flex-col items-center justify-center p-2 border border-gray-200 bg-gray-50 rounded text-center">
            {from.seal ? <img src={from.seal} className="h-10 object-contain mb-2" alt="Seal" /> : <FileSignature size={20} className="text-gray-400 mb-1" />}
            <label className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${theme?.bgLight || 'bg-blue-50'} ${theme?.main || 'text-blue-600'} hover:opacity-80`}>
              {from.seal ? 'Change Seal' : 'Upload Seal'}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload && handleImageUpload(e, 'from', 'seal')} className="hidden" />
            </label>
            {from.seal && <button onClick={() => setFrom({...from, seal: null})} className="text-[10px] text-red-500 hover:underline mt-1">Remove</button>}
          </div>
          <div className="flex flex-col items-center justify-center p-2 border border-gray-200 bg-gray-50 rounded text-center">
            {from.signature ? <img src={from.signature} className="h-10 object-contain mb-2" alt="Signature" /> : <Edit3 size={20} className="text-gray-400 mb-1" />}
            <label className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${theme?.bgLight || 'bg-blue-50'} ${theme?.main || 'text-blue-600'} hover:opacity-80`}>
              {from.signature ? 'Change Sign' : 'Upload Sign'}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload && handleImageUpload(e, 'from', 'signature')} className="hidden" />
            </label>
            {from.signature && <button onClick={() => setFrom({...from, signature: null})} className="text-[10px] text-red-500 hover:underline mt-1">Remove</button>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input type="text" placeholder="Company Name" value={from.name} onChange={(e) => setFrom({...from, name: e.target.value})} className="col-span-2 w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm font-bold outline-none" />
          <input type="text" placeholder="Tax ID / GSTIN" value={from.taxId} onChange={(e) => setFrom({...from, taxId: e.target.value})} className="col-span-2 w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm font-semibold text-blue-700 bg-blue-50/30 outline-none" />
          <input type="text" placeholder="Email" value={from.email} onChange={(e) => setFrom({...from, email: e.target.value})} className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm outline-none" />
          <input type="text" placeholder="Phone" value={from.phone} onChange={(e) => setFrom({...from, phone: e.target.value})} className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm outline-none" />
          <textarea rows="2" placeholder="Address" value={from.address} onChange={(e) => setFrom({...from, address: e.target.value})} className="col-span-2 w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm outline-none resize-none" />
          <input type="text" placeholder="Website" value={from.website} onChange={(e) => setFrom({...from, website: e.target.value})} className="col-span-2 w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm outline-none" />
        </div>
      </div>

      {/* 4. Client Details */}
      <div className="space-y-3">
        <h3 className="text-[12px] font-bold text-gray-800 uppercase flex items-center gap-1.5 border-b border-gray-200 pb-1">
          <User size={14} className={theme?.main || 'text-blue-600'}/> Client Details
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <input type="text" placeholder="Client Name" value={to.name} onChange={(e) => setTo({...to, name: e.target.value})} className="col-span-2 w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm font-bold outline-none" />
          <input type="text" placeholder="Client Tax ID / GSTIN" value={to.taxId} onChange={(e) => setTo({...to, taxId: e.target.value})} className="col-span-2 w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm font-semibold outline-none" />
          <input type="text" placeholder="Email" value={to.email} onChange={(e) => setTo({...to, email: e.target.value})} className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm outline-none" />
          <input type="text" placeholder="Phone" value={to.phone} onChange={(e) => setTo({...to, phone: e.target.value})} className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm outline-none" />
          <textarea rows="2" placeholder="Address" value={to.address} onChange={(e) => setTo({...to, address: e.target.value})} className="col-span-2 w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm outline-none resize-none" />
        </div>
      </div>
      
    </div>
  );
};
export default GeneralInfo;