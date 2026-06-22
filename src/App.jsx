import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Download, Plus, Trash2, Info, 
  ListOrdered, FileSignature, Building2, User, ImagePlus,
  Mail, Phone, MapPin, Landmark, CreditCard, FileDigit, Heart
} from 'lucide-react';

export default function App() {
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem('docucraft_pro_data');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  };
  
  const savedData = loadSavedData();

  const [docType, setDocType] = useState(savedData?.docType || 'invoice');
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef();

  const [meta, setMeta] = useState(savedData?.meta || {
    id: 'INV-2026-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: '₹',
    paymentTerms: '15 Days'
  });

  const [from, setFrom] = useState(savedData?.from || {
    name: 'TechFlow Solutions Pvt. Ltd.',
    email: 'billing@techflow.in',
    phone: '+91 98765 43210',
    address: 'Sector V, Salt Lake\nKolkata, WB 700091\nIndia',
    website: 'www.techflow.in',
    logo: null
  });

  const [to, setTo] = useState(savedData?.to || {
    name: 'Acme Digital Corp.',
    email: 'finance@acmedigital.com',
    phone: '+91 91234 56789',
    address: '123 Business Avenue\nAndheri East, Mumbai\nMaharashtra 400069, India'
  });

  const [items, setItems] = useState(savedData?.items || [
    { id: 1, desc: 'Full-Stack Web Development (MERN)', qty: 120, rate: 1500 },
    { id: 2, desc: 'UI/UX Design Strategy & Prototyping', qty: 40, rate: 1200 },
    { id: 3, desc: 'Cloud Server Setup (AWS) & Deployment', qty: 1, rate: 15000 }
  ]);

  const [financials, setFinancials] = useState(savedData?.financials || {
    taxRate: 18,
    discount: 0
  });

  const [payment, setPayment] = useState(savedData?.payment || {
    bankName: 'HDFC Bank',
    accountName: 'TechFlow Solutions Pvt. Ltd.',
    accountNo: '12345678901234',
    ifsc: 'HDFC0001234',
    upiName: 'techflow@upi',
    upiNumber: '9876543210@paytm',
    pan: 'AABCT1234D',
    gstin: '19AABCT1234D1Z5'
  });

  const [texts, setTexts] = useState(savedData?.texts || {
    notes: 'Thank you for your business.\nWe appreciate your trust in us.',
    agreementText: 'This Agreement is made effective as of the date written above...\n\n1. SERVICES PROVIDED: Custom software development services.\n2. PAYMENT TERMS: 50% upfront, 50% upon completion.'
  });

  useEffect(() => {
    const dataToSave = { docType, meta, from, to, items, financials, payment, texts };
    localStorage.setItem('docucraft_pro_data', JSON.stringify(dataToSave));
  }, [docType, meta, from, to, items, financials, payment, texts]);

  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  const taxAmount = (subtotal - financials.discount) * (financials.taxRate / 100);
  const total = subtotal - financials.discount + taxAmount;

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
    return str.trim() + ' Rupees Only';
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
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

  const addItem = () => setItems([...items, { id: Date.now(), desc: 'New Service Item', qty: 1, rate: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFrom({ ...from, logo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const downloadPDF = () => {
    if (!window.html2pdf) return;
    setIsGenerating(true);
    const element = pdfRef.current;
    const filename = `${docType.toUpperCase()}_${meta.id}_${to.name.replace(/\s+/g, '_')}.pdf`;
    
    const opt = {
        margin:       0,
        filename:     filename,
        image:        { type: 'jpeg', quality: 1.0 },
        html2canvas:  { scale: 3, useCORS: true, letterRendering: true }, 
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    window.html2pdf().set(opt).from(element).save().then(() => setIsGenerating(false));
  };

  const formatDate = (dateString) => {
    if(!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="h-screen w-screen flex flex-col font-sans bg-gray-100 text-gray-800 antialiased overflow-hidden">
      
      {/* HEADER / NAVBAR */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <FileText size={18} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-none tracking-tight">DocuCraft</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-semibold mt-1">Pro Edition</p>
          </div>
        </div>

        <div className="hidden md:flex bg-gray-100 p-1 rounded-lg border border-gray-200">
          {['invoice', 'quotation', 'agreement'].map(type => (
            <button 
              key={type} 
              onClick={() => handleDocTypeChange(type)} 
              className={`px-5 py-1.5 text-sm font-semibold rounded-md capitalize transition-all duration-200 ${docType === type ? 'bg-white shadow-sm text-blue-600 border border-gray-200/50' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {type}
            </button>
          ))}
        </div>

        <button onClick={downloadPDF} disabled={isGenerating} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed">
          {isGenerating ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Download size={16} />}
          {isGenerating ? 'Generating...' : 'Download PDF'}
        </button>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR / FORM EDITOR */}
        <aside className="w-full lg:w-[480px] bg-white border-r border-gray-200 overflow-y-auto p-6 space-y-8 flex-shrink-0 custom-scrollbar shadow-lg z-10">
          
          <section className="space-y-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Info size={14}/> Document Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Document Number</label>
                <input type="text" value={meta.id} onChange={(e) => setMeta({...meta, id: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Currency</label>
                <input type="text" value={meta.currency} onChange={(e) => setMeta({...meta, currency: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Issue Date</label>
                <input type="date" value={meta.date} onChange={(e) => setMeta({...meta, date: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-blue-500 outline-none transition-all" />
              </div>
              {docType !== 'agreement' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Due Date</label>
                    <input type="date" value={meta.dueDate} onChange={(e) => setMeta({...meta, dueDate: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Payment Terms</label>
                    <input type="text" value={meta.paymentTerms} onChange={(e) => setMeta({...meta, paymentTerms: e.target.value})} placeholder="e.g. 15 Days" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-blue-500 outline-none transition-all" />
                  </div>
                </>
              )}
            </div>
          </section>

          <hr className="border-gray-100" />

          <section className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Building2 size={14}/> Your Details</h2>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Company Name" value={from.name} onChange={(e) => setFrom({...from, name: e.target.value})} className="col-span-2 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:border-blue-500 outline-none transition-all" />
                
                <div className="col-span-2 flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-300 transition-all">
                  <label className="flex items-center gap-2 cursor-pointer w-full text-sm font-medium text-gray-600 hover:text-blue-600 transition">
                    <ImagePlus size={16} />
                    <span className="truncate">{from.logo ? 'Change Logo' : 'Upload Logo'}</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  {from.logo && (
                    <button onClick={() => setFrom({...from, logo: null})} className="text-red-500 hover:text-red-700 text-xs font-bold px-2">Remove</button>
                  )}
                </div>

                <input type="text" placeholder="Email Address" value={from.email} onChange={(e) => setFrom({...from, email: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-all" />
                <input type="text" placeholder="Phone Number" value={from.phone} onChange={(e) => setFrom({...from, phone: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-all" />
                <textarea rows="2" placeholder="Full Address" value={from.address} onChange={(e) => setFrom({...from, address: e.target.value})} className="col-span-2 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:border-blue-500 outline-none transition-all" />
                <input type="text" placeholder="Website" value={from.website} onChange={(e) => setFrom({...from, website: e.target.value})} className="col-span-2 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><User size={14}/> Client Details</h2>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Client Name" value={to.name} onChange={(e) => setTo({...to, name: e.target.value})} className="col-span-2 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:border-blue-500 outline-none transition-all" />
                <input type="text" placeholder="Client Email" value={to.email} onChange={(e) => setTo({...to, email: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-all" />
                <input type="text" placeholder="Client Phone" value={to.phone} onChange={(e) => setTo({...to, phone: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-all" />
                <textarea rows="2" placeholder="Client Address" value={to.address} onChange={(e) => setTo({...to, address: e.target.value})} className="col-span-2 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {docType !== 'agreement' ? (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><ListOrdered size={14}/> Items & Services</h2>
                <button onClick={addItem} className="text-xs text-blue-600 font-bold hover:text-blue-800 transition flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
                  <Plus size={14} /> Add Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm group">
                    <div className="flex justify-between items-center">
                      <input type="text" placeholder="Service Description" value={item.desc} onChange={(e) => handleItemChange(index, 'desc', e.target.value)} className="w-full text-sm font-semibold border-none outline-none bg-transparent placeholder-gray-400" />
                      <button onClick={() => removeItem(index)} className="text-gray-300 hover:text-red-500 transition ml-2"><Trash2 size={16} /></button>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1/3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Qty/Hrs</label>
                        <input type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-200 rounded-md text-sm focus:border-blue-500 outline-none" />
                      </div>
                      <div className="w-2/3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rate ({meta.currency})</label>
                        <input type="number" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', e.target.value)} className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-200 rounded-md text-sm focus:border-blue-500 outline-none" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Tax / GST (%)</span>
                  <input type="number" value={financials.taxRate} onChange={(e) => setFinancials({...financials, taxRate: parseFloat(e.target.value) || 0})} className="w-24 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-semibold text-right focus:border-blue-500 outline-none" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Discount Amount</span>
                  <input type="number" value={financials.discount} onChange={(e) => setFinancials({...financials, discount: parseFloat(e.target.value) || 0})} className="w-24 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-semibold text-right focus:border-blue-500 outline-none" />
                </div>
              </div>
            </section>
          ) : (
            <section>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><FileSignature size={14}/> Agreement Terms</h2>
              <textarea rows="15" value={texts.agreementText} onChange={(e) => setTexts({...texts, agreementText: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-serif leading-relaxed resize-none focus:border-blue-500 outline-none" />
            </section>
          )}

        

          {docType !== 'agreement' && (
            <section className="space-y-4">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><CreditCard size={14}/> Payment Information</h2>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <p className="text-xs font-bold text-gray-700">Bank Details</p>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Bank Name" value={payment.bankName} onChange={(e) => setPayment({...payment, bankName: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs focus:border-blue-500 outline-none" />
                  <input type="text" placeholder="IFSC Code" value={payment.ifsc} onChange={(e) => setPayment({...payment, ifsc: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs focus:border-blue-500 outline-none" />
                  <input type="text" placeholder="Account Name" value={payment.accountName} onChange={(e) => setPayment({...payment, accountName: e.target.value})} className="col-span-2 w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs focus:border-blue-500 outline-none" />
                  <input type="text" placeholder="Account No" value={payment.accountNo} onChange={(e) => setPayment({...payment, accountNo: e.target.value})} className="col-span-2 w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs focus:border-blue-500 outline-none" />
                </div>
                
                <p className="text-xs font-bold text-gray-700 mt-4 pt-2 border-t border-gray-200">UPI Details</p>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="UPI Name" value={payment.upiName} onChange={(e) => setPayment({...payment, upiName: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs focus:border-blue-500 outline-none" />
                  <input type="text" placeholder="UPI ID / Number" value={payment.upiNumber} onChange={(e) => setPayment({...payment, upiNumber: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs focus:border-blue-500 outline-none" />
                </div>

                <p className="text-xs font-bold text-gray-700 mt-4 pt-2 border-t border-gray-200">Tax Details</p>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="PAN" value={payment.pan} onChange={(e) => setPayment({...payment, pan: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs focus:border-blue-500 outline-none" />
                  <input type="text" placeholder="GSTIN" value={payment.gstin} onChange={(e) => setPayment({...payment, gstin: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs focus:border-blue-500 outline-none" />
                </div>
              </div>
            </section>
          )}

          <section className="pb-8 mt-6">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Notes</h2>
            <textarea rows="3" value={texts.notes} onChange={(e) => setTexts({...texts, notes: e.target.value})} placeholder="Thank you for your business..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm leading-relaxed resize-none focus:border-blue-500 outline-none" />
          </section>

        </aside>

        {/* RIGHT WORKSPACE: PDF PREVIEW */}
        <section className="flex-1 overflow-y-auto p-4 lg:p-10 flex justify-center bg-[#f3f4f6] custom-scrollbar">
          
          <div ref={pdfRef} className="bg-white text-gray-900 shadow-xl relative" style={{ width: '210mm', minHeight: '297mm', padding: '15mm 20mm' }}>
            <div className="flex flex-col h-full">
              
              {/* TOP HEADER */}
              <div className="flex justify-between items-start mb-6">
                
                {/* Left Side: Logo/Icon & Invoice Title */}
                <div className="flex items-center gap-4">
                  {from.logo ? (
                    <img src={from.logo} alt="Company Logo" className="w-20 h-20 object-contain rounded-md" />
                  ) : (
                    <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-sm relative shrink-0">
                      <FileText size={36} color="white" strokeWidth={1.5} />
                      <div className="absolute bottom-3 right-3 bg-white px-1.5 py-0.5 rounded text-[10px] font-bold text-red-600 shadow-sm">
                        {meta.currency}
                      </div>
                    </div>
                  )}
                  <div>
                    <h1 className="text-[44px] font-extrabold text-blue-600 uppercase tracking-wide leading-none">{docType}</h1>
                    <p className="text-base font-bold text-gray-800 mt-1"># {meta.id}</p>
                  </div>
                </div>

                {/* Right Side: Company Info & Icons */}
                <div className="text-right flex flex-col items-end">
                  <h2 className="text-xl font-bold text-blue-600 mb-3">{from.name}</h2>
                  
                  <div className="flex items-center justify-end gap-2 text-[13px] text-gray-700 mb-1.5 w-full">
                    {from.email} <Mail size={14} className="text-blue-600 shrink-0" />
                  </div>
                  <div className="flex items-center justify-end gap-2 text-[13px] text-gray-700 mb-1.5 w-full">
                    {from.phone} <Phone size={14} className="text-blue-600 shrink-0" />
                  </div>
                  <div className="flex items-start justify-end gap-2 text-[13px] text-gray-700 text-right w-full">
                    <span className="whitespace-pre-line">{from.address}</span>
                    <MapPin size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  </div>
                </div>
              </div>

              {/* Top Solid Gray Divider */}
              <div className="border-t border-blue-300 mb-8"></div>

              {/* CLIENT & INVOICE DETAILS GRID */}
              <div className="flex justify-between items-start mb-8">
                <div className="w-1/2 pr-6">
                  <span className="inline-block bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-md text-[11px] mb-4">
                    BILLED TO
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{to.name}</h3>
                  <div className="flex items-center gap-2 text-[13px] text-gray-700 mb-1.5">
                    <Mail size={14} className="text-blue-600" /> {to.email}
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-gray-700 mb-1.5">
                    <Phone size={14} className="text-blue-600" /> {to.phone}
                  </div>
                  <div className="flex items-start gap-2 text-[13px] text-gray-700">
                    <MapPin size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <span className="whitespace-pre-line">{to.address}</span>
                  </div>
                </div>
                
                <div className="w-1/2 pl-6">
                  <span className="inline-block bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-md text-[11px] mb-4">
                    INVOICE DETAILS
                  </span>
                  <div className="grid grid-cols-[110px_10px_1fr] gap-y-2.5 text-[13px]">
                    <span className="font-semibold text-gray-800">Invoice Date</span>
                    <span className="text-gray-500">:</span>
                    <span className="text-gray-700">{formatDate(meta.date)}</span>
                    
                    {docType !== 'agreement' && (
                      <>
                        <span className="font-semibold text-gray-800">Due Date</span>
                        <span className="text-gray-500">:</span>
                        <span className="text-gray-700">{formatDate(meta.dueDate)}</span>

                        <span className="font-semibold text-gray-800">Currency</span>
                        <span className="text-gray-500">:</span>
                        <span className="text-gray-700">{meta.currency === '₹' ? 'INR (₹)' : meta.currency === '$' ? 'USD ($)' : meta.currency}</span>

                        <span className="font-semibold text-gray-800">Payment Terms</span>
                        <span className="text-gray-500">:</span>
                        <span className="text-gray-700">{meta.paymentTerms}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* ITEMS TABLE */}
              {docType !== 'agreement' ? (
                <div className="mb-6">
                  <table className="w-full text-left border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="py-2.5 px-3 text-[11px] font-semibold w-[5%] border-r border-blue-500 text-center">#</th>
                        <th className="py-2.5 px-4 text-[11px] font-semibold w-[45%] border-r border-blue-500 uppercase">Description of Service</th>
                        <th className="py-2.5 px-4 text-[11px] font-semibold w-[15%] border-r border-blue-500 text-center uppercase">Qty / Hrs</th>
                        <th className="py-2.5 px-4 text-[11px] font-semibold w-[15%] border-r border-blue-500 text-center uppercase">Rate ({meta.currency})</th>
                        <th className="py-2.5 px-4 text-[11px] font-semibold w-[20%] text-center uppercase">Amount ({meta.currency})</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <tr key={i} className="border-b border-gray-200">
                          <td className="py-3 px-3 text-[13px] text-gray-600 text-center border-r border-gray-200">{i + 1}</td>
                          <td className="py-3 px-4 text-[13px] text-gray-800 border-r border-gray-200">{item.desc}</td>
                          <td className="py-3 px-4 text-[13px] text-gray-600 text-center border-r border-gray-200">{item.qty}</td>
                          <td className="py-3 px-4 text-[13px] text-gray-600 text-center border-r border-gray-200">{item.rate.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                          <td className="py-3 px-4 text-[13px] font-bold text-gray-900 text-right">{(item.qty * item.rate).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mb-8 flex-grow">
                  <div className="prose max-w-none text-sm font-serif leading-loose whitespace-pre-line text-gray-800 text-justify">
                    {texts.agreementText}
                  </div>
                </div>
              )}
               
              {/* TOTALS & AMOUNT IN WORDS */}
              {docType !== 'agreement' && (
                <div className="flex justify-between items-start mb-8">
                 
                  <div className="w-[50%] pr-4">
                    <h4 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-2">Amount in Words</h4>
                    <div className="bg-[#f0f4fa] text-gray-700 px-4 py-3 rounded-lg text-[13px] leading-relaxed mb-6">
                      {numberToWords(total)}
                    </div>

                    <h4 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-2">Notes</h4>
                    <p className="text-[12px] text-gray-700 whitespace-pre-line leading-relaxed">
                      {texts.notes}
                    </p>
                  </div>

                  <div className="w-[45%] rounded-xl overflow-hidden border border-gray-200 flex flex-col">
                    <div className="px-5 py-3 flex justify-between items-center border-b border-gray-200">
                      <span className="text-[13px] font-bold text-gray-800">Subtotal</span>
                      <span className="text-[14px] font-bold text-gray-900">{meta.currency}{subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                    </div>
                    {financials.discount > 0 && (
                      <div className="px-5 py-3 flex justify-between items-center border-b border-gray-200 text-gray-600">
                        <span className="text-[13px] font-semibold">Discount</span>
                        <span className="text-[14px] font-semibold">- {meta.currency}{financials.discount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                      </div>
                    )}
                    <div className="px-5 py-3 flex justify-between items-center border-b border-gray-200">
                      <span className="text-[13px] font-semibold text-gray-700">Tax ({financials.taxRate}%)</span>
                      <span className="text-[14px] font-bold text-gray-900">{meta.currency}{taxAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="px-5 py-4 flex justify-between items-center bg-[#f0f4fa]">
                      <span className="text-[15px] font-bold text-blue-600 uppercase tracking-wider">Total</span>
                      <span className="text-[20px] font-extrabold text-blue-600">{meta.currency}{total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                    </div>
                  </div>
                </div>
              )}

          
              
              {/* PAYMENT INFORMATION */}
              {docType !== 'agreement' && (
                
                
                <div className="mb-8">
                   <div className="border-t border-blue-300 mb-2"></div> 
                  <h4 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-4">Payment Information</h4>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                        <Landmark size={20} className="text-blue-600" />
                      </div>
                      <div className="text-[11px] text-gray-700 space-y-0.5">
                        <p className="font-bold text-gray-900">Bank Transfer</p>
                        <p>{payment.accountName}</p>
                        <p>A/C No: {payment.accountNo}</p>
                        <p>IFSC: {payment.ifsc}</p>
                        <p>Bank: {payment.bankName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-l border-gray-200 pl-6">
                      <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                        <CreditCard size={20} className="text-blue-600" />
                      </div>
                      <div className="text-[11px] text-gray-700 space-y-0.5">
                        <p className="font-bold text-gray-900">UPI Payment</p>
                        <p>{payment.upiName}</p>
                        <p>{payment.upiNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-l border-gray-200 pl-6">
                      <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                        <FileDigit size={20} className="text-blue-600" />
                      </div>
                      <div className="text-[11px] text-gray-700 space-y-0.5">
                        <p className="font-bold text-gray-900">Other Details</p>
                        <p>PAN: {payment.pan}</p>
                        <p>GSTIN: {payment.gstin}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Divider & Footer */}
              <div>
                 {/* Middle Divider */}
              <div className="border-t border-blue-300"></div>
                <div className="flex flex-col items-center justify-center text-center mt-3">
                  <div className="flex items-center gap-1.5 text-blue-600 font-medium text-[13px] mb-1">
                    <Heart size={14} className="fill-blue-600" />
                    Thank you for your business!
                  </div>
                  <p className="text-[12px] text-gray-500">{from.website}</p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}