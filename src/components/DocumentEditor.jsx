
import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import axios from 'axios';
import toast from 'react-hot-toast';
import DocumentLayout from './DocumentLayout';
import { useParams } from "react-router-dom";
import {
  Maximize, Type, Image as ImageIcon, Copy, Grid,
  LayoutTemplate, Palette, ChevronDown, ChevronUp
} from 'lucide-react';

const DocumentEditor = ({ docType: propDocType }) => {
  const pdfRef = useRef();
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);

  const loadSavedData = (key, defaultData) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultData;
    } catch (e) {
      return defaultData;
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const [docType, setDocType] = useState(() => {
    if (propDocType) return propDocType;
    return loadSavedData("docucraft_docType", "invoice");
  });

  useEffect(() => {
    if (propDocType) {
      setDocType(propDocType);
    }
  }, [propDocType]);

  const tabs = ['Company', 'Client', 'Details', docType === 'agreement' ? 'Clauses' : 'Items', 'Terms', 'Branding'];

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('docucraft_active_tab') || 'company';
  });

  // ================= 1. STATE MANAGEMENT =================
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
    themeColor: docType === 'invoice' ? '#166534' : docType === 'quotation' ? '#10B981' : '#8B5CF6',
    paperColor: '#FFFFFF',
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

  const [wmMode, setWmMode] = useState(() => loadSavedData('docucraft_wmMode', 'text_tiling'));
  const [wmText, setWmText] = useState(() => loadSavedData('docucraft_wmText', 'PRAKRITIGHOR'));
  const [wmLogo, setWmLogo] = useState(() => loadSavedData('docucraft_wmLogo', null));
  const [wmIntensity, setWmIntensity] = useState(() => loadSavedData('docucraft_wmIntensity', 12));
  const [wmSpacing, setWmSpacing] = useState(() => loadSavedData('docucraft_wmSpacing', 250));
  const [wmSpread, setWmSpread] = useState(() => loadSavedData('docucraft_wmSpread', 16));
  const [centerLogo, setCenterLogo] = useState(() => loadSavedData('docucraft_centerLogo', false));

  const themeColors = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#166534', '#3B82F6', '#8B5CF6', '#EC4899', '#1F2937'];

  useEffect(() => {
    if (id) {
      loadDocument();
    }
  }, [id]);

  const loadDocument = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/documents/${id}`,
        { withCredentials: true }
      );
      const doc = res.data;
      setDocType(doc.docType);
      setCompany(doc.data.company);
      setClient(doc.data.client);
      setDocMeta(doc.data.docMeta);
      setItems(doc.data.items || []);
      setClauses(doc.data.clauses || []);
      setTerms(doc.data.terms);
      setFinancials(doc.data.financials);
      setWmMode(doc.data.wmMode);
      setWmText(doc.data.wmText);
      setWmLogo(doc.data.wmLogo);
      setWmIntensity(doc.data.wmIntensity);
      setWmSpacing(doc.data.wmSpacing);
      setWmSpread(doc.data.wmSpread);
    } catch (err) {
      toast.error(err);
    }
  };

  useEffect(() => {
    if (isEditMode) return;
    localStorage.setItem('docucraft_active_tab', activeTab);
    localStorage.setItem("docucraft_docType", JSON.stringify(docType));
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
    localStorage.setItem('docucraft_centerLogo', JSON.stringify(centerLogo));
  }, [activeTab, docType, company, client, docMeta, items, clauses, terms, financials, wmMode, wmText, wmLogo, wmIntensity, wmSpacing, wmSpread, centerLogo]);

  useEffect(() => {
    const isQuotation = docType === 'quotation';
    const isAgreement = docType === 'agreement';
    setDocMeta(prev => {
      let newNumber = prev.number || '';
      if (docType === 'invoice') newNumber = newNumber.replace('QT-', 'INV-').replace('AGR-', 'INV-');
      if (isQuotation) newNumber = newNumber.replace('INV-', 'QT-').replace('AGR-', 'QT-');
      if (isAgreement) newNumber = newNumber.replace('INV-', 'AGR-').replace('QT-', 'AGR-');
      return {
        ...prev,
        title: docType === 'invoice' ? 'TAX INVOICE' : isQuotation ? 'PRICE QUOTATION' : 'SERVICE AGREEMENT',
        number: newNumber
      };
    });
  }, [docType]);

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload/image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
      );
      const imageUrl = res.data.url;
      if (fieldName === "companyLogo") setCompany(prev => ({ ...prev, logo: imageUrl }));
      else if (fieldName === "companySignature") setCompany(prev => ({ ...prev, signature: imageUrl }));
      else if (fieldName === "companySeal") setCompany(prev => ({ ...prev, seal: imageUrl }));
      else if (fieldName === "wmLogo") setWmLogo(imageUrl);
    } catch (error) {
      toast.error("Image upload failed");
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

  const handleAddItem = () => setItems([...items, { id: Date.now(), name: '', description: '', qty: 1, price: 0, taxRate: 0 }]);
  const handleDeleteItem = (id) => setItems(items.filter(item => item.id !== id));
  const handleAddClause = () => setClauses([...clauses, { id: Date.now(), title: '', text: '' }]);
  const handleDeleteClause = (id) => setClauses(clauses.filter(clause => clause.id !== id));

  useEffect(() => {
    const autoSaveTimer = setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const docData = {
          docType,
          docNumber: docMeta.number,
          clientName: client.name,
          data: {
            company, client, docMeta, items, clauses, terms, financials,
            wmMode, wmText, wmLogo, wmIntensity, wmSpacing, wmSpread, centerLogo
          },
        };
        await axios.post("http://localhost:5000/api/documents/save", docData, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        toast.error("Auto-save failed:", err);
      }
    }, 30000);
    return () => clearTimeout(autoSaveTimer);
  }, [docType, company, client, docMeta, items, clauses, terms, financials, wmMode, wmText, wmLogo, wmIntensity, wmSpacing, wmSpread, centerLogo]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const docData = {
        docType,
        docNumber: docMeta.number,
        clientName: client.name,
        data: {
          company, client, docMeta, items, clauses, terms, financials,
          wmMode, wmText, wmLogo, wmIntensity, wmSpacing, wmSpread, centerLogo
        },
      };
      if (isEditMode) {
        await axios.put(
          `http://localhost:5000/api/documents/update/${id}`,
          docData,
          { withCredentials: true }
        );
        toast.success("Updated Successfully");
        setIsEditMode(false);
      } else {
        await axios.post(
          "http://localhost:5000/api/documents/save",
          docData,
          { withCredentials: true }
        );
        toast.success("Saved Successfully");
      }
    } catch (err) {
      toast.error("Save Failed");
    } finally {
      setIsSaving(false);
    }
  };

  const renderWatermarkLayer = () => {
    if (wmMode === 'disabled') return null;
    const opacity = wmIntensity / 100;
    const wmColor = '#d1d5db';

    if (wmMode === 'text_tiling' && wmText) {
      const fontSize = Math.max(12, Number(wmSpacing) / 4);
      const gap = Number(wmSpread) * 2;
      const textWidth = fontSize * 0.6 * wmText.length;
      const boxWidth = textWidth + gap;
      const boxHeight = fontSize + gap;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${boxWidth}" height="${boxHeight}" viewBox="0 0 ${boxWidth} ${boxHeight}">
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${wmColor}" font-size="${fontSize}px" font-family="Arial, sans-serif" font-weight="bold">${wmText}</text>
      </svg>`;
      return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2"
            style={{
              width: '300%', height: '300%', opacity: opacity,
              transform: 'translate(-50%, -50%) rotate(-35deg)',
              backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
              backgroundRepeat: 'repeat',
              backgroundPosition: 'center'
            }}
          />
        </div>
      );
    }
    if (wmMode === 'single_text' && wmText) {
      const fontSize = Math.max(20, Number(wmSpacing) / 3);
      return (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div style={{ opacity: opacity, transform: 'rotate(-45deg)', fontSize: `${fontSize}px`, color: wmColor, fontWeight: 'bold', letterSpacing: '5px', whiteSpace: 'nowrap' }}>
            {wmText}
          </div>
        </div>
      );
    }
    if (wmMode === 'single_logo' && wmLogo) {
      const logoSize = Math.max(50, Number(wmSpacing));
      return (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <img src={wmLogo} alt="Watermark Logo" style={{ opacity: opacity, width: `${logoSize}px`, objectFit: 'contain', transform: 'rotate(-35deg)' }} />
        </div>
      );
    }
    if (wmMode === 'logo_tiling' && wmLogo) {
      const imgSize = Math.max(20, Number(wmSpacing) / 4);
      const gap = Number(wmSpread);
      const containerSize = 2200;
      const itemSize = imgSize + gap;
      const cols = Math.ceil(containerSize / itemSize);
      const totalItems = cols * cols;
      return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 grid" style={{ width: `${containerSize}px`, height: `${containerSize}px`, opacity: opacity, transform: 'translate(-50%, -50%) rotate(-35deg)', gridTemplateColumns: `repeat(${cols}, ${imgSize}px)`, gap: `${gap}px`, justifyContent: 'center', alignContent: 'center' }}>
            {Array.from({ length: totalItems }).map((_, i) => (
              <img key={i} src={wmLogo} alt="wm-tile" style={{ width: `${imgSize}px`, height: `${imgSize}px`, objectFit: 'contain' }} />
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const WatermarkOption = ({ id, label, icon }) => {
    const isActive = wmMode === id;
    return (
      <div
        onClick={() => setWmMode(id)}
        className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${isActive ? 'border-[#8C4A28] dark:border-orange-500 bg-[#F8EFEA] dark:bg-orange-900/30' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${isActive ? 'border-transparent bg-white dark:bg-gray-800 shadow-sm text-[#8C4A28] dark:text-orange-400' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
            {icon}
          </div>
          <span className="font-extrabold text-[13px] text-gray-900 dark:text-white tracking-wide">{label}</span>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-[#8C4A28] dark:border-orange-400' : 'border-gray-300 dark:border-gray-600'}`}>
          {isActive && <div className="w-2.5 h-2.5 rounded-full bg-[#8C4A28] dark:bg-orange-400" />}
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-4 h-full bg-gray-100 dark:bg-gray-950 p-4 font-sans transition-colors duration-300">

      {/* ================= LEFT: CONTROL PANEL ================= */}
      <div className="w-[450px] bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 rounded-xl shadow-lg flex flex-col overflow-hidden transition-colors duration-300">

        <div className="flex overflow-x-auto bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 p-2 gap-2 hide-scrollbar shrink-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-colors ${activeTab === tab.toLowerCase() ? 'bg-blue-600 text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#FCFAF8] dark:bg-gray-900 transition-colors duration-300">

          {/* ================= COMPANY TAB ================= */}
          {activeTab === 'company' && (
            <div className="space-y-4">
              <div><label className="text-xs text-gray-500 dark:text-gray-400 font-bold">Company Name</label><input type="text" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" /></div>
              <div><label className="text-xs text-gray-500 dark:text-gray-400 font-bold">GST/VAT Number</label><input type="text" value={company.gst} onChange={(e) => setCompany({ ...company, gst: e.target.value })} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" /></div>
              <div><label className="text-xs text-gray-500 dark:text-gray-400 font-bold">Address</label><textarea value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm h-20 outline-none focus:border-blue-500" /></div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Company Logo</label>
                  {company.logo ? (
                    <div className="relative border border-gray-200 dark:border-gray-700 p-1 rounded-md bg-gray-50 dark:bg-gray-800 text-center">
                      <img src={company.logo} alt="Logo" className="h-10 mx-auto object-contain" />
                      <button onClick={() => setCompany({ ...company, logo: null })} className="text-[10px] text-red-500 dark:text-red-400 font-bold mt-1 hover:underline w-full">Remove</button>
                    </div>
                  ) : (
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'companyLogo')} className="text-[10px] w-full text-gray-500 dark:text-gray-400" />
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Signature</label>
                  {company.signature ? (
                    <div className="relative border border-gray-200 dark:border-gray-700 p-1 rounded-md bg-gray-50 dark:bg-gray-800 text-center">
                      <img src={company.signature} alt="Sign" className="h-10 mx-auto object-contain" />
                      <button onClick={() => setCompany({ ...company, signature: null })} className="text-[10px] text-red-500 dark:text-red-400 font-bold mt-1 hover:underline w-full">Remove</button>
                    </div>
                  ) : (
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'companySignature')} className="text-[10px] w-full text-gray-500 dark:text-gray-400" />
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Seal / Stamp</label>
                  {company.seal ? (
                    <div className="relative border border-gray-200 dark:border-gray-700 p-1 rounded-md bg-gray-50 dark:bg-gray-800 text-center">
                      <img src={company.seal} alt="Seal" className="h-10 mx-auto object-contain" />
                      <button onClick={() => setCompany({ ...company, seal: null })} className="text-[10px] text-red-500 dark:text-red-400 font-bold mt-1 hover:underline w-full">Remove</button>
                    </div>
                  ) : (
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'companySeal')} className="text-[10px] w-full text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= CLIENT TAB ================= */}
          {activeTab === 'client' && (
            <div className="space-y-4">
              <div><label className="text-xs text-gray-500 dark:text-gray-400 font-bold">Client Name</label><input type="text" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" /></div>
              <div><label className="text-xs text-gray-500 dark:text-gray-400 font-bold">Billing Address</label><textarea value={client.billingAddress} onChange={(e) => setClient({ ...client, billingAddress: e.target.value })} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm h-20 outline-none focus:border-blue-500" /></div>
            </div>
          )}

          {/* ================= DETAILS TAB ================= */}
          {activeTab === 'details' && (
            <div className="space-y-5">
              <div><label className="text-xs text-gray-500 dark:text-gray-400 font-bold">Document Title</label><input type="text" value={docMeta.title} onChange={(e) => setDocMeta({ ...docMeta, title: e.target.value })} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm font-bold outline-none focus:border-blue-500" /></div>
              <div className="flex gap-2">
                <div className="w-2/3"><label className="text-xs text-gray-500 dark:text-gray-400 font-bold">Document Number</label><input type="text" value={docMeta.number} onChange={(e) => setDocMeta({ ...docMeta, number: e.target.value })} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" /></div>
                <div className="w-1/3"><label className="text-xs text-gray-500 dark:text-gray-400 font-bold">Currency</label><input type="text" value={docMeta.currency || ''} onChange={(e) => setDocMeta({ ...docMeta, currency: e.target.value })} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm text-center outline-none focus:border-blue-500" placeholder="₹, $, €" /></div>
              </div>
              <div className="flex gap-2">
                <div className="w-1/2"><label className="text-xs text-gray-500 dark:text-gray-400 font-bold">Date</label><input type="date" value={docMeta.date} onChange={(e) => setDocMeta({ ...docMeta, date: e.target.value })} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" /></div>
                {docType !== 'agreement' && <div className="w-1/2"><label className="text-xs text-gray-500 dark:text-gray-400 font-bold">Due Date</label><input type="date" value={docMeta.dueDate} onChange={(e) => setDocMeta({ ...docMeta, dueDate: e.target.value })} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" /></div>}
              </div>
            </div>
          )}

          {/* ================= ITEMS TAB ================= */}
          {activeTab === 'items' && docType !== 'agreement' && (
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={item.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 space-y-2 shadow-sm relative transition-colors duration-300">
                  <button onClick={() => handleDeleteItem(item.id)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold hover:bg-red-600 shadow-md">X</button>
                  <input type="text" placeholder="Item Name" value={item.name} onChange={(e) => { const n = [...items]; n[idx].name = e.target.value; setItems(n); }} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white rounded text-sm font-bold outline-none focus:border-blue-500" />
                  <input type="text" placeholder="Description" value={item.description} onChange={(e) => { const n = [...items]; n[idx].description = e.target.value; setItems(n); }} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" />
                  <div className="flex gap-2">
                    <div className="w-1/3"><label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold">Qty</label><input type="number" value={item.qty} onChange={(e) => { const n = [...items]; n[idx].qty = Number(e.target.value); setItems(n); }} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" /></div>
                    <div className="w-1/3"><label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold">Price</label><input type="number" value={item.price} onChange={(e) => { const n = [...items]; n[idx].price = Number(e.target.value); setItems(n); }} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" /></div>
                    <div className="w-1/3"><label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold">Tax %</label><input type="number" value={item.taxRate} onChange={(e) => { const n = [...items]; n[idx].taxRate = Number(e.target.value); setItems(n); }} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" /></div>
                  </div>
                </div>
              ))}
              <button onClick={handleAddItem} className="w-full py-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold rounded-lg text-sm transition-colors border-dashed">
                + Add New Item
              </button>

              <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 transition-colors duration-300">
                <h3 className="text-xs font-bold text-gray-800 dark:text-white uppercase">Adjustments (Global)</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Discount</label>
                    <input type="number" value={financials.discount} onChange={(e) => setFinancials({ ...financials, discount: parseFloat(e.target.value) || 0 })} className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Tax (%)</label>
                    <input type="number" value={financials.taxRate} onChange={(e) => setFinancials({ ...financials, taxRate: parseFloat(e.target.value) || 0 })} className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Shipping</label>
                    <input type="number" value={financials.shipping} onChange={(e) => setFinancials({ ...financials, shipping: parseFloat(e.target.value) || 0 })} className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= CLAUSES TAB ================= */}
          {activeTab === 'clauses' && docType === 'agreement' && (
            <div className="space-y-4">
              {clauses.map((clause, idx) => (
                <div key={clause.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 space-y-2 shadow-sm relative">
                  <button onClick={() => handleDeleteClause(clause.id)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold hover:bg-red-600 shadow-md">X</button>
                  <input type="text" placeholder="Title" value={clause.title} onChange={(e) => { const n = [...clauses]; n[idx].title = e.target.value; setClauses(n); }} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white rounded text-sm font-bold outline-none focus:border-blue-500" />
                  <textarea placeholder="Clause text..." value={clause.text} onChange={(e) => { const n = [...clauses]; n[idx].text = e.target.value; setClauses(n); }} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white rounded text-sm h-20 outline-none focus:border-blue-500" />
                </div>
              ))}
              <button onClick={handleAddClause} className="w-full py-3 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 font-bold rounded-lg text-sm transition-colors border-dashed">
                + Add New Clause
              </button>
            </div>
          )}

          {/* ================= TERMS TAB ================= */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div><label className="text-xs text-gray-500 dark:text-gray-400 font-bold">Notes / Messages</label><textarea value={terms.notes} onChange={(e) => setTerms({ ...terms, notes: e.target.value })} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm h-16 outline-none focus:border-blue-500" /></div>
              <div><label className="text-xs text-gray-500 dark:text-gray-400 font-bold">Terms & Conditions</label><textarea value={terms.conditions} onChange={(e) => setTerms({ ...terms, conditions: e.target.value })} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm h-20 outline-none focus:border-blue-500" /></div>
              {docType !== 'agreement' && <div><label className="text-xs text-gray-500 dark:text-gray-400 font-bold">Bank / Payment Details</label><textarea value={terms.bankDetails} onChange={(e) => setTerms({ ...terms, bankDetails: e.target.value })} className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm h-24 outline-none focus:border-blue-500" /></div>}
            </div>
          )}

          {/* ================= BRANDING & WATERMARK TAB ================= */}
          {activeTab === 'branding' && (
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 overflow-hidden shadow-sm transition-colors duration-300">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F8EFEA] dark:bg-orange-900/30 text-[#8C4A28] dark:text-orange-400 flex items-center justify-center">
                      <Palette size={16} />
                    </div>
                    <span className="font-extrabold text-[13px] text-gray-900 dark:text-white tracking-wide">2. BRANDING SYSTEM</span>
                  </div>
                  <ChevronUp size={18} className="text-gray-500 dark:text-gray-400" />
                </div>

                <div className="p-6 space-y-8 bg-[#FCFAF8] dark:bg-gray-900">

                  {/* Theme Colors */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest mb-3 uppercase">Theme Color</label>
                      <div className="p-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:border-orange-500 transition-colors">
                        <input
                          type="color"
                          value={docMeta.themeColor}
                          onChange={(e) => setDocMeta({ ...docMeta, themeColor: e.target.value })}
                          className="w-full h-8 border-0 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest mb-3 uppercase">Paper Color</label>
                      <div className="p-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:border-orange-500 transition-colors">
                        <input
                          type="color"
                          value={docMeta.paperColor || '#FFFFFF'}
                          onChange={(e) => setDocMeta({ ...docMeta, paperColor: e.target.value })}
                          className="w-full h-8 border-0 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Color Palette */}
                  <div className="flex flex-wrap gap-2 justify-between">
                    {themeColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setDocMeta({ ...docMeta, themeColor: color })}
                        className={`w-6 h-6 rounded-full transition-all duration-200 shadow-sm ${docMeta.themeColor === color ? 'ring-2 ring-offset-2 ring-gray-800 dark:ring-gray-300 scale-110' : 'border border-gray-300 dark:border-gray-600 hover:scale-110'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <hr className="border-gray-200 dark:border-gray-700" />

                  {/* Security Overlays */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest mb-3 uppercase">Security Overlays</label>
                    <div
                      className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setCenterLogo(!centerLogo)}
                    >
                      <span className="font-extrabold text-[12px] text-gray-900 dark:text-white tracking-wide">CENTER LOGO</span>
                      <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 shadow-inner ${centerLogo ? 'bg-[#8C4A28] dark:bg-orange-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm ${centerLogo ? 'left-6' : 'left-1'}`}></div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-200 dark:border-gray-700" />

                  {/* Watermark Radio Cards */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest mb-3 uppercase">Watermark Synthesis</label>
                    <div className="space-y-3">
                      <WatermarkOption id="disabled" label="DISABLED" icon={<Maximize size={15} />} />
                      <WatermarkOption id="single_text" label="SINGLE TEXT" icon={<Type size={15} />} />
                      <WatermarkOption id="single_logo" label="SINGLE LOGO" icon={<ImageIcon size={15} />} />
                      <WatermarkOption id="text_tiling" label="TEXT TILING" icon={<Copy size={15} />} />
                      <WatermarkOption id="logo_tiling" label="LOGO TILING" icon={<Grid size={15} />} />
                    </div>
                  </div>

                  {/* Dynamic Sliders */}
                  {wmMode !== 'disabled' && (
                    <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm space-y-6">

                      {wmMode.includes('text') && (
                        <div>
                          <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest mb-2 uppercase">Watermark Text</label>
                          <input
                            type="text"
                            value={wmText}
                            onChange={(e) => setWmText(e.target.value.toUpperCase())}
                            className="w-full p-3.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-black tracking-widest text-gray-900 dark:text-white bg-[#FCFAF8] dark:bg-gray-900 shadow-inner focus:outline-none focus:border-[#8C4A28] dark:focus:border-orange-500 focus:ring-1 focus:ring-[#8C4A28] dark:focus:ring-orange-500 transition-all uppercase"
                          />
                        </div>
                      )}

                      {wmMode.includes('logo') && (
                        <div>
                          <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-wider mb-2 uppercase">Watermark Logo</label>
                          {wmLogo ? (
                            <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-[#FCFAF8] dark:bg-gray-900">
                              <img src={wmLogo} alt="Watermark" className="h-10 object-contain" />
                              <button onClick={() => setWmLogo(null)} className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded font-bold hover:bg-red-200 dark:hover:bg-red-900/50">Remove</button>
                            </div>
                          ) : (
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'wmLogo')} className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400" />
                          )}
                        </div>
                      )}

                      <hr className="border-gray-100 dark:border-gray-700" />

                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest uppercase">Pattern Intensity</label>
                            <span className="text-[11px] font-black text-[#8C4A28] dark:text-orange-400">{wmIntensity}%</span>
                          </div>
                          <input type="range" min="1" max="100" value={wmIntensity} onChange={(e) => setWmIntensity(e.target.value)} className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#8C4A28] dark:accent-orange-500" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest uppercase">Grain & Spacing</label>
                            <span className="text-[11px] font-black text-[#8C4A28] dark:text-orange-400">{wmSpacing}px</span>
                          </div>
                          <input type="range" min="10" max="800" value={wmSpacing} onChange={(e) => setWmSpacing(e.target.value)} className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#8C4A28] dark:accent-orange-500" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest uppercase">Font/Icon Spread</label>
                            <span className="text-[11px] font-black text-[#8C4A28] dark:text-orange-400">{wmSpread}</span>
                          </div>
                          <input type="range" min="0" max="100" value={wmSpread} onChange={(e) => setWmSpread(e.target.value)} className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#8C4A28] dark:accent-orange-500" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shrink-0 flex gap-3 transition-colors duration-300">
          <button onClick={handleSave} className={`w-1/2 text-white py-3 rounded-xl font-bold shadow-md transition-colors flex justify-center items-center gap-2
             ${isSaving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }`}>
            {isSaving
              ? "Saving..."
              : isEditMode
                ? "Update Document"
                : "Save Document"}
          </button>
          <button onClick={handleDownloadPdf} className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md transition-colors flex justify-center items-center gap-2">
            Download PDF
          </button>
        </div>
      </div>

      {/* ================= RIGHT: LIVE PDF PREVIEW ================= */}
      <div className="flex-1 bg-gray-300 dark:bg-gray-800 flex justify-center items-start rounded-xl overflow-y-auto p-8 shadow-inner transition-colors duration-300">

        {/* ================= PDF PAPER (এটি সব সময় লাইট/সাদা থাকবে) ================= */}
        <div
          ref={pdfRef}
          className="bg-white w-[210mm] min-h-[297mm] text-black shadow-2xl relative overflow-hidden"
          style={{ backgroundColor: docMeta.paperColor || '#FFFFFF' }}
        >
          {renderWatermarkLayer()}
          <div className="relative z-10 h-full w-full">
            <DocumentLayout
              docType={docType} company={company} client={client} docMeta={docMeta}
              items={items} clauses={clauses} terms={terms} financials={financials}
              centerLogo={centerLogo}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DocumentEditor;