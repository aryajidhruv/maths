import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ArrowLeft, MessageSquare, Star, Send, 
  User, School, Loader2, CheckCircle2, AlertCircle 
} from 'lucide-react';

const API_REVIEW_GET = 'https://maths-arity.fastapicloud.dev/review/get';
const API_REVIEW_POST = 'https://maths-arity.fastapicloud.dev/review/post';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ReviewsPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [formData, setFormData] = useState({ name: '', college: '', review: '' });

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(API_REVIEW_GET);
      const dataArray = Object.values(response.data).reverse(); 
      setReviews(dataArray);
    } catch (err) { console.error("Fetch error", err); } 
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', msg: '' });
    try {
      await axios.post(API_REVIEW_POST, null, {
        params: { name: formData.name, college: formData.college, review: formData.review }
      });
      setStatus({ type: 'success', msg: 'Review encrypted and added to the vault!' });
      setFormData({ name: '', college: '', review: '' });
      fetchReviews();
    } catch (err) {
      setStatus({ type: 'error', msg: 'Transmission failed.' });
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 pb-20 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full"></div>
      </div>

      <nav className="relative z-10 p-6 flex items-center justify-between max-w-7xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 hover:text-emerald-500 transition-colors">
          <ArrowLeft size={16} /> Back to Terminal
        </button>
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center font-black">∆</div>
            <span className="font-black tracking-tighter uppercase text-sm">Review_Node</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
        <div className="lg:col-span-5">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <h1 className="text-5xl font-black tracking-tighter uppercase mb-4 leading-tight">
              Submit <br /> <span className="text-emerald-500 italic">Feedback</span>
            </h1>
            <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12">System Contribution</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { label: 'Identified Name', icon: <User size={16}/>, key: 'name', type: 'text', placeholder: 'Dhrub Arya' },
                { label: 'Institution', icon: <School size={16}/>, key: 'college', type: 'text', placeholder: 'Rajdhani College' }
              ].map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-stone-600 ml-2">{field.label}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600">{field.icon}</span>
                    <input 
                      required type={field.type} placeholder={field.placeholder}
                      value={formData[field.key]} onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-emerald-500/50 focus:bg-white/[0.05] outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-stone-600 ml-2">Review Content</label>
                <textarea 
                  required rows="5" placeholder="Vault performance report..."
                  value={formData.review} onChange={(e) => setFormData({...formData, review: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 focus:border-emerald-500/50 focus:bg-white/[0.05] outline-none transition-all font-medium resize-none"
                />
              </div>

              <button disabled={submitting} className="w-full bg-emerald-500 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-50">
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> SYNC DATA</>}
              </button>
            </form>
          </motion.div>
        </div>

        {/* --- THE FEED SECTION (Tailwind Scrollbar Fix) --- */}
        <div className="lg:col-span-7">
          <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 lg:p-12 min-h-[600px] backdrop-blur-xl">
            <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><MessageSquare size={20}/></div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Live Feed</h2>
                </div>
                <div className="px-4 py-2 bg-white/5 rounded-full text-[9px] font-black text-stone-500 uppercase tracking-[0.2em]">
                    {reviews.length} RECORDS FOUND
                </div>
            </div>

            {/* Tailwind Arbitrary Values for Scrollbar */}
            <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4 
                scrollbar-thin 
                scrollbar-thumb-white/5 
                scrollbar-track-transparent 
                [&::-webkit-scrollbar]:w-[4px] 
                [&::-webkit-scrollbar-thumb]:bg-white/10 
                [&::-webkit-scrollbar-thumb]:rounded-full">
              
              {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20"><Loader2 className="animate-spin mb-4" size={40} /></div>
              ) : (
                  reviews.map((rev, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                      className="p-8 bg-white/[0.01] border border-white/5 rounded-[2rem] hover:bg-white/[0.03] transition-all group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                            {rev[0]?.[0] || 'U'}
                          </div>
                          <div>
                            <h4 className="font-black text-sm uppercase tracking-tight">{rev[0]}</h4>
                            <p className="text-[9px] font-bold text-stone-600 uppercase tracking-widest">{rev[1]}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 text-emerald-500/20"><Star size={10} fill="currentColor" /></div>
                      </div>
                      <p className="text-stone-400 text-sm leading-relaxed italic">"{rev[2]}"</p>
                    </motion.div>
                  ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewsPage;