import {
  Building2,
  User,
  FileText,
  Package,
  Receipt,
  FileSignature,
} from "lucide-react";
import ItemsTable from "./ItemsTable";
import CompanyForm from "./CompanyForm";
import ClientForm from "./ClientForm";
import InvoiceDetails from "./InvoiceDetails";
import PaymentForm from "./PaymentForm";
import TermsForm from "./TermsForm";

const sections = [
  {
    title: "Company Information",
    icon: <Building2 size={18} />,
  },
  {
    title: "Client Information",
    icon: <User size={18} />,
  },
  {
    title: "Invoice Details",
    icon: <FileText size={18} />,
  },
  {
    title: "Items & Pricing",
    icon: <Package size={18} />,
  },
  {
    title: "Payment Information",
    icon: <Receipt size={18} />,
  },
  {
    title: "Terms & Conditions",
    icon: <FileSignature size={18} />,
  },
];

export default function InvoiceForm() {
  return (
    <div className="space-y-6">

      {/* Top Action Bar */}
      <div className="bg-white border rounded-2xl p-4 flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Create Invoice
        </h2>

        <div className="flex gap-3">

          <button className="px-5 py-2 rounded-lg border">
            Preview
          </button>

          <button className="px-5 py-2 rounded-lg bg-blue-600 text-white">
            Save
          </button>

          <button className="px-5 py-2 rounded-lg bg-green-600 text-white">
            Download PDF
          </button>

        </div>

      </div>

      {/* Form Sections */}

      {/* {sections.map((section, index) => (

        <div
          key={index}
          className="bg-white border rounded-2xl shadow-sm"
        >

          <div className="flex items-center gap-3 p-5 border-b">

            {section.icon}

            <h3 className="text-lg font-semibold">
              {section.title}
            </h3>

          </div>
          <CompanyForm />
          <ItemsTable />

          <div className="p-6">

            <div className="grid md:grid-cols-2 gap-5">

              <input
                className="border rounded-lg p-3"
                placeholder="Coming in next step..."
              />

              <input
                className="border rounded-lg p-3"
                placeholder="Coming in next step..."
              />

            </div>

          </div>

        </div>

      ))} */}
       {/* Form */}

      <CompanyForm />
      <ClientForm />
      <InvoiceDetails />

      <ItemsTable />
      <PaymentForm/>
      <TermsForm />


    </div>
  );
}