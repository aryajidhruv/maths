import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ArrowLeft, Star, Loader2 } from 'lucide-react';

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

  // Endpoints updated to match your verified example
  const GET_URL = 'https://maths-arity.fastapicloud.dev/review/get';
  const INSERT_URL = 'https://maths-arity.fastapicloud.dev/review/insert';

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(GET_URL);
      const reviewData = Object.values(response.data);
      setReviews(reviewData.reverse());
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', msg: '' });

    try {
      // Using the exact parameters from your example: institute, comment, rate, name
      const response = await axios.post(INSERT_URL, null, {
        params: { 
          institute: formData.institute,
          comment: formData.comment,
          rate: parseInt(formData.rate),
          name: formData.name
        }
      });

      if (response.status === 200 || response.status === 201) {
        setStatus({ type: 'success', msg: 'Transmission Synchronized.' });
        setFormData({ name: '', institute: '', comment: '', rate: 5 });
        setTimeout(fetchReviews, 800);
      }
    } catch (err) {
      console.error("Submission Error:", err.response?.data || err.message);
      setStatus({ 
        type: 'error', 
        msg: err.response?.data?.detail || 'Transmission Failed.' 
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
          <ArrowLeft size={16} /> Return
        </button>
        <div className="font-black uppercase tracking-tighter text-sm opacity-40"></div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-12">
        
        {/* SUBMISSION PANEL */}
        <div className="lg:col-span-5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-6xl font-black tracking-tighter uppercase mb-10 leading-[0.9]">
              The <br/><span className="text-emerald-500 italic">Feedback</span><br/>
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-stone-600 tracking-[0.3em] ml-2"></label>
                  <input 
                    required 
                    placeholder="Name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 focus:border-emerald-500/50 outline-none transition-all placeholder:opacity-20" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-stone-600 tracking-[0.3em] ml-2"></label>
                  <input 
                    required 
                    placeholder="Institute" 
                    value={formData.institute} 
                    onChange={(e) => setFormData({...formData, institute: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 focus:border-emerald-500/50 outline-none transition-all placeholder:opacity-20" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                
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
                <label className="text-[9px] font-black uppercase text-stone-600 tracking-[0.3em] ml-2">Your Experience</label>
                <textarea 
                  required 
                  rows="4" 
                  placeholder="Share your experience..." 
                  value={formData.comment} 
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 focus:border-emerald-500/50 outline-none transition-all resize-none placeholder:opacity-20" 
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
                disabled={submitting} 
                className="w-full bg-emerald-500 text-black font-black py-5 rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-50 flex justify-center gap-3 uppercase tracking-[0.2em] text-[11px] shadow-[0_0_40px_rgba(16,185,129,0.15)]"
              >
                {submitting ? <Loader2 className="animate-spin" /> : 'SUBMIT'}
              </button>
            </form>
          </motion.div>
        </div>

        {/* LOGS DISPLAY */}
        <div className="lg:col-span-7">
          <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 backdrop-blur-md max-h-[800px] overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-10 border-b border-white/5 pb-6">Reviews</h2>
            
            {loading ? (
              <div className="py-20 flex flex-col items-center opacity-30">
                <Loader2 className="animate-spin text-emerald-500 mb-4" size={32} />
                
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((rev, idx) => (
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
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewsPage;