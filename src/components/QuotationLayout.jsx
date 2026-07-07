import React from 'react';
import { Mail, Phone, MapPin, QrCode } from 'lucide-react';
import { formatDate } from '../utils';

const QuotationLayout = ({ contextData }) => {
  const { theme, appState, calculated } = contextData;
  const { labels, meta, from, to, items, financials, payment, texts } = appState;
  const { subtotal, taxAmount, total, amountInWords } = calculated;
  
  const mainColor = theme?.main || 'text-blue-600';
  const bgColor = theme?.bg || 'bg-blue-600';
  const lightBg = theme?.bgLight || 'bg-blue-50';

  // ২. Status Badge-এর জন্য ডাইনামিক কালার ফাংশন
  const getStatusStyle = (status = 'Draft') => {
    const s = status.toLowerCase();
    if (s === 'accepted') return 'text-green-700 bg-green-50 border-green-200';
    if (s === 'pending') return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    if (s === 'sent') return 'text-blue-700 bg-blue-50 border-blue-200';
    if (s === 'rejected') return 'text-red-700 bg-red-50 border-red-200';
    return 'text-slate-700 bg-gray-50 border-gray-200';
  };

  return (
    <div className="w-full h-full min-h-[1050px] flex flex-col font-sans relative">
       
       {/* 1. HEADER SECTION (Title, Status, Company) */}
       <div className="flex justify-between items-start mb-10">
          <div className="flex items-start gap-5">
             {from.logo ? (
                <img src={from.logo} alt="Logo" className="w-24 h-24 object-contain rounded-xl shadow-sm border border-slate-100 p-1 bg-white" />
             ) : (
                <div className={`w-24 h-24 ${bgColor} rounded-xl shadow-sm`}></div>
             )}
             <div className="mt-1">
                <h1 className={`text-[36px] font-black uppercase tracking-tight leading-none ${mainColor}`}>
                   PRICE QUOTATION
                </h1>
                {/* ১. Title Update: Quotation No, Valid Until, Prepared By */}
                <div className="mt-3 text-[12px] font-bold text-slate-600 space-y-1">
                   <p>Quotation No: <span className="text-slate-900">{meta.id}</span></p>
                   <p>Valid Until: <span className="text-slate-900">{formatDate(meta.dueDate)}</span></p>
                   <p>Prepared By: <span className="text-slate-900">{from.name}</span></p>
                </div>
             </div>
          </div>

          <div className="text-right flex flex-col items-end pt-1">
             {/* ২. Status Badge */}
             <div className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-4 ${getStatusStyle(meta.status)}`}>
                 <span className="w-2 h-2 rounded-full currentColor bg-current"></span>
                 {meta.status || 'Draft'}
             </div>

             <h2 className={`text-[16px] font-bold mb-1.5 ${mainColor}`}>{from.name}</h2>
             <div className="text-[11px] text-slate-600 space-y-1.5">
                {from.email && <div className="flex items-center justify-end gap-2"><span>{from.email}</span> <Mail size={12} className={mainColor} /></div>}
                {from.phone && <div className="flex items-center justify-end gap-2"><span>{from.phone}</span> <Phone size={12} className={mainColor} /></div>}
                {from.address && <div className="flex items-start justify-end gap-2"><span className="whitespace-pre-line text-right">{from.address}</span> <MapPin size={12} className={`mt-0.5 ${mainColor}`} /></div>}
             </div>
          </div>
       </div>

       {/* 3 & 4. CLIENT INFO & QUOTATION DETAILS */}
       <div className="grid grid-cols-2 gap-10 mb-8">
          {/* ৩. Client Information */}
          <div>
             <span className={`inline-block px-4 py-1.5 ${lightBg} ${mainColor} font-bold text-[9px] uppercase tracking-widest rounded-full mb-4`}>
                CLIENT INFORMATION
             </span>
             <h3 className="text-[15px] font-black text-slate-900 mb-1">{to.name}</h3>
             {to.companyName && <p className="text-[12px] font-bold text-slate-800 mb-1">{to.companyName}</p>}
             {to.contactPerson && <p className="text-[11px] font-medium text-slate-600 mb-1">Attn: {to.contactPerson}</p>}
             
             <div className="text-[11px] text-slate-600 space-y-1.5 mt-2">
                {to.email && <div className="flex items-center gap-2"><Mail size={12} className={mainColor} /> <span>{to.email}</span></div>}
                {to.phone && <div className="flex items-center gap-2"><Phone size={12} className={mainColor} /> <span>{to.phone}</span></div>}
                {to.address && <div className="flex items-start gap-2"><MapPin size={12} className={`mt-0.5 ${mainColor}`} /> <span className="whitespace-pre-line">{to.address}</span></div>}
                {(to.gst || to.taxId) && <div className="flex items-center gap-2 mt-1"><span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${mainColor} border-blue-200`}>GST: {to.gst || to.taxId}</span></div>}
             </div>
          </div>

          {/* ৪. Quotation Details */}
          <div className="pl-6 border-l border-slate-100">
             <span className={`inline-block px-4 py-1.5 ${lightBg} ${mainColor} font-bold text-[9px] uppercase tracking-widest rounded-full mb-4`}>
                QUOTATION DETAILS
             </span>
             <div className="grid grid-cols-[100px_1fr] gap-y-2.5 text-[11px] text-slate-700">
                <p className="text-slate-500 font-medium">Quotation No</p> <p className="font-bold text-slate-900">: {meta.id}</p>
                <p className="text-slate-500 font-medium">Issue Date</p> <p>: {formatDate(meta.date)}</p>
                <p className="text-slate-500 font-medium">Valid Until</p> <p className="font-bold text-slate-900">: {formatDate(meta.dueDate)}</p>
                <p className="text-slate-500 font-medium">Reference No</p> <p>: {meta.subject || '-'}</p>
                <p className="text-slate-500 font-medium">Prepared By</p> <p>: {from.name}</p>
                <p className="text-slate-500 font-medium">Currency</p> <p>: {meta.currency || 'INR'}</p>
             </div>
          </div>
       </div>

       {/* 5. TABLE (Professional format) */}
       <div className="mb-6">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className={`${bgColor} text-white text-[9px] font-bold uppercase tracking-widest`}>
                   <th className="py-3 px-3 w-[5%] text-center border-r border-white/20">#</th>
                   <th className="py-3 px-3 w-[33%] border-r border-white/20">DESCRIPTION</th>
                   <th className="py-3 px-3 w-[8%] text-center border-r border-white/20">QTY</th>
                   <th className="py-3 px-3 w-[10%] text-center border-r border-white/20">UNIT</th>
                   <th className="py-3 px-3 w-[12%] text-right border-r border-white/20">UNIT PRICE</th>
                   <th className="py-3 px-3 w-[10%] text-center border-r border-white/20">DISCOUNT</th>
                   <th className="py-3 px-3 w-[10%] text-center border-r border-white/20">TAX</th>
                   <th className="py-3 px-3 w-[12%] text-right">AMOUNT</th>
                </tr>
             </thead>
             <tbody>
                {items.map((item, i) => (
                   <tr key={item.id || i} className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-3 text-[11px] text-center text-slate-500 border-r border-slate-200 align-top">{i + 1}</td>
                      <td className="py-3.5 px-3 text-[11px] text-slate-800 font-bold border-r border-slate-200 whitespace-pre-wrap align-top">{item.desc || item.name}</td>
                      <td className="py-3.5 px-3 text-[11px] text-center text-slate-600 border-r border-slate-200 align-top">{item.qty}</td>
                      <td className="py-3.5 px-3 text-[11px] text-center text-slate-600 border-r border-slate-200 align-top">{item.unit || '-'}</td>
                      <td className="py-3.5 px-3 text-[11px] text-right text-slate-600 border-r border-slate-200 align-top">{Number(item.rate || item.price || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                      <td className="py-3.5 px-3 text-[11px] text-center text-slate-600 border-r border-slate-200 align-top">{item.discount || '-'}</td>
                      <td className="py-3.5 px-3 text-[11px] text-center text-slate-600 border-r border-slate-200 align-top">{item.taxRate || 0}%</td>
                      <td className="py-3.5 px-3 text-[11px] text-right font-black text-slate-900 align-top">{Number((item.qty || 0) * (item.rate || item.price || 0)).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>

       {/* 6. SUMMARY & 7. IMPORTANT NOTE */}
       <div className="flex justify-between items-start gap-8">
          <div className="w-[50%]">
             <h4 className={`text-[10px] font-bold ${mainColor} uppercase tracking-widest mb-2`}>{labels.amtWords || 'AMOUNT IN WORDS'}</h4>
             <div className="bg-[#f4f6f8] rounded-xl p-3 text-[11px] font-medium text-slate-700 mb-6 border border-slate-100">
                {amountInWords || '-'}
             </div>
             
             {/* ৭. Important Note Box */}
             <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 shadow-sm">
                <h4 className="text-amber-800 text-[10px] font-bold uppercase tracking-widest mb-2">Important Note</h4>
                <div className="space-y-1 text-[11px] text-amber-900/80 font-medium">
                   <p>• This quotation is valid for 30 days (Until {formatDate(meta.dueDate)}).</p>
                   <p>• Prices are subject to change after expiry.</p>
                   <p>• Payment Terms: <span className="font-bold text-amber-900">{meta.paymentTerms || '50% Advance, 50% After Delivery'}</span></p>
                </div>
             </div>
          </div>
          
          {/* ৬. Summary Block */}
          <div className="w-[45%] border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
             <div className="flex justify-between items-center p-3 border-b border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subtotal</span>
                <span className="text-[12px] font-bold text-slate-900">{subtotal?.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
             </div>
             <div className="flex justify-between items-center p-3 border-b border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Discount</span>
                <span className="text-[12px] font-bold text-red-500">{financials?.discount > 0 ? '-' : ''} {(financials?.discount || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
             </div>
             <div className="flex justify-between items-center p-3 border-b border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tax</span>
                <span className="text-[12px] font-bold text-slate-900">{taxAmount?.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
             </div>
             <div className="flex justify-between items-center p-3 border-b border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Shipping</span>
                <span className="text-[12px] font-bold text-slate-900">{(financials?.shipping || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
             </div>
             <div className={`flex justify-between items-center p-4 ${lightBg} mt-auto`}>
                <span className={`text-[13px] font-bold ${mainColor} uppercase tracking-wider`}>Grand Total</span>
                <span className={`text-[17px] font-black ${mainColor}`}>{total?.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
             </div>
          </div>
       </div>

       {/* ANCHORED BOTTOM SECTION (Pushed to bottom) */}
       <div className="mt-auto pt-8">
          
          {/* 8. ACCEPTANCE SECTION & 9. QR CODE */}
          <div className="grid grid-cols-[1fr_260px] gap-8 border-t border-slate-200 pt-6">
             <div className="flex gap-4 items-start">
                {payment?.qrCode ? (
                  <img src={payment.qrCode} className="w-20 h-20 object-contain border border-slate-200 rounded-lg p-1 bg-white shadow-sm" alt="QR" />
                ) : (
                  <div className="w-20 h-20 bg-slate-50 flex items-center justify-center rounded-lg border border-slate-200 shadow-sm">
                     <QrCode size={28} className="text-slate-300"/>
                  </div>
                )}
                <div className="mt-1">
                  <p className={`font-bold ${mainColor} text-[11px] uppercase tracking-widest mb-1.5`}>Scan to Verify Quotation</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Scan this QR code to verify<br/>the authenticity of this document.</p>
                </div>
             </div>
             
             {/* ৮. Client Acceptance */}
             <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 shadow-sm">
                 <h4 className={`text-[10px] font-bold ${mainColor} uppercase tracking-widest mb-4`}>Client Acceptance</h4>
                 <div className="space-y-4 text-[11px] text-slate-600 font-medium">
                     <div className="flex gap-2 items-end"><span className="w-16">Name:</span> <div className="flex-1 border-b border-slate-400 border-dashed h-4"></div></div>
                     <div className="flex gap-2 items-end"><span className="w-16">Signature:</span> <div className="flex-1 border-b border-slate-400 border-dashed h-4"></div></div>
                     <div className="flex gap-2 items-end"><span className="w-16">Date:</span> <div className="flex-1 border-b border-slate-400 border-dashed h-4"></div></div>
                 </div>
             </div>
          </div>

          {/* 10. FOOTER */}
          <div className="mt-6 border-t border-slate-200 pt-4 flex justify-between items-center text-[10px] text-slate-500 font-medium">
             <p>Generated by <span className="font-bold text-slate-800">DocuCraft Pro</span></p>
             <div className="flex gap-6">
                 <span>www.docucraftpro.com</span>
                 <span>support@docucraftpro.com</span>
             </div>
          </div>
       </div>

    </div>
  );
};

export default QuotationLayout;