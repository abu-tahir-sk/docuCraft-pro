import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { User, Mail, Upload, Loader2, ArrowRight } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [image, setImage] = useState(null); // ইমেজ ইউআরএল সংরক্ষণের জন্য
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ইমেজ আপলোড হ্যান্ডলার
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // সাইজ চেক (২ এমবি এর নিচে)
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image size must be below 2MB!");
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      // আপনার সার্ভারের ইমেজ আপলোড API
      const res = await axios.post("https://docu-craft-server.vercel.app/api/upload/image", formData);
      setImage(res.data.url); // সার্ভার থেকে আসা ইমেজ URL
      toast.success("Profile picture uploaded!");
    } catch (err) {
      toast.error("Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Please upload a profile picture!");

    setLoading(true);
    try {
      
      await axios.post("https://docu-craft-server.vercel.app/api/auth/register", {
        ...form,
        profileImage: image
      });

      toast.success("Registration successful! An OTP has been sent to your email");
      navigate("/verify-email", { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="text-gray-500 text-sm mt-2">DocuCraft Join DocuCraft now.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ইমেজ আপলোড এরিয়া */}
          <div className="flex justify-center mb-6">
            <label className="relative cursor-pointer group">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 group-hover:border-blue-500 transition-all">
                {uploading ? <Loader2 className="animate-spin text-blue-500" /> : 
                 image ? <img src={image} className="w-full h-full object-cover" alt="Profile" /> : <Upload className="text-gray-400" />}
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          {/* ইনপুট ফিল্ডস */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input type="text" placeholder="Full Name" onChange={(e) => setForm({...form, name: e.target.value})} className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input type="email" placeholder="Email Address" onChange={(e) => setForm({...form, email: e.target.value})} className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>

          <button disabled={loading || uploading} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <>Register <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          
Already have an account?? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;