import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { id: '01', title: 'Create Company', desc: 'Setup your business profile in seconds.' },
  { id: '02', title: 'Create Client', desc: 'Add your client details effortlessly.' },
  { id: '03', title: 'Generate Document', desc: 'Create invoices, quotes, or agreements.' },
  { id: '04', title: 'Save & Manage', desc: 'Securely store and track your files.' },
  { id: '05', title: 'Download PDF', desc: 'Get professional PDFs instantly.' },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white font-poppins mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            A simple 5-step process to professionalize your business workflow.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-6 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                {step.id}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 font-poppins">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-inter">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}