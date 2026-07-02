import React from 'react';
import { Building2, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../utils';

const AgreementLayout = ({ contextData }) => {
  const { theme, appState } = contextData;
  const { meta, from, to, texts, terms } = appState;

  return (
    <>
      <div className="flex justify-between items-start mb-5 border-b border-slate-200/60 pb-5">
        <div className="flex gap-4 max-w-[50%]">
          {from.logo ? (
            <img src={from.logo} className="w-16 h-16 object-contain rounded-xl shadow-sm border border-slate-200/50 bg-white/50 backdrop-blur-sm" alt="Company Logo" />
          ) : (
            <div className="w-16 h-16 rounded-xl shadow-sm flex items-center justify-center bg-slate-50/60 border border-slate-200/50 text-slate-400 backdrop-blur-sm">
              <Building2 size={28} />
            </div>
          )}
          <div className="flex flex-col justify-center">
            <h2 className="text-[20px] font-black tracking-tight text-slate-900 leading-none mb-1 break-words">{from.name}</h2>
            <p className="text-[10px] text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed break-words">{from.address}</p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <h1 className="text-[24px] font-black text-slate-900 uppercase tracking-tighter leading-none mb-1.5">SERVICE AGREEMENT</h1>
          <p className="text-[11px] font-bold text-slate-500 mb-3 break-words">Ref: {meta.id}</p>
          <div className="text-[10px] text-left bg-slate-50/60 p-3 rounded-xl border border-slate-200/50 shadow-sm space-y-1.5 backdrop-blur-sm">
            <div className="flex gap-2"><span className="text-slate-500 font-medium w-20">Effective Date:</span><span className="font-bold text-slate-900">{formatDate(meta.date)}</span></div>
            <div className="flex gap-2"><span className="text-slate-500 font-medium w-20">Valid Until:</span><span className="font-bold text-slate-900">{formatDate(meta.dueDate)}</span></div>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-700 leading-relaxed space-y-4 mb-4 text-justify">
        <p>
          This Service Agreement ("Agreement") is entered into on this <strong>{formatDate(meta.date)}</strong>, by and between:
        </p>

        <div className="grid grid-cols-2 gap-6 bg-slate-50/60 p-5 rounded-2xl border border-slate-200/50 shadow-sm backdrop-blur-sm">
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Service Provider (Party A)</h4>
            <h3 className="text-[13px] font-black text-slate-900 mb-1 break-words">{from.name}</h3>
            <p className="whitespace-pre-wrap text-slate-600 leading-relaxed break-words">{from.address}</p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Client (Party B)</h4>
            <h3 className="text-[13px] font-black text-slate-900 mb-1 break-words">{to.name}</h3>
            {to.companyName && <p className="font-bold text-slate-700 mb-1 break-words">{to.companyName}</p>}
            <p className="whitespace-pre-wrap text-slate-600 leading-relaxed break-words">{to.address}</p>
          </div>
        </div>

        <div className="bg-white/60 p-4 rounded-2xl border border-slate-200/60 shadow-sm backdrop-blur-sm overflow-hidden">
          <h3 className={`text-[12px] font-bold ${theme?.main || 'text-blue-600'} uppercase mb-2 border-b border-slate-200/60 pb-1.5`}>1. Scope of Services</h3>
          <p className="whitespace-pre-wrap leading-relaxed break-words">{texts.notes || "The Service Provider agrees to deliver professional services as mutually discussed and agreed upon. Deliverables and timelines are subject to standard industry practices."}</p>
        </div>

        <div className="bg-white/60 p-4 rounded-2xl border border-slate-200/60 shadow-sm backdrop-blur-sm overflow-hidden">
          <h3 className={`text-[12px] font-bold ${theme?.main || 'text-blue-600'} uppercase mb-2 border-b border-slate-200/60 pb-1.5`}>2. Terms & Conditions</h3>
          <p className="whitespace-pre-wrap leading-relaxed break-words">{terms || "1. Payment Terms: Invoices are payable within the agreed timeframe.\n2. Confidentiality: Both parties agree to maintain strict confidentiality regarding project details.\n3. Termination: Either party may terminate this agreement with a 30-day written notice.\n4. Governing Law: This agreement shall be governed by local state/country laws."}</p>
        </div>

        <p className="italic text-slate-500 mt-4 text-center px-4 leading-relaxed">
          By signing below, both parties acknowledge and agree to the terms and conditions outlined in this Agreement.
        </p>
      </div>

      {/* SIGNATURES (mt-auto forces this to the bottom) */}
      <div className="grid grid-cols-3 gap-6 mt-auto border-t border-slate-200/60 pt-6">
        <div className="flex flex-col items-center justify-end text-center pb-1">
          <div className="h-12 w-[90%] border-b border-slate-400 mb-2"></div>
          <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Company Signature</p>
          <p className="text-[9px] text-slate-500 mt-1 break-words px-2">{from.name}</p>
        </div>
        <div className="flex flex-col items-center justify-end text-center pb-1">
          <div className="h-12 w-[90%] border-b border-slate-400 mb-2"></div>
          <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Client Signature</p>
          <p className="text-[9px] text-slate-500 mt-1 break-words px-2">{to.name}</p>
        </div>
        <div className="flex flex-col items-center justify-end text-center pb-1">
          <div className="h-12 w-[90%] border-b border-slate-400 border-dashed mb-2 flex items-center justify-center">
            <span className="text-slate-300 font-bold tracking-widest text-[10px] uppercase opacity-70">Seal / Stamp</span>
          </div>
          <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Company Seal</p>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center text-[9px] text-slate-400 font-medium uppercase tracking-wider border-t border-slate-200/60 pt-3">
        <div className="flex items-center gap-1.5"><CheckCircle2 size={10} className="text-emerald-500"/> Legally Binding Document.</div>
        <div className="break-words">Generated by {from.name || "ERP"}</div>
      </div>
    </>
  );
};

export default AgreementLayout;