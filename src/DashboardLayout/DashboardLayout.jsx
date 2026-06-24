import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { themes, numberToWords } from '../utils'; // utils ফাইল থেকে থিম ইম্পোর্ট করুন

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('docucraft_active_user'));


  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const [activeTab, setActiveTab] = useState('info'); 
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef(null);

  // App States (যেগুলো Sidebar এবং Preview তে লাগবে)
  const [docType, setDocType] = useState('invoice');
  const [settings, setSettings] = useState({ themeColor: 'blue', customCols: [] });
  const [labels, setLabels] = useState({ billedTo: 'BILLED TO', invoiceDetails: 'DOCUMENT DETAILS' }); // Add other labels as needed
  const [meta, setMeta] = useState({ id: 'INV-001', date: new Date().toISOString().split('T')[0], dueDate: new Date().toISOString().split('T')[0], currency: '₹', paymentTerms: '15 Days', poNumber: '', status: 'Unpaid', subject: '' });
  const [from, setFrom] = useState({ name: 'Your Company', email: '', phone: '', address: '', website: '', taxId: '', logo: null, signature: null, seal: null });
  const [to, setTo] = useState({ name: 'Client Name', email: '', phone: '', address: '', taxId: '' });
  const [items, setItems] = useState([{ id: 1, desc: 'Service', qty: 1, rate: 1000, custom: {} }]);
  const [financials, setFinancials] = useState({ taxRate: 18, discount: 0, shipping: 0 });
  const [payment, setPayment] = useState({ bankName: '', accountName: '', accountNo: '', ifsc: '', upiName: '', upiNumber: '', pan: '', gstin: '', qrCode: null });
  const [texts, setTexts] = useState({ notes: '', latePolicy: '' });
  const [blocks, setBlocks] = useState([]);
  const [savedDocs, setSavedDocs] = useState([]);

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  const taxAmount = (subtotal - financials.discount) * (financials.taxRate / 100);
  const shippingAmt = parseFloat(financials.shipping) || 0;
  const total = subtotal - financials.discount + taxAmount + shippingAmt;
  const amountInWords = numberToWords ? numberToWords(total) : '';

  const theme = themes ? (themes[settings.themeColor] || themes.blue) : {};

  // Grouped Data to pass as Context/Props
  const appState = { docType, settings, labels, meta, from, to, items, financials, payment, texts, blocks };
  const appSetters = { setDocType, setSettings, setLabels, setMeta, setFrom, setTo, setItems, setFinancials, setPayment, setTexts, setBlocks };
  const calculated = { subtotal, taxAmount, shippingAmt, total, amountInWords };

  const actions = {
    handleDocTypeChange: (type) => setDocType(type),
    handleItemChange: (index, field, value) => { const n = [...items]; n[index][field] = value; setItems(n); },
    addItem: () => setItems([...items, { id: Date.now(), desc: '', qty: 1, rate: 0, custom: {} }]),
    removeItem: (index) => setItems(items.filter((_, i) => i !== index)),
  };

  const handleLogout = () => {
    localStorage.removeItem('docucraft_active_user');
    setCurrentUser(null);
    navigate("/");
  };

  const handleSaveDocument = () => {
    // Save Logic Here
    alert("Saved successfully!");
  };

  const downloadPDF = () => {
    // PDF Generate Logic Here
  };

  const loadDocument = (doc) => { /* Load logic */ };
  const deleteDocument = (id) => { /* Delete logic */ };

  return (
    <div className="h-screen w-screen flex flex-col font-sans bg-[#eef2f6] overflow-hidden">
      <Header 
       theme={theme} 
      currentUser={currentUser} 
      handleLogout={handleLogout} 
      handleSaveDocument={handleSaveDocument} 
      downloadPDF={downloadPDF} 
      isGenerating={isGenerating} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      savedDocsCount={savedDocs.length}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
        theme={theme} 
        themes={themes} 
        appState={appState}        
        appSetters={appSetters}    
        actions={actions}           
        savedDocs={savedDocs} 
        loadDocument={loadDocument} 
        deleteDocument={deleteDocument} 
        calculated={calculated}
        />
        
        
        <Outlet context={{ pdfRef, theme, appState, calculated }} />
        
      </div>
    </div>
  );
};

export default DashboardLayout;