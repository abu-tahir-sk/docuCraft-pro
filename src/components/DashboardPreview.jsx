import React from 'react';
import { motion } from 'framer-motion';
import { FiLayout, FiPieChart, FiFileText, FiUsers, FiActivity } from 'react-icons/fi';

export default function DashboardPreview() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white font-poppins mb-4">
            A Dashboard Built for Professionals
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Experience the simplicity of managing your business documents with our intuitive, data-driven dashboard.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 p-2"
        >
          {/* Dashboard Content */}
          <div className="flex h-[500px] rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-950">
            
            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 hidden md:block">
              <div className="flex items-center gap-2 mb-10">
                <div className="w-6 h-6 bg-[#2563EB] rounded-md"></div>
                <span className="font-bold text-gray-900 dark:text-white">DocuFlow</span>
              </div>
              <ul className="space-y-4">
                {[FiLayout, FiPieChart, FiFileText, FiUsers, FiActivity].map((Icon, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400 hover:text-[#2563EB] cursor-pointer transition-colors">
                    <Icon /> <div className="h-2 w-24 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Area */}
            <div className="flex-1 p-8 overflow-hidden">
              <div className="grid grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse"></div>
                ))}
              </div>
              <div className="h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}