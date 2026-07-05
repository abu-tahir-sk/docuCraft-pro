import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import axios from 'axios';
import toast from 'react-hot-toast';
import DocumentLayout from './DocumentLayout';

const DocumentEditor = ({ docType = 'invoice' }) => {
  const pdfRef = useRef();

  // ================= TABS =================
  const tabs = ['Company', 'Client', 'Details', docType === 'agreement' ? 'Clauses' : 'Items', 'Terms', 'Watermark'];

  const loadSavedData = (key, defaultData) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultData;
    } catch (e) {
      return defaultData;
    }
  };

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('docucraft_active_tab') || 'company';
  });

  // ================= 1. STATE MANAGEMENT (with Local Storage) =================
  const [company, setCompany] = useState(() => loadSavedData('docucraft_company', {
    name: 'TechFlow Solutions Pvt. Ltd.', gst: '22AAAAA0000A1Z5',
    address: 'Sector V, Salt Lake, Kolkata', email: 'billing@techflow.in', phone: '+91 98765 43210',
    logo: null, signature: null, seal: null
  }));

  const [client, setClient] = useState(() => loadSavedData('docucraft_client', {
    name: 'Acme Digital Corp.', companyName: 'Acme Corp', gst: '27BBBBB0000B1Z5',
    billingAddress: '123 Business Ave, Mumbai, Maharashtra 400069'
  }));

  const [docMeta, setDocMeta] = useState(() => loadSavedData('docucraft_docMeta', {
    title: docType === 'invoice' ? 'TAX INVOICE' : docType === 'quotation' ? 'PRICE QUOTATION' : 'SERVICE AGREEMENT',
    number: `${docType === 'quotation' ? 'QT' : docType === 'agreement' ? 'AGR' : 'INV'}-2026-001`,
    date: new Date().toISOString().substring(0, 10),
    dueDate: '2026-08-06',
    themeColor: docType === 'invoice' ? '#3B82F6' : docType === 'quotation' ? '#10B981' : '#8B5CF6',
    currency: '₹'
  }));

  const [items, setItems] = useState(() => loadSavedData('docucraft_items', [
    { id: Date.now(), name: 'Web Development', description: 'Sample description', qty: 1, price: 50000, taxRate: 18 }
  ]));

  const [clauses, setClauses] = useState(() => loadSavedData('docucraft_clauses', [
    { id: Date.now(), title: 'Scope of Work', text: 'The service provider agrees to deliver...' }
  ]));

  const [terms, setTerms] = useState(() => loadSavedData('docucraft_terms', {
    notes: 'Thank you for your business.',
    conditions: '1. Payment due in 30 days.\n2. Late fees 1.5% per month.',
    bankDetails: 'Bank: HDFC Bank\nA/C No: 12345678901234\nIFSC: HDFC0001234'
  }));

  const [financials, setFinancials] = useState(() => loadSavedData('docucraft_financials', {
    taxRate: 0, discount: 0, shipping: 0
  }));

  // Watermark States
  const [wmMode, setWmMode] = useState(() => loadSavedData('docucraft_wmMode', 'disabled'));
  const [wmText, setWmText] = useState(() => loadSavedData('docucraft_wmText', 'DRAFT'));
  const [wmLogo, setWmLogo] = useState(() => loadSavedData('docucraft_wmLogo', null));
  const [wmIntensity, setWmIntensity] = useState(() => loadSavedData('docucraft_wmIntensity', 9));
  const [wmSpacing, setWmSpacing] = useState(() => loadSavedData('docucraft_wmSpacing', 810));
  const [wmSpread, setWmSpread] = useState(() => loadSavedData('docucraft_wmSpread', 20));

  // ================= PRESET COLORS FOR PALETTE =================
  const themeColors = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#1F2937'];


  // ================= 2. SAVE TO LOCAL STORAGE ON CHANGE =================
  useEffect(() => {
    localStorage.setItem('docucraft_active_tab', activeTab);
    localStorage.setItem('docucraft_company', JSON.stringify(company));
    localStorage.setItem('docucraft_client', JSON.stringify(client));
    localStorage.setItem('docucraft_docMeta', JSON.stringify(docMeta));
    localStorage.setItem('docucraft_items', JSON.stringify(items));
    localStorage.setItem('docucraft_clauses', JSON.stringify(clauses));
    localStorage.setItem('docucraft_terms', JSON.stringify(terms));
    localStorage.setItem('docucraft_financials', JSON.stringify(financials));
    
    localStorage.setItem('docucraft_wmMode', JSON.stringify(wmMode));
    localStorage.setItem('docucraft_wmText', JSON.stringify(wmText));
    localStorage.setItem('docucraft_wmLogo', JSON.stringify(wmLogo));
    localStorage.setItem('docucraft_wmIntensity', JSON.stringify(wmIntensity));
    localStorage.setItem('docucraft_wmSpacing', JSON.stringify(wmSpacing));
    localStorage.setItem('docucraft_wmSpread', JSON.stringify(wmSpread));
  }, [activeTab, company, client, docMeta, items, clauses, terms, financials, wmMode, wmText, wmLogo, wmIntensity, wmSpacing, wmSpread]);

  // ================= EFFECT FOR DOC TYPE CHANGE =================
  useEffect(() => {
    const isQuotation = docType === 'quotation';
    const isAgreement = docType === 'agreement';
    setDocMeta(prev => ({
      ...prev,
      title: docType === 'invoice' ? 'TAX INVOICE' : isQuotation ? 'PRICE QUOTATION' : 'SERVICE AGREEMENT',
      themeColor: docType === 'invoice' ? '#3B82F6' : isQuotation ? '#10B981' : '#8B5CF6'
    }));
  }, [docType]); 

  // ================= IMAGE UPLOAD HANDLER (Base64) & 100KB CHECK =================
 const handleImageUpload = async (e, fieldName) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post(
    "http://localhost:5000/api/upload/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );

  const imageUrl = res.data.url;

  if (fieldName === "companyLogo") {
    setCompany((prev) => ({
      ...prev,
      logo: imageUrl,
    }));
  } else if (fieldName === "companySignature") {
    setCompany((prev) => ({
      ...prev,
      signature: imageUrl,
    }));
  } else if (fieldName === "companySeal") {
    setCompany((prev) => ({
      ...prev,
      seal: imageUrl,
    }));
  } else if (fieldName === "wmLogo") {
    setWmLogo(imageUrl);
  }
};

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

  // Row Management Functions
  const handleAddItem = () => setItems([...items, { id: Date.now(), name: '', description: '', qty: 1, price: 0, taxRate: 0 }]);
  const handleDeleteItem = (id) => setItems(items.filter(item => item.id !== id));
  const handleAddClause = () => setClauses([...clauses, { id: Date.now(), title: '', text: '' }]);
  const handleDeleteClause = (id) => setClauses(clauses.filter(clause => clause.id !== id));

  // ================= FULL AUTO-SAVE TO DATABASE =================
 useEffect(() => {

const autoSaveTimer=setTimeout(async()=>{

   if(!autoSave){
      return;
   }

   await handleSave();

},30000); // 30 second

return ()=>clearTimeout(autoSaveTimer);

},[
company,
client,
items,
clauses,
terms,
financials,
wmMode,
wmText,
wmLogo,
wmIntensity,
wmSpacing,
wmSpread
]);

