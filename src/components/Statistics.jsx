import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Invoices Created', value: '10,000+' },
  { label: 'Active Businesses', value: '5,000+' },
  { label: 'PDF Downloads', value: '15,000+' },
  { label: 'Satisfaction Rate', value: '99%' },
];

export default function Statistics() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</h3>
            <p className="text-blue-50 text-sm md:text-base opacity-90">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}