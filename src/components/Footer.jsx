import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiLinkedin, FiGithub, FiArrowUp } from 'react-icons/fi';

export default function Footer() {
  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2" onClick={scrollToTop}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white font-bold text-xl">
                D
              </div>
              <span className="font-poppins font-bold text-xl text-gray-900 dark:text-white">
                DocuFlow
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 font-inter text-sm leading-relaxed max-w-sm">
              Simplify your business workflow with our premium document management system. Create, track, and download enterprise-grade invoices, quotes, and agreements instantly.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-4 mt-2">
              {[
                { icon: FiTwitter, href: '#' },
                { icon: FiLinkedin, href: '#' },
                { icon: FiGithub, href: '#' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-white hover:border-[#2563EB] shadow-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  <social.icon className="text-base" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white font-poppins uppercase tracking-wider mb-4">
              Products
            </h4>
            <ul className="space-y-3 font-inter text-sm">
              {[
                { text: 'Invoice Generator', path: '#' },
                { text: 'Quotation Generator', path: '#' },
                { text: 'Agreement Creator', path: '#' },
                { text: 'Pricing Plans', path: '#pricing' }
              ].map((link, idx) => (
                <li key={idx}>
                  <a href={link.path} className="text-gray-600 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-white transition-colors duration-200">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white font-poppins uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-3 font-inter text-sm">
              {[
                { text: 'Features', path: '#features' },
                { text: 'About Us', path: '#about' },
                { text: 'Privacy Policy', path: '#' },
                { text: 'Terms of Service', path: '#' }
              ].map((link, idx) => (
                <li key={idx}>
                  <a href={link.path} className="text-gray-600 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-white transition-colors duration-200">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Address */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white font-poppins uppercase tracking-wider mb-4">
              Contact Info
            </h4>
            <ul className="space-y-4 font-inter text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-[#2563EB] text-lg mt-0.5 shrink-0" />
                <span>
                  123 Business Suite, Tower B,<br />
                  Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-[#2563EB] text-lg shrink-0" />
                <a href="mailto:support@docuflow.com" className="hover:text-[#2563EB] transition-colors">
                  support@docuflow.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-[#2563EB] text-lg shrink-0" />
                <a href="tel:+880123456789" className="hover:text-[#2563EB] transition-colors">
                  +880 1234-56789
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Divider, Copyright and Back to Top */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-inter text-xs text-gray-500 dark:text-gray-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} DocuFlow Inc. All rights reserved. Built for professional businesses.
          </p>
          
          {/* Back To Top Button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 font-inter text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-white transition-all bg-white dark:bg-gray-900 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            Back to top
            <FiArrowUp className="animate-bounce" />
          </button>
        </div>

      </div>
    </footer>
  );
}