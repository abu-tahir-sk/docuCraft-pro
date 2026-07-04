import { FileText } from "lucide-react";

export default function InvoiceDetails() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

      {/* Header */}

      <div className="flex items-center gap-3 p-5 border-b">

        <FileText className="text-blue-600" size={22} />

        <div>
          <h2 className="text-xl font-bold">
            Invoice Details
          </h2>

          <p className="text-sm text-gray-500">
            Configure invoice information.
          </p>
        </div>

      </div>

      {/* Body */}

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

        <div>
          <label className="block mb-2 font-medium">
            Invoice Number
          </label>

          <input
            type="text"
            placeholder="INV-0001"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Reference Number
          </label>

          <input
            type="text"
            placeholder="REF-001"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Invoice Date
          </label>

          <input
            type="date"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Due Date
          </label>

          <input
            type="date"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Currency
          </label>

          <select className="w-full border rounded-xl px-4 py-3">
            <option>INR (₹)</option>
            <option>USD ($)</option>
            <option>EUR (€)</option>
            <option>GBP (£)</option>
            <option>BDT (৳)</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Status
          </label>

          <select className="w-full border rounded-xl px-4 py-3">
            <option>Draft</option>
            <option>Pending</option>
            <option>Paid</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Payment Terms
          </label>

          <select className="w-full border rounded-xl px-4 py-3">
            <option>Due on Receipt</option>
            <option>7 Days</option>
            <option>15 Days</option>
            <option>30 Days</option>
            <option>60 Days</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Sales Person
          </label>

          <input
            type="text"
            placeholder="Sales Person"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

      </div>

    </div>
  );
}