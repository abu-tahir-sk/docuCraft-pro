import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Printer } from 'lucide-react';
import DocumentLayout from '../components/DocumentLayout';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ViewPdf = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://docu-craft-server.vercel.app/api/documents/${id}`, { withCredentials: true });
        setDoc(res.data);
        setLoading(false);
      } catch (err) {

        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  const handleDownload = async () => {

    const element = document.getElementById("pdf-content");

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(`${docMeta.number}.pdf`);
  };

  if (loading) return <div className="text-center mt-10">Loading Document...</div>;
  if (!doc) return <div className="text-center mt-10 text-red-500">Document not found!</div>;

  // ডেটাগুলো বের করে নিচ্ছি
  const { wmMode, wmText, wmLogo, wmIntensity, wmSpacing, wmSpread, docMeta } = doc.data || {};

  // ================= WATERMARK RENDERER (Editor-এর হুবহু সেম কোড) =================
  const renderWatermarkLayer = () => {
    if (!wmMode || wmMode === 'disabled') return null;
    const opacity = (wmIntensity || 9) / 100;
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
          <div className="absolute top-1/2 left-1/2 grid"
            style={{ width: `${containerSize}px`, height: `${containerSize}px`, opacity: opacity, transform: 'translate(-50%, -50%) rotate(-35deg)', gridTemplateColumns: `repeat(${cols}, ${imgSize}px)`, gap: `${gap}px`, justifyContent: 'center', alignContent: 'center' }}>
            {Array.from({ length: totalItems }).map((_, i) => (
              <img key={i} src={wmLogo} alt="wm-tile" style={{ width: `${imgSize}px`, height: `${imgSize}px`, objectFit: 'contain' }} />
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">

      {/* Top Action Bar */}
      <div className="no-print flex justify-between items-center mb-6 max-w-[210mm] mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-black transition font-semibold">
          <ArrowLeft size={20} /> Back
        </button>
        <button onClick={handleDownload} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition font-bold">
          <Printer size={20} /> Save as PDF
        </button>
      </div>

      {/* Perfect A4 Wrapper */}
      <div className="flex justify-center items-start overflow-x-auto pb-10">
        <div
          className="bg-white w-[210mm] min-h-[297mm] text-black shadow-2xl relative overflow-hidden mx-auto print:shadow-none print:w-full print:min-h-0 print:m-0"
          style={{ backgroundColor: docMeta?.paperColor || '#FFFFFF' }}
        >

          {/* নতুন পারফেক্ট ওয়াটারমার্ক লেয়ারটি এখানে দেওয়া হলো */}
          {renderWatermarkLayer()}

          {/* DocumentLayout-কে relative z-10 দিয়ে মোড়ানো হয়েছে যাতে ডিজাইন না ভাঙে */}
          <div id="pdf-content" className="relative z-10 h-full w-full ">
            <DocumentLayout
              docType={doc.docType}
              company={doc.data?.company || {}}
              client={doc.data?.client || {}}
              docMeta={{
                ...doc.data?.docMeta,
                number: doc.docNumber
              }}
              items={doc.data?.items || []}
              clauses={doc.data?.clauses || []}
              terms={doc.data?.terms || {}}
              financials={doc.data?.financials || {}} // Financials ডেটা পাঠানো হলো
              centerLogo={doc.data?.centerLogo}
            // এখানে wmMode পাঠানো হয়নি, যাতে ভেতরের পুরোনো ভাঙা ওয়াটারমার্কটি আর কাজ না করে
            />
          </div>

        </div>
      </div>

    </div>
  );
};

export default ViewPdf;