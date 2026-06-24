// ==========================================
// 1. থিম কালার সেটিংস
// ==========================================
export const themes = {
  blue: { 
    main: 'text-blue-600', 
    bg: 'bg-blue-600', 
    bgLight: 'bg-blue-50', 
    border: 'border-blue-600', 
    borderLight: 'border-blue-100', 
    fill: 'fill-blue-600', 
    activeTab: 'border-blue-600 text-blue-600 bg-blue-50/50' 
  },
  emerald: { 
    main: 'text-emerald-600', 
    bg: 'bg-emerald-600', 
    bgLight: 'bg-emerald-50', 
    border: 'border-emerald-600', 
    borderLight: 'border-emerald-100', 
    fill: 'fill-emerald-600', 
    activeTab: 'border-emerald-600 text-emerald-600 bg-emerald-50/50' 
  },
  slate: { 
    main: 'text-slate-800', 
    bg: 'bg-slate-800', 
    bgLight: 'bg-slate-100', 
    border: 'border-slate-800', 
    borderLight: 'border-slate-200', 
    fill: 'fill-slate-800', 
    activeTab: 'border-slate-800 text-slate-800 bg-slate-100/50' 
  },
  rose: { 
    main: 'text-rose-600', 
    bg: 'bg-rose-600', 
    bgLight: 'bg-rose-50', 
    border: 'border-rose-600', 
    borderLight: 'border-rose-100', 
    fill: 'fill-rose-600', 
    activeTab: 'border-rose-600 text-rose-600 bg-rose-50/50' 
  }
};

// ==========================================
// 2. তারিখ ফরম্যাট করার ফাংশন (যেমন: 24 Jun, 2026)
// ==========================================
export const formatDate = (dateString) => {
  if(!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
};

// ==========================================
// 3. পেমেন্ট স্ট্যাটাস অনুযায়ী ব্যাজের কালার দেওয়ার ফাংশন
// ==========================================
export const getStatusColor = (status) => {
  if(status === 'Paid') return 'bg-green-100 text-green-700 border-green-200';
  if(status === 'Partial') return 'bg-orange-100 text-orange-700 border-orange-200';
  return 'bg-red-100 text-red-700 border-red-200';
};

// ==========================================
// 4. নাম্বারকে কথায় (Amount in Words) কনভার্ট করার ফাংশন
// ==========================================
export const numberToWords = (num) => {
  if (num === 0) return 'Zero';
  const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
  
  // ইন্ডিয়ান নাম্বারিং সিস্টেম অনুযায়ী (লাখ, কোটি) কনভার্ট করার লজিক
  const n = ('000000000' + Math.floor(num)).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  
  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  
  return str.trim() + ' Only';
};