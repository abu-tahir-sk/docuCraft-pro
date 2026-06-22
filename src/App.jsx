import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Download, Plus, Trash2, Info, 
  ListOrdered, FileSignature, Receipt, Building2, User 
} from 'lucide-react';

export default function App() {
  // References
  const printRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- States ---
  const [docType, setDocType] = useState('invoice'); // invoice, quotation, agreement
  
  const [meta, setMeta] = useState({
    id: 'INV-2026-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: '₹'
  });

  const [from, setFrom] = useState({
    name: 'TechFlow Solutions Pvt. Ltd.',
    email: 'billing@techflow.in',
    phone: '+91 98765 43210',
    address: 'Sector V, Salt Lake\nKolkata, WB 700091\nIndia'
  });

  const [to, setTo] = useState({
    name: 'Acme Digital Corp.',
    email: 'finance@acmedigital.com',
    phone: '+91 91234 56789',
    address: '123 Business Avenue\nAndheri East, Mumbai\nMaharashtra 400069'
  });

  const [items, setItems] = useState([
    { id: 1, desc: 'Full-Stack Web Development (MERN)', qty: 120, rate: 1500 },
    { id: 2, desc: 'UI/UX Design Strategy & Prototyping', qty: 40, rate: 1200 },
    { id: 3, desc: 'Cloud Server Setup (AWS) & Deployment', qty: 1, rate: 15000 }
  ]);

  const [financials, setFinancials] = useState({
    taxRate: 18,
    discountAmount: 0
  });

  const [texts, setTexts] = useState({
    notes: 'Thank you for choosing TechFlow Solutions.\nPayment is due within 15 days via NEFT/RTGS to HDFC Bank (A/C: XXXXXXXXX).',
    agreementText: 'This Software Development Agreement ("Agreement") is made effective as of the date written above, between the Provider and the Client.\n\n1. SERVICES PROVIDED: The Provider agrees to provide custom software development services as discussed.\n\n2. PAYMENT TERMS: The Client agrees to pay the Provider the total amount specified. 50% upfront, 50% upon completion.\n\n3. INTELLECTUAL PROPERTY: Upon final payment, all source code and intellectual property rights will transfer to the Client.\n\n4. CONFIDENTIALITY: Both parties agree to keep all proprietary information confidential.'
  });

  useEffect(() => {
    // Inject html2pdf.js dynamically since we are in a React environment
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Calculate Totals on the fly
  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  const taxAmount = (subtotal - financials.discountAmount) * (financials.taxRate / 100);
  const total = subtotal - financials.discountAmount + taxAmount;

  // Format Date Helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const handleDocTypeChange = (type) => {
    setDocType(type);
    let newId = meta.id;
    if (type === 'invoice') newId = newId.replace('QT-', 'INV-').replace('AGR-', 'INV-');
    if (type === 'quotation') newId = newId.replace('INV-', 'QT-').replace('AGR-', 'QT-');
    if (type === 'agreement') newId = newId.replace('INV-', 'AGR-').replace('QT-', 'AGR-');
    setMeta({ ...meta, id: newId });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'qty' || field === 'rate' ? parseFloat(value) || 0 : value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), desc: 'New Service Item', qty: 1, rate: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const downloadPDF = () => {
    if (!window.html2pdf) {
      alert("PDF library is still loading, please wait a second.");
      return;
    }
    
    setIsGenerating(true);
    const element = printRef.current;
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

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 text-gray-800 font-sans overflow-hidden">
      {/* Inject custom CSS for custom scrollbar and A4 sizing */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        .a4-paper {
          width: 100%;
          max-width: 210mm;
          min-height: 297mm;
          background: white;
          margin: 0 auto;
          padding: 20mm;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        @media print {
          .a4-paper { box-shadow: none; padding: 0; }
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Receipt size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">DocuCraft <span className="font-light">Pro</span></h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">React Edition</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="hidden md:flex bg-gray-100 p-1 rounded-lg">
          {['invoice', 'quotation', 'agreement'].map((type) => (
            <button
              key={type}
              onClick={() => handleDocTypeChange(type)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${
                docType === type ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <button 
          onClick={downloadPDF} 
          disabled={isGenerating}
          className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md transition-all transform active:scale-95 disabled:opacity-70"
        >
          {isGenerating ? <span className="animate-spin text-xl">⟳</span> : <Download size={16} />}
          {isGenerating ? 'Generating...' : 'Download PDF'}
        </button>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Form */}
        <aside className="w-full lg:w-[450px] xl:w-[500px] bg-white border-r border-gray-200 overflow-y-auto custom-scrollbar flex flex-col shrink-0 relative z-10">
          <div className="p-6 space-y-8">
            
            {/* Document Info */}
            <section>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Info size={14} /> Document Info
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Doc Number</label>
                  <input type="text" value={meta.id} onChange={(e) => setMeta({...meta, id: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Currency</label>
                  <select value={meta.currency} onChange={(e) => setMeta({...meta, currency: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition">
                    <option value="₹">₹ (INR)</option>
                    <option value="$">$ (USD)</option>
                    <option value="৳">৳ (BDT)</option>
                    <option value="€">€ (EUR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Issue Date</label>
                  <input type="date" value={meta.date} onChange={(e) => setMeta({...meta, date: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none transition" />
                </div>
                {docType !== 'agreement' && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">{docType === 'invoice' ? 'Due Date' : 'Valid Till'}</label>
                    <input type="date" value={meta.dueDate} onChange={(e) => setMeta({...meta, dueDate: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none transition" />
                  </div>
                )}
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Entities */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* From */}
              <div>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1"><Building2 size={12}/> From (Your Company)</h2>
                <div className="space-y-3">
                  <input type="text" placeholder="Company Name" value={from.name} onChange={(e) => setFrom({...from, name: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:border-blue-500 outline-none" />
                  <input type="text" placeholder="Email" value={from.email} onChange={(e) => setFrom({...from, email: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none" />
                  <input type="text" placeholder="Phone" value={from.phone} onChange={(e) => setFrom({...from, phone: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none" />
                  <textarea rows="2" placeholder="Address" value={from.address} onChange={(e) => setFrom({...from, address: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:border-blue-500 outline-none"></textarea>
                </div>
              </div>
              
              {/* To */}
              <div>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1"><User size={12}/> To (Client Details)</h2>
                <div className="space-y-3">
                  <input type="text" placeholder="Client Name" value={to.name} onChange={(e) => setTo({...to, name: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:border-blue-500 outline-none" />
                  <input type="text" placeholder="Email" value={to.email} onChange={(e) => setTo({...to, email: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none" />
                  <input type="text" placeholder="Phone" value={to.phone} onChange={(e) => setTo({...to, phone: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none" />
                  <textarea rows="2" placeholder="Address" value={to.address} onChange={(e) => setTo({...to, address: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:border-blue-500 outline-none"></textarea>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {}
            {docType !== 'agreement' ? (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <ListOrdered size={14} /> Services & Items
                  </h2>
                  <button onClick={addItem} className="text-xs text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1">
                    <Plus size={14} /> Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={item.id} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-gray-200 shadow-sm relative group">
                      <div className="flex-grow space-y-2">
                        <input type="text" placeholder="Description" value={item.desc} onChange={(e) => handleItemChange(index, 'desc', e.target.value)} className="w-full bg-transparent hover:bg-gray-50 text-sm font-medium outline-none p-1 rounded" />
                        <div className="flex gap-2">
                          <div className="w-1/3">
                            <label className="text-[10px] text-gray-500 uppercase px-1">Qty/Hrs</label>
                            <input type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:border-blue-500" />
                          </div>
                          <div className="w-2/3">
                            <label className="text-[10px] text-gray-500 uppercase px-1">Rate</label>
                            <input type="number" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', e.target.value)} className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:border-blue-500" />
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeItem(index)} className="text-gray-300 hover:text-red-500 pt-2 px-1"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Tax / GST (%)</span>
                    <input type="number" value={financials.taxRate} onChange={(e) => setFinancials({...financials, taxRate: parseFloat(e.target.value) || 0})} className="w-20 px-2 py-1 text-right bg-white border border-gray-200 rounded text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Discount Amount</span>
                    <input type="number" value={financials.discountAmount} onChange={(e) => setFinancials({...financials, discountAmount: parseFloat(e.target.value) || 0})} className="w-24 px-2 py-1 text-right bg-white border border-gray-200 rounded text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
              </section>
            ) : (
              <section>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FileSignature size={14} /> Agreement Terms
                </h2>
                <textarea 
                  rows="15" 
                  value={texts.agreementText} 
                  onChange={(e) => setTexts({...texts, agreementText: e.target.value})} 
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-serif leading-relaxed resize-none focus:border-blue-500 outline-none"
                ></textarea>
              </section>
            )}

            <hr className="border-gray-100" />

            {/* Footer Notes */}
            <section className="pb-8">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Notes & Terms</h2>
              <textarea 
                rows="3" 
                value={texts.notes} 
                onChange={(e) => setTexts({...texts, notes: e.target.value})} 
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:border-blue-500 outline-none"
              ></textarea>
            </section>

          </div>
        </aside>

        {}
        <section className="flex-1 bg-gray-200 overflow-y-auto p-4 lg:p-8 flex justify-center custom-scrollbar relative">
          
          {/* Printable A4 Container */}
          <div ref={printRef} className="a4-paper flex flex-col justify-between text-gray-800">
            <div className="flex flex-col h-full">
              
              {/* Preview Header */}
              <div className="flex justify-between items-start mb-12 border-b-2 border-gray-900 pb-6">
                <div>
                  <h1 className="text-4xl font-extrabold uppercase tracking-tight text-gray-900 mb-2">{docType}</h1>
                  <p className="text-sm font-bold text-gray-500"># <span className="text-gray-900 font-mono">{meta.id}</span></p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-gray-900">{from.name || 'Company Name'}</h2>
                  <p className="text-sm text-gray-600 mt-1">{from.email}</p>
                  <p className="text-sm text-gray-600">{from.phone}</p>
                  <p className="text-sm text-gray-600 whitespace-pre-line mt-1">{from.address}</p>
                </div>
              </div>

              {/* Preview Meta */}
              <div className="flex justify-between items-start mb-10">
                <div className="w-1/2 pr-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Billed To / Client</p>
                  <h3 className="text-lg font-bold text-gray-900">{to.name || 'Client Name'}</h3>
                  <p className="text-sm text-gray-600 mt-1">{to.email}</p>
                  <p className="text-sm text-gray-600">{to.phone}</p>
                  <p className="text-sm text-gray-600 whitespace-pre-line mt-1">{to.address}</p>
                </div>
                <div className="w-1/2 text-right">
                  <div className="grid grid-cols-2 gap-y-2 text-sm justify-end float-right">
                    <span className="font-bold text-gray-500">Date:</span>
                    <span className="font-medium text-gray-900 text-right">{formatDate(meta.date)}</span>
                    
                    {docType !== 'agreement' && (
                      <>
                        <span className="font-bold text-gray-500">{docType === 'invoice' ? 'Due Date:' : 'Valid Till:'}</span>
                        <span className="font-medium text-gray-900 text-right">{formatDate(meta.dueDate)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {}
              {docType !== 'agreement' ? (
                <div className="flex-grow">
                  <table className="w-full text-left border-collapse mb-8">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="py-3 text-sm font-bold text-gray-900 w-3/5">Description of Service</th>
                        <th className="py-3 text-sm font-bold text-gray-900 text-center w-1/5">Qty / Hrs</th>
                        <th className="py-3 text-sm font-bold text-gray-900 text-right w-1/5">Rate</th>
                        <th className="py-3 text-sm font-bold text-gray-900 text-right w-1/5">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="py-3 text-sm text-gray-800 pr-4">{item.desc}</td>
                          <td className="py-3 text-sm text-gray-600 text-center">{item.qty}</td>
                          <td className="py-3 text-sm text-gray-600 text-right font-mono">
                            {item.rate.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                          </td>
                          <td className="py-3 text-sm font-medium text-gray-900 text-right font-mono">
                            {(item.qty * item.rate).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="flex justify-end">
                    <div className="w-1/2 md:w-2/5">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Subtotal</span>
                        <span className="text-sm font-bold text-gray-900 font-mono">
                          {meta.currency} {subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                        </span>
                      </div>
                      
                      {financials.discountAmount > 0 && (
                        <div className="flex justify-between py-2 border-b border-gray-100 text-red-500">
                          <span className="text-sm">Discount</span>
                          <span className="text-sm font-bold font-mono">
                            - {meta.currency} {financials.discountAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Tax ({financials.taxRate}%)</span>
                        <span className="text-sm font-bold text-gray-900 font-mono">
                          {meta.currency} {taxAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                        </span>
                      </div>
                      <div className="flex justify-between py-4 mt-2 bg-gray-50 px-4 rounded-lg">
                        <span className="text-base font-bold text-gray-900">Total</span>
                        <span className="text-lg font-extrabold text-blue-600 font-mono">
                          {meta.currency} {total.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col">
                  <div className="prose max-w-none text-sm text-gray-800 font-serif leading-loose whitespace-pre-line text-justify flex-grow">
                    {texts.agreementText}
                  </div>
                  
                  {/* Signature Block */}
                  <div className="grid grid-cols-2 gap-16 mt-20">
                    <div>
                      <div className="border-b border-gray-400 h-10 mb-2"></div>
                      <p className="text-sm font-bold text-gray-900">Signature (Provider)</p>
                      <p className="text-xs text-gray-500 mt-1">{from.name || 'Company'}</p>
                    </div>
                    <div>
                      <div className="border-b border-gray-400 h-10 mb-2"></div>
                      <p className="text-sm font-bold text-gray-900">Signature (Client)</p>
                      <p className="text-xs text-gray-500 mt-1">{to.name || 'Client'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Notes */}
              <div className="mt-12 pt-6 border-t border-gray-200 shrink-0">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Notes & Terms</h4>
                <p className="text-xs text-gray-500 whitespace-pre-line leading-relaxed">{texts.notes}</p>
              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}