import React from 'react';
import { useOutletContext } from "react-router-dom";

import InvoiceLayout from '../components/InvoiceLayout';
import QuotationLayout from '../components/QuotationLayout';
import AgreementLayout from '../components/AgreementLayout';

const PdfPreviewArea = () => {
  const contextData = useOutletContext();
  if (!contextData || !contextData.appState) return null;

  const { pdfRef, appState } = contextData;
  const { docType, settings, meta } = appState;

  // ================= WATERMARK ENGINE =================
  const renderWatermark = () => {
    if (!settings.watermarkType || settings.watermarkType === 'disabled') return null;
    
    const status = meta.status?.toUpperCase() || 'DRAFT';
    let watermarkColor = 'text-slate-300';
    
    if (status === 'PAID') watermarkColor = 'text-emerald-500';
    if (status === 'UNPAID') watermarkColor = 'text-rose-500';

    const opacity = (settings.patternIntensity / 100) * 0.12; 

    return (
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span 
          className={`text-[150px] font-black uppercase tracking-widest -rotate-45 ${watermarkColor}`}
          style={{ opacity: opacity }}
        >
          {settings.watermarkText || status}
        </span>
      </div>
    );
  };

  return (
    <section className="flex-1 overflow-y-auto p-4 lg:p-10 flex justify-center  custom-scrollbar shadow-inner relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div 
        ref={pdfRef} 
        className="bg-white text-slate-800 shadow-2xl relative shrink-0 box-border flex flex-col print-exact overflow-hidden" 
        style={{ width: '794px', height: '1123px', padding: '30px 40px' }}
      >
        {renderWatermark()}

        <div className="relative z-10 flex flex-col h-full">
          {docType === 'invoice' && <InvoiceLayout contextData={contextData} />}
          {docType === 'quotation' && <QuotationLayout contextData={contextData} />}
          {docType === 'agreement' && <AgreementLayout contextData={contextData} />}
        </div>
      </div>
    </section>
  );
};

export default PdfPreviewArea;