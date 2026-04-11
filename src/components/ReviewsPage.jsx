import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ArrowLeft, Star, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config'; // Using your centralized config

const ReviewsPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hoverRate, setHoverRate] = useState(0);
  const [status, setStatus] = useState({ type: '', msg: '' });
  
  const [formData, setFormData] = useState({ 
    name: '', 
    institute: '', 
    comment: '', 
    rate: 5 
  });

  // UPDATED: Fixed endpoints based on OpenAPI schema
  const GET_REVIEWS_URL = `${API_BASE_URL}/review/get-top`;
  const INSERT_REVIEW_URL = `${API_BASE_URL}/review/insert`;

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      // Added 'top' param as per schema (default 20)
      const response = await axios.get(GET_REVIEWS_URL, {
        params: { top: 30 } 
      });
      
      // Schema says: {id: [name, institute, comment, rate]}
      const reviewData = Object.values(response.data);
      // Reversing to show latest first
      setReviews(reviewData.reverse());
    } catch (err) {
      console.error("Fetch Error:", err);
      setStatus({ type: 'error', msg: 'Could not sync with the Review Vault.' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (formData.name.trim().length < 2) return "Name is too short.";
    if (formData.institute.trim().length < 2) return "Institute name is too short.";
    if (formData.comment.trim().length < 5) return "Comment must be at least 5 characters.";
    if (formData.name.length > 50 || formData.institute.length > 50) return "Name/Institute exceeds 50 chars.";
    if (formData.comment.length > 1000) return "Comment exceeds 1000 characters."; 
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setStatus({ type: 'error', msg: error });
      return;
    }

    setSubmitting(true);
    setStatus({ type: '', msg: '' });

    try {
      /**
       * FIXED: POST request with query parameters as defined in schema.
       * The schema explicitly places name, institute, etc., in 'parameters' with 'in: query'.
       */
      const response = await axios.post(INSERT_REVIEW_URL, null, {
        params: { 
          name: formData.name.trim(),
          institute: formData.institute.trim(),
          comment: formData.comment.trim(),
          rate: parseInt(formData.rate)
        }
      });

      if (response.status === 200 || response.status === 201) {
        setStatus({ type: 'success', msg: 'Review Synchronized Successfully.' });
        setFormData({ name: '', institute: '', comment: '', rate: 5 });
        // Small delay before refresh for better UX
        setTimeout(fetchReviews, 1000);
      }
    } catch (err) {
      // Handling FastAPI's validation error structure
      const apiError = err.response?.data?.detail;
      const errorMsg = Array.isArray(apiError) ? apiError[0]?.msg : 'Transmission Failed.';
      setStatus({ 
        type: 'error', 
        msg: errorMsg 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 pb-20">
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
      `}} />

      <nav className="p-6 max-w-7xl mx-auto flex items-center justify-between border-b border-white/5">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-emerald-500 transition-colors"
        >
          <ArrowLeft size={16} /> Return to Home
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-12">
        
        {/* Form Section */}
        <div className="lg:col-span-5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-6xl font-black tracking-tighter uppercase mb-10 leading-[0.9]">
              The <br/><span className="text-emerald-500 italic">Feedback</span>
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black uppercase text-emerald-500/70 tracking-widest">Name</label>
                    <span className="text-[8px] text-stone-700">{formData.name.length}/50</span>
                  </div>
                  <input 
                    required 
                    maxLength={50}
                    placeholder="e.g. Dhruv Arya" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-stone-600" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black uppercase text-emerald-500/70 tracking-widest">Institute</label>
                    <span className="text-[8px] text-stone-700">{formData.institute.length}/50</span>
                  </div>
                  <input 
                    required 
                    maxLength={50}
                    placeholder="University" 
                    value={formData.institute} 
                    onChange={(e) => setFormData({...formData, institute: e.target.value})}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-stone-600" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-emerald-500/70 tracking-widest ml-2">Rating</label>
                <div className="flex gap-3 bg-white/[0.02] border border-white/5 w-fit p-4 rounded-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onMouseEnter={() => setHoverRate(star)}
                      onMouseLeave={() => setHoverRate(0)}
                      onClick={() => setFormData({...formData, rate: star})} 
                      className="transition-transform active:scale-90"
                    >
                      <Star 
                        size={24} 
                        fill={(hoverRate || formData.rate) >= star ? "#10b981" : "none"} 
                        className={(hoverRate || formData.rate) >= star ? "text-emerald-500" : "text-stone-800"} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black uppercase text-emerald-500/70 tracking-widest">Your Experience</label>
                  <span className="text-[8px] text-stone-700">{formData.comment.length}/1000</span>
                </div>
                <textarea 
                  required 
                  maxLength={1000} 
                  rows="4" 
                  placeholder="How was your journey with the Vault?" 
                  value={formData.comment} 
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-6 text-white focus:border-emerald-500/50 outline-none transition-all resize-none placeholder:text-stone-600" 
                />
              </div>

              <AnimatePresence>
                {status.msg && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}
                  >
                    {status.msg}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit"
                disabled={submitting} 
                className="w-full bg-emerald-500 text-black font-black py-5 rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-50 flex justify-center gap-3 uppercase tracking-[0.2em] text-[11px] shadow-[0_0_40px_rgba(16,185,129,0.15)]"
              >
                {submitting ? <Loader2 className="animate-spin" /> : 'TRANSMIT REVIEW'}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Display Section */}
        <div className="lg:col-span-7">
          <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 backdrop-blur-md max-h-[800px] overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-10 border-b border-white/5 pb-6">Global Logs</h2>
            
            {loading ? (
              <div className="py-20 flex flex-col items-center opacity-30">
                <Loader2 className="animate-spin text-emerald-500 mb-4" size={32} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Querying Database...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.length > 0 ? reviews.map((rev, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: 20 }} 
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-8 bg-white/[0.01] border border-white/5 rounded-[2rem] hover:bg-white/[0.03] transition-all group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center font-black text-xs border border-emerald-500/20 uppercase">
                        {rev[0]?.[0] || 'U'}
                      </div>
                      <div className="flex-grow">
                          <h4 className="font-black text-[10px] uppercase tracking-wider">{rev[0] || 'Anonymous'}</h4>
                          <p className="text-[8px] text-stone-600 uppercase font-black">{rev[1] || 'Node_Internal'}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={8} 
                            fill={i < (rev[3] || 5) ? "#10b981" : "none"} 
                            className={i < (rev[3] || 5) ? "text-emerald-500" : "text-stone-800"} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-400 text-sm italic font-medium leading-relaxed group-hover:text-stone-300 transition-colors">
                      "{rev[2]}"
                    </p>
                  </motion.div>
                )) : (
                  <div className="text-center py-20 text-stone-600 text-[10px] font-black uppercase tracking-widest">
                    No records found in current segment.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
 
export default ReviewsPage;