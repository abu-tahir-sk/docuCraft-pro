import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiBriefcase, FiUsers, FiSave, FiDownload, FiShield } from 'react-icons/fi';

const features = [
  { icon: FiFileText, title: 'Invoice Generator', desc: 'Create stunning, professional invoices that get you paid faster.' },
  { icon: FiBriefcase, title: 'Quotation Generator', desc: 'Send winning quotes and estimates that impress your clients.' },
  { icon: FiUsers, title: 'Client Management', desc: 'Keep track of all your clients, histories, and data in one secure place.' },
  { icon: FiSave, title: 'Save Documents', desc: 'Never lose a file again. Securely save drafts and finalized documents.' },
  { icon: FiDownload, title: 'PDF Export', desc: 'Export any document to a high-quality PDF with a single click.' },
  { icon: FiShield, title: 'Secure Storage', desc: 'Enterprise-grade security ensuring your business data is safe.' },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#2563EB] font-semibold tracking-wide uppercase text-sm mb-3">Powerful Features</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white font-poppins">
            Everything you need to scale your business
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-[#2563EB]/5 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feat.icon className="text-2xl text-[#2563EB]" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 font-poppins">
                {feat.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 font-inter leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}