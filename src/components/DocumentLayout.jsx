import React from 'react';

const DocumentLayout = ({ 
  docType, company = {}, client = {}, docMeta = {}, items = [], clauses = [], terms = {}, financials = {},
  wmMode = 'disabled', wmText = '', wmLogo = null, wmIntensity = 9, wmSpacing = 810, wmSpread = 20, themeColor = '#10B981' 
}) => {
  
  const currency = docMeta.currency || '₹';

  // ================= SMART CALCULATIONS =================
  const subTotal = (items || []).reduce((acc, item) => {
    const qty = Number(item.qty || 1);
    const price = Number(item.price || item.rate || item.amount || 0);
    return acc + (qty * price);
  }, 0);

  const itemTax = (items || []).reduce((acc, item) => {
    const qty = Number(item.qty || 1);
    const price = Number(item.price || item.rate || item.amount || 0);
    const taxRate = Number(item.taxRate || item.taxPercent || item.tax || 0);
    return acc + ((qty * price) * (taxRate / 100));
  }, 0);

  const discount = Number(financials.discount || 0);
  const shipping = Number(financials.shipping || 0);
  const globalTaxRate = Number(financials.taxRate || 0);
  
  const subTotalAfterDiscount = subTotal - discount;
  const globalTaxAmount = subTotalAfterDiscount * (globalTaxRate / 100);
  const totalTax = itemTax + globalTaxAmount;

  const grandTotal = subTotalAfterDiscount + totalTax + shipping;

  // ================= NUMBER TO WORDS CONVERTER =================
  const numberToWords = (num) => {
    if (num === 0) return 'Zero';
    const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
    const n = ('000000000' + Math.floor(num)).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str.trim() + ' Only';
  };

  // Watermark Style Logic
  const getWatermarkStyle = () => ({
    opacity: wmIntensity / 100, 
    rotation: `rotate(-${wmSpread}deg)`, 
    gap: `${Math.max(20, wmSpacing / 10)}px`
  });
  const wmStyles = getWatermarkStyle();

  return (
    <div className="p-12 text-gray-800 h-full flex flex-col justify-between font-sans relative">
      
      {/* ================= WATERMARK ================= */}
      {wmMode !== 'disabled' && (
        <div 
          className="absolute inset-0 flex overflow-hidden z-0 pointer-events-none"
          style={{ opacity: wmStyles.opacity }}
        >
          {wmMode.includes('tiling') ? (
            <div className="w-full h-full flex flex-wrap justify-center items-center" style={{ gap: wmStyles.gap, padding: '2rem' }}>
               {Array(40).fill(0).map((_, i) => (
                  <div key={i} style={{ transform: wmStyles.rotation }} className="flex justify-center items-center">
                      {wmMode === 'logo_tiling' && wmLogo && <img src={wmLogo} alt="WM" className="w-24 object-contain grayscale" />}
                      {wmMode === 'text_tiling' && <span className="text-4xl font-black uppercase whitespace-nowrap text-gray-400">{wmText}</span>}
                  </div>
               ))}
            </div>
          ) : (
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
          
          <div className="flex items-center gap-4">
            {/* Company Logo in PDF */}
            {company.logo && (
              <img src={company.logo} alt="Logo" className="w-20 h-20 object-contain rounded-md border border-gray-100 p-1" />
            )}
            <div>
              <h1 style={{ color: docMeta.themeColor || themeColor }} className="text-4xl font-black uppercase tracking-widest">{docMeta.title}</h1>
              <p className="text-gray-600 font-semibold mt-1"># {docMeta.number}</p>
            </div>
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
            <span style={{ backgroundColor: `${docMeta.themeColor || themeColor}20`, color: docMeta.themeColor || themeColor }} className="font-bold px-3 py-1 rounded text-xs uppercase mb-3 inline-block">Billed To</span>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{client.name}</h3>
            <p className="text-gray-500 whitespace-pre-wrap">{client.billingAddress}</p>
          </div>
          <div className="w-64 space-y-2 text-gray-600">
             <div className="flex justify-between"><span className="font-medium">Date:</span> <span>{docMeta.date}</span></div>
             {docType !== 'agreement' && <div className="flex justify-between"><span className="font-medium">Due Date:</span> <span>{docMeta.dueDate}</span></div>}
          </div>
        </div>

        {/* ================= DYNAMIC CONTENT ================= */}
        {docType === 'agreement' ? (
          <div className="mt-8 text-gray-700 text-sm leading-relaxed min-h-[300px]">
            {clauses.map((clause, idx) => (
              <p key={idx} className="mb-4 text-justify">
                <span className="font-bold text-gray-900 uppercase">{idx + 1}. {clause.title}: </span> 
                {clause.text}
              </p>
            ))}
          </div>
        ) : (
          <div className="min-h-[300px]">
            <table className="w-full text-left border-collapse mb-8">
              <thead style={{ backgroundColor: docMeta.themeColor || themeColor }} className="text-white">
                <tr>
                  <th className="py-3 px-4 font-bold text-xs uppercase rounded-tl-lg">Description</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase text-center w-20">Qty</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase text-right w-28">Price</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase text-right rounded-tr-lg">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {items.map((item, idx) => {
                  const qty = Number(item.qty || 1);
                  const price = Number(item.price || item.rate || item.amount || 0);
                  const taxRate = Number(item.taxRate || item.taxPercent || item.tax || 0);
                  const itemName = item.name || item.desc || item.description || "Item Description";
                  const itemTotal = (qty * price) + ((qty * price) * (taxRate / 100));
                  
                  return (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-4 px-4 font-medium text-gray-800">{itemName}</td>
                      <td className="py-4 px-4 text-center">{qty}</td>
                      <td className="py-4 px-4 text-right">{currency}{price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td className="py-4 px-4 text-right font-bold">{currency}{itemTotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* ================= SUMMARY SECTION WITH AMOUNT IN WORDS ================= */}
            <div className="flex justify-between items-start mt-6 border-t border-gray-200 pt-6">
              
              <div className="w-[50%] pr-4">
                <h4 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: docMeta.themeColor || themeColor }}>
                  Amount in Words
                </h4>
                <div className="bg-[#f0f4fa] text-gray-700 px-4 py-3 rounded-lg text-[13px] font-medium leading-relaxed mb-5 border border-blue-50 break-words">
                  {currency} {numberToWords(grandTotal)}
                </div>
              </div>

              <div className="w-[45%] bg-gray-50 rounded-xl border border-gray-200 overflow-hidden text-sm">
                <div className="flex justify-between p-4 border-b border-gray-200">
                  <span>Subtotal</span> <span>{currency}{Number(subTotal || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between p-4 border-b border-gray-200 text-red-500">
                    <span>Discount</span> <span>-{currency}{Number(discount).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                )}

                {totalTax > 0 && (
                  <div className="flex justify-between p-4 border-b border-gray-200">
                    <span>Tax {globalTaxRate > 0 ? `(${globalTaxRate}%)` : ''}</span> <span>{currency}{Number(totalTax).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                )}

                {shipping > 0 && (
                  <div className="flex justify-between p-4 border-b border-gray-200">
                    <span>Shipping</span> <span>{currency}{Number(shipping).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                )}

                <div style={{ backgroundColor: `${docMeta.themeColor || themeColor}15`, color: docMeta.themeColor || themeColor }} className="flex justify-between p-4 font-black text-lg">
                  <span>Grand Total</span> <span>{currency}{Number(grandTotal || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="relative z-20 mt-12 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-end">
          <div className="text-xs text-gray-600 w-1/2 space-y-4">
             {terms.notes && <p className="italic text-gray-500">{terms.notes}</p>}
             <div>
               <h4 className="font-bold text-gray-800 uppercase mb-1">Terms & Conditions</h4>
               <p className="whitespace-pre-wrap">{terms.conditions}</p>
             </div>
             {docType !== 'agreement' && terms.bankDetails && (
               <div>
                 <h4 className="font-bold text-gray-800 uppercase mb-1">Payment Details</h4>
                 <p className="whitespace-pre-wrap">{terms.bankDetails}</p>
               </div>
             )}
          </div>
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

// import React from 'react';

// const DocumentLayout = ({ 
//   docType, company = {}, client = {}, docMeta = {}, items = [], clauses = [], terms = {}, financials = {},
//   wmType = 'none', wmText = '', wmFont = 'Arial', wmColor = '#D1D5DB', wmOpacity = 20, wmRotation = -45, wmSize = 48, wmLogo = null
// }) => {
  
//   const currency = docMeta.currency || '₹';

//   // ================= SMART CALCULATIONS =================
//   const subTotal = (items || []).reduce((acc, item) => {
//     const qty = Number(item.qty || 1);
//     const price = Number(item.price || item.rate || item.amount || 0);
//     return acc + (qty * price);
//   }, 0);

//   const itemTax = (items || []).reduce((acc, item) => {
//     const qty = Number(item.qty || 1);
//     const price = Number(item.price || item.rate || item.amount || 0);
//     const taxRate = Number(item.taxRate || item.taxPercent || item.tax || 0);
//     return acc + ((qty * price) * (taxRate / 100));
//   }, 0);

//   const discount = Number(financials.discount || 0);
//   const shipping = Number(financials.shipping || 0);
//   const globalTaxRate = Number(financials.taxRate || 0);
  
//   const subTotalAfterDiscount = subTotal - discount;
//   const globalTaxAmount = subTotalAfterDiscount * (globalTaxRate / 100);
//   const totalTax = itemTax + globalTaxAmount;

//   const grandTotal = subTotalAfterDiscount + totalTax + shipping;

//   // ================= NUMBER TO WORDS CONVERTER =================
//   const numberToWords = (num) => {
//     if (num === 0) return 'Zero';
//     const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
//     const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
//     const n = ('000000000' + Math.floor(num)).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
//     if (!n) return '';
//     let str = '';
//     str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
//     str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
//     str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
//     str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
//     str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
//     return str.trim() + ' Only';
//   };

//   return (
//     <div className="p-12 text-gray-800 h-full flex flex-col justify-between font-sans relative">
      
//       {/* ================= WATERMARK ================= */}
//       {wmType !== 'none' && (
//         <div className="absolute inset-0 flex justify-center items-center z-0 pointer-events-none overflow-hidden">
//           <div style={{
//               opacity: wmOpacity / 100,
//               transform: `rotate(${wmRotation}deg)`,
//               userSelect: 'none'
//           }}>
//             {wmType === 'text' && wmText && (
//               <span style={{ 
//                 color: wmColor, 
//                 fontFamily: wmFont, 
//                 fontSize: `${wmSize}px`,
//                 fontWeight: 'bold',
//                 whiteSpace: 'nowrap',
//                 textTransform: 'uppercase' 
//               }}>
//                 {wmText}
//               </span>
//             )}
            
//             {wmType === 'image' && wmLogo && (
//               <img 
//                 src={wmLogo} 
//                 alt="Watermark" 
//                 style={{ width: `${wmSize * 5}px`, maxWidth: '800px', objectFit: 'contain' }} 
//               />
//             )}
//           </div>
//         </div>
//       )}

//       {/* ================= HEADER ================= */}
//       <div className="relative z-10">
//         <div className="flex justify-between items-start mb-8">
          
//           <div className="flex items-center gap-4">
//             {company.logo && (
//               <img src={company.logo} alt="Logo" className="w-20 h-20 object-contain rounded-md border border-gray-100 p-1 bg-white" />
//             )}
//             <div>
//               <h1 style={{ color: docMeta.themeColor || themeColor }} className="text-4xl font-black uppercase tracking-widest">{docMeta.title}</h1>
//               <p className="text-gray-600 font-semibold mt-1"># {docMeta.number}</p>
//             </div>
//           </div>

//           <div className="text-right text-sm">
//             <h2 className="text-xl font-bold mb-1 text-gray-800">{company.name}</h2>
//             <p className="text-gray-600 font-medium">GSTIN: {company.gst}</p>
//             <p className="text-gray-500 whitespace-pre-wrap">{company.address}</p>
//           </div>
//         </div>
//         <div className="border-t-2 border-gray-100 mb-8"></div>

//         {/* ================= CLIENT INFO ================= */}
//         <div className="flex justify-between mb-8 text-sm">
//           <div>
//             <span style={{ backgroundColor: `${docMeta.themeColor || themeColor}20`, color: docMeta.themeColor || themeColor }} className="font-bold px-3 py-1 rounded text-xs uppercase mb-3 inline-block">Billed To</span>
//             <h3 className="text-lg font-bold text-gray-800 mb-1">{client.name}</h3>
//             <p className="text-gray-500 whitespace-pre-wrap">{client.billingAddress}</p>
//           </div>
//           <div className="w-64 space-y-2 text-gray-600">
//              <div className="flex justify-between"><span className="font-medium">Date:</span> <span>{docMeta.date}</span></div>
//              {docType !== 'agreement' && <div className="flex justify-between"><span className="font-medium">Due Date:</span> <span>{docMeta.dueDate}</span></div>}
//           </div>
//         </div>

//         {/* ================= DYNAMIC CONTENT ================= */}
//         {docType === 'agreement' ? (
//           <div className="mt-8 text-gray-700 text-sm leading-relaxed min-h-[300px]">
//             {clauses.map((clause, idx) => (
//               <p key={idx} className="mb-4 text-justify">
//                 <span className="font-bold text-gray-900 uppercase">{idx + 1}. {clause.title}: </span> 
//                 {clause.text}
//               </p>
//             ))}
//           </div>
//         ) : (
//           <div className="min-h-[300px]">
//             <table className="w-full text-left border-collapse mb-8">
//               <thead style={{ backgroundColor: docMeta.themeColor || themeColor }} className="text-white">
//                 <tr>
//                   <th className="py-3 px-4 font-bold text-xs uppercase rounded-tl-lg">Description</th>
//                   <th className="py-3 px-4 font-bold text-xs uppercase text-center w-20">Qty</th>
//                   <th className="py-3 px-4 font-bold text-xs uppercase text-right w-28">Price</th>
//                   <th className="py-3 px-4 font-bold text-xs uppercase text-right rounded-tr-lg">Total</th>
//                 </tr>
//               </thead>
//               <tbody className="text-sm">
//                 {items.map((item, idx) => {
//                   const qty = Number(item.qty || 1);
//                   const price = Number(item.price || item.rate || item.amount || 0);
//                   const taxRate = Number(item.taxRate || item.taxPercent || item.tax || 0);
//                   const itemName = item.name || item.desc || item.description || "Item Description";
//                   const itemTotal = (qty * price) + ((qty * price) * (taxRate / 100));
                  
//                   return (
//                     <tr key={idx} className="border-b border-gray-100">
//                       <td className="py-4 px-4 font-medium text-gray-800">{itemName}</td>
//                       <td className="py-4 px-4 text-center">{qty}</td>
//                       <td className="py-4 px-4 text-right">{currency}{price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
//                       <td className="py-4 px-4 text-right font-bold">{currency}{itemTotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>

//             {/* ================= SUMMARY SECTION WITH AMOUNT IN WORDS ================= */}
//             <div className="flex justify-between items-start mt-6 border-t border-gray-200 pt-6">
              
//               <div className="w-[50%] pr-4">
//                 <h4 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: docMeta.themeColor || themeColor }}>
//                   Amount in Words
//                 </h4>
//                 <div className="bg-[#f0f4fa] text-gray-700 px-4 py-3 rounded-lg text-[13px] font-medium leading-relaxed mb-5 border border-blue-50 break-words">
//                   {currency} {numberToWords(grandTotal)}
//                 </div>
//               </div>

//               <div className="w-[45%] bg-gray-50 rounded-xl border border-gray-200 overflow-hidden text-sm">
//                 <div className="flex justify-between p-4 border-b border-gray-200">
//                   <span>Subtotal</span> <span>{currency}{Number(subTotal || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
//                 </div>
                
//                 {discount > 0 && (
//                   <div className="flex justify-between p-4 border-b border-gray-200 text-red-500">
//                     <span>Discount</span> <span>-{currency}{Number(discount).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
//                   </div>
//                 )}

//                 {totalTax > 0 && (
//                   <div className="flex justify-between p-4 border-b border-gray-200">
//                     <span>Tax {globalTaxRate > 0 ? `(${globalTaxRate}%)` : ''}</span> <span>{currency}{Number(totalTax).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
//                   </div>
//                 )}

//                 {shipping > 0 && (
//                   <div className="flex justify-between p-4 border-b border-gray-200">
//                     <span>Shipping</span> <span>{currency}{Number(shipping).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
//                   </div>
//                 )}

//                 <div style={{ backgroundColor: `${docMeta.themeColor || themeColor}15`, color: docMeta.themeColor || themeColor }} className="flex justify-between p-4 font-black text-lg">
//                   <span>Grand Total</span> <span>{currency}{Number(grandTotal || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
//                 </div>
//               </div>

//             </div>
//           </div>
//         )}
//       </div>

//       {/* ================= FOOTER ================= */}
//       <div className="relative z-20 mt-12 pt-6 border-t border-gray-200">
//         <div className="flex justify-between items-end">
//           <div className="text-xs text-gray-600 w-1/2 space-y-4">
//              {terms.notes && <p className="italic text-gray-500">{terms.notes}</p>}
//              <div>
//                <h4 className="font-bold text-gray-800 uppercase mb-1">Terms & Conditions</h4>
//                <p className="whitespace-pre-wrap">{terms.conditions}</p>
//              </div>
//              {docType !== 'agreement' && terms.bankDetails && (
//                <div>
//                  <h4 className="font-bold text-gray-800 uppercase mb-1">Payment Details</h4>
//                  <p className="whitespace-pre-wrap">{terms.bankDetails}</p>
//                </div>
//              )}
//           </div>
//           <div className="relative text-center w-64 pt-6">
//             {company.seal && <img src={company.seal} alt="Seal" className="absolute -left-6 -top-4 w-24 h-24 object-contain opacity-70 mix-blend-multiply" />}
//             <div className="relative z-10 h-16 flex items-end justify-center mb-2">
//               {company.signature ? (
//                 <img src={company.signature} alt="Signature" className="h-full object-contain mix-blend-multiply" />
//               ) : (
//                 <div className="w-48 border-b border-dashed border-gray-400"></div>
//               )}
//             </div>
//             <p className="text-gray-800 font-bold border-t border-gray-400 pt-2 mx-auto w-48 text-sm">Authorized Signatory</p>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default DocumentLayout;