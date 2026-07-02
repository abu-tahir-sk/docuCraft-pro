import React from 'react';
import { Mail, Phone, MapPin, Globe, Landmark, CreditCard, QrCode, Building2, Calendar, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatDate } from '../utils';

const InvoiceLayout = ({ contextData }) => {
  const { theme, appState, calculated } = contextData;
  const { labels, meta, from, to, shipTo, items, financials, payment, texts, terms } = appState;
  const { subtotal, taxAmount, total, amountInWords } = calculated;

  const discount = financials?.discount || 0;
  const shipping = financials?.shipping || 0;
  const roundOff = financials?.roundOff || 0;
  const amountPaid = financials?.amountPaid || 0;
  const grandTotal = total || (subtotal - discount + taxAmount + shipping + roundOff);
  const balanceDue = grandTotal - amountPaid;

  const dueDays = meta.dueDate ? Math.ceil(Math.abs(new Date(meta.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'paid') return 'bg-emerald-50/80 text-emerald-600 border-emerald-200/50';
    if (s === 'unpaid') return 'bg-rose-50/80 text-rose-600 border-rose-200/50';
    if (s === 'partial') return 'bg-amber-50/80 text-amber-600 border-amber-200/50';
    return 'bg-slate-50/80 text-slate-600 border-slate-200/50'; 
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-start mb-5">
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
            {from.tagline && <p className="text-[11px] text-slate-500 font-medium mb-1.5 break-words">{from.tagline}</p>}
            <div className="flex flex-col gap-1 text-[10px] text-slate-600 mt-1">
              {from.address && <div className="flex items-start gap-1.5"><MapPin size={12} className={`mt-0.5 ${theme?.main || 'text-blue-500'} shrink-0`}/> <span className="whitespace-pre-line break-words leading-snug">{from.address}</span></div>}
              <div className="flex items-center gap-3 mt-1">
                {from.phone && <div className="flex items-center gap-1.5"><Phone size={12} className={theme?.main || 'text-blue-500'}/> <span className="break-words">{from.phone}</span></div>}
                {from.email && <div className="flex items-center gap-1.5"><Mail size={12} className={theme?.main || 'text-blue-500'}/> <span className="break-words">{from.email}</span></div>}
              </div>
              <div className="flex items-center gap-3 mt-0.5 font-medium">
                {from.website && <div className="flex items-center gap-1.5"><Globe size={12} className={theme?.main || 'text-blue-500'}/> <span className="break-words">{from.website}</span></div>}
                {from.gstin && <div><span className="text-slate-400">GSTIN:</span> <span className="break-words">{from.gstin}</span></div>}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <h1 className="text-[32px] font-black text-slate-900 uppercase tracking-tighter leading-none mb-1.5">INVOICE</h1>
          <p className="text-[13px] font-bold text-slate-500 mb-3 break-words"># {meta.id}</p>
          <div className="grid grid-cols-[auto_auto] gap-x-3 gap-y-1.5 text-[10px] text-left bg-slate-50/60 p-3 rounded-xl border border-slate-200/50 shadow-sm backdrop-blur-sm">
            <span className="text-slate-500 flex items-center gap-1.5 font-medium"><Calendar size={12}/> Date:</span>
            <span className="font-bold text-slate-900">{formatDate(meta.date)}</span>
            <span className="text-slate-500 flex items-center gap-1.5 font-medium"><Calendar size={12}/> Due Date:</span>
            <span className="font-bold text-slate-900">{formatDate(meta.dueDate)}</span>
          </div>
          {meta.status && (
            <div className="mt-2 flex items-center gap-2">
              {dueDays && meta.status.toLowerCase() !== 'paid' && <span className="text-[9px] font-bold text-rose-600 bg-rose-50/80 px-2 py-1 rounded-full border border-rose-200/50">Due in {dueDays} days</span>}
              <span className={`px-2.5 py-1 border rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-sm ${getStatusBadge(meta.status)}`}>{meta.status}</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full border-t border-slate-200/60 mb-5"></div>

      {/* CLIENT INFO CARDS */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/50 shadow-sm backdrop-blur-sm overflow-hidden">
          <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><FileText size={12}/> Bill To</h4>
          <h3 className="text-[14px] font-black text-slate-900 mb-1 break-words">{to.name}</h3>
          {to.companyName && <p className="text-[11px] font-bold text-slate-700 mb-1 break-words">{to.companyName}</p>}
          {to.gstNumber && <p className="text-[10px] font-semibold text-slate-500 mb-1.5 break-words">GSTIN: {to.gstNumber}</p>}
          <div className="text-[10px] text-slate-600 space-y-1.5 mt-2">
            {to.email && <div className="flex items-center gap-2"><Mail size={12} className="text-slate-400 shrink-0"/> <span className="break-words">{to.email}</span></div>}
            {to.phone && <div className="flex items-center gap-2"><Phone size={12} className="text-slate-400 shrink-0"/> <span className="break-words">{to.phone}</span></div>}
            {to.address && <div className="flex items-start gap-2 mt-1"><MapPin size={12} className="mt-0.5 text-slate-400 shrink-0"/> <span className="whitespace-pre-line leading-relaxed break-words">{to.address}</span></div>}
          </div>
        </div>
        {shipTo && (shipTo.name || shipTo.address) ? (
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/50 shadow-sm backdrop-blur-sm overflow-hidden">
            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><MapPin size={12}/> Ship To</h4>
            <h3 className="text-[14px] font-bold text-slate-900 mb-1 break-words">{shipTo.name || to.name}</h3>
            <div className="text-[10px] text-slate-600 space-y-1.5 mt-2">
              {shipTo.address && <div className="flex items-start gap-2"><MapPin size={12} className="mt-0.5 text-slate-400 shrink-0"/> <span className="whitespace-pre-line leading-relaxed break-words">{shipTo.address}</span></div>}
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center bg-slate-50/30 p-4 rounded-2xl border border-slate-200/50 border-dashed text-slate-400 text-center text-[10px] backdrop-blur-sm">
            <p>Ship To identical to Bill To</p>
          </div>
        )}
      </div>

      {/* SERVICE TABLE */}
      <div className="mb-5 rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm backdrop-blur-sm flex-shrink-0">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className={`${theme?.bg || 'bg-slate-800/90'} text-white text-[9px] uppercase tracking-widest`}>
              <th className="py-2.5 px-3 font-bold w-[6%] text-center border-r border-white/10">#</th>
              <th className="py-2.5 px-3 font-bold w-[38%] border-r border-white/10">{labels.desc}</th>
              <th className="py-2.5 px-3 font-bold w-[13%] text-center border-r border-white/10">Qty/Unit</th>
              <th className="py-2.5 px-3 font-bold w-[14%] text-right border-r border-white/10">Rate</th>
              <th className="py-2.5 px-3 font-bold w-[14%] text-right border-r border-white/10">Tax/Disc</th>
              <th className="py-2.5 px-3 font-bold w-[15%] text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-slate-200/50 bg-white/60 hover:bg-white/80 transition-colors">
                <td className="py-2.5 px-3 text-[11px] text-slate-500 text-center align-top">{i + 1}</td>
                <td className="py-2.5 px-3 align-top overflow-hidden">
                  <p className="text-[12px] font-bold text-slate-900 mb-1 break-words whitespace-pre-wrap">{item.name || item.desc?.split('\n')[0]}</p>
                  <p className="text-[10px] text-slate-600 whitespace-pre-wrap break-words leading-relaxed">{item.name ? item.desc : item.desc?.substring(item.desc.indexOf('\n') + 1)}</p>
                </td>
                <td className="py-2.5 px-3 text-[11px] text-slate-800 text-center align-top font-semibold break-words">
                  {item.qty} {item.unit && <span className="text-slate-400 text-[9px] ml-1 block mt-0.5 font-normal">{item.unit}</span>}
                </td>
                <td className="py-2.5 px-3 text-[11px] text-slate-700 text-right align-top break-words">₹{Number(item.rate).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                <td className="py-2.5 px-3 text-[10px] text-slate-500 text-right align-top break-words space-y-0.5">
                  {item.tax > 0 && <div>Tax: {item.tax}%</div>}
                  {item.discount > 0 && <div>Disc: ₹{item.discount}</div>}
                  {(!item.tax && !item.discount) && '-'}
                </td>
                <td className="py-2.5 px-3 text-[12px] font-black text-slate-900 text-right align-top break-words">₹{(item.qty * item.rate).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAYMENT & SUMMARY */}
      <div className="flex justify-between items-start mb-5 gap-6">
        <div className="w-[55%] flex flex-col gap-4">
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/50 shadow-sm backdrop-blur-sm overflow-hidden">
            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Landmark size={12}/> Payment Information</h4>
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <div className="text-[10px] text-slate-700 space-y-1.5">
                <div className="grid grid-cols-[70px_1fr]"><span className="text-slate-500 font-medium">Bank:</span><span className="font-semibold text-slate-900 break-words">{payment.bankName || '-'}</span></div>
                <div className="grid grid-cols-[70px_1fr]"><span className="text-slate-500 font-medium">A/C Name:</span><span className="font-semibold text-slate-900 break-words">{payment.accountName || '-'}</span></div>
                <div className="grid grid-cols-[70px_1fr]"><span className="text-slate-500 font-medium">A/C No:</span><span className="font-semibold text-slate-900 break-all">{payment.accountNo || '-'}</span></div>
                <div className="grid grid-cols-[70px_1fr]"><span className="text-slate-500 font-medium">IFSC:</span><span className="font-semibold text-slate-900 break-words">{payment.ifsc || '-'}</span></div>
                {payment.swift && <div className="grid grid-cols-[70px_1fr]"><span className="text-slate-500 font-medium">SWIFT:</span><span className="font-semibold text-slate-900 break-words">{payment.swift}</span></div>}
                <div className="grid grid-cols-[70px_1fr] pt-2 border-t border-slate-200/60 mt-1"><span className="text-slate-500 font-medium flex items-center gap-1"><CreditCard size={10}/> UPI:</span><span className="font-bold text-slate-900 break-all">{payment.upiNumber || '-'}</span></div>
              </div>
              <div className="flex flex-col items-center justify-center p-2 bg-white/70 rounded-xl border border-slate-200/60 shadow-sm backdrop-blur-sm">
                 <QrCode size={50} className="text-slate-700 mb-1.5" />
                 <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Scan to Pay</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Amount In Words</h4>
            <div className="bg-slate-50/60 text-slate-800 px-3 py-2 rounded-xl border border-slate-200/50 text-[10px] font-semibold leading-relaxed backdrop-blur-sm break-words">
              {amountInWords}
            </div>
          </div>
        </div>

        <div className="w-[45%] flex flex-col">
          <div className="bg-white/70 rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden backdrop-blur-sm">
            <div className="p-4 space-y-2.5 text-[11px] text-slate-700">
              <div className="flex justify-between items-center"><span className="font-medium">Subtotal</span><span className="font-bold text-slate-900 break-words">₹{subtotal?.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
              {discount > 0 && <div className="flex justify-between items-center text-emerald-600"><span className="font-medium">Discount</span><span className="font-bold break-words">-₹{discount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>}
              <div className="flex justify-between items-center"><span className="font-medium">Tax (GST)</span><span className="font-bold text-slate-900 break-words">₹{taxAmount?.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
              {shipping > 0 && <div className="flex justify-between items-center"><span className="font-medium">Shipping</span><span className="font-bold text-slate-900 break-words">₹{shipping.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>}
              {roundOff !== 0 && <div className="flex justify-between items-center"><span className="font-medium">Round Off</span><span className="font-bold text-slate-900 break-words">₹{roundOff.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>}
            </div>
            <div className={`${theme?.bg || 'bg-slate-800/90'} text-white px-4 py-3 flex justify-between items-center shadow-inner`}>
              <span className="text-[12px] font-bold uppercase tracking-wider">Grand Total</span>
              <span className="text-[18px] font-black tracking-tight break-words">₹{grandTotal?.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
            </div>
            <div className="p-4 bg-slate-50/60 space-y-2.5 text-[11px]">
              <div className="flex justify-between items-center text-slate-500"><span className="font-medium">Amount Paid</span><span className="font-bold text-slate-700 break-words">-₹{amountPaid.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
              <div className="flex justify-between items-center border-t border-slate-200/60 pt-2"><span className="text-[12px] font-bold text-slate-900 uppercase tracking-wide">Balance Due</span><span className="text-[15px] font-black text-rose-600 break-words">₹{balanceDue?.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* NOTES & TERMS (mt-auto forces it to bottom) */}
      <div className="grid grid-cols-[1fr_auto] gap-8 mt-auto border-t border-slate-200/60 pt-4">
        <div className="space-y-4">
          <div className="bg-slate-50/40 p-3 rounded-xl border border-slate-200/50 backdrop-blur-sm">
            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><FileText size={12}/> Notes</h4>
            <p className="text-[10px] text-slate-600 whitespace-pre-wrap leading-relaxed break-words">{texts.notes || "Thank you for your business."}</p>
          </div>
          <div className="bg-slate-50/40 p-3 rounded-xl border border-slate-200/50 backdrop-blur-sm">
            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><ShieldCheck size={12}/> Terms & Conditions</h4>
            <div className="text-[9px] text-slate-600 space-y-1 pl-1">
              {terms ? <p className="whitespace-pre-wrap leading-relaxed break-words">{terms}</p> : <ul className="list-disc list-inside space-y-1 break-words"><li>Payment Due Within 7 Days. Late Fee 2% Per Month.</li><li>Services once delivered are non-refundable.</li><li>Support valid for 30 days. GST applicable.</li></ul>}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-end w-44 text-center pb-1">
          <div className="h-16 w-full relative flex items-end justify-center mb-2"><span className="text-slate-200 italic text-[24px] font-serif select-none absolute bottom-0 opacity-50">Authorized</span></div>
          <div className="w-full border-t border-slate-400"></div>
          <p className="text-[10px] font-bold text-slate-800 mt-2 uppercase tracking-wider">Authorized Signature</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-4 flex justify-between items-center text-[9px] text-slate-400 font-medium uppercase tracking-wider border-t border-slate-200/60 pt-3">
        <div className="flex items-center gap-1.5"><CheckCircle2 size={10} className="text-emerald-500"/> Computer Generated Invoice. No Signature Required.</div>
        <div className="flex gap-4">{from.website && <span>{from.website}</span>}{from.email && <span>{from.email}</span>}<span>Generated by {from.name || "ERP"}</span></div>
      </div>
    </>
  );
};

export default InvoiceLayout;