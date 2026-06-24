import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Download, Plus, Trash2, Info, 
  ListOrdered, FileSignature, Building2, User, ImagePlus,
  Mail, Phone, MapPin, Landmark, CreditCard, FileDigit, Heart,
  Settings, Palette, ChevronUp, ChevronDown, Edit3, 
  AlignLeft, AlignCenter, AlignRight, Type, Image as ImageIcon,
  FolderOpen, Save, CheckCircle2, LogOut, Lock
} from 'lucide-react';

// --- RICH TEXT EDITOR COMPONENT ---
const RichEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  const handleBlur = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const execute = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current.focus();
    handleBlur();
  };

  const insertImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => execute('insertImage', reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col focus-within:border-blue-500 transition-colors">
      <div className="flex flex-wrap items-center gap-1 p-1.5 border-b border-gray-200 bg-[#f8f9fa]">
        <button onClick={() => execute('bold')} title="Bold" className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition"><b className="font-serif">B</b></button>
        <button onClick={() => execute('italic')} title="Italic" className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition"><i className="font-serif">I</i></button>
        <button onClick={() => execute('underline')} title="Underline" className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition"><u className="font-serif">U</u></button>
        <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
        <button onClick={() => execute('justifyLeft')} title="Align Left" className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition"><AlignLeft size={14} /></button>
        <button onClick={() => execute('justifyCenter')} title="Align Center" className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition"><AlignCenter size={14} /></button>
        <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
        <div className="relative flex items-center gap-1 p-1 hover:bg-gray-200 rounded transition cursor-pointer border border-transparent">
          <Palette size={14} className="text-gray-700" />
          <input type="color" onChange={(e) => execute('foreColor', e.target.value)} title="Text Color" className="w-4 h-4 cursor-pointer p-0 border-none bg-transparent" />
        </div>
        <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
        <label title="Insert Image Here" className="flex items-center gap-1 p-1.5 hover:bg-blue-100 hover:text-blue-700 rounded text-gray-700 transition cursor-pointer font-medium text-[11px]">
          <ImageIcon size={14} /> Add Image
          <input type="file" accept="image/*" onChange={insertImage} className="hidden" />
        </label>
        <button onClick={() => execute('removeFormat')} title="Clear Formatting" className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded text-gray-700 transition ml-auto"><Eraser size={14} /></button>
      </div>
      <div 
        ref={editorRef} contentEditable onBlur={handleBlur}
        className="p-3 min-h-[100px] max-h-[300px] overflow-y-auto outline-none text-[13px] leading-relaxed prose prose-sm max-w-none custom-scrollbar"
        placeholder={placeholder}
      />
    </div>
  );
};

// --- AUTHENTICATION COMPONENT ---
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(email && password) {
      onLogin(email);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#eef2f6]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px] text-center border border-gray-100">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
          <FileText size={32} />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">DocuCraft Pro</h1>
        <p className="text-sm text-gray-500 mb-8">Login to access your workspace</p>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-4 shadow-md transition-colors flex items-center justify-center gap-2">
            <Lock size={16} /> Login / Sign Up
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-6 text-center leading-relaxed">
          * This is a simulated local environment.<br/>Data is saved to your browser under this email.
        </p>
      </div>
    </div>
  );
};