console.log(company);
  const handleSave = async () => {
     console.log(company.logo);
console.log(company.signature);
console.log(company.seal);
console.log(wmLogo);
  try {
    const token = localStorage.getItem("token");
    const saveCompany = {
  ...company,
  logo: company.logo || null,
  signature: company.signature || null,
  seal: company.seal || null,
};

    const docData = {
      docType,
      docNumber: docMeta.number,
      clientName: client.name,
      data: {
        company: saveCompany,
        client,
        docMeta,
        items,
        clauses,
        terms,
        financials,
        wmMode,
        wmText,
        wmLogo,
        wmIntensity,
        wmSpacing,
        wmSpread,
      },
    };
    console.log(
  "Payload Size",
  JSON.stringify(docData).length / 1024,
  "KB"
);

    await axios.post(
      "http://localhost:5000/api/documents/save",
      docData,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  

    toast.success("Document Saved Successfully");
  } catch (err) {
    
    toast.error("Save Failed");
  }
};

  // ================= WATERMARK UI COMPONENT =================
  const WatermarkOption = ({ id, label, icon }) => {
    const isActive = wmMode === id;
    return (
      <div
        onClick={() => setWmMode(id)}
        className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${isActive ? 'border-[#8C4A28] bg-[#F8EFEA]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
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
              className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-colors ${activeTab === tab.toLowerCase() ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FDFBF7]">
          
          {/* ================= COMPANY TAB ================= */}
          {activeTab === 'company' && (
            <div className="space-y-4">
              <div><label className="text-xs text-gray-500 font-bold">Company Name</label><input type="text" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
              <div><label className="text-xs text-gray-500 font-bold">GST/VAT Number</label><input type="text" value={company.gst} onChange={(e) => setCompany({ ...company, gst: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
              <div><label className="text-xs text-gray-500 font-bold">Address</label><textarea value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} className="w-full p-2 border rounded text-sm h-20" /></div>
              
              {/* IMAGE UPLOAD & REMOVE SECTION */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-500 font-bold uppercase mb-1">Company Logo</label>
                  {company.logo ? (
                    <div className="relative border p-1 rounded-md bg-gray-50 text-center">
                      <img src={company.logo} alt="Logo" className="h-10 mx-auto object-contain" />
                      <button onClick={() => setCompany({...company, logo: null})} className="text-[10px] text-red-500 font-bold mt-1 hover:underline w-full">Remove</button>
                    </div>
                  ) : (
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'companyLogo')} className="text-[10px] w-full" />
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-500 font-bold uppercase mb-1">Signature</label>
                  {company.signature ? (
                    <div className="relative border p-1 rounded-md bg-gray-50 text-center">
                      <img src={company.signature} alt="Sign" className="h-10 mx-auto object-contain" />
                      <button onClick={() => setCompany({...company, signature: null})} className="text-[10px] text-red-500 font-bold mt-1 hover:underline w-full">Remove</button>
                    </div>
                  ) : (
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'companySignature')} className="text-[10px] w-full" />
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-500 font-bold uppercase mb-1">Seal / Stamp</label>
                  {company.seal ? (
                    <div className="relative border p-1 rounded-md bg-gray-50 text-center">
                      <img src={company.seal} alt="Seal" className="h-10 mx-auto object-contain" />
                      <button onClick={() => setCompany({...company, seal: null})} className="text-[10px] text-red-500 font-bold mt-1 hover:underline w-full">Remove</button>
                    </div>
                  ) : (
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'companySeal')} className="text-[10px] w-full" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= CLIENT TAB ================= */}
          {activeTab === 'client' && (
            <div className="space-y-4">
              <div><label className="text-xs text-gray-500 font-bold">Client Name</label><input type="text" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
              <div><label className="text-xs text-gray-500 font-bold">Billing Address</label><textarea value={client.billingAddress} onChange={(e) => setClient({ ...client, billingAddress: e.target.value })} className="w-full p-2 border rounded text-sm h-20" /></div>
            </div>
          )}

          {/* ================= DETAILS TAB (COLOR PALETTE ADDED HERE) ================= */}
          {activeTab === 'details' && (
            <div className="space-y-5">
              <div><label className="text-xs text-gray-500 font-bold">Document Title</label><input type="text" value={docMeta.title} onChange={(e) => setDocMeta({ ...docMeta, title: e.target.value })} className="w-full p-2 border rounded text-sm font-bold" /></div>
              
              <div className="flex gap-2">
                <div className="w-2/3"><label className="text-xs text-gray-500 font-bold">Document Number</label><input type="text" value={docMeta.number} onChange={(e) => setDocMeta({ ...docMeta, number: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                <div className="w-1/3"><label className="text-xs text-gray-500 font-bold">Currency</label><input type="text" value={docMeta.currency || ''} onChange={(e) => setDocMeta({ ...docMeta, currency: e.target.value })} className="w-full p-2 border rounded text-sm text-center" placeholder="₹, $, €" /></div>
              </div>

              <div className="flex gap-2">
                <div className="w-1/2"><label className="text-xs text-gray-500 font-bold">Date</label><input type="date" value={docMeta.date} onChange={(e) => setDocMeta({ ...docMeta, date: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                {docType !== 'agreement' && <div className="w-1/2"><label className="text-xs text-gray-500 font-bold">Due Date</label><input type="date" value={docMeta.dueDate} onChange={(e) => setDocMeta({ ...docMeta, dueDate: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>}
              </div>

              {/* Theme Color Picker & Preset Palette */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="text-xs text-gray-800 font-bold uppercase tracking-wider mb-3 block">Theme Color</label>
                <input 
                  type="color" 
                  value={docMeta.themeColor} 
                  onChange={(e) => setDocMeta({ ...docMeta, themeColor: e.target.value })} 
                  className="w-full h-10 border-0 rounded cursor-pointer mb-4 shadow-sm" 
                />
                
                {/* 9 Standard Preset Colors */}
                <div className="flex flex-wrap gap-3 justify-between px-1">
                  {themeColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setDocMeta({ ...docMeta, themeColor: color })}
                      className={`w-6 h-6 rounded-full transition-all duration-200 shadow-sm ${docMeta.themeColor === color ? 'ring-2 ring-offset-2 ring-gray-800 scale-110' : 'border border-gray-300 hover:scale-110'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= ITEMS TAB ================= */}
          {activeTab === 'items' && docType !== 'agreement' && (
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={item.id} className="p-3 border rounded-lg bg-white space-y-2 shadow-sm relative">
                  <button onClick={() => handleDeleteItem(item.id)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold hover:bg-red-600 shadow-md">X</button>
                  <input type="text" placeholder="Item Name" value={item.name} onChange={(e) => { const n = [...items]; n[idx].name = e.target.value; setItems(n); }} className="w-full p-2 border rounded text-sm font-bold" />
                  <input type="text" placeholder="Description" value={item.description} onChange={(e) => { const n = [...items]; n[idx].description = e.target.value; setItems(n); }} className="w-full p-2 border rounded text-sm" />
                  <div className="flex gap-2">
                    <div className="w-1/3"><label className="text-[10px] text-gray-400 uppercase font-bold">Qty</label><input type="number" value={item.qty} onChange={(e) => { const n = [...items]; n[idx].qty = Number(e.target.value); setItems(n); }} className="w-full p-2 border rounded text-sm" /></div>
                    <div className="w-1/3"><label className="text-[10px] text-gray-400 uppercase font-bold">Price</label><input type="number" value={item.price} onChange={(e) => { const n = [...items]; n[idx].price = Number(e.target.value); setItems(n); }} className="w-full p-2 border rounded text-sm" /></div>
                    <div className="w-1/3"><label className="text-[10px] text-gray-400 uppercase font-bold">Tax %</label><input type="number" value={item.taxRate} onChange={(e) => { const n = [...items]; n[idx].taxRate = Number(e.target.value); setItems(n); }} className="w-full p-2 border rounded text-sm" /></div>
                  </div>
                </div>
              ))}
              
              <button onClick={handleAddItem} className="w-full py-3 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-600 font-bold rounded-lg text-sm transition-colors border-dashed">
                + Add New Item
              </button>

              {/* ================= ADJUSTMENTS (TAX, DISCOUNT, SHIPPING) ================= */}
              <div className="mt-6 p-4 border border-gray-200 bg-gray-50 rounded-lg space-y-3">
                <h3 className="text-xs font-bold text-gray-800 uppercase">Adjustments (Global)</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Discount</label>
                    <input type="number" value={financials.discount} onChange={(e) => setFinancials({...financials, discount: parseFloat(e.target.value) || 0})} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Tax (%)</label>
                    <input type="number" value={financials.taxRate} onChange={(e) => setFinancials({...financials, taxRate: parseFloat(e.target.value) || 0})} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Shipping</label>
                    <input type="number" value={financials.shipping} onChange={(e) => setFinancials({...financials, shipping: parseFloat(e.target.value) || 0})} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'clauses' && docType === 'agreement' && (
            <div className="space-y-4">
              {clauses.map((clause, idx) => (
                <div key={clause.id} className="p-3 border rounded-lg bg-white space-y-2 shadow-sm relative">
                  <button onClick={() => handleDeleteClause(clause.id)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold hover:bg-red-600 shadow-md">X</button>
                  <input type="text" placeholder="Title" value={clause.title} onChange={(e) => { const n = [...clauses]; n[idx].title = e.target.value; setClauses(n); }} className="w-full p-2 border rounded text-sm font-bold" />
                  <textarea placeholder="Clause text..." value={clause.text} onChange={(e) => { const n = [...clauses]; n[idx].text = e.target.value; setClauses(n); }} className="w-full p-2 border rounded text-sm h-20" />
                </div>
              ))}
              <button onClick={handleAddClause} className="w-full py-3 bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-600 font-bold rounded-lg text-sm transition-colors border-dashed">
                + Add New Clause
              </button>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div><label className="text-xs text-gray-500 font-bold">Notes / Messages</label><textarea value={terms.notes} onChange={(e) => setTerms({ ...terms, notes: e.target.value })} className="w-full p-2 border rounded text-sm h-16" /></div>
              <div><label className="text-xs text-gray-500 font-bold">Terms & Conditions</label><textarea value={terms.conditions} onChange={(e) => setTerms({ ...terms, conditions: e.target.value })} className="w-full p-2 border rounded text-sm h-20" /></div>
              {docType !== 'agreement' && <div><label className="text-xs text-gray-500 font-bold">Bank / Payment Details</label><textarea value={terms.bankDetails} onChange={(e) => setTerms({ ...terms, bankDetails: e.target.value })} className="w-full p-2 border rounded text-sm h-24" /></div>}
            </div>
          )}

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
                      <label className="block text-[11px] font-black text-gray-500 tracking-wider mb-2 uppercase">Watermark Logo</label>
                      {wmLogo ? (
                        <div className="flex items-center justify-between p-2 border rounded bg-white">
                          <img src={wmLogo} alt="Watermark" className="h-10 object-contain" />
                          <button onClick={() => setWmLogo(null)} className="text-[10px] bg-red-100 text-red-600 px-3 py-1.5 rounded font-bold hover:bg-red-200">Remove</button>
                        </div>
                      ) : (
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'wmLogo')} className="w-full text-xs" />
                      )}
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

        {/* ================= ACTION BUTTONS ================= */}
        <div className="p-4 bg-white border-t border-gray-200 shrink-0 flex gap-3">
          <button  onClick={handleSave} className="w-1/2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md transition-colors flex justify-center items-center gap-2">
            Save
          </button>
          <button onClick={handleDownloadPdf} className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md transition-colors flex justify-center items-center gap-2">
            Download PDF
          </button>
        </div>
      </div>

      {/* ================= RIGHT: LIVE PDF PREVIEW ================= */}
      <div className="flex-1 bg-gray-300 flex justify-center items-start rounded-xl overflow-y-auto p-8 shadow-inner">
        <div ref={pdfRef} className="bg-white w-[210mm] min-h-[297mm] text-black shadow-2xl relative overflow-hidden">
          <DocumentLayout
            docType={docType} company={company} client={client} docMeta={docMeta}
            items={items} clauses={clauses} terms={terms} financials={financials}
            wmMode={wmMode} wmText={wmText} wmLogo={wmLogo} wmIntensity={wmIntensity} wmSpacing={wmSpacing} wmSpread={wmSpread}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;

// import React, { useState, useEffect, useRef } from 'react';
// import html2pdf from 'html2pdf.js';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import DocumentLayout from './DocumentLayout';

// const DocumentEditor = ({ docType = 'invoice' }) => {
//   const pdfRef = useRef();

//   // ================= TABS =================
//   const tabs = ['Company', 'Client', 'Details', docType === 'agreement' ? 'Clauses' : 'Items', 'Terms', 'Watermark'];

//   const loadSavedData = (key, defaultData) => {
//     try {
//       const saved = localStorage.getItem(key);
//       return saved ? JSON.parse(saved) : defaultData;
//     } catch (e) {
//       return defaultData;
//     }
//   };

//   const [activeTab, setActiveTab] = useState(() => {
//     return localStorage.getItem('docucraft_active_tab') || 'company';
//   });

//   // ================= 1. STATE MANAGEMENT (with Local Storage) =================
//   const [company, setCompany] = useState(() => loadSavedData('docucraft_company', {
//     name: 'TechFlow Solutions Pvt. Ltd.', gst: '22AAAAA0000A1Z5',
//     address: 'Sector V, Salt Lake, Kolkata', email: 'billing@techflow.in', phone: '+91 98765 43210',
//     logo: null, signature: null, seal: null
//   }));

//   const [client, setClient] = useState(() => loadSavedData('docucraft_client', {
//     name: 'Acme Digital Corp.', companyName: 'Acme Corp', gst: '27BBBBB0000B1Z5',
//     billingAddress: '123 Business Ave, Mumbai, Maharashtra 400069'
//   }));

//   const [docMeta, setDocMeta] = useState(() => loadSavedData('docucraft_docMeta', {
//     title: docType === 'invoice' ? 'TAX INVOICE' : docType === 'quotation' ? 'PRICE QUOTATION' : 'SERVICE AGREEMENT',
//     number: `${docType === 'quotation' ? 'QT' : docType === 'agreement' ? 'AGR' : 'INV'}-2026-001`,
//     date: new Date().toISOString().substring(0, 10),
//     dueDate: '2026-08-06',
//     themeColor: docType === 'invoice' ? '#3B82F6' : docType === 'quotation' ? '#10B981' : '#8B5CF6',
//     currency: '₹'
//   }));

//   const [items, setItems] = useState(() => loadSavedData('docucraft_items', [
//     { id: Date.now(), name: 'Web Development', description: 'Sample description', qty: 1, price: 50000, taxRate: 18 }
//   ]));

//   const [clauses, setClauses] = useState(() => loadSavedData('docucraft_clauses', [
//     { id: Date.now(), title: 'Scope of Work', text: 'The service provider agrees to deliver...' }
//   ]));

//   const [terms, setTerms] = useState(() => loadSavedData('docucraft_terms', {
//     notes: 'Thank you for your business.',
//     conditions: '1. Payment due in 30 days.\n2. Late fees 1.5% per month.',
//     bankDetails: 'Bank: HDFC Bank\nA/C No: 12345678901234\nIFSC: HDFC0001234'
//   }));

//   const [financials, setFinancials] = useState(() => loadSavedData('docucraft_financials', {
//     taxRate: 0, discount: 0, shipping: 0
//   }));

//   // ================= NEW WATERMARK STATES (Based on Image) =================
//   const [wmType, setWmType] = useState(() => loadSavedData('docucraft_wmType', 'text')); // 'none', 'text', 'image'
//   const [wmText, setWmText] = useState(() => loadSavedData('docucraft_wmText', 'CONFIDENTIAL'));
//   const [wmFont, setWmFont] = useState(() => loadSavedData('docucraft_wmFont', 'Arial'));
//   const [wmColor, setWmColor] = useState(() => loadSavedData('docucraft_wmColor', '#D1D5DB'));
//   const [wmOpacity, setWmOpacity] = useState(() => loadSavedData('docucraft_wmOpacity', 20));
//   const [wmRotation, setWmRotation] = useState(() => loadSavedData('docucraft_wmRotation', -45));
//   const [wmSize, setWmSize] = useState(() => loadSavedData('docucraft_wmSize', 48));
//   const [wmLogo, setWmLogo] = useState(() => loadSavedData('docucraft_wmLogo', null));

//   // ================= PRESET COLORS FOR PALETTE =================
//   const themeColors = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#1F2937'];

//   // ================= 2. SAVE TO LOCAL STORAGE ON CHANGE =================
//   useEffect(() => {
//     localStorage.setItem('docucraft_active_tab', activeTab);
//     localStorage.setItem('docucraft_company', JSON.stringify(company));
//     localStorage.setItem('docucraft_client', JSON.stringify(client));
//     localStorage.setItem('docucraft_docMeta', JSON.stringify(docMeta));
//     localStorage.setItem('docucraft_items', JSON.stringify(items));
//     localStorage.setItem('docucraft_clauses', JSON.stringify(clauses));
//     localStorage.setItem('docucraft_terms', JSON.stringify(terms));
//     localStorage.setItem('docucraft_financials', JSON.stringify(financials));
    
//     // Save New Watermark States
//     localStorage.setItem('docucraft_wmType', JSON.stringify(wmType));
//     localStorage.setItem('docucraft_wmText', JSON.stringify(wmText));
//     localStorage.setItem('docucraft_wmFont', JSON.stringify(wmFont));
//     localStorage.setItem('docucraft_wmColor', JSON.stringify(wmColor));
//     localStorage.setItem('docucraft_wmOpacity', JSON.stringify(wmOpacity));
//     localStorage.setItem('docucraft_wmRotation', JSON.stringify(wmRotation));
//     localStorage.setItem('docucraft_wmSize', JSON.stringify(wmSize));
//     localStorage.setItem('docucraft_wmLogo', JSON.stringify(wmLogo));
//   }, [activeTab, company, client, docMeta, items, clauses, terms, financials, wmType, wmText, wmFont, wmColor, wmOpacity, wmRotation, wmSize, wmLogo]);

//   // ================= EFFECT FOR DOC TYPE CHANGE =================
//   useEffect(() => {
//     const isQuotation = docType === 'quotation';
//     const isAgreement = docType === 'agreement';
//     setDocMeta(prev => ({
//       ...prev,
//       title: docType === 'invoice' ? 'TAX INVOICE' : isQuotation ? 'PRICE QUOTATION' : 'SERVICE AGREEMENT',
//       themeColor: docType === 'invoice' ? '#3B82F6' : isQuotation ? '#10B981' : '#8B5CF6'
//     }));
//   }, [docType]); 

//   // ================= IMAGE UPLOAD HANDLER (Base64) & 100KB CHECK =================
//   const handleImageUpload = (e, fieldName) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 100 * 1024) {
//         toast.error("Image is too large! Please upload under 100KB.");
//         e.target.value = ""; 
//         return;
//       }

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64String = reader.result;
//         if (fieldName === 'companyLogo') setCompany({ ...company, logo: base64String });
//         else if (fieldName === 'companySignature') setCompany({ ...company, signature: base64String });
//         else if (fieldName === 'companySeal') setCompany({ ...company, seal: base64String });
//         else if (fieldName === 'wmLogo') setWmLogo(base64String);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDownloadPdf = () => {
//     const element = pdfRef.current;
//     const opt = {
//       margin: 10,
//       filename: `${docMeta.number}.pdf`,
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: { scale: 2, useCORS: true },
//       jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
//     };
//     html2pdf().set(opt).from(element).save();
//   };

//   // Row Management Functions
//   const handleAddItem = () => setItems([...items, { id: Date.now(), name: '', description: '', qty: 1, price: 0, taxRate: 0 }]);
//   const handleDeleteItem = (id) => setItems(items.filter(item => item.id !== id));
//   const handleAddClause = () => setClauses([...clauses, { id: Date.now(), title: '', text: '' }]);
//   const handleDeleteClause = (id) => setClauses(clauses.filter(clause => clause.id !== id));

//   // ================= FULL AUTO-SAVE TO DATABASE =================
//   useEffect(() => {
//     const autoSaveTimer = setTimeout(async () => {
//       try {
//         const docData = {
//           docType: docType,
//           docNumber: docMeta.number,
//           clientName: client.name,
//           data: {
//             company, client, docMeta, items, clauses, terms, financials,
//             wmType, wmText, wmFont, wmColor, wmOpacity, wmRotation, wmSize, wmLogo
//           }
//         };

//         const token = localStorage.getItem('token');
//         await axios.post('http://localhost:5000/api/documents/save', docData, {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
//         });
//         console.log("✅ All data auto-saved!");
//       } catch (error) {
//         console.error("❌ Auto-save error:", error);
//       }
//     }, 1500);

//     return () => clearTimeout(autoSaveTimer);
//   }, [docType, docMeta, company, client, items, clauses, terms, financials, wmType, wmText, wmFont, wmColor, wmOpacity, wmRotation, wmSize, wmLogo]);

//   return (
//     <div className="flex gap-4 h-screen bg-gray-100 p-4 font-sans">
//       {/* ================= LEFT: CONTROL PANEL ================= */}
//       <div className="w-[450px] bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
        
//         {/* Tabs Header */}
//         <div className="flex overflow-x-auto bg-gray-50 border-b border-gray-200 p-2 gap-2 hide-scrollbar shrink-0">
//           {tabs.map(tab => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab.toLowerCase())}
//               className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-colors ${activeTab === tab.toLowerCase() ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Tabs Content */}
//         <div className="flex-1 overflow-y-auto p-6 bg-[#FDFBF7]">
          
//           {/* ================= COMPANY TAB ================= */}
//           {activeTab === 'company' && (
//             <div className="space-y-4">
//               <div><label className="text-xs text-gray-500 font-bold">Company Name</label><input type="text" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
//               <div><label className="text-xs text-gray-500 font-bold">GST/VAT Number</label><input type="text" value={company.gst} onChange={(e) => setCompany({ ...company, gst: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
//               <div><label className="text-xs text-gray-500 font-bold">Address</label><textarea value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} className="w-full p-2 border rounded text-sm h-20" /></div>
              
//               <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
//                 <div className="flex flex-col">
//                   <label className="text-[10px] text-gray-500 font-bold uppercase mb-1">Company Logo</label>
//                   {company.logo ? (
//                     <div className="relative border p-1 rounded-md bg-gray-50 text-center">
//                       <img src={company.logo} alt="Logo" className="h-10 mx-auto object-contain" />
//                       <button onClick={() => setCompany({...company, logo: null})} className="text-[10px] text-red-500 font-bold mt-1 hover:underline w-full">Remove</button>
//                     </div>
//                   ) : (
//                     <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'companyLogo')} className="text-[10px] w-full" />
//                   )}
//                 </div>
//                 <div className="flex flex-col">
//                   <label className="text-[10px] text-gray-500 font-bold uppercase mb-1">Signature</label>
//                   {company.signature ? (
//                     <div className="relative border p-1 rounded-md bg-gray-50 text-center">
//                       <img src={company.signature} alt="Sign" className="h-10 mx-auto object-contain" />
//                       <button onClick={() => setCompany({...company, signature: null})} className="text-[10px] text-red-500 font-bold mt-1 hover:underline w-full">Remove</button>
//                     </div>
//                   ) : (
//                     <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'companySignature')} className="text-[10px] w-full" />
//                   )}
//                 </div>
//                 <div className="flex flex-col">
//                   <label className="text-[10px] text-gray-500 font-bold uppercase mb-1">Seal / Stamp</label>
//                   {company.seal ? (
//                     <div className="relative border p-1 rounded-md bg-gray-50 text-center">
//                       <img src={company.seal} alt="Seal" className="h-10 mx-auto object-contain" />
//                       <button onClick={() => setCompany({...company, seal: null})} className="text-[10px] text-red-500 font-bold mt-1 hover:underline w-full">Remove</button>
//                     </div>
//                   ) : (
//                     <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'companySeal')} className="text-[10px] w-full" />
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ================= CLIENT TAB ================= */}
//           {activeTab === 'client' && (
//             <div className="space-y-4">
//               <div><label className="text-xs text-gray-500 font-bold">Client Name</label><input type="text" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
//               <div><label className="text-xs text-gray-500 font-bold">Billing Address</label><textarea value={client.billingAddress} onChange={(e) => setClient({ ...client, billingAddress: e.target.value })} className="w-full p-2 border rounded text-sm h-20" /></div>
//             </div>
//           )}

//           {/* ================= DETAILS TAB ================= */}
//           {activeTab === 'details' && (
//             <div className="space-y-5">
//               <div><label className="text-xs text-gray-500 font-bold">Document Title</label><input type="text" value={docMeta.title} onChange={(e) => setDocMeta({ ...docMeta, title: e.target.value })} className="w-full p-2 border rounded text-sm font-bold" /></div>
              
//               <div className="flex gap-2">
//                 <div className="w-2/3"><label className="text-xs text-gray-500 font-bold">Document Number</label><input type="text" value={docMeta.number} onChange={(e) => setDocMeta({ ...docMeta, number: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
//                 <div className="w-1/3"><label className="text-xs text-gray-500 font-bold">Currency</label><input type="text" value={docMeta.currency || ''} onChange={(e) => setDocMeta({ ...docMeta, currency: e.target.value })} className="w-full p-2 border rounded text-sm text-center" placeholder="₹, $, €" /></div>
//               </div>

//               <div className="flex gap-2">
//                 <div className="w-1/2"><label className="text-xs text-gray-500 font-bold">Date</label><input type="date" value={docMeta.date} onChange={(e) => setDocMeta({ ...docMeta, date: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
//                 {docType !== 'agreement' && <div className="w-1/2"><label className="text-xs text-gray-500 font-bold">Due Date</label><input type="date" value={docMeta.dueDate} onChange={(e) => setDocMeta({ ...docMeta, dueDate: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>}
//               </div>

//               <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//                 <label className="text-xs text-gray-800 font-bold uppercase tracking-wider mb-3 block">Theme Color</label>
//                 <input type="color" value={docMeta.themeColor} onChange={(e) => setDocMeta({ ...docMeta, themeColor: e.target.value })} className="w-full h-10 border-0 rounded cursor-pointer mb-4 shadow-sm" />
                
//                 <div className="flex flex-wrap gap-3 justify-between px-1">
//                   {themeColors.map((color) => (
//                     <button
//                       key={color} type="button" onClick={() => setDocMeta({ ...docMeta, themeColor: color })}
//                       className={`w-6 h-6 rounded-full transition-all duration-200 shadow-sm ${docMeta.themeColor === color ? 'ring-2 ring-offset-2 ring-gray-800 scale-110' : 'border border-gray-300 hover:scale-110'}`}
//                       style={{ backgroundColor: color }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ================= ITEMS TAB ================= */}
//           {activeTab === 'items' && docType !== 'agreement' && (
//             <div className="space-y-4">
//               {items.map((item, idx) => (
//                 <div key={item.id} className="p-3 border rounded-lg bg-white space-y-2 shadow-sm relative">
//                   <button onClick={() => handleDeleteItem(item.id)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold hover:bg-red-600 shadow-md">X</button>
//                   <input type="text" placeholder="Item Name" value={item.name} onChange={(e) => { const n = [...items]; n[idx].name = e.target.value; setItems(n); }} className="w-full p-2 border rounded text-sm font-bold" />
//                   <input type="text" placeholder="Description" value={item.description} onChange={(e) => { const n = [...items]; n[idx].description = e.target.value; setItems(n); }} className="w-full p-2 border rounded text-sm" />
//                   <div className="flex gap-2">
//                     <div className="w-1/3"><label className="text-[10px] text-gray-400 uppercase font-bold">Qty</label><input type="number" value={item.qty} onChange={(e) => { const n = [...items]; n[idx].qty = Number(e.target.value); setItems(n); }} className="w-full p-2 border rounded text-sm" /></div>
//                     <div className="w-1/3"><label className="text-[10px] text-gray-400 uppercase font-bold">Price</label><input type="number" value={item.price} onChange={(e) => { const n = [...items]; n[idx].price = Number(e.target.value); setItems(n); }} className="w-full p-2 border rounded text-sm" /></div>
//                     <div className="w-1/3"><label className="text-[10px] text-gray-400 uppercase font-bold">Tax %</label><input type="number" value={item.taxRate} onChange={(e) => { const n = [...items]; n[idx].taxRate = Number(e.target.value); setItems(n); }} className="w-full p-2 border rounded text-sm" /></div>
//                   </div>
//                 </div>
//               ))}
              
//               <button onClick={handleAddItem} className="w-full py-3 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-600 font-bold rounded-lg text-sm transition-colors border-dashed">
//                 + Add New Item
//               </button>

//               <div className="mt-6 p-4 border border-gray-200 bg-gray-50 rounded-lg space-y-3">
//                 <h3 className="text-xs font-bold text-gray-800 uppercase">Adjustments (Global)</h3>
//                 <div className="grid grid-cols-3 gap-3">
//                   <div>
//                     <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Discount</label>
//                     <input type="number" value={financials.discount} onChange={(e) => setFinancials({...financials, discount: parseFloat(e.target.value) || 0})} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
//                   </div>
//                   <div>
//                     <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Tax (%)</label>
//                     <input type="number" value={financials.taxRate} onChange={(e) => setFinancials({...financials, taxRate: parseFloat(e.target.value) || 0})} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
//                   </div>
//                   <div>
//                     <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Shipping</label>
//                     <input type="number" value={financials.shipping} onChange={(e) => setFinancials({...financials, shipping: parseFloat(e.target.value) || 0})} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ================= CLAUSES TAB ================= */}
//           {activeTab === 'clauses' && docType === 'agreement' && (
//             <div className="space-y-4">
//               {clauses.map((clause, idx) => (
//                 <div key={clause.id} className="p-3 border rounded-lg bg-white space-y-2 shadow-sm relative">
//                   <button onClick={() => handleDeleteClause(clause.id)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold hover:bg-red-600 shadow-md">X</button>
//                   <input type="text" placeholder="Title" value={clause.title} onChange={(e) => { const n = [...clauses]; n[idx].title = e.target.value; setClauses(n); }} className="w-full p-2 border rounded text-sm font-bold" />
//                   <textarea placeholder="Clause text..." value={clause.text} onChange={(e) => { const n = [...clauses]; n[idx].text = e.target.value; setClauses(n); }} className="w-full p-2 border rounded text-sm h-20" />
//                 </div>
//               ))}
//               <button onClick={handleAddClause} className="w-full py-3 bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-600 font-bold rounded-lg text-sm transition-colors border-dashed">
//                 + Add New Clause
//               </button>
//             </div>
//           )}

//           {/* ================= TERMS TAB ================= */}
//           {activeTab === 'terms' && (
//             <div className="space-y-4">
//               <div><label className="text-xs text-gray-500 font-bold">Notes / Messages</label><textarea value={terms.notes} onChange={(e) => setTerms({ ...terms, notes: e.target.value })} className="w-full p-2 border rounded text-sm h-16" /></div>
//               <div><label className="text-xs text-gray-500 font-bold">Terms & Conditions</label><textarea value={terms.conditions} onChange={(e) => setTerms({ ...terms, conditions: e.target.value })} className="w-full p-2 border rounded text-sm h-20" /></div>
//               {docType !== 'agreement' && <div><label className="text-xs text-gray-500 font-bold">Bank / Payment Details</label><textarea value={terms.bankDetails} onChange={(e) => setTerms({ ...terms, bankDetails: e.target.value })} className="w-full p-2 border rounded text-sm h-24" /></div>}
//             </div>
//           )}

//           {/* ================= WATERMARK TAB (UPDATED UI) ================= */}
//           {activeTab === 'watermark' && (
//             <div className="space-y-5">
              
//               {/* Type Toggles */}
//               <div className="flex bg-gray-100 p-1 rounded-lg">
//                 <button onClick={() => setWmType('none')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${wmType === 'none' ? 'bg-white text-red-500 shadow' : 'text-gray-500 hover:text-gray-700'}`}>No Watermark</button>
//                 <button onClick={() => setWmType('text')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${wmType === 'text' ? 'bg-[#3B82F6] text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}>Text Watermark</button>
//                 <button onClick={() => setWmType('image')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${wmType === 'image' ? 'bg-[#3B82F6] text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}>Image Watermark</button>
//               </div>

//               {/* Text Watermark Controls */}
//               {wmType === 'text' && (
//                 <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
//                   <div>
//                     <label className="text-[11px] text-gray-500 font-bold uppercase mb-1 block">Watermark Text</label>
//                     <input type="text" value={wmText} onChange={(e) => setWmText(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm font-bold text-gray-700 focus:outline-none focus:border-blue-500" placeholder="Confidential" />
//                   </div>
                  
//                   <div className="flex gap-3">
//                     <div className="w-1/2">
//                       <label className="text-[11px] text-gray-500 font-bold uppercase mb-1 block">Font Family</label>
//                       <select value={wmFont} onChange={(e) => setWmFont(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm font-medium focus:outline-none focus:border-blue-500">
//                         <option value="Arial">Arial</option>
//                         <option value="Times New Roman">Times New Roman</option>
//                         <option value="Courier New">Courier New</option>
//                         <option value="Georgia">Georgia</option>
//                         <option value="Verdana">Verdana</option>
//                       </select>
//                     </div>
//                     <div className="w-1/2">
//                       <label className="text-[11px] text-gray-500 font-bold uppercase mb-1 block">Text Color</label>
//                       <div className="flex gap-2 items-center bg-white border border-gray-300 rounded pr-2">
//                         <input type="color" value={wmColor} onChange={(e) => setWmColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0 ml-1" />
//                         <input type="text" value={wmColor} onChange={(e) => setWmColor(e.target.value)} className="w-full text-sm font-bold text-gray-600 uppercase focus:outline-none bg-transparent" />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-4 pt-2 border-t border-gray-200 mt-2">
//                     <div>
//                       <div className="flex justify-between items-center mb-1">
//                         <label className="text-[11px] text-gray-500 font-bold uppercase">Opacity</label>
//                         <span className="text-[11px] font-bold text-gray-700">{wmOpacity}%</span>
//                       </div>
//                       <input type="range" min="0" max="100" value={wmOpacity} onChange={(e) => setWmOpacity(e.target.value)} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
//                     </div>
//                     <div>
//                       <div className="flex justify-between items-center mb-1">
//                         <label className="text-[11px] text-gray-500 font-bold uppercase">Rotation Angle</label>
//                         <span className="text-[11px] font-bold text-gray-700">{wmRotation}°</span>
//                       </div>
//                       <input type="range" min="-90" max="90" value={wmRotation} onChange={(e) => setWmRotation(e.target.value)} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
//                     </div>
//                     <div>
//                       <div className="flex justify-between items-center mb-1">
//                         <label className="text-[11px] text-gray-500 font-bold uppercase">Font Size</label>
//                         <span className="text-[11px] font-bold text-gray-700">{wmSize}px</span>
//                       </div>
//                       <input type="range" min="10" max="150" value={wmSize} onChange={(e) => setWmSize(e.target.value)} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Image Watermark Controls */}
//               {wmType === 'image' && (
//                 <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
//                    <div>
//                       <label className="text-[11px] text-gray-500 font-bold uppercase mb-1 block">Upload Watermark Image</label>
//                       {wmLogo ? (
//                         <div className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-300 rounded bg-white">
//                           <img src={wmLogo} alt="Watermark" className="h-20 object-contain mb-3" />
//                           <button onClick={() => setWmLogo(null)} className="text-[11px] bg-red-100 text-red-600 px-4 py-2 rounded font-bold hover:bg-red-200 w-full">Remove Image</button>
//                         </div>
//                       ) : (
//                         <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'wmLogo')} className="w-full text-xs p-2 border border-gray-300 rounded bg-white" />
//                       )}
//                     </div>
                    
//                     <div className="space-y-4 pt-2 border-t border-gray-200 mt-2">
//                     <div>
//                       <div className="flex justify-between items-center mb-1">
//                         <label className="text-[11px] text-gray-500 font-bold uppercase">Opacity</label>
//                         <span className="text-[11px] font-bold text-gray-700">{wmOpacity}%</span>
//                       </div>
//                       <input type="range" min="0" max="100" value={wmOpacity} onChange={(e) => setWmOpacity(e.target.value)} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
//                     </div>
//                     <div>
//                       <div className="flex justify-between items-center mb-1">
//                         <label className="text-[11px] text-gray-500 font-bold uppercase">Rotation Angle</label>
//                         <span className="text-[11px] font-bold text-gray-700">{wmRotation}°</span>
//                       </div>
//                       <input type="range" min="-90" max="90" value={wmRotation} onChange={(e) => setWmRotation(e.target.value)} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
//                     </div>
//                     <div>
//                       <div className="flex justify-between items-center mb-1">
//                         <label className="text-[11px] text-gray-500 font-bold uppercase">Image Size</label>
//                         <span className="text-[11px] font-bold text-gray-700">{wmSize}%</span>
//                       </div>
//                       <input type="range" min="10" max="250" value={wmSize} onChange={(e) => setWmSize(e.target.value)} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//         </div>

//         {/* ================= ACTION BUTTONS ================= */}
//         <div className="p-4 bg-white border-t border-gray-200 shrink-0 flex gap-3">
//           <button className="w-1/2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md transition-colors flex justify-center items-center gap-2">
//             Save
//           </button>
//           <button onClick={handleDownloadPdf} className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md transition-colors flex justify-center items-center gap-2">
//             Download PDF
//           </button>
//         </div>
//       </div>

//       {/* ================= RIGHT: LIVE PDF PREVIEW ================= */}
//       <div className="flex-1 bg-gray-300 flex justify-center items-start rounded-xl overflow-y-auto p-8 shadow-inner">
//         <div ref={pdfRef} className="bg-white w-[210mm] min-h-[297mm] text-black shadow-2xl relative overflow-hidden">
//           <DocumentLayout
//             docType={docType} company={company} client={client} docMeta={docMeta}
//             items={items} clauses={clauses} terms={terms} financials={financials}
            
//             // New Watermark Props
//             wmType={wmType} wmText={wmText} wmFont={wmFont} wmColor={wmColor} wmOpacity={wmOpacity} wmRotation={wmRotation} wmSize={wmSize} wmLogo={wmLogo}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DocumentEditor;