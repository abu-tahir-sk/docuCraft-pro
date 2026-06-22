import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Download, Plus, Trash2, Info, 
  ListOrdered, FileSignature, Building2, User, ImagePlus 
} from 'lucide-react';

export default function App() {
  // --- Local Storage থেকে আগের ডাটা লোড করার ফাংশন ---
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem('docucraft_pro_data');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  };
  
  const savedData = loadSavedData();

  const [docType, setDocType] = useState(savedData?.docType || 'invoice'); // invoice, quotation, agreement
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef();

  // Document Metadata
  const [meta, setMeta] = useState(savedData?.meta || {
    id: 'INV-2026-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: '₹'
  });

  // From (Company) Details with Logo support
  const [from, setFrom] = useState(savedData?.from || {
    name: 'TechFlow Solutions Pvt. Ltd.',
    email: 'billing@techflow.in',
    phone: '+91 98765 43210',
    address: 'Sector V, Salt Lake\nKolkata, WB 700091\nIndia',
    logo: null
  });

  // To (Client) Details
  const [to, setTo] = useState(savedData?.to || {
    name: 'Acme Digital Corp.',
    email: 'finance@acmedigital.com',
    phone: '+91 91234 56789',
    address: '123 Business Avenue\nAndheri East, Mumbai\nMaharashtra 400069'
  });

  // Invoice Items
  const [items, setItems] = useState(savedData?.items || [
    { id: 1, desc: 'Full-Stack Web Development (MERN)', qty: 120, rate: 1500 },
    { id: 2, desc: 'UI/UX Design Strategy & Prototyping', qty: 40, rate: 1200 },
    { id: 3, desc: 'Cloud Server Setup (AWS) & Deployment', qty: 1, rate: 15000 }
  ]);

  // Financials
  const [financials, setFinancials] = useState(savedData?.financials || {
    taxRate: 18,
    discount: 0
  });

  // Texts
  const [texts, setTexts] = useState(savedData?.texts || {
    notes: 'Thank you for choosing TechFlow Solutions.\nPayment is due within 15 days via NEFT/RTGS to HDFC Bank (A/C: XXXXXXXXX).',
    agreementText: 'This Software Development Agreement ("Agreement") is made effective as of the date written above, between the Provider and the Client.\n\n1. SERVICES PROVIDED: The Provider agrees to provide custom software development services as discussed.\n\n2. PAYMENT TERMS: The Client agrees to pay the Provider the total amount specified. 50% upfront, 50% upon completion.\n\n3. INTELLECTUAL PROPERTY: Upon final payment, all source code and intellectual property rights will transfer to the Client.\n\n4. CONFIDENTIALITY: Both parties agree to keep all proprietary information confidential.'
  });

  // --- ডাটা আপডেট হলেই তা Local Storage-এ সেভ করার অটোমেটিক সিস্টেম ---
  useEffect(() => {
    const dataToSave = { docType, meta, from, to, items, financials, texts };
    localStorage.setItem('docucraft_pro_data', JSON.stringify(dataToSave));
  }, [docType, meta, from, to, items, financials, texts]);

  // Auto calculations
  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  const taxAmount = (subtotal - financials.discount) * (financials.taxRate / 100);
  const total = subtotal - financials.discount + taxAmount;

  // Dynamically load html2pdf.js so we don't need npm install for it
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleDocTypeChange = (type) => {
    setDocType(type);
    let newId = meta.id;
    if(type === 'invoice') newId = newId.replace('QT-', 'INV-').replace('AGR-', 'INV-');
    if(type === 'quotation') newId = newId.replace('INV-', 'QT-').replace('AGR-', 'QT-');
    if(type === 'agreement') newId = newId.replace('INV-', 'AGR-').replace('QT-', 'AGR-');
    setMeta({ ...meta, id: newId });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = (field === 'qty' || field === 'rate') ? (parseFloat(value) || 0) : value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), desc: 'New Service Item', qty: 1, rate: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Logo Upload Handler
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrom({ ...from, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // PDF Generation Logic
  const downloadPDF = () => {
    if (!window.html2pdf) {
      console.error("PDF Library not loaded yet.");
      return;
    }
    
    setIsGenerating(true);
    const element = pdfRef.current;
    const filename = `${docType.toUpperCase()}_${meta.id}_${to.name.replace(/\s+/g, '_')}.pdf`;
    
    const opt = {
        margin:       [0, 0, 0, 0],
        filename:     filename,
        image:        { type: 'jpeg', quality: 1.0 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    window.html2pdf().set(opt).from(element).save().then(() => {
        setIsGenerating(false);
    });
  };

  const formatDate = (dateString) => {
    if(!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="h-screen w-screen flex flex-col font-sans bg-gray-100 text-gray-800 antialiased overflow-hidden">
      
      {/* HEADER / NAVBAR */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
            <FileText size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">DocuCraft <span className="font-light">Pro</span></h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">React Edition</p>
          </div>
        </div>

        <div className="hidden md:flex bg-gray-100 p-1 rounded-lg">
          {['invoice', 'quotation', 'agreement'].map(type => (
            <button key={type} onClick={() => handleDocTypeChange(type)} className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${docType === type ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
              {type}
            </button>
          ))}
        </div>

        <button onClick={downloadPDF} disabled={isGenerating} className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed">
          {isGenerating ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Download size={16} />}
          {isGenerating ? 'Generating...' : 'Download PDF'}
        </button>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 flex overflow-hidden">
        
        { }
        {/* SIDEBAR / FORM EDITOR */}
        <aside className="w-full lg:w-[450px] xl:w-[500px] bg-white border-r border-gray-200 overflow-y-auto p-6 space-y-8 flex-shrink-0 custom-scrollbar">
          
          {/* Document Meta */}
          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Info size={14}/> Document Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Doc Number</label>
                <input type="text" value={meta.id} onChange={(e) => setMeta({...meta, id: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Currency</label>
                <select value={meta.currency} onChange={(e) => setMeta({...meta, currency: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none">
                  <option value="₹">₹ (INR)</option>
                  <option value="$">$ (USD)</option>
                  <option value="৳">৳ (BDT)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Issue Date</label>
                <input type="date" value={meta.date} onChange={(e) => setMeta({...meta, date: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none" />
              </div>
              {docType !== 'agreement' && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{docType === 'invoice' ? 'Due Date' : 'Valid Till'}</label>
                  <input type="date" value={meta.dueDate} onChange={(e) => setMeta({...meta, dueDate: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none" />
                </div>
              )}
            </div>
          </section>

          <hr className="border-gray-100" />

          {}
          {/* Entities */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1"><Building2 size={12}/> From (Your Company)</h2>
              <div className="space-y-3">
                <input type="text" placeholder="Company Name" value={from.name} onChange={(e) => setFrom({...from, name: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:border-blue-500 outline-none" />
                
                {/* LOGO UPLOAD INPUT */}
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer w-full text-sm text-gray-600 hover:text-blue-600 transition">
                    <ImagePlus size={16} />
                    <span className="truncate">{from.logo ? 'Logo Uploaded - Change' : 'Upload Logo'}</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  {from.logo && (
                    <button onClick={() => setFrom({...from, logo: null})} className="text-red-500 hover:text-red-700 text-xs font-bold px-2">Clear</button>
                  )}
                </div>

                <input type="text" placeholder="Email" value={from.email} onChange={(e) => setFrom({...from, email: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none" />
                <input type="text" placeholder="Phone" value={from.phone} onChange={(e) => setFrom({...from, phone: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none" />
                <textarea rows="3" placeholder="Address" value={from.address} onChange={(e) => setFrom({...from, address: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:border-blue-500 outline-none" />
              </div>
            </div>
            
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1"><User size={12}/> To (Client)</h2>
              <div className="space-y-3">
                <input type="text" placeholder="Client Name" value={to.name} onChange={(e) => setTo({...to, name: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:border-blue-500 outline-none" />
                <input type="text" placeholder="Email" value={to.email} onChange={(e) => setTo({...to, email: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none" />
                <input type="text" placeholder="Phone" value={to.phone} onChange={(e) => setTo({...to, phone: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none" />
                <textarea rows="3" placeholder="Client Address" value={to.address} onChange={(e) => setTo({...to, address: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:border-blue-500 outline-none" />
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {}
          {/* Dynamic Content (Items or Agreement) */}
          {docType !== 'agreement' ? (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2"><ListOrdered size={14}/> Services & Items</h2>
                <button onClick={addItem} className="text-xs text-blue-600 font-bold hover:text-blue-800 transition flex items-center gap-1">
                  <Plus size={14} /> Add Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                    <div className="flex justify-between items-center mb-1">
                      <input type="text" placeholder="Item Description" value={item.desc} onChange={(e) => handleItemChange(index, 'desc', e.target.value)} className="w-full text-sm font-bold border-none outline-none bg-transparent placeholder-gray-400" />
                      <button onClick={() => removeItem(index)} className="text-gray-300 hover:text-red-500 transition"><Trash2 size={16} /></button>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1/3">
                        <label className="text-[10px] text-gray-400 uppercase tracking-wider">Qty/Hrs</label>
                        <input type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} className="w-full px-2 py-1 mt-1 bg-gray-50 border border-gray-200 rounded text-sm focus:border-blue-500 outline-none" />
                      </div>
                      <div className="w-2/3">
                        <label className="text-[10px] text-gray-400 uppercase tracking-wider">Rate</label>
                        <input type="number" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', e.target.value)} className="w-full px-2 py-1 mt-1 bg-gray-50 border border-gray-200 rounded text-sm focus:border-blue-500 outline-none" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Tax / GST (%)</span>
                  <input type="number" value={financials.taxRate} onChange={(e) => setFinancials({...financials, taxRate: parseFloat(e.target.value) || 0})} className="w-20 px-2 py-1 bg-white border border-gray-200 rounded text-sm text-right focus:border-blue-500 outline-none" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Discount Amount</span>
                  <input type="number" value={financials.discount} onChange={(e) => setFinancials({...financials, discount: parseFloat(e.target.value) || 0})} className="w-24 px-2 py-1 bg-white border border-gray-200 rounded text-sm text-right focus:border-blue-500 outline-none" />
                </div>
              </div>
            </section>
          ) : (
            <section>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><FileSignature size={14}/> Agreement Terms</h2>
              <textarea rows="15" value={texts.agreementText} onChange={(e) => setTexts({...texts, agreementText: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-serif leading-relaxed resize-none focus:border-blue-500 outline-none" />
            </section>
          )}

          <hr className="border-gray-100" />

          {/* Footer Notes */}
          <section className="pb-8">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Notes & Terms</h2>
            <textarea rows="3" value={texts.notes} onChange={(e) => setTexts({...texts, notes: e.target.value})} placeholder="Thank you for your business..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:border-blue-500 outline-none" />
          </section>

        </aside>

        {}
        {/* RIGHT WORKSPACE: PDF PREVIEW */}
        <section className="flex-1 overflow-y-auto p-4 lg:p-8 flex justify-center bg-[#f5f5f7] custom-scrollbar">
          
          {/* A4 Paper Wrapper */}
          <div ref={pdfRef} className="bg-white text-gray-900 shadow-xl" style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}>
            <div className="flex flex-col h-full justify-between">
              
              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-12 border-b-2 border-gray-900 pb-6">
                  <div>
                    <h1 className="text-4xl font-extrabold uppercase tracking-tight mb-2">{docType}</h1>
                    <p className="text-sm font-bold text-gray-500"># <span className="text-gray-900 font-mono">{meta.id}</span></p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    {/* LOGO DISPLAY LOGIC */}
                    {from.logo ? (
                      <img src={from.logo} alt="Company Logo" className="max-h-16 object-contain mb-2" />
                    ) : (
                      <h2 className="text-xl font-bold text-gray-900">{from.name || 'Company Name'}</h2>
                    )}
                    <p className="text-sm text-gray-600 mt-1">{from.email}</p>
                    <p className="text-sm text-gray-600">{from.phone}</p>
                    <p className="text-sm text-gray-600 whitespace-pre-line mt-1 text-right">{from.address}</p>
                  </div>
                </div>

                {}
                {/* Meta & Client Info */}
                <div className="flex justify-between items-start mb-10">
                  <div className="w-1/2 pr-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Billed To / Client</p>
                    <h3 className="text-lg font-bold text-gray-900">{to.name || 'Client Name'}</h3>
                    <p className="text-sm text-gray-600 mt-1">{to.email}</p>
                    <p className="text-sm text-gray-600">{to.phone}</p>
                    <p className="text-sm text-gray-600 whitespace-pre-line mt-1">{to.address}</p>
                  </div>
                  <div className="w-1/2 text-right flex justify-end">
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-right">
                      <span className="font-bold text-gray-500">Date:</span>
                      <span className="font-medium">{formatDate(meta.date)}</span>
                      
                      {docType !== 'agreement' && (
                        <>
                          <span className="font-bold text-gray-500">{docType === 'invoice' ? 'Due Date:' : 'Valid Till:'}</span>
                          <span className="font-medium">{formatDate(meta.dueDate)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {}
                {/* Items Table */}
                {docType !== 'agreement' ? (
                  <div className="mb-8">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="py-3 text-sm font-bold w-3/5">Description of Service</th>
                          <th className="py-3 text-sm font-bold text-center w-1/5">Qty / Hrs</th>
                          <th className="py-3 text-sm font-bold text-right w-1/5">Rate</th>
                          <th className="py-3 text-sm font-bold text-right w-1/5">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="py-3 text-sm pr-4">{item.desc}</td>
                            <td className="py-3 text-sm text-gray-600 text-center">{item.qty}</td>
                            <td className="py-3 text-sm text-gray-600 text-right font-mono">{item.rate.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                            <td className="py-3 text-sm font-medium text-right font-mono">{(item.qty * item.rate).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="flex justify-end mt-4">
                      <div className="w-1/2 md:w-2/5">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Subtotal</span>
                          <span className="text-sm font-bold font-mono">{meta.currency} {subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                        </div>
                        {financials.discount > 0 && (
                          <div className="flex justify-between py-2 border-b border-gray-100 text-red-500">
                            <span className="text-sm">Discount</span>
                            <span className="text-sm font-bold font-mono">- {meta.currency} {financials.discount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Tax ({financials.taxRate}%)</span>
                          <span className="text-sm font-bold font-mono">{meta.currency} {taxAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                        </div>
                        <div className="flex justify-between py-4 mt-2">
                          <span className="text-base font-bold">Total</span>
                          <span className="text-lg font-extrabold text-blue-600 font-mono">{meta.currency} {total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-8 flex-grow">
                    <div className="prose max-w-none text-sm font-serif leading-loose whitespace-pre-line text-justify">
                      {texts.agreementText}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-16 mt-20">
                      <div>
                        <div className="border-b border-gray-400 h-10 mb-2"></div>
                        <p className="text-sm font-bold">Signature (Provider)</p>
                        <p className="text-xs text-gray-500 mt-1">{from.name}</p>
                      </div>
                      <div>
                        <div className="border-b border-gray-400 h-10 mb-2"></div>
                        <p className="text-sm font-bold">Signature (Client)</p>
                        <p className="text-xs text-gray-500 mt-1">{to.name}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Note */}
              <div className="mt-12 pt-6 border-t border-gray-200">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2">Notes & Terms</h4>
                <p className="text-xs text-gray-500 whitespace-pre-line leading-relaxed">{texts.notes}</p>
              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}