// --- MAIN APPLICATION ---
export default function App() {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('docucraft_active_user'));

  // Load User Specific Data
  const loadSavedData = (email) => {
    try {
      const saved = localStorage.getItem(`docucraft_pro_data_${email}`);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  };

  const loadSavedDocsList = (email) => {
    try {
      const docs = localStorage.getItem(`docucraft_docs_list_${email}`);
      return docs ? JSON.parse(docs) : [];
    } catch (e) {
      return [];
    }
  };

  const [activeTab, setActiveTab] = useState('info'); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const pdfRef = useRef();

  // APP STATES
  const [docType, setDocType] = useState('invoice');
  const [settings, setSettings] = useState({ themeColor: 'blue', customCols: [] });
  const [labels, setLabels] = useState({
    billedTo: 'BILLED TO', invoiceDetails: 'DOCUMENT DETAILS', invDate: 'Invoice Date',
    dueDate: 'Due Date', currency: 'Currency', payTerms: 'Payment Terms', poNumber: 'PO Number', status: 'Payment Status',
    companyTaxId: 'GSTIN', clientTaxId: 'GSTIN', desc: 'Description of Service', qty: 'Qty', rate: 'Rate', amount: 'Amount',
    subtotal: 'Subtotal', discount: 'Discount', tax: 'Tax', shipping: 'Shipping / Extra', total: 'Total', amtWords: 'Amount in Words',
    notes: 'Terms & Conditions', latePolicy: 'Late Payment Policy', bankTitle: 'Bank Transfer', upiTitle: 'UPI Payment',
    otherTitle: 'Other Details', qrTitle: 'Scan to Pay', signTitle: 'Authorized Signature', sealTitle: 'Company Seal'
  });
  const [meta, setMeta] = useState({ id: 'INV-2026-001', date: new Date().toISOString().split('T')[0], dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], currency: '₹', paymentTerms: '15 Days', poNumber: '', status: 'Unpaid', subject: 'Invoice for Web Development Services' });
  const [from, setFrom] = useState({ name: 'Your Company Name', email: 'billing@yourcompany.com', phone: '+91 98765 43210', address: '123 Tech Park\nCity, State 12345', website: 'www.yourcompany.com', taxId: '22AAAAA0000A1Z5', logo: null, signature: null, seal: null });
  const [to, setTo] = useState({ name: 'Client Name', email: 'client@company.com', phone: '+91 91234 56789', address: '456 Business Ave\nCity, State 67890', taxId: '' });
  const [items, setItems] = useState([{ id: 1, desc: 'Service Description', qty: 1, rate: 1000, custom: {} }]);
  const [financials, setFinancials] = useState({ taxRate: 18, discount: 0, shipping: 0 });
  const [payment, setPayment] = useState({ bankName: 'Bank Name', accountName: 'Your Company', accountNo: '1234567890', ifsc: 'BANK0001234', upiName: 'UPI Name', upiNumber: 'upi@bank', pan: 'ABCDE1234F', gstin: '22ABCDE1234F1Z5', qrCode: null });
  const [texts, setTexts] = useState({ notes: '1. Please review the invoice and contact us if you have any questions.\n2. All taxes are applicable as per govt rules.', latePolicy: '', agreementText: '' });
  const [blocks, setBlocks] = useState([{ id: 101, type: 'heading', content: 'Scope of Work', align: 'left' }]);
  const [savedDocs, setSavedDocs] = useState([]);

  // Initialize data when user changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('docucraft_active_user', currentUser);
      const data = loadSavedData(currentUser);
      if (data) {
        setDocType(data.docType || 'invoice');
        setSettings(data.settings); setLabels(data.labels); setMeta(data.meta);
        setFrom(data.from); setTo(data.to); setItems(data.items);
        setFinancials(data.financials); setPayment(data.payment);
        setTexts(data.texts); setBlocks(data.blocks);
      }
      setSavedDocs(loadSavedDocsList(currentUser));
    } else {
      localStorage.removeItem('docucraft_active_user');
    }
  }, [currentUser]);

  // Save changes automatically for current user
  useEffect(() => {
    if (currentUser) {
      const dataToSave = { docType, settings, labels, meta, from, to, items, financials, payment, texts, blocks };
      localStorage.setItem(`docucraft_pro_data_${currentUser}`, JSON.stringify(dataToSave));
      localStorage.setItem(`docucraft_docs_list_${currentUser}`, JSON.stringify(savedDocs));
    }
  }, [docType, settings, labels, meta, from, to, items, financials, payment, texts, blocks, savedDocs, currentUser]);

  const handleLogin = (email) => setCurrentUser(email);
  const handleLogout = () => setCurrentUser(null);

  const handleSaveDocument = () => {
    const currentData = { docType, settings, labels, meta, from, to, items, financials, payment, texts, blocks, savedAt: Date.now() };
    setSavedDocs(prevDocs => {
      const existingIndex = prevDocs.findIndex(doc => doc.meta.id === meta.id);
      if (existingIndex >= 0) {
        const newDocs = [...prevDocs];
        newDocs[existingIndex] = currentData;
        return newDocs;
      }
      return [currentData, ...prevDocs];
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const loadDocument = (doc) => {
    if(window.confirm(`Are you sure you want to load document ${doc.meta.id}? Current unsaved changes will be overwritten.`)) {
      setDocType(doc.docType); setSettings(doc.settings); setLabels(doc.labels); setMeta(doc.meta);
      setFrom(doc.from); setTo(doc.to); setItems(doc.items); setFinancials(doc.financials);
      setPayment(doc.payment); setTexts(doc.texts); setBlocks(doc.blocks || []);
      setActiveTab('info');
    }
  };

  const deleteDocument = (id) => {
    if(window.confirm('Are you sure you want to delete this saved document?')) {
      setSavedDocs(prev => prev.filter(doc => doc.meta.id !== id));
    }
  };

  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  const taxAmount = (subtotal - financials.discount) * (financials.taxRate / 100);
  const shippingAmt = parseFloat(financials.shipping) || 0;
  const total = subtotal - financials.discount + taxAmount + shippingAmt;

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
  
  const handleItemCustomChange = (index, colId, value) => {
    const newItems = [...items];
    if(!newItems[index].custom) newItems[index].custom = {};
    newItems[index].custom[colId] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { id: Date.now(), desc: '', qty: 1, rate: 0, custom: {} }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleImageUpload = (e, targetState, targetField) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (targetState === 'from') setFrom({ ...from, [targetField]: reader.result });
        if (targetState === 'payment') setPayment({ ...payment, [targetField]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addBlock = (type) => setBlocks([...blocks, { id: Date.now(), type, content: '', align: 'left' }]);
  const updateBlock = (id, content) => setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  const updateBlockAlign = (id, align) => setBlocks(blocks.map(b => b.id === id ? { ...b, align } : b));
  const removeBlock = (id) => setBlocks(blocks.filter(b => b.id !== id));
  
  const moveBlockUp = (index) => {
    if (index === 0) return;
    const newBlocks = [...blocks];
    [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
    setBlocks(newBlocks);
  };
  
  const moveBlockDown = (index) => {
    if (index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
    setBlocks(newBlocks);
  };

  const handleBlockImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateBlock(id, reader.result);
      reader.readAsDataURL(file);
    }
  };

  const downloadPDF = () => {
    if (!window.html2pdf) return;
    setIsGenerating(true);
    const element = pdfRef.current;
    const filename = `${docType.toUpperCase()}_${meta.id}_${to.name.replace(/\s+/g, '_')}.pdf`;
    const opt = { margin: 0, filename: filename, image: { type: 'jpeg', quality: 1.0 }, html2canvas: { scale: 3, useCORS: true, letterRendering: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
    window.html2pdf().set(opt).from(element).save().then(() => setIsGenerating(false));
  };

  const formatDate = (dateString) => {
    if(!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    if(status === 'Paid') return 'bg-green-100 text-green-700 border-green-200';
    if(status === 'Partial') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const themes = {
    blue: { main: 'text-blue-600', bg: 'bg-blue-600', bgLight: 'bg-blue-50', border: 'border-blue-600', borderLight: 'border-blue-100', fill: 'fill-blue-600', activeTab: 'border-blue-600 text-blue-600 bg-blue-50/50' },
    emerald: { main: 'text-emerald-600', bg: 'bg-emerald-600', bgLight: 'bg-emerald-50', border: 'border-emerald-600', borderLight: 'border-emerald-100', fill: 'fill-emerald-600', activeTab: 'border-emerald-600 text-emerald-600 bg-emerald-50/50' },
    slate: { main: 'text-slate-800', bg: 'bg-slate-800', bgLight: 'bg-slate-100', border: 'border-slate-800', borderLight: 'border-slate-200', fill: 'fill-slate-800', activeTab: 'border-slate-800 text-slate-800 bg-slate-100/50' },
    rose: { main: 'text-rose-600', bg: 'bg-rose-600', bgLight: 'bg-rose-50', border: 'border-rose-600', borderLight: 'border-rose-100', fill: 'fill-rose-600', activeTab: 'border-rose-600 text-rose-600 bg-rose-50/50' }
  };
  const theme = themes[settings.themeColor] || themes.blue;

  // --- RENDER LOGIN SCREEN IF NOT LOGGED IN ---
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // --- RENDER MAIN APP IF LOGGED IN ---
  return (
    <div className="h-screen w-screen flex flex-col font-sans bg-[#eef2f6] text-gray-800 antialiased overflow-hidden">
      
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-2xl text-sm font-bold flex items-center gap-2 z-50 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} className="text-green-400" /> Document Saved Successfully!
        </div>
      )}

      <header className="bg-white border-b border-gray-200 shrink-0 z-20 shadow-sm flex flex-col">
        <div className="h-14 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${theme.bg} flex items-center justify-center text-white shadow-md`}>
              <FileText size={16} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-gray-900 leading-none tracking-tight">DocuCraft <span className="text-gray-400 font-medium">Workstation</span></h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold uppercase">{currentUser.charAt(0)}</div>
              <span className="text-xs font-bold text-gray-600 hidden md:block">{currentUser}</span>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 ml-2" title="Logout"><LogOut size={14}/></button>
            </div>
            <button onClick={handleSaveDocument} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-1.5 rounded-md text-sm font-bold transition-all shadow-sm">
              <Save size={14} /> Save
            </button>
            <button onClick={downloadPDF} disabled={isGenerating} className={`flex items-center gap-2 ${theme.bg} hover:opacity-90 text-white px-5 py-1.5 rounded-md text-sm font-bold shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed`}>
              {isGenerating ? <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" /> : <Download size={14} />}
              {isGenerating ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
        </div>
        
        <div className="flex px-6 border-t border-gray-100 bg-[#fafafa] overflow-x-auto">
          <button onClick={() => setActiveTab('info')} className={`px-5 py-2.5 text-[13px] font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'info' ? theme.activeTab : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}>
            <Building2 size={14} /> General Info
          </button>
          <button onClick={() => setActiveTab('items')} className={`px-5 py-2.5 text-[13px] font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'items' ? theme.activeTab : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}>
            <ListOrdered size={14} /> Content & Data
          </button>
          <button onClick={() => setActiveTab('settings')} className={`px-5 py-2.5 text-[13px] font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'settings' ? theme.activeTab : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}>
            <Settings size={14} /> Settings & Themes
          </button>
          <button onClick={() => setActiveTab('history')} className={`px-5 py-2.5 text-[13px] font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'history' ? theme.activeTab : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}>
            <FolderOpen size={14} /> Saved Documents ({savedDocs.length})
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR / PANELS */}
        <aside className="w-full lg:w-[500px] xl:w-[550px] bg-white border-r border-gray-200 overflow-y-auto p-5 flex-shrink-0 custom-scrollbar shadow-lg z-10">
          
          {/* TAB 1: GENERAL INFO */}
          {activeTab === 'info' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex bg-gray-100 p-1 rounded-md border border-gray-200">
                {['invoice', 'quotation', 'agreement'].map(type => (
                  <button key={type} onClick={() => handleDocTypeChange(type)} className={`flex-1 py-1.5 text-[13px] font-bold rounded capitalize transition-all duration-200 ${docType === type ? `bg-white shadow-sm ${theme.main}` : 'text-gray-500'}`}>
                    {type}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#f8f9fa] p-4 rounded-lg border border-gray-200">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Document ID</label>
                  <input type="text" value={meta.id} onChange={(e) => setMeta({...meta, id: e.target.value})} className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-sm font-semibold outline-none focus:border-blue-500" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Currency</label>
                  <input type="text" value={meta.currency} onChange={(e) => setMeta({...meta, currency: e.target.value})} className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-sm font-semibold outline-none focus:border-blue-500" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Date</label>
                  <input type="date" value={meta.date} onChange={(e) => setMeta({...meta, date: e.target.value})} className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
                </div>
                {docType !== 'agreement' && (
                  <>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Due Date / Validity</label>
                      <input type="date" value={meta.dueDate} onChange={(e) => setMeta({...meta, dueDate: e.target.value})} className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">PO Number</label>
                      <input type="text" value={meta.poNumber} onChange={(e) => setMeta({...meta, poNumber: e.target.value})} placeholder="e.g. PO-9981" className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Payment Status</label>
                      <select value={meta.status} onChange={(e) => setMeta({...meta, status: e.target.value})} className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-sm font-bold outline-none focus:border-blue-500 cursor-pointer">
                        <option value="Unpaid">🔴 Unpaid</option>
                        <option value="Partial">🟠 Partial</option>
                        <option value="Paid">🟢 Paid</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Payment Terms</label>
                      <input type="text" value={meta.paymentTerms} onChange={(e) => setMeta({...meta, paymentTerms: e.target.value})} className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
                    </div>
                  </>
                )}
                <div className="col-span-2 border-t border-gray-200 mt-2 pt-3">
                  <label className="flex items-center gap-2 text-[11px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Main Subject / Reference Title</label>
                  <input type="text" placeholder="e.g. Invoice for Web Development" value={meta.subject || ''} onChange={(e) => setMeta({...meta, subject: e.target.value})} className="w-full px-2.5 py-2 bg-white border border-blue-200 rounded text-sm font-semibold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[12px] font-bold text-gray-800 uppercase flex items-center gap-1.5 border-b border-gray-200 pb-1"><Building2 size={14} className={theme.main}/> My Company Details</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center justify-center p-2 border border-gray-200 bg-gray-50 rounded text-center">
                    {from.logo ? <img src={from.logo} className="h-10 object-contain mb-2" /> : <ImagePlus size={20} className="text-gray-400 mb-1" />}
                    <label className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${theme.bgLight} ${theme.main} hover:opacity-80`}>
                      {from.logo ? 'Change Logo' : 'Upload Logo'}
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'from', 'logo')} className="hidden" />
                    </label>
                    {from.logo && <button onClick={() => setFrom({...from, logo: null})} className="text-[10px] text-red-500 hover:underline mt-1">Remove</button>}
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 border border-gray-200 bg-gray-50 rounded text-center">
                    {from.seal ? <img src={from.seal} className="h-10 object-contain mb-2" /> : <FileSignature size={20} className="text-gray-400 mb-1" />}
                    <label className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${theme.bgLight} ${theme.main} hover:opacity-80`}>
                      {from.seal ? 'Change Seal' : 'Upload Seal'}
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'from', 'seal')} className="hidden" />
                    </label>
                    {from.seal && <button onClick={() => setFrom({...from, seal: null})} className="text-[10px] text-red-500 hover:underline mt-1">Remove</button>}
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 border border-gray-200 bg-gray-50 rounded text-center">
                    {from.signature ? <img src={from.signature} className="h-10 object-contain mb-2" /> : <Edit3 size={20} className="text-gray-400 mb-1" />}
                    <label className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${theme.bgLight} ${theme.main} hover:opacity-80`}>
                      {from.signature ? 'Change Sign' : 'Upload Sign'}
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'from', 'signature')} className="hidden" />
                    </label>
                    {from.signature && <button onClick={() => setFrom({...from, signature: null})} className="text-[10px] text-red-500 hover:underline mt-1">Remove</button>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Company Name" value={from.name} onChange={(e) => setFrom({...from, name: e.target.value})} className="col-span-2 w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm font-bold focus:border-blue-500 outline-none" />
                  <input type="text" placeholder="Tax ID / GSTIN" value={from.taxId} onChange={(e) => setFrom({...from, taxId: e.target.value})} className="col-span-2 w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm font-semibold text-blue-700 bg-blue-50/30 focus:border-blue-500 outline-none" />
                  <input type="text" placeholder="Email" value={from.email} onChange={(e) => setFrom({...from, email: e.target.value})} className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none" />
                  <input type="text" placeholder="Phone" value={from.phone} onChange={(e) => setFrom({...from, phone: e.target.value})} className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none" />
                  <textarea rows="2" placeholder="Address" value={from.address} onChange={(e) => setFrom({...from, address: e.target.value})} className="col-span-2 w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none resize-none" />
                  <input type="text" placeholder="Website" value={from.website} onChange={(e) => setFrom({...from, website: e.target.value})} className="col-span-2 w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[12px] font-bold text-gray-800 uppercase flex items-center gap-1.5 border-b border-gray-200 pb-1"><User size={14} className={theme.main}/> Client Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Client Name" value={to.name} onChange={(e) => setTo({...to, name: e.target.value})} className="col-span-2 w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm font-bold focus:border-blue-500 outline-none" />
                  <input type="text" placeholder="Client Tax ID / GSTIN" value={to.taxId} onChange={(e) => setTo({...to, taxId: e.target.value})} className="col-span-2 w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm font-semibold focus:border-blue-500 outline-none" />
                  <input type="text" placeholder="Email" value={to.email} onChange={(e) => setTo({...to, email: e.target.value})} className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none" />
                  <input type="text" placeholder="Phone" value={to.phone} onChange={(e) => setTo({...to, phone: e.target.value})} className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none" />
                  <textarea rows="2" placeholder="Address" value={to.address} onChange={(e) => setTo({...to, address: e.target.value})} className="col-span-2 w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none resize-none" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT & DATA */}
          {activeTab === 'items' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {docType !== 'agreement' && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[12px] font-bold text-gray-800 uppercase flex items-center gap-1.5">
                        <ListOrdered size={14} className={theme.main}/> Data Grid (Spreadsheet)
                      </h3>
                      <button onClick={addItem} className={`text-[11px] px-3 py-1.5 bg-gray-800 text-white rounded font-bold hover:bg-gray-700 flex items-center gap-1 transition-colors shadow-sm`}>
                        <Plus size={12}/> Add Row
                      </button>
                    </div>

                    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                        <thead>
                          <tr className="bg-gray-100 border-b border-gray-300 text-gray-600">
                            <th className="p-1.5 border-r border-gray-300 font-semibold w-8 text-center">#</th>
                            <th className="p-1.5 border-r border-gray-300 font-semibold w-full min-w-[150px]">{labels.desc}</th>
                            {settings.customCols?.map(col => (
                              <th key={col.id} className="p-1.5 border-r border-gray-300 font-semibold w-20">{col.name}</th>
                            ))}
                            <th className="p-1.5 border-r border-gray-300 font-semibold w-16 text-center">{labels.qty}</th>
                            <th className="p-1.5 border-r border-gray-300 font-semibold w-24 text-right">{labels.rate}</th>
                            <th className="p-1.5 border-r border-gray-300 font-semibold w-24 text-right bg-gray-50">{labels.amount}</th>
                            <th className="p-1.5 font-semibold w-8 text-center">⚙️</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr key={item.id} className="border-b border-gray-200 hover:bg-blue-50/30 focus-within:bg-blue-50/50 transition-colors">
                              <td className="p-0 border-r border-gray-200 text-center text-gray-400 font-medium bg-gray-50">{index + 1}</td>
                              <td className="p-0 border-r border-gray-200">
                                <input type="text" value={item.desc} onChange={(e) => handleItemChange(index, 'desc', e.target.value)} placeholder="Type here..." className="w-full px-2 py-1.5 bg-transparent outline-none focus:ring-inset focus:ring-1 focus:ring-blue-500 text-gray-800 font-medium" />
                              </td>
                              {settings.customCols?.map(col => (
                                <td key={col.id} className="p-0 border-r border-gray-200">
                                  <input type="text" value={item.custom?.[col.id] || ''} onChange={(e) => handleItemCustomChange(index, col.id, e.target.value)} className="w-full px-2 py-1.5 bg-transparent outline-none focus:ring-inset focus:ring-1 focus:ring-blue-500 text-gray-800" />
                                </td>
                              ))}
                              <td className="p-0 border-r border-gray-200">
                                <input type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} className="w-full px-2 py-1.5 bg-transparent outline-none focus:ring-inset focus:ring-1 focus:ring-blue-500 text-gray-800 text-center" />
                              </td>
                              <td className="p-0 border-r border-gray-200">
                                <input type="number" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', e.target.value)} className="w-full px-2 py-1.5 bg-transparent outline-none focus:ring-inset focus:ring-1 focus:ring-blue-500 text-gray-800 text-right" />
                              </td>
                              <td className="p-2 border-r border-gray-200 bg-gray-50/50 text-right font-bold text-gray-700">
                                {(item.qty * item.rate).toLocaleString('en-IN')}
                              </td>
                              <td className="p-1 text-center bg-gray-50">
                                <button onClick={() => removeItem(index)} title="Delete Row" className="p-1 text-gray-400 hover:text-red-600 hover:bg-white rounded transition-colors"><Trash2 size={12} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* TAXES, DISCOUNTS & SHIPPING */}
                  <div className="flex gap-4">
                    <div className="w-1/2 space-y-3 bg-[#f8f9fa] p-4 rounded-lg border border-gray-200">
                      <h3 className="text-[11px] font-bold text-gray-600 uppercase">Adjustments</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">{labels.discount} (Amt)</label>
                          <input type="number" value={financials.discount} onChange={(e) => setFinancials({...financials, discount: parseFloat(e.target.value) || 0})} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">{labels.tax} (%)</label>
                          <input type="number" value={financials.taxRate} onChange={(e) => setFinancials({...financials, taxRate: parseFloat(e.target.value) || 0})} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">{labels.shipping}</label>
                          <input type="number" value={financials.shipping} onChange={(e) => setFinancials({...financials, shipping: parseFloat(e.target.value) || 0})} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-1/2 bg-gray-800 rounded-lg p-4 text-white flex flex-col justify-center shadow-inner">
                       <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Net Total</p>
                       <p className="text-3xl font-black">{meta.currency} {total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                    </div>
                  </div>
                </>
              )}

              {/* MODULAR BLOCK BUILDER */}
              <div className="bg-blue-50/30 p-4 border border-blue-100 rounded-xl space-y-4">
                <div className="flex flex-col">
                  <h3 className="text-[14px] font-bold text-gray-800 flex items-center gap-1.5">
                    <FileSignature size={16} className={theme.main}/> Custom Blocks (Notes & Scope)
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1">Add free-text paragraphs, titles, and images. Align them left, center, or right.</p>
                </div>

                <div className="space-y-3">
                  {blocks.map((block, index) => (
                    <div key={block.id} className="relative bg-white border border-gray-200 rounded-lg p-3 shadow-sm group focus-within:border-blue-400 transition-colors">
                      <div className="absolute -top-3 -right-2 flex items-center gap-1 bg-white border border-gray-200 shadow-sm rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                         {(block.type === 'heading' || block.type === 'paragraph') && (
                           <>
                             <button onClick={() => updateBlockAlign(block.id, 'left')} className={`p-1 rounded ${block.align === 'left' || !block.align ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`} title="Align Left"><AlignLeft size={14}/></button>
                             <button onClick={() => updateBlockAlign(block.id, 'center')} className={`p-1 rounded ${block.align === 'center' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`} title="Align Center"><AlignCenter size={14}/></button>
                             <button onClick={() => updateBlockAlign(block.id, 'right')} className={`p-1 rounded ${block.align === 'right' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`} title="Align Right"><AlignRight size={14}/></button>
                             <div className="w-[1px] h-3 bg-gray-300 mx-0.5"></div>
                           </>
                         )}
                         <button onClick={() => moveBlockUp(index)} disabled={index === 0} className="p-1 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30"><ChevronUp size={14}/></button>
                         <button onClick={() => moveBlockDown(index)} disabled={index === blocks.length - 1} className="p-1 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30"><ChevronDown size={14}/></button>
                         <div className="w-[1px] h-3 bg-gray-300 mx-0.5"></div>
                         <button onClick={() => removeBlock(block.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14}/></button>
                      </div>

                      {block.type === 'heading' && (
                        <div className="flex gap-2">
                          <Type size={16} className="text-gray-400 mt-2 shrink-0"/>
                          <input type="text" placeholder="Enter Heading..." value={block.content} onChange={(e) => updateBlock(block.id, e.target.value)} className={`w-full text-[15px] font-bold outline-none bg-transparent placeholder-gray-300 p-1 ${block.align === 'center' ? 'text-center' : block.align === 'right' ? 'text-right' : 'text-left'}`} />
                        </div>
                      )}
                      {block.type === 'paragraph' && (
                        <div className="flex gap-2">
                          <AlignLeft size={16} className="text-gray-400 mt-2 shrink-0"/>
                          <textarea rows="3" placeholder="Write paragraph here..." value={block.content} onChange={(e) => updateBlock(block.id, e.target.value)} className={`w-full text-[13px] text-gray-700 outline-none bg-transparent resize-none placeholder-gray-300 p-1 custom-scrollbar ${block.align === 'center' ? 'text-center' : block.align === 'right' ? 'text-right' : 'text-left'}`} />
                        </div>
                      )}
                      {block.type === 'image' && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between text-[12px] font-bold text-gray-500">
                            <span className="flex items-center gap-2"><ImageIcon size={14}/> Custom Image</span>
                            <div className="flex gap-1 bg-gray-50 border border-gray-200 rounded p-1">
                              <button onClick={() => updateBlockAlign(block.id, 'left')} className={`p-1 rounded ${block.align === 'left' || !block.align ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-200'}`}><AlignLeft size={12}/></button>
                              <button onClick={() => updateBlockAlign(block.id, 'center')} className={`p-1 rounded ${block.align === 'center' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-200'}`}><AlignCenter size={12}/></button>
                              <button onClick={() => updateBlockAlign(block.id, 'right')} className={`p-1 rounded ${block.align === 'right' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-200'}`}><AlignRight size={12}/></button>
                            </div>
                          </div>
                          {block.content ? (
                            <div className="relative inline-block border border-gray-200 p-1 rounded bg-gray-50 w-full text-center">
                              <img src={block.content} className="max-h-40 object-contain rounded mx-auto" />
                              <label className="absolute bottom-2 right-2 bg-white text-[10px] font-bold px-2 py-1 rounded shadow cursor-pointer hover:bg-gray-100">
                                Change <input type="file" accept="image/*" onChange={(e) => handleBlockImageUpload(block.id, e)} className="hidden" />
                              </label>
                            </div>
                          ) : (
                            <label className="w-full py-6 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors">
                              <ImagePlus size={24} className="mb-2" />
                              <span className="text-[12px] font-bold">Click to upload image</span>
                              <input type="file" accept="image/*" onChange={(e) => handleBlockImageUpload(block.id, e)} className="hidden" />
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button onClick={() => addBlock('heading')} className="text-[11px] font-bold bg-white border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 flex items-center gap-1.5 text-gray-700 shadow-sm transition-colors"><Type size={14} className={theme.main}/> + Title</button>
                  <button onClick={() => addBlock('paragraph')} className="text-[11px] font-bold bg-white border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 flex items-center gap-1.5 text-gray-700 shadow-sm transition-colors"><AlignLeft size={14} className={theme.main}/> + Paragraph</button>
                  <button onClick={() => addBlock('image')} className="text-[11px] font-bold bg-white border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 flex items-center gap-1.5 text-gray-700 shadow-sm transition-colors"><ImageIcon size={14} className={theme.main}/> + Image</button>
                </div>
              </div>

              {/* TERMS & POLICIES */}
              {docType !== 'agreement' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-[12px] font-bold text-gray-800 uppercase flex items-center gap-1.5">Terms & Conditions</h3>
                    <textarea rows="4" value={texts.notes} onChange={(e) => setTexts({...texts, notes: e.target.value})} placeholder="Terms, Conditions, Warranty..." className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-[13px] leading-relaxed resize-none focus:border-blue-500 outline-none custom-scrollbar" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[12px] font-bold text-gray-800 uppercase flex items-center gap-1.5">Late Payment Policy</h3>
                    <textarea rows="4" value={texts.latePolicy} onChange={(e) => setTexts({...texts, latePolicy: e.target.value})} placeholder="Late fee policy..." className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-[13px] leading-relaxed resize-none focus:border-blue-500 outline-none custom-scrollbar" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SETTINGS & CUSTOMIZATION */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
                <h3 className="text-[12px] font-bold text-gray-800 uppercase">1. Theme Colors</h3>
                <div className="flex gap-3">
                  {Object.keys(themes).map(color => (
                    <button 
                      key={color} onClick={() => setSettings({...settings, themeColor: color})}
                      className={`w-8 h-8 rounded-full shadow-sm border-4 ${settings.themeColor === color ? 'border-gray-800 scale-110' : 'border-transparent'} ${themes[color].bg} transition-all`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg space-y-3 shadow-inner">
                <h3 className="text-[12px] font-bold text-blue-800 uppercase">2. Spreadsheet Columns</h3>
                <p className="text-[11px] text-gray-600">Add arbitrary columns (e.g. HSN, Size) to your table.</p>
                <div className="space-y-2">
                  {settings.customCols?.map((col) => (
                    <div key={col.id} className="flex items-center gap-2">
                      <input type="text" value={col.name} onChange={(e) => setSettings({...settings, customCols: settings.customCols.map(c => c.id === col.id ? {...c, name: e.target.value} : c)})} className="w-full px-2 py-1.5 text-xs bg-white border border-gray-300 rounded outline-none focus:border-blue-500" />
                      <button onClick={() => setSettings({...settings, customCols: settings.customCols.filter(c => c.id !== col.id)})} className="p-1.5 text-gray-400 hover:text-red-600 bg-white border border-gray-300 rounded transition"><Trash2 size={14}/></button>
                    </div>
                  ))}
                  <button onClick={() => setSettings({...settings, customCols: [...(settings.customCols || []), {id: 'col_' + Date.now(), name: 'New Column'}]})} className="text-[11px] px-3 py-1.5 border border-blue-300 bg-white text-blue-700 font-bold rounded hover:bg-blue-50 flex items-center gap-1 transition-colors">
                    <Plus size={12}/> Add Custom Column
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
                <h3 className="text-[12px] font-bold text-gray-800 uppercase">3. Rename PDF Text Labels</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries({
                    billedTo: 'Billed To', invoiceDetails: 'Doc Info', invDate: 'Date', dueDate: 'Due Date',
                    poNumber: 'PO Number', status: 'Payment Status', companyTaxId: 'Company Tax ID', clientTaxId: 'Client Tax ID',
                    desc: 'Table: Description', qty: 'Table: Qty', rate: 'Table: Rate', amount: 'Table: Amount',
                    subtotal: 'Subtotal', discount: 'Discount', tax: 'Tax', shipping: 'Shipping', total: 'Total',
                    amtWords: 'Amount in Words', notes: 'Terms & Conditions', latePolicy: 'Late Policy',
                    signTitle: 'Signature Title', sealTitle: 'Seal/Stamp Title'
                  }).map(([key, label]) => (
                    <div key={key}>
                      <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">{label}</label>
                      <input type="text" value={labels[key]} onChange={(e) => setLabels({...labels, [key]: e.target.value})} className="w-full px-2 py-1.5 text-xs bg-white border border-gray-300 rounded focus:border-blue-500 outline-none" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HISTORY / SAVED DOCS */}
          {activeTab === 'history' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
                <h3 className="text-[12px] font-bold text-gray-800 uppercase flex items-center gap-1.5"><FolderOpen size={14} className={theme.main}/> My Saved Documents</h3>
                <p className="text-[11px] text-gray-500">Your documents are saved locally in your browser. Loading a document will overwrite your current unsaved data.</p>
                
                {savedDocs.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <FileText size={36} className="mx-auto mb-2 opacity-50"/>
                    <p className="text-sm font-medium">No documents saved yet.</p>
                    <p className="text-[11px] mt-1">Click the "Save" button in the top bar to save your work.</p>
                  </div>
                ) : (
                  <div className="space-y-2 mt-4">
                    {savedDocs.map(doc => (
                      <div key={doc.meta.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 transition-all">
                        <div>
                          <h4 className="text-[13px] font-bold text-gray-800">
                            {doc.meta.id} 
                            <span className="text-[9px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded ml-2 uppercase tracking-wider">{doc.docType}</span>
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-1">{doc.to.name} • {formatDate(doc.meta.date)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => loadDocument(doc)} className="text-[11px] px-3 py-1.5 bg-blue-50 text-blue-600 font-bold rounded hover:bg-blue-100 transition-colors">Load</button>
                          <button onClick={() => deleteDocument(doc.meta.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </aside>

        {/* RIGHT WORKSPACE: PERFECT A4 PDF PREVIEW */}
        <section className="flex-1 overflow-y-auto p-4 lg:p-10 flex justify-center bg-[#525659] custom-scrollbar shadow-inner relative">
          
          <div ref={pdfRef} className="bg-white text-gray-900 shadow-2xl relative shrink-0 box-border transition-colors duration-300 my-auto" style={{ width: '794px', minHeight: '1123px', padding: '50px 60px' }}>
            <div className="flex flex-col h-full">
              
              {/* TOP HEADER */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  {from.logo ? (
                    <img src={from.logo} alt="Company Logo" className="w-20 h-20 object-contain rounded-md" />
                  ) : (
                    <div className={`w-20 h-20 ${theme.bg} rounded-2xl flex items-center justify-center shadow-sm relative shrink-0`}>
                      <FileText size={36} color="white" strokeWidth={1.5} />
                      <div className="absolute bottom-3 right-3 bg-white px-1.5 py-0.5 rounded text-[10px] font-bold text-red-600 shadow-sm">{meta.currency}</div>
                    </div>
                  )}
                  <div>
                    <h1 className={`text-[40px] font-extrabold ${theme.main} uppercase tracking-wide leading-none`}>{docType}</h1>
                    <p className="text-sm font-bold text-gray-800 mt-1"># {meta.id}</p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end max-w-[50%]">
                  <h2 className={`text-lg font-bold ${theme.main} mb-1`}>{from.name}</h2>
                  {from.taxId && <p className="text-[12px] font-bold text-gray-500 mb-2">{labels.companyTaxId}: <span className="text-gray-800">{from.taxId}</span></p>}
                  
                  <div className="flex items-center justify-end gap-2 text-[13px] text-gray-700 mb-1 w-full">
                    <span className="truncate">{from.email}</span> <Mail size={14} className={`${theme.main} shrink-0`} />
                  </div>
                  <div className="flex items-center justify-end gap-2 text-[13px] text-gray-700 mb-1 w-full">
                    <span>{from.phone}</span> <Phone size={14} className={`${theme.main} shrink-0`} />
                  </div>
                  <div className="flex items-start justify-end gap-2 text-[13px] text-gray-700 text-right w-full">
                    <span className="whitespace-pre-line break-words leading-snug">{from.address}</span>
                    <MapPin size={16} className={`${theme.main} shrink-0 mt-0.5`} />
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-gray-300 mb-6"></div>

              {/* CLIENT & INVOICE DETAILS GRID */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-1/2 pr-4">
                  <span className={`inline-block ${theme.bgLight} ${theme.main} font-bold px-3 py-1 rounded-md text-[11px] mb-3 uppercase tracking-wider`}>{labels.billedTo}</span>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-1">{to.name}</h3>
                  {to.taxId && <p className="text-[12px] font-bold text-gray-500 mb-2">{labels.clientTaxId}: <span className="text-gray-800">{to.taxId}</span></p>}
                  
                  <div className="flex items-center gap-2 text-[13px] text-gray-700 mb-1"><Mail size={14} className={`${theme.main} shrink-0`} /> <span className="break-all">{to.email}</span></div>
                  <div className="flex items-center gap-2 text-[13px] text-gray-700 mb-1"><Phone size={14} className={`${theme.main} shrink-0`} /> <span>{to.phone}</span></div>
                  <div className="flex items-start gap-2 text-[13px] text-gray-700"><MapPin size={16} className={`${theme.main} shrink-0 mt-0.5`} /><span className="whitespace-pre-line break-words leading-snug">{to.address}</span></div>
                </div>
                
                <div className="w-1/2 pl-4 border-l border-gray-100">
                  <span className={`inline-block ${theme.bgLight} ${theme.main} font-bold px-3 py-1 rounded-md text-[11px] mb-3 uppercase tracking-wider`}>{labels.invoiceDetails}</span>
                  <div className="grid grid-cols-[100px_10px_1fr] gap-y-2 text-[13px]">
                    <span className="font-semibold text-gray-800">{labels.invDate}</span><span className="text-gray-500">:</span><span className="text-gray-700">{formatDate(meta.date)}</span>
                    
                    {docType !== 'agreement' && (
                      <>
                        <span className="font-semibold text-gray-800">{labels.dueDate}</span><span className="text-gray-500">:</span><span className="text-gray-700">{formatDate(meta.dueDate)}</span>
                        {meta.poNumber && (
                          <><span className="font-semibold text-gray-800">{labels.poNumber}</span><span className="text-gray-500">:</span><span className="text-gray-700 font-bold">{meta.poNumber}</span></>
                        )}
                        <span className="font-semibold text-gray-800">{labels.status}</span><span className="text-gray-500">:</span>
                        <span><span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusColor(meta.status)}`}>{meta.status.toUpperCase()}</span></span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* CUSTOM SUBJECT */}
              {meta.subject && (
                <div className="mb-6">
                   <p className="text-[14px] text-gray-900 font-bold leading-relaxed border-b border-gray-200 pb-2">
                     <span className={`${theme.main} uppercase tracking-wider text-[11px] block mb-1 font-extrabold`}>Subject / Reference</span>
                     {meta.subject}
                   </p>
                </div>
              )}

              {/* ITEMS TABLE */}
              {docType !== 'agreement' && (
                <div className="mb-6">
                  <table className="w-full text-left border-collapse border border-gray-200">
                    <thead>
                      <tr className={`${theme.bg} text-white`}>
                        <th className={`py-2.5 px-3 text-[11px] font-bold w-[5%] border-r ${theme.border} text-center`}>#</th>
                        <th className={`py-2.5 px-3 text-[11px] font-bold w-[40%] border-r ${theme.border} uppercase`}>{labels.desc}</th>
                        {settings.customCols?.map((col) => (
                          <th key={col.id} className={`py-2.5 px-3 text-[11px] font-bold border-r ${theme.border} text-center uppercase`}>{col.name}</th>
                        ))}
                        <th className={`py-2.5 px-3 text-[11px] font-bold w-[12%] border-r ${theme.border} text-center uppercase`}>{labels.qty}</th>
                        <th className={`py-2.5 px-3 text-[11px] font-bold w-[15%] border-r ${theme.border} text-center uppercase`}>{labels.rate}</th>
                        <th className={`py-2.5 px-3 text-[11px] font-bold w-[15%] text-center uppercase`}>{labels.amount}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <tr key={item.id} className="border-b border-gray-200">
                          <td className="py-3 px-3 text-[13px] text-gray-600 text-center border-r border-gray-200">{i + 1}</td>
                          <td className="py-3 px-3 text-[13px] text-gray-800 border-r border-gray-200 break-words">{item.desc}</td>
                          {settings.customCols?.map((col) => (
                            <td key={col.id} className="py-3 px-3 text-[13px] text-gray-600 text-center border-r border-gray-200 break-words">{item.custom?.[col.id] || '-'}</td>
                          ))}
                          <td className="py-3 px-3 text-[13px] text-gray-600 text-center border-r border-gray-200">{item.qty}</td>
                          <td className="py-3 px-3 text-[13px] text-gray-600 text-center border-r border-gray-200">{meta.currency} {item.rate.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                          <td className="py-3 px-3 text-[13px] font-bold text-gray-900 text-right break-words">{meta.currency} {(item.qty * item.rate).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* MODULAR BLOCKS */}
              <div className="mb-6 space-y-3">
                {blocks.map((block) => {
                  const alignmentClass = block.align === 'center' ? 'text-center' : block.align === 'right' ? 'text-right' : 'text-left';
                  if (block.type === 'heading' && block.content) return <h3 key={block.id} className={`text-[15px] font-bold ${theme.main} mt-2 ${alignmentClass}`}>{block.content}</h3>;
                  if (block.type === 'paragraph' && block.content) return <p key={block.id} className={`text-[13px] text-gray-700 whitespace-pre-line leading-relaxed break-words ${alignmentClass}`}>{block.content}</p>;
                  if (block.type === 'image' && block.content) {
                    const justifyClass = block.align === 'center' ? 'justify-center' : block.align === 'right' ? 'justify-end' : 'justify-start';
                    return <div key={block.id} className={`flex w-full my-2 ${justifyClass}`}><img src={block.content} className="max-w-full rounded" style={{maxHeight: '250px'}} /></div>;
                  }
                  return null;
                })}
              </div>

              {/* TOTALS & AMOUNT IN WORDS */}
              {docType !== 'agreement' && (
                <div className="flex justify-between items-start mb-6 mt-4 border-t border-gray-200 pt-6">
                  <div className="w-[50%] pr-4">
                    <h4 className={`text-[11px] font-bold ${theme.main} uppercase tracking-widest mb-2`}>{labels.amtWords}</h4>
                    <div className="bg-[#f0f4fa] text-gray-700 px-4 py-3 rounded-lg text-[13px] font-medium leading-relaxed mb-5 border border-blue-50 break-words">
                      {meta.currency} {numberToWords(total)}
                    </div>
                  </div>

                  <div className="w-[45%] rounded-xl overflow-hidden border border-gray-200 flex flex-col">
                    <div className="px-5 py-3 flex justify-between items-center border-b border-gray-200">
                      <span className="text-[12px] font-bold text-gray-600 uppercase tracking-wide">{labels.subtotal}</span>
                      <span className="text-[13px] font-bold text-gray-900">{meta.currency} {subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                    </div>
                    {financials.discount > 0 && (
                      <div className="px-5 py-3 flex justify-between items-center border-b border-gray-200 text-red-500">
                        <span className="text-[12px] font-bold uppercase tracking-wide">{labels.discount}</span>
                        <span className="text-[13px] font-bold">- {meta.currency} {financials.discount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                      </div>
                    )}
                    {financials.taxRate > 0 && (
                      <div className="px-5 py-3 flex justify-between items-center border-b border-gray-200">
                        <span className="text-[12px] font-bold text-gray-600 uppercase tracking-wide">{labels.tax} ({financials.taxRate}%)</span>
                        <span className="text-[13px] font-bold text-gray-900">{meta.currency} {taxAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                      </div>
                    )}
                    {financials.shipping > 0 && (
                      <div className="px-5 py-3 flex justify-between items-center border-b border-gray-200">
                        <span className="text-[12px] font-bold text-gray-600 uppercase tracking-wide">{labels.shipping}</span>
                        <span className="text-[13px] font-bold text-gray-900">{meta.currency} {financials.shipping.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                      </div>
                    )}
                    <div className={`px-5 py-4 flex justify-between items-center ${theme.bgLight}`}>
                      <span className={`text-[14px] font-bold ${theme.main} uppercase tracking-widest`}>{labels.total}</span>
                      <span className={`text-[18px] font-black ${theme.main} break-words`}>{meta.currency} {total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENT INFORMATION */}
              {docType !== 'agreement' && (
                <div className="mb-6 border-t border-gray-200 pt-6">
                  <h4 className={`text-[11px] font-bold ${theme.main} uppercase tracking-widest mb-4`}>Payment Information</h4>
                  <div className={`grid ${payment.qrCode ? 'grid-cols-4' : 'grid-cols-3'} gap-4`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl ${theme.bgLight} flex items-center justify-center shrink-0 border ${theme.borderLight}`}><Landmark size={18} className={theme.main} /></div>
                      <div className="text-[11px] text-gray-700 space-y-1 w-full pr-1">
                        <p className="font-bold text-gray-900 mb-1">{labels.bankTitle}</p>
                        <p className="break-words">{payment.accountName}</p>
                        <p className="break-all">A/C: <span className="font-medium text-gray-900">{payment.accountNo}</span></p>
                        <p>IFSC: <span className="font-medium text-gray-900">{payment.ifsc}</span></p>
                        <p className="break-words">Bank: {payment.bankName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 border-l border-gray-200 pl-4">
                      <div className={`w-10 h-10 rounded-xl ${theme.bgLight} flex items-center justify-center shrink-0 border ${theme.borderLight}`}><CreditCard size={18} className={theme.main} /></div>
                      <div className="text-[11px] text-gray-700 space-y-1 w-full pr-1">
                        <p className="font-bold text-gray-900 mb-1">{labels.upiTitle}</p>
                        <p className="break-words">{payment.upiName}</p>
                        <p className="font-medium text-gray-900 break-all">{payment.upiNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 border-l border-gray-200 pl-4">
                      <div className={`w-10 h-10 rounded-xl ${theme.bgLight} flex items-center justify-center shrink-0 border ${theme.borderLight}`}><FileDigit size={18} className={theme.main} /></div>
                      <div className="text-[11px] text-gray-700 space-y-1 w-full">
                        <p className="font-bold text-gray-900 mb-1">{labels.otherTitle}</p>
                        <p>PAN: <span className="font-medium text-gray-900 break-all">{payment.pan}</span></p>
                        <p>GSTIN: <span className="font-medium text-gray-900 break-all">{payment.gstin}</span></p>
                      </div>
                    </div>
                    {payment.qrCode && (
                      <div className="flex items-start gap-3 border-l border-gray-200 pl-4">
                        <img src={payment.qrCode} alt="QR Code" className="w-[60px] h-[60px] object-contain border border-gray-200 rounded p-1 bg-white" />
                        <div className="text-[11px] text-gray-700 mt-1">
                          <p className="font-bold text-gray-900">{labels.qrTitle}</p>
                          <p className="text-gray-500 mt-0.5">Scan to Pay</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TERMS & LATE PAYMENT POLICY */}
              {docType !== 'agreement' && (
                <div className="grid grid-cols-2 gap-6 border-t border-gray-200 pt-6 mb-10">
                   <div>
                      <h4 className={`text-[11px] font-bold ${theme.main} uppercase tracking-widest mb-2`}>{labels.notes}</h4>
                      <p className="text-[12px] text-gray-600 whitespace-pre-line leading-relaxed break-words">{texts.notes}</p>
                   </div>
                   {texts.latePolicy && (
                     <div>
                        <h4 className={`text-[11px] font-bold text-red-500 uppercase tracking-widest mb-2`}>{labels.latePolicy}</h4>
                        <p className="text-[12px] text-gray-600 whitespace-pre-line leading-relaxed break-words">{texts.latePolicy}</p>
                     </div>
                   )}
                </div>
              )}

              <div className="mt-auto"></div>

              {/* SIGNATURE & SEAL SECTION */}
              <div className="flex justify-between items-end mb-6 px-4">
                 <div className="flex flex-col items-center justify-end w-40 h-24 relative">
                    {from.seal && <img src={from.seal} alt="Company Seal" className="absolute bottom-6 max-h-24 object-contain mix-blend-multiply opacity-80" />}
                    <div className="w-full border-t border-gray-400 border-dashed z-10"></div>
                    <p className="text-[11px] font-bold text-gray-600 mt-1.5 uppercase tracking-wider z-10">{labels.sealTitle}</p>
                 </div>

                 <div className="flex flex-col items-center justify-end w-48 h-24 relative">
                    {from.signature && <img src={from.signature} alt="Authorized Signature" className="absolute bottom-6 max-h-16 object-contain mix-blend-multiply z-0" />}
                    <div className="w-full border-t border-gray-800 z-10"></div>
                    <p className="text-[11px] font-bold text-gray-800 mt-1.5 uppercase tracking-wider z-10">{labels.signTitle}</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5 z-10">{from.name}</p>
                 </div>
              </div>

              {/* Bottom Divider & Footer */}
              <div>
                <div className={`w-full border-t-2 ${theme.border} mb-4`}></div>
                <div className="flex justify-between items-center text-center">
                  <div className={`flex items-center gap-1.5 ${theme.main} font-bold text-[12px]`}><Heart size={14} className={theme.fill} />Thank you for your business!</div>
                  <p className="text-[12px] font-semibold text-gray-500">{from.website}</p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

