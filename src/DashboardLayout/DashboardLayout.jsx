import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import { themes, numberToWords } from '../utils';
 import api from "../api/axios";
import { LayoutDashboard, FileText, FileCheck, FileSignature, Settings, RefreshCw, Download, Cloud, ChevronLeft, LogOut, FolderArchive, Loader2 } from 'lucide-react';

// PDF Generate করার লাইব্রেরি
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

const currentUser = user?.name || user?.email || "Administrator";
  // const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('docucraft_active_user'));
  // useEffect(() => { if (!currentUser) navigate("/"); }, [currentUser, navigate]);

  const [activeTab, setActiveTab] = useState('builder');
  const [isGenerating, setIsGenerating] = useState(false); // লোডিং দেখানোর জন্য
  const pdfRef = useRef(null);

  const [docType, setDocType] = useState('quotation');

  // ================= STATES =================
  const [settings, setSettings] = useState({ themeColor: 'blue', customCols: [], watermarkType: 'disabled', watermarkText: 'TIME DIGITALS', watermarkLogo: null, patternIntensity: 15, grainSpacing: 150, fontIconSpread: 35 });
  const [labels, setLabels] = useState({ billedTo: 'BILLED TO', invoiceDetails: 'DOCUMENT DETAILS', invDate: 'Invoice Date', dueDate: 'Due Date', currency: 'Currency', payTerms: 'Payment Terms', poNumber: 'PO Number', status: 'Payment Status', companyTaxId: 'GSTIN', clientTaxId: 'GSTIN', desc: 'DESCRIPTION OF SERVICE', qty: 'QTY / HRS', rate: 'RATE (₹)', amount: 'AMOUNT (₹)', subtotal: 'SUBTOTAL', discount: 'DISCOUNT', tax: 'TAX', shipping: 'SHIPPING', total: 'TOTAL', amtWords: 'AMOUNT IN WORDS', notes: 'NOTES', latePolicy: 'Late Payment Policy', bankTitle: 'Bank Transfer', upiTitle: 'UPI Payment', otherTitle: 'Other Details', signTitle: 'Authorized Signature', sealTitle: 'Company Seal' });
  const [meta, setMeta] = useState({ id: 'QT-2026-001', date: '2026-06-22', dueDate: '2026-07-07', currency: 'INR (₹)', paymentTerms: '', poNumber: '', status: 'Unpaid', subject: '' });
  const [from, setFrom] = useState({ name: 'TechFlow Solutions Pvt. Ltd.', email: 'billing@techflow.in', phone: '+91 98765 43210', address: 'Sector V, Salt Lake\nKolkata, WB 700091\nIndia', website: '', taxId: '', logo: null, signature: null, seal: null });
  const [to, setTo] = useState({ name: 'Acme Digital Corp.', email: 'finance@acmedigital.com', phone: '+91 91234 56789', address: '123 Business Avenue\nAndheri East, Mumbai\nMaharashtra 400069', taxId: '' });
  const [items, setItems] = useState([{ id: 1, desc: 'Full-Stack Web Development', qty: 1, rate: 1000, custom: {} }]);
  const [financials, setFinancials] = useState({ taxRate: 18, discount: 0, shipping: 0 });
  const [payment, setPayment] = useState({ bankName: 'HDFC Bank', accountName: 'TechFlow Solutions', accountNo: '123456789', ifsc: 'HDFC0001234', upiName: 'techflow@upi', upiNumber: '9876543210', pan: 'ABCDE1234F', gstin: '19ABCDE1234' });
  const [texts, setTexts] = useState({ notes: 'Thank you for your business.', latePolicy: 'Late payments attract 2% interest.' });
  const [blocks, setBlocks] = useState([{ id: 101, type: 'paragraph', content: 'Terms and conditions apply...', align: 'left' }]);

  const [savedDocs, setSavedDocs] = useState([]);

  // ================= ACTIONS =================
  const handleDocTypeChange = (type) => { setDocType(type); setActiveTab('builder'); };
  const handleItemChange = (index, field, value) => { const n = [...items]; n[index][field] = (field === 'qty' || field === 'rate') ? (parseFloat(value) || 0) : value; setItems(n); };
  const addItem = () => setItems([...items, { id: Date.now(), desc: '', qty: 1, rate: 0, custom: {} }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  const taxAmount = (subtotal - financials.discount) * (financials.taxRate / 100);
  const total = subtotal - financials.discount + taxAmount + (parseFloat(financials.shipping) || 0);
  const amountInWords = numberToWords ? numberToWords(total) : '';
  const theme = themes ? (themes[settings.themeColor] || themes.blue) : {};

  const appState = { docType, settings, labels, meta, from, to, items, financials, payment, texts, blocks };
  const appSetters = { setDocType, setSettings, setLabels, setMeta, setFrom, setTo, setItems, setFinancials, setPayment, setTexts, setBlocks };
  const actions = { handleDocTypeChange, handleItemChange, addItem, removeItem };
  const calculated = { subtotal, taxAmount, total, amountInWords };

  const handleSaveDocument = () => {
    const newDoc = { id: meta.id || `DOC-${Date.now()}`, docType, companyName: from.name || 'N/A', clientName: to.name || 'N/A', date: meta.date, amount: total, status: meta.status || 'Unpaid', snapshot: JSON.parse(JSON.stringify({ docType, settings, labels, meta, from, to, items, financials, payment, texts, blocks })) };
    const existingIdx = savedDocs.findIndex(d => d.id === newDoc.id);
    if (existingIdx > -1) { const updated = [...savedDocs]; updated[existingIdx] = newDoc; setSavedDocs(updated); alert(`Updated Successfully!`); }
    else { setSavedDocs([...savedDocs, newDoc]); alert(`Saved Successfully!`); }
  };

  const loadDocument = (doc) => { const s = doc.snapshot; if (!s) return; setDocType(s.docType); setSettings(s.settings); setLabels(s.labels); setMeta(s.meta); setFrom(s.from); setTo(s.to); setItems(s.items); setFinancials(s.financials); setPayment(s.payment); setTexts(s.texts); setBlocks(s.blocks); setActiveTab('builder'); };
  const deleteDocument = (id) => { if (window.confirm("Delete?")) setSavedDocs(savedDocs.filter(d => d.id !== id)); };
 

const handleLogout = async () => {
  try {
    await api.post("/auth/logout");
    navigate("/login");
  } catch (error) {
    console.error(error);
  }
};

  // ================= DIRECT PDF DOWNLOAD LOGIC =================
  const downloadPDF = async () => {
    const input = pdfRef.current;
    if (!input) return;

    try {
      setIsGenerating(true); // ডাউনলোডের সময় স্পিনার দেখানোর জন্য

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // ফাইল সেভ
      pdf.save(`${docType.toUpperCase()}_${meta.id || 'Doc'}.pdf`);

    } catch (error) {
      console.error("Error generating PDF: ", error);
      alert("Failed to generate PDF!");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen w-screen flex font-sans bg-[#F3F4F6] overflow-hidden text-gray-800">

      {/* ================= 1. GLOBAL LEFT SIDEBAR ================= */}
      <aside className="w-[260px] bg-[#FCFAF8] border-r border-gray-200 flex flex-col shrink-0 z-30 shadow-[2px_0_15px_rgba(0,0,0,0.02)] justify-between">

        <div className="flex flex-col h-full">
          <div className="h-[70px] flex items-center px-6 border-b border-gray-200/60 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-sm shadow-blue-200 mr-2 border border-blue-400">
              <span className="font-bold text-lg leading-none">D</span>
            </div>
            <div className="flex flex-col leading-tight mt-0.5">
              <span className="text-[17px] font-black text-gray-900 tracking-wide">DocuCraft</span>
              <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-[0.2em]">Platform</span>
            </div>
          </div>

          <div className="flex-1 py-5 px-3 space-y-6 overflow-y-auto custom-scrollbar">
            {/* 1. Templates */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-3">Templates</p>
              <div className="space-y-1">
                <button onClick={() => handleDocTypeChange('invoice')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${docType === 'invoice' && activeTab === 'builder' ? 'bg-orange-50/70 text-[#9A4D2E] font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                  <FileText size={18} className={docType === 'invoice' && activeTab === 'builder' ? 'text-[#9A4D2E]' : 'text-gray-400'} /> Invoice Builder
                </button>
                <button onClick={() => handleDocTypeChange('quotation')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${docType === 'quotation' && activeTab === 'builder' ? 'bg-orange-50/70 text-[#9A4D2E] font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                  <FileCheck size={18} className={docType === 'quotation' && activeTab === 'builder' ? 'text-[#9A4D2E]' : 'text-gray-400'} /> Quotation Builder
                </button>
                <button onClick={() => handleDocTypeChange('agreement')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${docType === 'agreement' && activeTab === 'builder' ? 'bg-orange-50/70 text-[#9A4D2E] font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                  <FileSignature size={18} className={docType === 'agreement' && activeTab === 'builder' ? 'text-[#9A4D2E]' : 'text-gray-400'} /> Agreement Builder
                </button>
              </div>
            </div>

            <div className="h-px w-full bg-gray-200/60"></div>

            {/* 2. Database */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-3">Database</p>
              <button onClick={() => setActiveTab('saved')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'saved' ? 'bg-orange-50/70 text-[#9A4D2E] font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                <div className="flex items-center gap-3">
                  <FolderArchive size={18} className={activeTab === 'saved' ? 'text-[#9A4D2E]' : 'text-gray-400'} /> Saved Documents
                </div>
                <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{savedDocs.length}</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200/60 flex items-center justify-between bg-[#F9F7F4] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 overflow-hidden shrink-0">
              <img src={`https://ui-avatars.com/api/?name=${currentUser || 'Admin'}&background=9A4D2E&color=fff`} alt="User" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900 truncate max-w-[120px]">{currentUser || 'Administrator'}</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Super Admin</span>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition"><LogOut size={16} /></button>
        </div>
      </aside>

      {/* ================= RIGHT MAIN AREA ================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

        <TopHeader currentUser={currentUser} />

        <main className="flex-1 flex flex-col overflow-hidden bg-white">

          <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200 shrink-0 z-10">
            <div className="flex items-center gap-4">
              <button className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded border border-transparent hover:border-gray-200 transition"><ChevronLeft size={18} /></button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[15px] font-black uppercase text-gray-900 tracking-wider capitalize">{activeTab === 'saved' ? 'Document Database' : `${docType} BUILDER`}</h2>
                  {activeTab === 'builder' && <span className="bg-orange-50 border border-orange-200 text-[#9A4D2E] text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">Enterprise Edition</span>}
                </div>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mt-1">Theme-Aware Document Synthesis Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {activeTab === 'builder' && (
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition shadow-sm bg-white">
                  <RefreshCw size={14} /> Synchronize
                </button>
              )}

              {/* Export PDF Button (with loading state) */}
              <button
                onClick={downloadPDF}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-4 py-2 border border-orange-200 rounded-md text-xs font-bold transition shadow-sm ${isGenerating ? 'bg-orange-100 text-orange-400 cursor-not-allowed' : 'bg-orange-50/50 text-[#9A4D2E] hover:bg-orange-50'}`}
              >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                {isGenerating ? 'Exporting...' : 'Export High-Res'}
              </button>

              {activeTab === 'builder' && (
                <button onClick={handleSaveDocument} className="flex items-center gap-2 px-5 py-2 bg-[#9A4D2E] text-white rounded-md text-xs font-bold hover:bg-[#7A3D24] transition shadow-md hover:shadow-lg">
                  <Cloud size={14} /> Save to Cloud
                </button>
              )}
            </div>
          </div>

          {/* SPLIT AREA: Configuration Panel + PDF Preview */}
          <div className="flex-1 flex overflow-hidden">

            {/* INNER SETTINGS SIDEBAR */}
            <div className="w-[360px] bg-white border-r border-gray-200 overflow-y-auto flex flex-col shrink-0 custom-scrollbar z-0 relative">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-20 shadow-sm shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-50 border border-orange-100 text-[#9A4D2E] rounded flex items-center justify-center shrink-0 shadow-inner">
                    {activeTab === 'saved' ? <FolderArchive size={18} /> : <Settings size={18} />}
                  </div>
                  <div>
                    <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-wider">{activeTab === 'saved' ? 'Saved History' : 'Registry Architect'}</h3>
                    <p className="text-[8px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">{activeTab === 'saved' ? 'Manage your documents' : 'Visual Configuration Engine'}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 relative">
                <Sidebar activeTab={activeTab} theme={theme} appState={appState} appSetters={appSetters} actions={actions} themes={themes} savedDocs={savedDocs} loadDocument={loadDocument} deleteDocument={deleteDocument} calculated={calculated} />
              </div>
            </div>

            {/* PDF PREVIEW AREA */}
            <div className="flex-1 bg-[#FDFBF7] relative overflow-hidden flex flex-col shadow-inner">
              <div className="absolute top-5 right-8 bg-white border border-green-200 text-green-700 text-[9px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-20 tracking-wider uppercase">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Live Visual Engine
              </div>
              <Outlet context={{ pdfRef, theme, appState, calculated }} />
            </div>

          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;