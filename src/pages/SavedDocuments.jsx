
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SavedDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/documents/my-documents', {
          withCredentials: true
        });
        setDocuments(response.data);
      } catch (error) {
        toast.error("Failed to load documents");
      }
    };
    fetchDocuments();
  }, []);

  // Document Delete korar function
  const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this document?")) {
    try {
      // এখানে খেয়াল করুন 'withCredentials: true' যোগ করা হয়েছে
      await axios.delete(`http://localhost:5000/api/documents/delete/${id}`, { 
        withCredentials: true 
      });
      
      setDocuments(documents.filter(doc => doc._id !== id));
      toast.success("Deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error.response || error);
      toast.error("Unauthorized: Please login again.");
    }
  }
};
const handleViewPdf = (doc) => {
  
  navigate(`/dashboard/view-pdf/${doc._id}`, );
};

  // const handleDelete = async (id) => {
  //   if (window.confirm("Are you sure you want to delete this document?")) {
  //     try {
  //       await axios.delete(`http://localhost:5000/api/documents/delete/${id}`, { withCredentials: true });
  //       setDocuments(documents.filter(doc => doc._id !== id)); // লোকাল স্টেট থেকে রিমুভ
  //       toast.success("Deleted successfully!");
  //     } catch (error) {
  //       toast.error("Failed to delete!");
  //     }
  //   }

  // };

  return (
    <div className="p-8 bg-gray-100 min-h-screen font-sans w-full">

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">

        {/* Header Section */}
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-wide">Saved Documents</h2>
            <p className="text-sm text-gray-500 mt-1">Manage all your generated Invoices, Quotations, and Agreements.</p>
          </div>
          <div className="text-sm font-bold text-gray-500">
            Total Saved: {documents.length}
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white text-gray-400 text-xs uppercase tracking-widest border-b border-gray-200">
              <tr>
                <th className="p-5 font-bold">Doc Number</th>
                <th className="p-5 font-bold">Client Name</th>
                <th className="p-5 font-bold">Document Type</th>
                <th className="p-5 font-bold">Created Date</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">

              {/* Jodi kono data na thake */}
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500 font-medium">
                    No documents saved yet. Go generate a new PDF!
                  </td>
                </tr>
              ) : (

                /* Saved Data gulor list loop kora hocche */
                documents.map((doc) => (
                  <tr key={doc._id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">

                    <td className="p-5 font-bold text-gray-800">{doc.docNumber}</td>

                    <td className="p-5 font-bold text-gray-700">{doc.clientName}</td>

                    <td className="p-5">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${doc.docType === 'invoice' ? 'bg-blue-100 text-blue-700' :
                          doc.docType === 'quotation' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                        }`}>
                        {doc.docType}
                      </span>
                    </td>

                    <td className="p-5 text-gray-600 font-medium">{doc.date}</td>

                    <td className="p-5 text-right space-x-4">
                      {/* View button (Future e PDF open korar jonno kaj korbe) */}
                      <button
                        onClick={() => handleViewPdf(doc)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                      >
                        View PDF
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/edit-document/${doc._id}`)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id)} // _id ব্যবহার করবেন
                        className="text-red-500 hover:text-red-700 font-bold text-sm"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default SavedDocuments;