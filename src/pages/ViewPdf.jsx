import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Printer } from 'lucide-react';
import DocumentLayout from '../components/DocumentLayout';

const ViewPdf = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/documents/${id}`, { withCredentials: true });
        setDoc(res.data);
        console.log("PDF Data Received:", res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading document:", err);
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading Document...</div>;
  if (!doc) return <div className="text-center mt-10 text-red-500">Document not found!</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      
      {/* Top Action Bar (no-print hides it during printing) */}
      <div className="no-print flex justify-between items-center mb-6 max-w-[210mm] mx-auto">
        <button 
           onClick={() => navigate(-1)} 
           className="flex items-center gap-2 text-gray-600 hover:text-black transition font-semibold"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <button 
           onClick={() => window.print()} 
           className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition font-bold"
        >
          <Printer size={20} /> Save as PDF
        </button>
      </div>

      {/* Perfect A4 Wrapper (Exactly same as DocumentEditor Preview) */}
      <div className="flex justify-center items-start overflow-x-auto pb-10">
        <div className="bg-white w-[210mm] min-h-[297mm] text-black shadow-2xl relative overflow-hidden mx-auto print:shadow-none print:w-full print:min-h-0 print:m-0">
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
              
              // Watermark props with defaults to match editor state
              wmMode={doc.data?.wmMode || 'disabled'}
              wmText={doc.data?.wmText || ''}
              wmLogo={doc.data?.wmLogo || null}
              wmIntensity={doc.data?.wmIntensity || 9}
              wmSpacing={doc.data?.wmSpacing || 810}
              wmSpread={doc.data?.wmSpread || 20}
          />
        </div>
      </div>
      
    </div>
  );
};

export default ViewPdf;