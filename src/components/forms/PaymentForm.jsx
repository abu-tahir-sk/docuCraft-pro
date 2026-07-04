import { CreditCard } from "lucide-react";

export default function PaymentForm() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

      {/* Header */}

      <div className="flex items-center gap-3 p-5 border-b">

        <CreditCard className="text-blue-600" size={22} />

        <div>
          <h2 className="text-xl font-bold">
            Payment Information
          </h2>

          <p className="text-sm text-gray-500">
            Add payment details for this invoice.
          </p>
        </div>

      </div>

      {/* Body */}

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

        <div>
          <label className="block mb-2 font-medium">
            Payment Method
          </label>

          <select className="w-full border rounded-xl px-4 py-3">
            <option>Bank Transfer</option>
            <option>Cash</option>
            <option>Cheque</option>
            <option>UPI</option>
            <option>PayPal</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Bank Name
          </label>

          <input
            className="w-full border rounded-xl px-4 py-3"
            placeholder="State Bank of India"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Account Name
          </label>

          <input
            className="w-full border rounded-xl px-4 py-3"
            placeholder="Account Holder Name"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Account Number
          </label>

          <input
            className="w-full border rounded-xl px-4 py-3"
            placeholder="XXXXXXXXXXXX"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            IFSC / SWIFT Code
          </label>

          <input
            className="w-full border rounded-xl px-4 py-3"
            placeholder="SBIN000000"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Branch
          </label>

          <input
            className="w-full border rounded-xl px-4 py-3"
            placeholder="Branch Name"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            UPI ID
          </label>

          <input
            className="w-full border rounded-xl px-4 py-3"
            placeholder="example@upi"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Payment Reference
          </label>

          <input
            className="w-full border rounded-xl px-4 py-3"
            placeholder="Reference ID"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">
            Payment Notes
          </label>

          <textarea
            rows="4"
            className="w-full border rounded-xl px-4 py-3"
            placeholder="Write payment instructions..."
          ></textarea>
        </div>

      </div>

    </div>
  );
}