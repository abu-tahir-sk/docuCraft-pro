import { useState } from "react";

import QuotationForm from "../../components/forms/QuotationForm";
import AgreementForm from "../../components/forms/AgreementForm";
import InvoiceBuilder from "../InvoiceBuilder";

export default function DocumentPage() {
  const [documentType, setDocumentType] = useState("invoice");

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white rounded-xl border p-5 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold">
            Documents
          </h2>

          <p className="text-gray-500">
            Create professional business documents.
          </p>
        </div>

        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="invoice">Invoice</option>
          <option value="quotation">Quotation</option>
          <option value="agreement">Agreement</option>
        </select>

      </div>

      {documentType === "invoice" && <InvoiceBuilder />}

      {documentType === "quotation" && <QuotationForm />}

      {documentType === "agreement" && <AgreementForm />}

    </div>
  );
}