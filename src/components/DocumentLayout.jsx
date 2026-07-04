import React from 'react';

const DocumentLayout = ({ 
  docType, company, client, docMeta, items, clauses, terms,
  wmMode, wmText, wmLogo, wmIntensity, wmSpacing, wmSpread
}) => {
  
  // Calculate Totals (For Invoice/Quotation)
  const subTotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const totalTax = items.reduce((acc, item) => acc + ((item.qty * item.price) * (item.taxRate / 100)), 0);
  const grandTotal = subTotal + totalTax;

  // Watermark Style Logic
  const getWatermarkStyle = () => ({
    opacity: wmIntensity / 100, 
    rotation: `rotate(-${wmSpread}deg)`, 
    gap: `${Math.max(20, wmSpacing / 10)}px`
  });
  const wmStyles = getWatermarkStyle();

  return (
    <div className="p-12 text-gray-800 h-full flex flex-col justify-between font-sans relative">
      
      {/* ================= WATERMARK RENDERER ================= */}
      {wmMode !== 'disabled' && (
        <div 
          className="absolute inset-0 flex overflow-hidden z-0 pointer-events-none"
          style={{ opacity: wmStyles.opacity }}
        >
          {wmMode.includes('tiling') ? (
            /* TILING (Text or Logo) */
            <div 
              className="w-full h-full flex flex-wrap justify-center items-center"
              style={{ gap: wmStyles.gap, padding: '2rem' }}
            >
               {Array(40).fill(0).map((_, i) => (
                  <div key={i} style={{ transform: wmStyles.rotation }} className="flex justify-center items-center">
                      {wmMode === 'logo_tiling' && wmLogo && <img src={wmLogo} alt="WM" className="w-24 object-contain grayscale" />}
                      {wmMode === 'text_tiling' && <span className="text-4xl font-black uppercase whitespace-nowrap text-gray-400">{wmText}</span>}
                  </div>
               ))}
            </div>
          ) : (
            /* SINGLE (Text or Logo) */
            <div className="w-full h-full flex justify-center items-center">
               <div style={{ transform: wmStyles.rotation }} className="flex justify-center items-center">
                   {wmMode === 'single_logo' && wmLogo && <img src={wmLogo} alt="WM" className="w-96 object-contain grayscale opacity-20" />}
                   {wmMode === 'single_text' && <span className="text-8xl font-black uppercase whitespace-nowrap text-gray-200">{wmText}</span>}
               </div>
            </div>
          )}
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 style={{ color: docMeta.themeColor }} className="text-4xl font-black uppercase tracking-widest">{docMeta.title}</h1>
            <p className="text-gray-600 font-semibold mt-1"># {docMeta.number}</p>
          </div>
          <div className="text-right text-sm">
            <h2 className="text-xl font-bold mb-1 text-gray-800">{company.name}</h2>
            <p className="text-gray-600 font-medium">GSTIN: {company.gst}</p>
            <p className="text-gray-500 whitespace-pre-wrap">{company.address}</p>
          </div>
        </div>
        <div className="border-t-2 border-gray-100 mb-8"></div>

        {/* ================= CLIENT INFO ================= */}
        <div className="flex justify-between mb-8 text-sm">
          <div>
            <span style={{ backgroundColor: `${docMeta.themeColor}20`, color: docMeta.themeColor }} className="font-bold px-3 py-1 rounded text-xs uppercase mb-3 inline-block">Billed To</span>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{client.name}</h3>
            <p className="text-gray-500 whitespace-pre-wrap">{client.billingAddress}</p>
          </div>
          <div className="w-64 space-y-2 text-gray-600">
             <div className="flex justify-between"><span className="font-medium">Date:</span> <span>{docMeta.date}</span></div>
             {docType !== 'agreement' && <div className="flex justify-between"><span className="font-medium">Due Date:</span> <span>{docMeta.dueDate}</span></div>}
          </div>
        </div>

        {/* ================= DYNAMIC CONTENT (Agreement vs Invoice/Quotation) ================= */}
        {docType === 'agreement' ? (
          /* AGREEMENT CLAUSES */
          <div className="mt-8 text-gray-700 text-sm leading-relaxed min-h-[300px]">
            {clauses.map((clause, idx) => (
              <p key={idx} className="mb-4 text-justify">
                <span className="font-bold text-gray-900 uppercase">{idx + 1}. {clause.title}: </span> 
                {clause.text}
              </p>
            ))}
          </div>
        ) : (
          /* INVOICE / QUOTATION TABLE */
          <div className="min-h-[300px]">
            <table className="w-full text-left border-collapse mb-8">
              <thead style={{ backgroundColor: docMeta.themeColor }} className="text-white">
                <tr>
                  <th className="py-3 px-4 font-bold text-xs uppercase rounded-tl-lg">Description</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase text-center w-20">Qty</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase text-right w-28">Price</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase text-right rounded-tr-lg">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {items.map((item, idx) => {
                  const itemTotal = (item.qty * item.price) + ((item.qty * item.price) * (item.taxRate / 100));
                  return (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-4 px-4 font-medium text-gray-800">{item.name}</td>
                      <td className="py-4 px-4 text-center">{item.qty}</td>
                      <td className="py-4 px-4 text-right">₹{item.price.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right font-bold">₹{itemTotal.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Summary */}
            <div className="flex justify-end">
              <div className="w-80 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden text-sm">
                <div className="flex justify-between p-4 border-b border-gray-200"><span>Subtotal</span> <span>₹{subTotal.toLocaleString()}</span></div>
                <div className="flex justify-between p-4 border-b border-gray-200"><span>Tax</span> <span>₹{totalTax.toLocaleString()}</span></div>
                <div style={{ backgroundColor: `${docMeta.themeColor}15`, color: docMeta.themeColor }} className="flex justify-between p-4 font-black text-lg">
                  <span>Grand Total</span> <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= FOOTER (Custom Terms & Signatures) ================= */}
      <div className="relative z-20 mt-12 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-end">
          
          <div className="text-xs text-gray-600 w-1/2 space-y-4">
             {/* Editable Notes */}
             {terms.notes && <p className="italic text-gray-500">{terms.notes}</p>}
             
             {/* Editable Terms & Conditions */}
             <div>
               <h4 className="font-bold text-gray-800 uppercase mb-1">Terms & Conditions</h4>
               <p className="whitespace-pre-wrap">{terms.conditions}</p>
             </div>

             {/* Editable Bank Details (Hide for Agreement) */}
             {docType !== 'agreement' && terms.bankDetails && (
               <div>
                 <h4 className="font-bold text-gray-800 uppercase mb-1">Payment Details</h4>
                 <p className="whitespace-pre-wrap">{terms.bankDetails}</p>
               </div>
             )}
          </div>

          {/* Signatures & Seal */}
          <div className="relative text-center w-64 pt-6">
            {company.seal && <img src={company.seal} alt="Seal" className="absolute -left-6 -top-4 w-24 h-24 object-contain opacity-70 mix-blend-multiply" />}
            <div className="relative z-10 h-16 flex items-end justify-center mb-2">
              {company.signature ? (
                <img src={company.signature} alt="Signature" className="h-full object-contain mix-blend-multiply" />
              ) : (
                <div className="w-48 border-b border-dashed border-gray-400"></div>
              )}
            </div>
            <p className="text-gray-800 font-bold border-t border-gray-400 pt-2 mx-auto w-48 text-sm">Authorized Signatory</p>
          </div>
          
        </div>
      </div>

    </div>
  );
};

export default DocumentLayout;