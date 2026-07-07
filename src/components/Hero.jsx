import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiPlayCircle, FiArrowRight } from 'react-icons/fi';

export default function Hero() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePrimaryClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Background Gradient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-br from-[#2563EB]/20 to-[#06B6D4]/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-5xl lg:text-6xl font-extrabold font-poppins text-gray-900 dark:text-white leading-tight tracking-tight mb-6">
              Create Professional{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
                Invoices, Quotations & Agreements
              </span>{' '}
              in Minutes.
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-inter mb-8 max-w-xl">
              Simplify your business workflow with one modern platform. Create, manage, save, and download professional business documents effortlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handlePrimaryClick}
                className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#4F46E5] text-white px-8 py-3.5 rounded-full font-semibold text-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
              >
                {user ? 'Go to Dashboard' : 'Get Started'}
                <FiArrowRight />
              </button>
              <button className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-8 py-3.5 rounded-full font-semibold text-lg transition-all shadow-sm">
                <FiPlayCircle className="text-xl" />
                Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Right Side - Real Dashboard Image with Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Mockup Card (With Image) */}
            <div className="relative rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/50 dark:border-gray-700 p-2 shadow-2xl">
              <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 shadow-inner flex items-center justify-center">
                 
                 {/* ========================================================= */}
                 {/* Dashboard Image - আপনার আসল ড্যাশবোর্ডের ছবির লিংক এখানে দিন */}
                 <img 
                   src="/dashbord.png" 
                   alt="DocuCraft Dashboard" 
                   className="w-full h-auto object-cover rounded-lg"
                 />
                 {/* ========================================================= */}

              </div>
            </div>

            {/* Floating Glass Cards */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -left-12 top-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 dark:border-gray-700 z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">✓</div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Invoice Paid</p>
                  <p className="text-xs text-gray-500">$2,400.00</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -right-8 bottom-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 dark:border-gray-700 z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">PDF</div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Generated</p>
                  <p className="text-xs text-gray-500">Agreement_Q3.pdf</p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}