import React from 'react';
import { motion } from 'framer-motion';
// react-icons/si (Simple Icons) থেকে জনপ্রিয় ব্র্যান্ডের লোগো ইমপোর্ট করা হলো
import { SiStripe, SiVercel, SiLinear, SiNotion, SiNetflix, SiDropbox } from 'react-icons/si';

const brands = [
  { name: 'Stripe', icon: SiStripe },
  { name: 'Vercel', icon: SiVercel },
  { name: 'Linear', icon: SiLinear },
  { name: 'Notion', icon: SiNotion },
  { name: 'Netflix', icon: SiNetflix },
  { name: 'Dropbox', icon: SiDropbox },
];

export default function Companies() {
  return (
    <section className="py-12 bg-white dark:bg-gray-950 border-b border-gray-50 dark:border-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm font-semibold text-gray-400 dark:text-gray-500 font-inter uppercase tracking-widest mb-8"
        >
          Trusted by innovative teams worldwide
        </motion.p>

        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-20">
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex justify-center"
            >
              <brand.icon 
                title={brand.name}
                className="text-4xl md:text-5xl text-gray-400 dark:text-gray-600 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:text-gray-900 dark:hover:text-white transition-all duration-300 cursor-pointer" 
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}