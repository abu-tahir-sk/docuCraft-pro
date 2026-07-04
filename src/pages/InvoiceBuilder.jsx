import InvoiceForm from "../components/forms/InvoiceForm";
import PdfPreview from "../components/preview/PdfPreview";


export default function InvoiceBuilder() {
  return (
    <div className="grid grid-cols-12 gap-6">

      {/* Left Form */}

      <div className="col-span-7">

        <InvoiceForm />

      </div>

      {/* Right Preview */}

      <div className="col-span-5">

        <PdfPreview />

      </div>

    </div>
  );
}