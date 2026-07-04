import { Building2, Upload } from "lucide-react";

export default function CompanyForm() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

      {/* Header */}

      <div className="flex items-center gap-3 p-5 border-b">

        <Building2 className="text-blue-600" size={22} />

        <div>
          <h2 className="text-xl font-bold">
            Company Information
          </h2>

          <p className="text-sm text-gray-500">
            This information will appear on every document.
          </p>
        </div>

      </div>

      {/* Body */}

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

        <div>
          <label className="block mb-2 font-medium">
            Company Name
          </label>

          <input
            className="w-full border rounded-xl px-4 py-3"
            placeholder="ABC Pvt Ltd"
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
            Email
          </label>

          <input
            className="w-full border rounded-xl px-4 py-3"
            placeholder="company@email.com"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Phone
          </label>

          <input
            className="w-full border rounded-xl px-4 py-3"
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Website
          </label>

          <input
            className="w-full border rounded-xl px-4 py-3"
            placeholder="www.company.com"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            PAN Number
          </label>

          <input
            className="w-full border rounded-xl px-4 py-3"
            placeholder="PAN Number"
          />
        </div>

        <div className="md:col-span-2">

          <label className="block mb-2 font-medium">
            Address
          </label>

          <textarea
            rows="3"
            className="w-full border rounded-xl px-4 py-3"
            placeholder="Company Address"
          ></textarea>

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Company Logo
          </label>

          <label className="border-2 border-dashed rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">

            <Upload size={28} />

            <span className="text-sm mt-2">
              Upload Logo
            </span>

            <input
              type="file"
              className="hidden"
            />

          </label>

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Company Seal
          </label>

          <label className="border-2 border-dashed rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">

            <Upload size={28} />

            <span className="text-sm mt-2">
              Upload Seal
            </span>

            <input
              type="file"
              className="hidden"
            />

          </label>

        </div>

      </div>

    </div>
  );
}