import React from 'react';
import { FiCheck } from 'react-icons/fi';

const plans = [
  { name: 'Free', price: '$0', features: ['3 Documents/mo', 'Basic Templates', 'Community Support'] },
  { name: 'Pro', price: '$29', features: ['Unlimited Documents', 'Premium Templates', 'Priority Support', 'Custom Branding'], popular: true },
  { name: 'Business', price: '$99', features: ['All Pro Features', 'Team Access', 'API Access', 'Dedicated Manager'] },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Simple, Transparent Pricing</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div key={i} className={`p-8 rounded-2xl border ${plan.popular ? 'border-[#2563EB] shadow-xl' : 'border-gray-200'} relative`}>
              {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white px-3 py-1 rounded-full text-xs font-bold">MOST POPULAR</span>}
              <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
              <div className="text-4xl font-bold mb-6">{plan.price}<span className="text-base text-gray-500">/mo</span></div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2"><FiCheck className="text-[#2563EB]" /> {f}</li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-lg font-bold transition ${plan.popular ? 'bg-[#2563EB] text-white' : 'bg-gray-100'}`}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}