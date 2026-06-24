import React from 'react';
import { Building2, User, ImagePlus, Edit3, FileSignature } from 'lucide-react';

const GeneralInfo = ({ appState, appSetters, actions, theme }) => {
  const { docType, meta, from, to } = appState;
  const { setMeta, setFrom, setTo } = appSetters;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* 1. Document Type Switcher */}
      <div className="flex bg-gray-100 p-1 rounded-md border border-gray-200">
        {['invoice', 'quotation', 'agreement'].map(type => (
          <button
            key={type}
            onClick={() => actions.handleDocTypeChange(type)}
            className={`flex-1 py-1.5 text-[13px] font-bold rounded capitalize transition-all duration-200 ${docType === type ? `bg-white shadow-sm ${theme?.main || 'text-blue-600'}` : 'text-gray-500'
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
          <input type="text" value={meta.id} onChange={(e) => setMeta({ ...meta, id: e.target.value })} className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Date</label>
          <input type="date" value={meta.date} onChange={(e) => setMeta({ ...meta, date: e.target.value })} className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
        </div>
        <div className="col-span-2">
          <label className="block text-[11px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Subject / Title</label>
          <input type="text" value={meta.subject || ''} onChange={(e) => setMeta({ ...meta, subject: e.target.value })} className="w-full px-2.5 py-2 bg-white border border-blue-200 rounded text-sm font-semibold outline-none focus:border-blue-500" placeholder="e.g. Project Delivery" />
        </div>
      </div>
      {/* Upload Section */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center justify-center p-3 border border-gray-200 bg-gray-50 rounded text-center">
          {from.logo ? (
            <img src={from.logo} className="h-10 object-contain mb-2" />
          ) : (
            <ImagePlus size={20} className="text-gray-400 mb-2" />
          )}

          <label className="text-[10px] font-bold text-blue-600 cursor-pointer">
            Upload Logo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onloadend = () => {
                  setFrom({ ...from, logo: reader.result });
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>

        <div className="flex flex-col items-center justify-center p-3 border border-gray-200 bg-gray-50 rounded text-center">
          {from.seal ? (
            <img src={from.seal} className="h-10 object-contain mb-2" />
          ) : (
            <FileSignature size={20} className="text-gray-400 mb-2" />
          )}

          <label className="text-[10px] font-bold text-blue-600 cursor-pointer">
            Upload Seal
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onloadend = () => {
                  setFrom({ ...from, seal: reader.result });
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>

        <div className="flex flex-col items-center justify-center p-3 border border-gray-200 bg-gray-50 rounded text-center">
          {from.signature ? (
            <img src={from.signature} className="h-10 object-contain mb-2" />
          ) : (
            <Edit3 size={20} className="text-gray-400 mb-2" />
          )}

          <label className="text-[10px] font-bold text-blue-600 cursor-pointer">
            Upload Sign
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onloadend = () => {
                  setFrom({ ...from, signature: reader.result });
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>
      </div>

      {/* 3. Company Details */}
      <div className="space-y-4">
        <h3 className="text-[12px] font-bold text-gray-800 uppercase flex items-center gap-1.5 border-b border-gray-200 pb-1">
          <Building2 size={14} className={theme?.main} /> My Company Details
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <input type="text" placeholder="Company Name" value={from.name} onChange={(e) => setFrom({ ...from, name: e.target.value })} className="col-span-2 w-full px-2.5 py-1.5 border rounded text-sm font-bold" />
          <input type="text" placeholder="Email" value={from.email} onChange={(e) => setFrom({ ...from, email: e.target.value })} className="w-full px-2.5 py-1.5 border rounded text-sm" />
          <input type="text" placeholder="Phone" value={from.phone} onChange={(e) => setFrom({ ...from, phone: e.target.value })} className="w-full px-2.5 py-1.5 border rounded text-sm" />
          <textarea rows="2" placeholder="Address" value={from.address} onChange={(e) => setFrom({ ...from, address: e.target.value })} className="col-span-2 w-full px-2.5 py-1.5 border rounded text-sm resize-none" />
        </div>
      </div>

      {/* 4. Client Details */}
      <div className="space-y-4">
        <h3 className="text-[12px] font-bold text-gray-800 uppercase flex items-center gap-1.5 border-b border-gray-200 pb-1">
          <User size={14} className={theme?.main} /> Client Details
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <input type="text" placeholder="Client Name" value={to.name} onChange={(e) => setTo({ ...to, name: e.target.value })} className="col-span-2 w-full px-2.5 py-1.5 border rounded text-sm font-bold" />
          <input type="text" placeholder="Email" value={to.email} onChange={(e) => setTo({ ...to, email: e.target.value })} className="w-full px-2.5 py-1.5 border rounded text-sm" />
          <input type="text" placeholder="Phone" value={to.phone} onChange={(e) => setTo({ ...to, phone: e.target.value })} className="w-full px-2.5 py-1.5 border rounded text-sm" />
          <textarea rows="2" placeholder="Address" value={to.address} onChange={(e) => setTo({ ...to, address: e.target.value })} className="col-span-2 w-full px-2.5 py-1.5 border rounded text-sm resize-none" />
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;