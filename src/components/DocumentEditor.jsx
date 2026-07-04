import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import DocumentLayout from './DocumentLayout';

const DocumentEditor = ({ docType = 'invoice' }) => {
  const pdfRef = useRef();

  // ================= TABS =================
  const tabs = ['Company', 'Client', 'Details', docType === 'agreement' ? 'Clauses' : 'Items', 'Terms', 'Watermark'];
  const [activeTab, setActiveTab] = useState('details');

  // ================= STATE MANAGEMENT =================
  
  // 1. Company
  const [company, setCompany] = useState({
    name: 'TechFlow Solutions Pvt. Ltd.', gst: '22AAAAA0000A1Z5', 
    address: 'Sector V, Salt Lake, Kolkata', email: 'billing@techflow.in', phone: '+91 98765 43210',
    signature: null, seal: null
  });

  // 2. Client
  const [client, setClient] = useState({
    name: 'Acme Digital Corp.', companyName: 'Acme Corp', gst: '27BBBBB0000B1Z5',
    billingAddress: '123 Business Ave, Mumbai, Maharashtra 400069'
  });

  // 3. Document Details (Dynamic Default based on docType)
  const [docMeta, setDocMeta] = useState({
    title: docType === 'invoice' ? 'TAX INVOICE' : docType === 'quotation' ? 'PRICE QUOTATION' : 'SERVICE AGREEMENT',
    number: `${docType === 'quotation' ? 'QT' : docType === 'agreement' ? 'AGR' : 'INV'}-2026-001`, 
    date: new Date().toISOString().substring(0, 10), 
    dueDate: '2026-08-06',
    themeColor: docType === 'invoice' ? '#3B82F6' : docType === 'quotation' ? '#10B981' : '#8B5CF6' // আলাদা ডকুমেন্টে আলাদা ডিফল্ট কালার
  });

  // 4A. Items (For Invoice & Quotation)
  const [items, setItems] = useState([
    { id: 1, name: 'Web Development', description: 'MERN Stack', qty: 1, price: 150000, taxRate: 18 },
    { id: 2, name: 'UI/UX Design', description: 'Figma Prototype', qty: 1, price: 50000, taxRate: 18 }
  ]);

  // 4B. Clauses (For Agreement)
  const [clauses, setClauses] = useState([
    { id: 1, title: 'SERVICES PROVIDED', text: 'The Provider agrees to provide custom software development services as discussed in the initial project scope.' },
    { id: 2, title: 'PAYMENT TERMS', text: 'The Client agrees to pay the total amount specified. 50% upfront, 50% upon completion.' },
    { id: 3, title: 'CONFIDENTIALITY', text: 'Both parties agree to keep all proprietary information confidential.' }
  ]);

  // 5. Terms, Notes & Payment Info (Dynamic Default based on docType)
  const [terms, setTerms] = useState({
    notes: docType === 'quotation' ? 'Looking forward to working with you!' : 'Thank you for choosing TechFlow Solutions.',
    conditions: docType === 'agreement' ? 'This agreement is legally binding once signed by both parties.' : 'Payment is due within 15 days. This is a computer-generated document.',
    bankDetails: 'Bank: HDFC Bank\nA/C No: 12345678901234\nIFSC: HDFC0001234'
  });

  // 6. Watermark
  const [wmMode, setWmMode] = useState('disabled');
  const [wmText, setWmText] = useState('CONFIDENTIAL');
  const [wmLogo, setWmLogo] = useState(null);
  const [wmIntensity, setWmIntensity] = useState(9); 
  const [wmSpacing, setWmSpacing] = useState(810); 
  const [wmSpread, setWmSpread] = useState(20); 

  // ================= STATE MANAGEMENT (আগের কোড) =================
  // ... আপনার আগের সব useState গুলো এখানে আছে ...

  // 👇 এই নতুন useEffect কোডটুকু যোগ করুন 👇
  useEffect(() => {
    // docType চেঞ্জ হলে ট্যাব রিসেট করে details এ নিয়ে যাবে
    setActiveTab('details');

    // Title, Color, Number আপডেট করা
    setDocMeta({
      title: docType === 'invoice' ? 'TAX INVOICE' : docType === 'quotation' ? 'PRICE QUOTATION' : 'SERVICE AGREEMENT',
      number: `${docType === 'quotation' ? 'QT' : docType === 'agreement' ? 'AGR' : 'INV'}-2026-001`, 
      date: new Date().toISOString().substring(0, 10), 
      dueDate: '2026-08-06',
      themeColor: docType === 'invoice' ? '#3B82F6' : docType === 'quotation' ? '#10B981' : '#8B5CF6'
    });

    // Terms & Conditions আপডেট করা
    setTerms({
      notes: docType === 'quotation' ? 'Looking forward to working with you!' : 'Thank you for choosing TechFlow Solutions.',
      conditions: docType === 'agreement' ? 'This agreement is legally binding once signed by both parties.' : 'Payment is due within 15 days. This is a computer-generated document.',
      bankDetails: 'Bank: HDFC Bank\nA/C No: 12345678901234\nIFSC: HDFC0001234'
    });

  }, [docType]); // যখনই docType পরিবর্তন হবে, এই কোডটি রান করবে
  // 👆 নতুন কোড শেষ 👆



  // ================= HANDLERS =================
  const handleImageUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) setter(URL.createObjectURL(file));
  };

  // ১. শুধুমাত্র সেভ করার ফাংশন
  const handleSave = () => {
    const newSavedDoc = {
      id: Date.now(),
      docNumber: docMeta.number,
      clientName: client.name,
      docType: docType,
      date: docMeta.date,
    };

    const existingDocs = JSON.parse(localStorage.getItem('savedDocuments')) || [];
    localStorage.setItem('savedDocuments', JSON.stringify([newSavedDoc, ...existingDocs]));
    
    alert(`${docMeta.title} Saved Successfully!`);
  };

  // ২. শুধুমাত্র পিডিএফ ডাউনলোড করার ফাংশন
  const handleDownloadPdf = () => {
    const element = pdfRef.current;
    const opt = {
      margin: 10, 
      filename: `${docMeta.number}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };
  // Row Management Functions (Add & Delete)
  const handleAddItem = () => setItems([...items, { id: Date.now(), name: '', description: '', qty: 1, price: 0, taxRate: 0 }]);
  const handleDeleteItem = (id) => setItems(items.filter(item => item.id !== id));

  const handleAddClause = () => setClauses([...clauses, { id: Date.now(), title: '', text: '' }]);
  const handleDeleteClause = (id) => setClauses(clauses.filter(clause => clause.id !== id));


  // ================= WATERMARK UI COMPONENT =================
  const WatermarkOption = ({ id, label, icon }) => {
    const isActive = wmMode === id;
    return (
      <div 
        onClick={() => setWmMode(id)}
        className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
          isActive ? 'border-[#8C4A28] bg-[#F8EFEA]' : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-700">{icon}</div>
          <span className="font-bold text-sm text-gray-900 tracking-wide">{label}</span>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-[#8C4A28]' : 'border-gray-300'}`}>
          {isActive && <div className="w-2.5 h-2.5 rounded-full bg-[#8C4A28]" />}
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-4 h-screen bg-gray-100 p-4 font-sans">
      
      {/* ================= LEFT: CONTROL PANEL ================= */}
      <div className="w-[450px] bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
        
        {/* Tabs Header */}
        <div className="flex overflow-x-auto bg-gray-50 border-b border-gray-200 p-2 gap-2 hide-scrollbar shrink-0">
          {tabs.map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.toLowerCase() ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FDFBF7]">
          
          {/* ... Company, Client, Details Tabs (আগের মতই) ... */}
          {activeTab === 'company' && (
            <div className="space-y-4">
               <div><label className="text-xs text-gray-500 font-bold">Company Name</label><input type="text" value={company.name} onChange={(e) => setCompany({...company, name: e.target.value})} className="w-full p-2 border rounded text-sm" /></div>
               <div><label className="text-xs text-gray-500 font-bold">GST/VAT Number</label><input type="text" value={company.gst} onChange={(e) => setCompany({...company, gst: e.target.value})} className="w-full p-2 border rounded text-sm" /></div>
               <div><label className="text-xs text-gray-500 font-bold">Address</label><textarea value={company.address} onChange={(e) => setCompany({...company, address: e.target.value})} className="w-full p-2 border rounded text-sm h-20" /></div>
               <div className="flex gap-2">
                 <div className="w-1/2"><label className="text-xs text-gray-500 font-bold">Signature</label><input type="file" onChange={(e) => handleImageUpload(e, (url) => setCompany({...company, signature: url}))} className="text-xs w-full" /></div>
                 <div className="w-1/2"><label className="text-xs text-gray-500 font-bold">Seal/Stamp</label><input type="file" onChange={(e) => handleImageUpload(e, (url) => setCompany({...company, seal: url}))} className="text-xs w-full" /></div>
               </div>
            </div>
          )}

          {activeTab === 'client' && (
            <div className="space-y-4">
               <div><label className="text-xs text-gray-500 font-bold">Client Name</label><input type="text" value={client.name} onChange={(e) => setClient({...client, name: e.target.value})} className="w-full p-2 border rounded text-sm" /></div>
               <div><label className="text-xs text-gray-500 font-bold">Billing Address</label><textarea value={client.billingAddress} onChange={(e) => setClient({...client, billingAddress: e.target.value})} className="w-full p-2 border rounded text-sm h-20" /></div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4">
               <div><label className="text-xs text-gray-500 font-bold">Document Title</label><input type="text" value={docMeta.title} onChange={(e) => setDocMeta({...docMeta, title: e.target.value})} className="w-full p-2 border rounded text-sm font-bold" /></div>
               <div><label className="text-xs text-gray-500 font-bold">Document Number</label><input type="text" value={docMeta.number} onChange={(e) => setDocMeta({...docMeta, number: e.target.value})} className="w-full p-2 border rounded text-sm" /></div>
               <div className="flex gap-2">
                 <div className="w-1/2"><label className="text-xs text-gray-500 font-bold">Date</label><input type="date" value={docMeta.date} onChange={(e) => setDocMeta({...docMeta, date: e.target.value})} className="w-full p-2 border rounded text-sm" /></div>
                 {docType !== 'agreement' && <div className="w-1/2"><label className="text-xs text-gray-500 font-bold">Due Date</label><input type="date" value={docMeta.dueDate} onChange={(e) => setDocMeta({...docMeta, dueDate: e.target.value})} className="w-full p-2 border rounded text-sm" /></div>}
               </div>
               <div><label className="text-xs text-gray-500 font-bold">Theme Color</label><input type="color" value={docMeta.themeColor} onChange={(e) => setDocMeta({...docMeta, themeColor: e.target.value})} className="w-full h-10 border rounded cursor-pointer" /></div>
            </div>
          )}

          {/* ================= ITEMS ROW ADD & DELETE ================= */}
          {activeTab === 'items' && docType !== 'agreement' && (
            <div className="space-y-4">
               {items.map((item, idx) => (
                 <div key={item.id} className="p-3 border rounded-lg bg-white space-y-2 shadow-sm relative">
                    {/* Delete Row Button */}
                    <button onClick={() => handleDeleteItem(item.id)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold hover:bg-red-600 shadow-md">✕</button>
                    
                    <input type="text" placeholder="Item Name" value={item.name} onChange={(e) => { const n = [...items]; n[idx].name = e.target.value; setItems(n); }} className="w-full p-2 border rounded text-sm font-bold" />
                    <input type="text" placeholder="Description" value={item.description} onChange={(e) => { const n = [...items]; n[idx].description = e.target.value; setItems(n); }} className="w-full p-2 border rounded text-sm" />
                    <div className="flex gap-2">
                      <div className="w-1/3"><label className="text-[10px] text-gray-400 uppercase font-bold">Qty</label><input type="number" value={item.qty} onChange={(e) => { const n = [...items]; n[idx].qty = Number(e.target.value); setItems(n); }} className="w-full p-2 border rounded text-sm" /></div>
                      <div className="w-1/3"><label className="text-[10px] text-gray-400 uppercase font-bold">Price</label><input type="number" value={item.price} onChange={(e) => { const n = [...items]; n[idx].price = Number(e.target.value); setItems(n); }} className="w-full p-2 border rounded text-sm" /></div>
                      <div className="w-1/3"><label className="text-[10px] text-gray-400 uppercase font-bold">Tax %</label><input type="number" value={item.taxRate} onChange={(e) => { const n = [...items]; n[idx].taxRate = Number(e.target.value); setItems(n); }} className="w-full p-2 border rounded text-sm" /></div>
                    </div>
                 </div>
               ))}
               
               {/* Add Row Button */}
               <button onClick={handleAddItem} className="w-full py-3 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-600 font-bold rounded-lg text-sm transition-colors border-dashed">
                 + Add New Item
               </button>
            </div>
          )}

          {/* ================= CLAUSES ROW ADD & DELETE ================= */}
          {activeTab === 'clauses' && docType === 'agreement' && (
            <div className="space-y-4">
               {clauses.map((clause, idx) => (
                 <div key={clause.id} className="p-3 border rounded-lg bg-white space-y-2 shadow-sm relative">
                    {/* Delete Clause Button */}
                    <button onClick={() => handleDeleteClause(clause.id)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold hover:bg-red-600 shadow-md">✕</button>
                    
                    <input type="text" placeholder="Title" value={clause.title} onChange={(e) => { const n = [...clauses]; n[idx].title = e.target.value; setClauses(n); }} className="w-full p-2 border rounded text-sm font-bold" />
                    <textarea placeholder="Clause text..." value={clause.text} onChange={(e) => { const n = [...clauses]; n[idx].text = e.target.value; setClauses(n); }} className="w-full p-2 border rounded text-sm h-20" />
                 </div>
               ))}
               
               {/* Add Clause Button */}
               <button onClick={handleAddClause} className="w-full py-3 bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-600 font-bold rounded-lg text-sm transition-colors border-dashed">
                 + Add New Clause
               </button>
            </div>
          )}

          {/* TERMS TAB */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
               <div><label className="text-xs text-gray-500 font-bold">Notes / Messages</label><textarea value={terms.notes} onChange={(e) => setTerms({...terms, notes: e.target.value})} className="w-full p-2 border rounded text-sm h-16" /></div>
               <div><label className="text-xs text-gray-500 font-bold">Terms & Conditions</label><textarea value={terms.conditions} onChange={(e) => setTerms({...terms, conditions: e.target.value})} className="w-full p-2 border rounded text-sm h-20" /></div>
               {docType !== 'agreement' && <div><label className="text-xs text-gray-500 font-bold">Bank / Payment Details</label><textarea value={terms.bankDetails} onChange={(e) => setTerms({...terms, bankDetails: e.target.value})} className="w-full p-2 border rounded text-sm h-24" /></div>}
            </div>
          )}

          {/* WATERMARK TAB */}
          {activeTab === 'watermark' && (
            <div className="space-y-6">
              <h3 className="text-xs font-black text-gray-500 tracking-widest uppercase">Watermark Synthesis</h3>
              
              <div className="space-y-3">
                <WatermarkOption id="disabled" label="DISABLED" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>} />
                <WatermarkOption id="single_text" label="SINGLE TEXT" icon={<span className="font-serif font-bold">T</span>} />
                <WatermarkOption id="single_logo" label="SINGLE LOGO" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                <WatermarkOption id="text_tiling" label="TEXT TILING" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>} />
                <WatermarkOption id="logo_tiling" label="LOGO TILING" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" /></svg>} />
              </div>

              {wmMode !== 'disabled' && (
                <div className="border border-gray-200 bg-[#FCFAF8] p-5 rounded-xl space-y-6 mt-6 shadow-sm">
                  
                  {wmMode.includes('text') && (
                    <div>
                      <label className="block text-[11px] font-black text-gray-500 tracking-wider mb-2 uppercase">Watermark Text</label>
                      <input type="text" value={wmText} onChange={(e) => setWmText(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm font-black tracking-widest text-gray-900 bg-white shadow-inner focus:outline-none focus:border-[#8C4A28]" />
                    </div>
                  )}

                  {wmMode.includes('logo') && (
                    <div>
                      <label className="block text-[11px] font-black text-gray-500 tracking-wider mb-2 uppercase">Upload Logo</label>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setWmLogo)} className="w-full text-xs" />
                    </div>
                  )}

                  <hr className="border-gray-200" />

                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[11px] font-black text-gray-500 tracking-wider uppercase">Pattern Intensity</label>
                        <span className="text-[11px] font-black text-[#8C4A28]">{wmIntensity}%</span>
                      </div>
                      <input type="range" min="1" max="100" value={wmIntensity} onChange={(e) => setWmIntensity(e.target.value)} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8C4A28]" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[11px] font-black text-gray-500 tracking-wider uppercase">Grain & Spacing</label>
                        <span className="text-[11px] font-black text-[#8C4A28]">{wmSpacing}</span>
                      </div>
                      <input type="range" min="100" max="1500" value={wmSpacing} onChange={(e) => setWmSpacing(e.target.value)} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8C4A28]" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[11px] font-black text-gray-500 tracking-wider uppercase">Font/Icon Spread</label>
                        <span className="text-[11px] font-black text-[#8C4A28]">{wmSpread}</span>
                      </div>
                      <input type="range" min="0" max="90" value={wmSpread} onChange={(e) => setWmSpread(e.target.value)} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8C4A28]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Generate Button */}
       {/* ================= ACTION BUTTONS (Save & Download) ================= */}
        <div className="p-4 bg-white border-t border-gray-200 shrink-0 flex gap-3">
          <button 
            onClick={handleSave} 
            className="w-1/2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md transition-colors flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
            Save 
          </button>
          
          <button 
            onClick={handleDownloadPdf} 
            className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md transition-colors flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Download
          </button>
        </div>

      </div>

      {/* ================= RIGHT: LIVE PDF PREVIEW ================= */}
      <div className="flex-1 bg-gray-300 flex justify-center items-start rounded-xl overflow-y-auto p-8 shadow-inner">
        <div ref={pdfRef} className="bg-white w-[210mm] min-h-[297mm] text-black shadow-2xl relative overflow-hidden">
          <DocumentLayout 
            docType={docType} company={company} client={client} docMeta={docMeta} 
            items={items} clauses={clauses} terms={terms}
            wmMode={wmMode} wmText={wmText} wmLogo={wmLogo} wmIntensity={wmIntensity} wmSpacing={wmSpacing} wmSpread={wmSpread}
          />
        </div>
      </div>

    </div>
  );
};

export default DocumentEditor;