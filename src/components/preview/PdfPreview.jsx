export default function PdfPreview() {
  return (
    <div className="bg-gray-100 rounded-2xl border h-full">

      <div className="border-b bg-white p-4">

        <h2 className="font-bold text-lg">
          Live PDF Preview
        </h2>

      </div>

      <div className="flex items-center justify-center h-[900px]">

        <div className="w-[210mm] h-[297mm] bg-white shadow-xl scale-[0.55] origin-top">

          <div className="p-12">

            <h1 className="text-4xl font-bold">

              INVOICE

            </h1>

            <hr className="my-6"/>

            <p>Company Name</p>

            <p>Client Name</p>

            <p>Invoice Number</p>

            <p>Date</p>

          </div>

        </div>

      </div>

    </div>
  );
}