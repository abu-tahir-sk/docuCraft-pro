import React from 'react';
import { Mail, Phone, MapPin, Landmark, CreditCard, FileText, Heart } from 'lucide-react';
import { formatDate } from '../utils';

const QuotationLayout = ({ contextData }) => {
  const { theme, appState, calculated } = contextData;
  const { labels, meta, from, to, items, financials, payment, texts } = appState;
  const { subtotal, taxAmount, total, amountInWords } = calculated;

  const mainColor = theme?.main || 'text-blue-600';
  const bgColor = theme?.bg || 'bg-blue-600';
  const lightBg = theme?.bgLight || 'bg-blue-50';

  return (
    // Added h-full and flex flex-col to utilize the full A4 page height
    <div className="w-full h-full min-h-[1050px] flex flex-col font-sans relative">
       
       {/* 1. HEADER SECTION */}
       <div className="flex justify-between items-start mb-10">
          <div className="flex items-center gap-4">
             {from.logo ? (
                <img src={from.logo} alt="Logo" className="w-20 h-20 object-contain rounded-xl shadow-sm" />
             ) : (
                <div className={`w-20 h-20 ${bgColor} rounded-xl shadow-sm`}></div>
             )}
             <div>
                <h1 className={`text-[46px] font-black uppercase tracking-tight leading-none ${mainColor}`}>
                   {appState.docType || 'QUOTATION'}
                </h1>
                <p className="text-[13px] font-bold text-slate-800 mt-1"># {meta.id}</p>
             </div>
          </div>
          <div className="text-[11px] text-slate-700 text-right space-y-1.5 pt-1">
             <h2 className={`text-[16px] font-bold mb-2 ${mainColor}`}>{from.name}</h2>
             {from.email && (
                <div className="flex items-center justify-end gap-2">
                   <span>{from.email}</span> <Mail size={13} className={mainColor} />
                </div>
             )}
             {from.phone && (
                <div className="flex items-center justify-end gap-2">
                   <span>{from.phone}</span> <Phone size={13} className={mainColor} />
                </div>
             )}
             {from.address && (
                <div className="flex items-start justify-end gap-2">
                   <span className="whitespace-pre-line text-right">{from.address}</span> 
                   <MapPin size={13} className={`mt-0.5 ${mainColor}`} />
                </div>
             )}
          </div>
       </div>

       {/* 2. CLIENT & QUOTATION DETAILS */}
       <div className="grid grid-cols-2 gap-10 mb-8">
          {/* Billed To */}
          <div>
             <span className={`inline-block px-4 py-1.5 ${lightBg} ${mainColor} font-bold text-[9px] uppercase tracking-widest rounded-full mb-4`}>
                BILLED TO
             </span>
             <h3 className="text-[15px] font-black text-slate-900 mb-2">{to.name}</h3>
             <div className="text-[11px] text-slate-600 space-y-2">
                {to.email && <div className="flex items-center gap-2"><Mail size={13} className={mainColor} /> <span>{to.email}</span></div>}
                {to.phone && <div className="flex items-center gap-2"><Phone size={13} className={mainColor} /> <span>{to.phone}</span></div>}
                {to.address && <div className="flex items-start gap-2"><MapPin size={13} className={`mt-0.5 ${mainColor}`} /> <span className="whitespace-pre-line">{to.address}</span></div>}
             </div>
          </div>

          {/* Quotation Details */}
          <div className="pl-6">
             <span className={`inline-block px-4 py-1.5 ${lightBg} ${mainColor} font-bold text-[9px] uppercase tracking-widest rounded-full mb-4`}>
                QUOTATION DETAILS
             </span>
             <div className="grid grid-cols-[100px_1fr] gap-y-2.5 text-[11px] text-slate-700">
                <p className="text-slate-500 font-medium">Quotation Date</p> <p>: {formatDate(meta.date)}</p>
                <p className="text-slate-500 font-medium">Valid Until</p> <p>: {formatDate(meta.dueDate)}</p>
                <p className="text-slate-500 font-medium">Currency</p> <p>: {meta.currency || 'INR (₹)'}</p>
                <p className="text-slate-500 font-medium">Payment Terms</p> <p>: {meta.paymentTerms || '-'}</p>
             </div>
          </div>
       </div>

       {/* 3. SERVICE TABLE */}
       <div className="mb-6">
          <table className="w-full text-left border-collapse   ">
             <thead>
                <tr className={`${bgColor}  backdrop-blur-none text-white text-[10px] font-bold uppercase tracking-wider`}>
                   <th className="py-3.5 px-4 w-[6%] text-center border-r border-white/20">#</th>
                   <th className="py-3.5 px-4 w-[44%] border-r border-white/20">{labels.desc || 'DESCRIPTION OF SERVICE'}</th>
                   <th className="py-3.5 px-4 w-[15%] text-center border-r border-white/20">QTY / HRS</th>
                   <th className="py-3.5 px-4 w-[15%] text-center border-r border-white/20">RATE (₹)</th>
                   <th className="py-3.5 px-4 w-[20%] text-center">AMOUNT (₹)</th>
                </tr>
             </thead>
             <tbody>
                {items.map((item, i) => (
                   <tr key={item.id || i} className="border-b border-slate-200  hover:bg-slate-50/50">
                      <td className="py-4 px-4 text-[12px] text-center text-slate-600 border-r border-slate-200 align-top">{i + 1}</td>
                      <td className="py-4 px-4 text-[12px] text-slate-800 font-medium border-r border-slate-200 whitespace-pre-wrap align-top">{item.desc}</td>
                      <td className="py-4 px-4 text-[12px] text-center text-slate-600 border-r border-slate-200 align-top">{item.qty}</td>
                      <td className="py-4 px-4 text-[12px] text-center text-slate-600 border-r border-slate-200 align-top">{Number(item.rate).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                      <td className="py-4 px-4 text-[12px] text-center font-bold text-slate-900 align-top">{Number(item.qty * item.rate).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>

       {/* 4. SUMMARY & AMOUNT IN WORDS */}
       <div className="flex justify-between items-start gap-8">
          <div className="w-[55%]">
             <h4 className={`text-[10px] font-bold ${mainColor} uppercase tracking-widest mb-2`}>{labels.amtWords || 'AMOUNT IN WORDS'}</h4>
             <div className="bg-[#f4f6f8] backdrop-blur-none rounded-xl p-4 text-[11px] font-medium text-slate-700 mb-6 leading-relaxed border border-slate-100">
                {amountInWords}
             </div>
             
             <h4 className={`text-[10px] font-bold ${mainColor} uppercase tracking-widest mb-2`}>{labels.notes || 'NOTES'}</h4>
             <p className="text-[11px] text-slate-600 whitespace-pre-line leading-relaxed">
                {texts.notes || "Thank you for choosing TechFlow Solutions.\nPayment is due within 15 days via NEFT/RTGS."}
             </p>
          </div>

          <div className="w-[45%] border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
             <div className="flex justify-between items-center p-4 border-b border-slate-200 ">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{labels.subtotal || 'SUBTOTAL'}</span>
                <span className="text-[12px] font-bold text-slate-900">₹ {subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
             </div>
             <div className="flex justify-between items-center p-4 border-b border-slate-200 ">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{labels.tax || 'TAX'} ({financials.taxRate || 18}%)</span>
                <span className="text-[12px] font-bold text-slate-900">₹ {taxAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
             </div>
             <div className={`flex justify-between items-center p-4 ${lightBg} mt-auto`}>
                <span className={`text-[13px] font-bold ${mainColor} uppercase tracking-wider`}>{labels.total || 'TOTAL'}</span>
                <span className={`text-[17px] font-black ${mainColor}`}>₹ {total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
             </div>
          </div>
       </div>

       {/* 5. ANCHORED BOTTOM SECTION (Pushed to the bottom using mt-auto) */}
       <div className="mt-auto pt-8">
          {/* Separator */}
          <div className="w-full border-t border-blue-200/60 mb-6"></div>

          {/* PAYMENT INFORMATION */}
          <div className="mb-4">
             <h4 className={`text-[10px] font-bold ${mainColor} uppercase tracking-widest mb-4`}>PAYMENT INFORMATION</h4>
             <div className="grid grid-cols-3 gap-6">
                {/* Bank Transfer */}
                <div className="flex gap-3">
                   <div className={`w-10 h-10 rounded-xl ${lightBg} ${mainColor} flex items-center justify-center shrink-0`}>
                      <Landmark size={18} />
                   </div>
                   <div className="text-[10px] text-slate-600 space-y-1">
                      <p className="font-bold text-slate-900 text-[11px] mb-1">Bank Transfer</p>
                      <p>{payment.bankName}</p>
                      <p>A/C: {payment.accountNo}</p>
                      <p>IFSC: {payment.ifsc}</p>
                   </div>
                </div>
                {/* UPI Payment */}
                <div className="flex gap-3 border-l border-slate-200 pl-6">
                   <div className={`w-10 h-10 rounded-xl ${lightBg} ${mainColor} flex items-center justify-center shrink-0`}>
                      <CreditCard size={18} />
                   </div>
                   <div className="text-[10px] text-slate-600 space-y-1">
                      <p className="font-bold text-slate-900 text-[11px] mb-1">UPI Payment</p>
                      <p>{payment.upiName}</p>
                      <p>{payment.upiNumber}</p>
                   </div>
                </div>
                {/* Other Details */}
                <div className="flex gap-3 border-l border-slate-200 pl-6">
                   <div className={`w-10 h-10 rounded-xl ${lightBg} ${mainColor} flex items-center justify-center shrink-0`}>
                      <FileText size={18} />
                   </div>
                   <div className="text-[10px] text-slate-600 space-y-1">
                      <p className="font-bold text-slate-900 text-[11px] mb-1">Other Details</p>
                      <p>PAN: {payment.pan}</p>
                      <p>GSTIN: {payment.gstin}</p>
                   </div>
                </div>
             </div>
          </div>

          {/* FOOTER */}
          <div className="mt-6 border-t border-blue-200/60 pt-4 flex items-center gap-2 text-blue-600 font-bold text-[11px]">
             <Heart size={14} fill="currentColor" />
             <p>Thank you for your business!</p>
          </div>
       </div>

    </div>
  );
};

export default QuotationLayout;