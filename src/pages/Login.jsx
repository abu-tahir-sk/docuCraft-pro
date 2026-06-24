import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Lock } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();

  // যদি ইউজার আগে থেকেই লগইন করা থাকে, তাহলে সরাসরি ড্যাশবোর্ডে পাঠিয়ে দাও
  useEffect(() => {
    const activeUser = localStorage.getItem('docucraft_active_user');
    if (activeUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLoginMode) {
        // --- LOGIN API CALL ---
        const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        
        if (response.data.success) {
          // লগইন সফল হলে টোকেন এবং ইমেইল লোকাল স্টোরেজে সেভ করা
          localStorage.setItem('docucraft_token', response.data.token);
          localStorage.setItem('docucraft_active_user', response.data.email);
          
          // সফল লগইনের পর ড্যাশবোর্ডে রিডাইরেক্ট করা
          navigate('/dashboard');
        }
      } else {
        // --- SIGNUP API CALL ---
        const response = await axios.post('http://localhost:5000/api/auth/register', { email, password });
        
        if (response.data.success) {
          alert('Registration successful! Please login.');
          setIsLoginMode(true); // সাইনআপের পর লগইন মুডে নিয়ে যাওয়া
          setPassword(''); // সিকিউরিটির জন্য পাসওয়ার্ড ক্লিয়ার করা
        }
      }
    } catch (error) {
      // ব্যাকএন্ড থেকে আসা এরর মেসেজ দেখানো
      setErrorMsg(error.response?.data?.message || 'Something went wrong. Server might be down.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#eef2f6]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px] text-center border border-gray-100">
        
        {/* Logo Icon */}
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
          <FileText size={32} />
        </div>
        
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">DocuCraft Pro</h1>
        <p className="text-sm text-gray-500 mb-6">
          {isLoginMode ? 'Login to access your workspace' : 'Create a new account'}
        </p>
        
        {/* Error Message Display */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-lg mb-4 text-left border border-red-100">
            ⚠️ {errorMsg}
          </div>
        )}
        
        {/* Login / Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="you@company.com" 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg mt-4 shadow-md transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Lock size={16} />} 
            {loading ? 'Processing...' : (isLoginMode ? 'Login to Dashboard' : 'Sign Up Now')}
          </button>
        </form>

        {/* Toggle Login / Signup */}
        <p className="text-xs text-gray-500 mt-6 text-center font-medium">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => { setIsLoginMode(!isLoginMode); setErrorMsg(''); }} 
            className="text-blue-600 hover:underline font-bold"
          >
            {isLoginMode ? 'Sign Up' : 'Login Here'}
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;