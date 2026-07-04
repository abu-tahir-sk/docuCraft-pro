import { Plus, Copy, Trash2 } from "lucide-react";

export default function ItemsTable() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between p-5 border-b">

        <div>

          <h2 className="text-xl font-bold">
            Items & Services
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Add products or services to this invoice.
          </p>

        </div>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl">

          <Plus size={18} />

          Add Item

        </button>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-4 py-3 text-left">Description</th>

              <th className="px-4 py-3">Qty</th>

              <th className="px-4 py-3">Unit</th>

              <th className="px-4 py-3">Price</th>

              <th className="px-4 py-3">Tax</th>

              <th className="px-4 py-3">Discount</th>

              <th className="px-4 py-3">Amount</th>

              <th className="px-4 py-3">Action</th>

            </tr>

          </thead>

          <tbody>

            <tr className="border-b">

              <td className="p-3">

                <input
                  type="text"
                  placeholder="Product or Service"
                  className="w-full border rounded-lg px-3 py-2"
                />

              </td>

              <td className="p-3">

                <input
                  type="number"
                  defaultValue="1"
                  className="w-20 border rounded-lg px-3 py-2"
                />

              </td>

              <td className="p-3">

                <select className="border rounded-lg px-3 py-2">

                  <option>PCS</option>

                  <option>KG</option>

                  <option>Box</option>

                  <option>Hour</option>

                </select>

              </td>

              <td className="p-3">

                <input
                  type="number"
                  placeholder="0.00"
                  className="w-28 border rounded-lg px-3 py-2"
                />

              </td>

              <td className="p-3">

                <input
                  type="number"
                  placeholder="18%"
                  className="w-20 border rounded-lg px-3 py-2"
                />

              </td>

              <td className="p-3">

                <input
                  type="number"
                  placeholder="0"
                  className="w-20 border rounded-lg px-3 py-2"
                />

              </td>

              <td className="font-semibold text-center">

                ₹0.00

              </td>

              <td>

                <div className="flex justify-center gap-2">

                  <button className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100">

                    <Copy size={18} />

                  </button>

                  <button className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600">

                    <Trash2 size={18} />

                  </button>

                </div>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="border-t p-6 flex justify-end">

        <div className="w-96 space-y-3">

          <div className="flex justify-between">

            <span>Subtotal</span>

            <strong>₹0.00</strong>

          </div>

          <div className="flex justify-between">

            <span>Total Tax</span>

            <strong>₹0.00</strong>

          </div>

          <div className="flex justify-between">

            <span>Discount</span>

            <strong>₹0.00</strong>

          </div>

          <div className="border-t pt-3 flex justify-between text-lg">

            <strong>Grand Total</strong>

            <strong className="text-blue-600">

              ₹0.00

            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}