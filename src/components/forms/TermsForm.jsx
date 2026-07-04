import { FileSignature, Upload } from "lucide-react";

export default function TermsForm() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

      {/* Header */}

      <div className="flex items-center gap-3 p-5 border-b">

        <FileSignature className="text-blue-600" size={22} />

        <div>
          <h2 className="text-xl font-bold">
            Terms & Notes
          </h2>

          <p className="text-sm text-gray-500">
            Add terms, notes and signature for this document.
          </p>

        </div>

      </div>

      {/* Body */}

      <div className="p-6 space-y-6">

        {/* Terms */}

        <div>

          <label className="block font-medium mb-2">
            Terms & Conditions
          </label>

          <textarea
            rows={5}
            className="w-full border rounded-xl p-4"
            placeholder="Write your terms and conditions..."
          />

        </div>

        {/* Notes */}

        <div>

          <label className="block font-medium mb-2">
            Notes
          </label>

          <textarea
            rows={4}
            className="w-full border rounded-xl p-4"
            placeholder="Additional notes..."
          />

        </div>

        {/* Upload */}

        <div className="grid md:grid-cols-3 gap-5">

          <div>

            <label className="block font-medium mb-2">
              Signature
            </label>

            <label className="border-2 border-dashed rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">

              <Upload size={26} />

              <span className="mt-2 text-sm">
                Upload Signature
              </span>

              <input type="file" className="hidden" />

            </label>

          </div>

          <div>

            <label className="block font-medium mb-2">
              Company Seal
            </label>

            <label className="border-2 border-dashed rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">

              <Upload size={26} />

              <span className="mt-2 text-sm">
                Upload Seal
              </span>

              <input type="file" className="hidden" />

            </label>

          </div>

          <div>

            <label className="block font-medium mb-2">
              Attachment
            </label>

            <label className="border-2 border-dashed rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">

              <Upload size={26} />

              <span className="mt-2 text-sm">
                Upload File
              </span>

              <input type="file" className="hidden" />

            </label>

          </div>

        </div>

      </div>

    </div>
  );
}