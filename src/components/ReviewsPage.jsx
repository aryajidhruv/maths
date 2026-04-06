import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ArrowLeft, Star, Send, Loader2, MessageSquare
} from 'lucide-react';

const ReviewsPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hoverRate, setHoverRate] = useState(0);
  const [status, setStatus] = useState({ type: '', msg: '' });
  
  // Updated Form Data to match your API
  const [formData, setFormData] = useState({ 
    name: '', 
    institute: '', 
    comment: '', 
    rate: 5 
  });

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('https://maths-arity.fastapicloud.dev/review/get');
      setReviews(Object.values(response.data).reverse());
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', msg: '' });
    try {
      // POST mapping to your exact query parameters
      await axios.post('https://maths-arity.fastapicloud.dev/review/post', null, {
        params: { 
          NameDescriptioninstitute: formData.institute,
          comment: formData.comment,
          rate: formData.rate,
          name: formData.name
        }
      });
      setStatus({ type: 'success', msg: 'Sync Successful.' });
      setFormData({ name: '', institute: '', comment: '', rate: 5 });
      fetchReviews();
    } catch (err) {
      setStatus({ type: 'error', msg: 'Transmission Failed.' });
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 pb-20">
      <nav className="p-6 max-w-7xl mx-auto flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-emerald-500 transition-colors">
          <ArrowLeft size={16} /> Return
        </button>
        <div className="font-black uppercase tracking-tighter text-sm">Review_Hub</div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-10">
        {/* Left: Submission Form */}
        <div className="lg:col-span-5">
            <h1 className="text-6xl font-black tracking-tighter uppercase mb-10">Vault <br/><span className="text-emerald-500 italic">Feedback</span></h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-stone-600 tracking-widest ml-2">Name</label>
                    <input required placeholder="Dhrub Arya" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 focus:border-emerald-500/50 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-stone-600 tracking-widest ml-2">Institute</label>
                    <input required placeholder="Rajdhani College" value={formData.institute} onChange={(e) => setFormData({...formData, institute: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 focus:border-emerald-500/50 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase text-stone-600 tracking-widest ml-2">Rating</label>
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
                <label className="text-[9px] font-black uppercase text-stone-600 tracking-widest ml-2">Comment</label>
                <textarea required rows="4" placeholder="Your experience..." value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 focus:border-emerald-500/50 outline-none transition-all resize-none" />
              </div>

              {status.msg && <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{status.msg}</div>}

              <button disabled={submitting} className="w-full bg-emerald-500 text-black font-black py-5 rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-50 flex justify-center gap-3 uppercase tracking-widest text-[11px]">
                {submitting ? <Loader2 className="animate-spin" /> : 'Send Transmission'}
              </button>
            </form>
        </div>

        {/* Right: Reviews List */}
        <div className="lg:col-span-7">
          <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 backdrop-blur-sm max-h-[800px] overflow-y-auto [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:bg-emerald-500">
            <h2 className="text-2xl font-black uppercase mb-10">Records_</h2>
            {loading ? <Loader2 className="animate-spin text-emerald-500 mx-auto" /> : (
              <div className="space-y-6">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="p-8 bg-white/[0.01] border border-white/5 rounded-[2rem] hover:bg-white/[0.03] transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center font-black text-xs">{rev[0]?.[0]}</div>
                      <div className="flex-grow">
                          <h4 className="font-black text-[10px] uppercase tracking-wider">{rev[0]}</h4>
                          <p className="text-[8px] text-stone-600 uppercase font-black">{rev[1]}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={8} fill={i < (rev[3] || 5) ? "#10b981" : "none"} className={i < (rev[3] || 5) ? "text-emerald-500" : "text-stone-800"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-400 text-sm italic font-medium">"{rev[2]}"</p>
                  </div>
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