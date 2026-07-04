import { User } from "lucide-react";

export default function ClientForm() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

      {/* Header */}

      <div className="flex items-center gap-3 p-5 border-b">

        <User className="text-blue-600" size={22} />

        <div>
          <h2 className="text-xl font-bold">
            Client Information
          </h2>

          <p className="text-sm text-gray-500">
            Select an existing client or create a new one.
          </p>
        </div>

      </div>

      {/* Body */}

      <div className="p-6">

        {/* Existing Client */}

        <div className="mb-6">

          <label className="block mb-2 font-medium">
            Existing Client
          </label>

          <select className="w-full border rounded-xl px-4 py-3">

            <option>Select Client</option>

            <option>ABC Company</option>

            <option>XYZ Pvt Ltd</option>

          </select>

        </div>

        {/* Form */}

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="block mb-2 font-medium">
              Client Name
            </label>

            <input
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Client Name"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Company Name
            </label>

            <input
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Company Name"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Email"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Phone
            </label>

            <input
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Phone"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              GST Number
            </label>

            <input
              className="w-full border rounded-xl px-4 py-3"
              placeholder="GST Number"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Country
            </label>

            <input
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Country"
            />

          </div>

          <div className="md:col-span-2">

            <label className="block mb-2 font-medium">
              Billing Address
            </label>

            <textarea
              rows="3"
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Billing Address"
            ></textarea>

          </div>

        </div>

      </div>

    </div>
  );
}