const docs = [
  {
    id: "INV-001",
    client: "ABC Company",
    type: "Invoice",
    date: "02 Jul 2026",
  },
  {
    id: "QT-002",
    client: "Tech World",
    type: "Quotation",
    date: "01 Jul 2026",
  },
  {
    id: "AGR-003",
    client: "Digital Hub",
    type: "Agreement",
    date: "30 Jun 2026",
  },
];

export default function RecentDocuments() {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-xl font-bold">
          Recent Documents
        </h2>

        <button className="text-blue-600 font-semibold">
          View All
        </button>

      </div>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="py-3 text-left">
              Document
            </th>

            <th className="text-left">
              Client
            </th>

            <th className="text-left">
              Type
            </th>

            <th className="text-left">
              Date
            </th>

          </tr>

        </thead>

        <tbody>

          {docs.map((doc) => (

            <tr
              key={doc.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="py-4 font-semibold">
                {doc.id}
              </td>

              <td>
                {doc.client}
              </td>

              <td>
                {doc.type}
              </td>

              <td>
                {doc.date}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}