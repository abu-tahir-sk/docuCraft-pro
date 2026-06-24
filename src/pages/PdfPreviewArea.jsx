import React from 'react';
import { useOutletContext } from "react-router-dom";
import { Mail, Phone, MapPin, Landmark, CreditCard, FileDigit, Heart, FileText } from 'lucide-react';
import { formatDate, getStatusColor } from '../utils';

const PdfPreviewArea = () => {
  const contextData = useOutletContext();
  if (!contextData) return null;

  const { pdfRef, theme, appState, calculated } = contextData;
  const { docType, settings, labels, meta, from, to, items, financials, payment, texts, blocks } = appState;
  const { subtotal, taxAmount, total, amountInWords } = calculated;

  return (
    <section className="flex-1 overflow-y-auto p-4 lg:p-10 flex justify-center bg-[#525659] custom-scrollbar shadow-inner relative">
      <div ref={pdfRef} className="bg-white text-gray-900 shadow-2xl relative shrink-0 box-border transition-colors duration-300 my-auto" style={{ width: '794px', minHeight: '1123px', padding: '50px 60px' }}>
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              {from.logo ? <img src={from.logo} className="w-20 h-20 object-contain rounded-md" alt="Logo" /> : <div className={`w-20 h-20 ${theme.bg} rounded-2xl flex items-center justify-center text-white`}><FileText size={36}/></div>}
              <div>
                <h1 className={`text-[40px] font-extrabold ${theme.main} uppercase leading-none`}>{docType}</h1>
                <p className="text-sm font-bold text-gray-800 mt-1"># {meta.id}</p>
              </div>
            </div>
            <div className="text-right max-w-[50%]">
              <h2 className={`text-lg font-bold ${theme.main}`}>{from.name}</h2>
              <div className="text-[13px] text-gray-700">{from.email} | {from.phone}</div>
              <div className="text-[13px] text-gray-700 whitespace-pre-line">{from.address}</div>
            </div>
          </div>

          <div className="w-full border-t border-gray-300 mb-6"></div>

          {/* Details */}
          <div className="flex justify-between mb-8">
            <div>
              <span className={`text-[11px] font-bold ${theme.main} uppercase`}>{labels.billedTo}</span>
              <h3 className="text-[15px] font-bold">{to.name}</h3>
              <p className="text-[13px]">{to.address}</p>
            </div>
            <div className="text-right">
              <span className={`text-[11px] font-bold ${theme.main} uppercase`}>{labels.invoiceDetails}</span>
              <p className="text-[13px]"><b>{labels.invDate}:</b> {formatDate(meta.date)}</p>
              <p className="text-[13px]"><b>{labels.dueDate}:</b> {formatDate(meta.dueDate)}</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left border-collapse border border-gray-200 mb-8">
            <thead>
              <tr className={`${theme.bg} text-white`}>
                <th className="p-3 text-[11px] uppercase">#</th>
                <th className="p-3 text-[11px] uppercase">{labels.desc}</th>
                <th className="p-3 text-[11px] uppercase">Qty</th>
                <th className="p-3 text-[11px] uppercase">Rate</th>
                <th className="p-3 text-[11px] uppercase text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3 text-[13px]">{i + 1}</td>
                  <td className="p-3 text-[13px]">{item.desc}</td>
                  <td className="p-3 text-[13px]">{item.qty}</td>
                  <td className="p-3 text-[13px]">{item.rate}</td>
                  <td className="p-3 text-[13px] text-right font-bold">{item.qty * item.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Blocks */}
          <div className="mb-8">{blocks.map(b => <p key={b.id} className="text-[13px]">{b.content}</p>)}</div>

          {/* Totals */}
          <div className="flex justify-end mb-10">
            <div className="w-64 space-y-2">
              <div className="flex justify-between"><span className="text-sm font-bold">{labels.subtotal}</span><span className="text-sm font-bold">{subtotal}</span></div>
              <div className="flex justify-between"><span className="text-sm font-bold">{labels.tax}</span><span className="text-sm font-bold">{taxAmount}</span></div>
              <div className={`flex justify-between text-lg font-black ${theme.main}`}><span>{labels.total}</span><span>{meta.currency} {total}</span></div>
            </div>
          </div>

          {/* Footer & Signature */}
          <div className="mt-auto flex justify-between items-end border-t pt-6">
            <div className="text-[10px] text-gray-500">{texts.notes}</div>
            <div className="text-center">
               <div className="w-32 border-t border-black mb-2"></div>
               <p className="text-[11px] font-bold">{labels.signTitle}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PdfPreviewArea;