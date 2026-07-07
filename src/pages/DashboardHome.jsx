import React from 'react';
import { FileText, FileSpreadsheet, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

export default function DashboardHome() {
  const cards = [
    { title: "Total Invoices", value: "24", color: "bg-blue-600", icon: <FileSpreadsheet /> },
    { title: "Total Quotations", value: "12", color: "bg-green-600", icon: <FileText /> },
    { title: "Active Agreements", value: "8", color: "bg-purple-600", icon: <ShieldCheck /> },
    { title: "Pending", value: "4", color: "bg-orange-500", icon: <Clock /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 transition-colors duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                <h2 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{card.value}</h2>
              </div>
              <div className={`${card.color} w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-sm`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Documents */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-300">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Documents</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 dark:text-gray-500 text-xs uppercase border-b border-gray-100 dark:border-gray-800">
                  <th className="pb-3">Doc ID</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 font-bold">INV-00{i}</td>
                    <td className="py-4">Client {i}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md text-[10px] font-bold">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-300">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
          <div className="space-y-4">
            {["New Invoice", "New Quotation", "New Agreement"].map((action, idx) => (
              <button key={idx} className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-200 rounded-xl transition-colors font-semibold border border-transparent hover:border-blue-100 dark:hover:border-blue-800/30">
                {action}
                <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}