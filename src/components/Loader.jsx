import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-transparent">
      <div className="relative flex justify-center items-center">
        {/* পেছনের পালসিং শ্যাডো ইফেক্ট */}
        <div className="absolute w-20 h-20 rounded-full bg-blue-500 opacity-20 animate-ping"></div>
        
        {/* মূল স্পিনার (গ্রেডিয়েন্ট বর্ডার) */}
        <div className="relative w-16 h-16 rounded-full animate-spin border-4 border-solid border-blue-600 border-t-transparent shadow-lg"></div>
        
        {/* ভেতরের ছোট ডট */}
        <div className="absolute w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
      </div>

      {/* লোডিং টেক্সট */}
      <h2 className="mt-8 text-lg font-medium text-gray-700 dark:text-gray-200 animate-pulse tracking-widest">
        LOADING...
      </h2>
      
      {/* নিচে ছোট তিনটি ডট বাউন্স ইফেক্ট */}
      <div className="flex space-x-2 mt-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default Loader;