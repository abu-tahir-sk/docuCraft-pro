import React from 'react';
import { Mail, Phone, MapPin, Building2, Calendar, FileText, CheckCircle2, ShieldCheck, Landmark, CreditCard, QrCode } from 'lucide-react';
import { formatDate } from '../utils';

const QuotationLayout = ({ contextData }) => {
  const { theme, appState, calculated } = contextData;
  const { labels, meta, from, to, items, financials, payment, texts, terms } = appState;
  const { subtotal, taxAmount, total, amountInWords } = calculated;

  const discount = financials?.discount || 0;
  const grandTotal = total;

  return (
    <div className=" bg-white text-slate-800 shadow-2xl mx-auto p-10 font-sans print:shadow-none print:m-0">
      
      {/* SECTION 1: MAIN BODY (Watermark confined here) */}
      <div className="relative">
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
          <span className="text-[100px] font-black uppercase tracking-widest -rotate-45">Quotation</span>
        </div>

        <div className="relative z-10">
            {/* Header */}
            <header className="flex justify-between items-start mb-8">
                <div className="flex gap-4">
                    {from.logo ? <img src={from.logo} className="w-16 h-16 object-contain rounded-xl border border-slate-100" alt="Logo" /> : <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Building2 size={24}/></div>}
                    <div>
                        <h2 className="text-[20px] font-black text-slate-900 uppercase">{from.name}</h2>
                        <div className="text-[10px] text-slate-500 mt-1">
                            <p>{from.address}</p>
                            <p>{from.email} • {from.phone}</p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <h1 className="text-[32px] font-black text-slate-900 uppercase leading-none">Quotation</h1>
                    <p className="text-[12px] font-bold text-slate-500"># {meta.id}</p>
                </div>
            </header>

            {/* Client Info Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-[9px] font-bold text-slate-400 uppercase mb-2">Prepared For</h4>
                    <p className="text-[14px] font-black text-slate-900">{to.name}</p>
                    <p className="text-[11px] font-bold text-slate-700 mb-1">{to.companyName}</p>
                    <p className="text-[10px] text-slate-600 leading-snug">{to.address}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-[9px] font-bold text-slate-400 uppercase mb-2">Quotation Details</h4>
                    <div className="text-[11px] space-y-1">
                        <p className="flex justify-between"><span>Date:</span> <b>{formatDate(meta.date)}</b></p>
                        <p className="flex justify-between"><span>Valid Until:</span> <b>{formatDate(meta.dueDate)}</b></p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="mb-6 rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className={`${theme?.bg || 'bg-slate-800'} text-white text-[10px] uppercase`}>
                        <tr>
                            <th className="py-3 px-4 w-[8%] text-center">#</th>
                            <th className="py-3 px-4 w-[45%]">Description</th>
                            <th className="py-3 px-4 w-[12%] text-center">Qty</th>
                            <th className="py-3 px-4 w-[15%] text-right">Rate</th>
                            <th className="py-3 px-4 w-[20%] text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map((item, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                                <td className="py-4 px-4 text-[12px] text-center align-top">{i + 1}</td>
                                <td className="py-4 px-4 align-top">
                                    <p className="text-[13px] font-bold text-slate-900">{item.name || item.desc?.split('\n')[0]}</p>
                                    <p className="text-[11px] text-slate-500 whitespace-pre-wrap">{item.desc?.substring(item.desc.indexOf('\n') + 1)}</p>
                                </td>
                                <td className="py-4 px-4 text-[12px] text-center font-semibold">{item.qty}</td>
                                <td className="py-4 px-4 text-[12px] text-right">₹{Number(item.rate).toLocaleString()}</td>
                                <td className="py-4 px-4 text-[13px] font-black text-right">₹{(item.qty * item.rate).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[10px]">
                    <h4 className="font-bold uppercase text-slate-400 mb-2">Amount in Words</h4>
                    <p className="italic text-slate-700">{amountInWords}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-4 text-[12px] space-y-1">
                        <div className="flex justify-between"><span>Subtotal</span><b>₹{subtotal.toLocaleString()}</b></div>
                        <div className="flex justify-between"><span>Tax</span><b>₹{taxAmount.toLocaleString()}</b></div>
                    </div>
                    <div className={`${theme?.bg || 'bg-slate-800'} text-white p-4 flex justify-between items-center`}>
                        <span className="text-[14px] font-bold uppercase">Grand Total</span>
                        <span className="text-[18px] font-black">₹{grandTotal.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* SECTION 2: FOOTER (No Watermark, No Flex-grow, Natural flow) */}
      <div className="space-y-6">
        {/* Payment Info */}
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[9px]">
                <p className="font-bold mb-1">Bank Transfer</p>
                <p>Name: {payment.bankName}<br/>A/C: {payment.accountNo}<br/>IFSC: {payment.ifsc}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[9px] flex items-center justify-between">
                <p className="font-bold">UPI: {payment.upiNumber}</p>
                <QrCode size={30} className="text-slate-400"/>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[9px]">
                <p className="font-bold">Other</p>
                <p>PAN: {payment.pan || 'N/A'}<br/>GSTIN: {payment.gstin || 'N/A'}</p>
            </div>
        </div>

        {/* Notes & Terms */}
        <div className="grid grid-cols-2 gap-6 text-[10px]">
            <div><h4 className="font-bold mb-1 uppercase text-slate-400">Notes</h4><p className="text-slate-600">{texts.notes || "Thank you for considering our quotation."}</p></div>
            <div><h4 className="font-bold mb-1 uppercase text-slate-400">Terms</h4><p className="text-slate-600">{terms || "Valid for 15 days."}</p></div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end border-t pt-4">
            <div className="text-center w-40"><div className="h-8 border-b border-slate-300 mx-2 mb-1"></div><p className="text-[10px] font-bold">Client Signature</p></div>
            <div className="text-center w-40"><div className="h-8 border-b border-slate-300 mx-2 mb-1"></div><p className="text-[10px] font-bold">Company Signature</p></div>
        </div>

        {/* Footer */}
        <div className="text-center text-[9px] text-slate-400 border-t pt-2 uppercase">
            Computer Generated Quotation • {from.website} • {from.email}
        </div>
      </div>

    </div>
  );
};

export default QuotationLayout;