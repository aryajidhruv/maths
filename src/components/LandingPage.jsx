import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import axios from 'axios';
import { 
  Loader2, Menu, X, ArrowUpRight, BookOpen, 
  Sparkles, FileText, Layout, Video, Heart, GraduationCap, Database, Monitor, Mail,
  MessageCircle, Users, MessageSquare, Star, Quote 
} from 'lucide-react'; 
import { API_BASE_URL } from '../config';

// --- SHARED ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const MATH_SYMBOLS = ['∫', 'π', '∞', 'Σ', '√', 'Δ', 'θ', 'λ', 'Ω', '∂', '≈', '≠', '±', '≡', '∀', '∃', '∇', '∈', '∉', '⊂', '⊃'];

// --- INITIALIZING LOADER COMPONENT ---
const VaultLoader = () => (
  <motion.div 
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.4 } }}
    className="fixed inset-0 z-[1000] bg-[#050505] flex flex-col items-center justify-center p-6"
  >
    <div className="relative flex flex-col items-center">
      <motion.div 
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-14 h-14 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center rounded-xl font-black text-2xl mb-6 shadow-[0_0_40px_rgba(16,185,129,0.1)] relative z-10"
      >
        ∆
      </motion.div>
      <motion.p 
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-[9px] font-black tracking-[0.6em] uppercase text-emerald-500 mb-4 relative z-10"
      >
        Initializing Vault
      </motion.p>
      <div className="w-32 h-[1px] bg-white/5 rounded-full overflow-hidden relative z-10">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-emerald-500"
        />
      </div>
    </div>
  </motion.div>
);

// --- SYMBOL RAIN TRANSITION ---
const SymbolRain = () => {
  const rainParticles = useMemo(() => {
    return Array.from({ length: 110 }).map((_, i) => ({
      id: i,
      char: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)],
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 0.8,
      duration: 1.5 + Math.random() * 2,
      size: 12 + Math.random() * 35,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-[900] pointer-events-none overflow-hidden">
      {rainParticles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: ['0vh', '115vh'], opacity: [0, 1, 0.5, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: "circIn" }}
          className="absolute font-serif text-emerald-500/40"
          style={{ left: p.left, fontSize: p.size }}
        >
          {p.char}
        </motion.div>
      ))}
    </div>
  );
};

// --- PERSISTENT AMBIENT BACKGROUND SYMBOLS ---
const FloatingMathParticles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      char: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: 18 + Math.random() * 35,
      duration: 20 + Math.random() * 30,
      delay: Math.random() * -20 
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          animate={{ 
            y: [0, -100, 0],
            x: [0, 50, 0],
            rotate: [0, 180, 360],
            opacity: [0.08, 0.25, 0.08], 
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
          className="absolute font-serif text-emerald-500/30 select-none"
          style={{ top: p.top, left: p.left, fontSize: p.size }}
        >
          {p.char}
        </motion.span>
      ))}
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [siteReady, setSiteReady] = useState(false);
  const [showRain, setShowRain] = useState(false);
  const [availableSemesters, setAvailableSemesters] = useState(() => {
    const saved = localStorage.getItem('vault_semesters');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(availableSemesters.length === 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const COMMUNITY_LINK = "https://chat.whatsapp.com/HbuIF5IrOQWKdCjOwRPkLJ";

  useEffect(() => {
    const fetchSemesters = async () => {
      const startTime = Date.now();
      try {
        const response = await axios.get(`${API_BASE_URL}/metadata`, {
          params: { of: 'cores' },
          headers: { 'accept': 'application/json' }
        });
        const keys = Object.keys(response.data).map(k => parseInt(k));
        const sortedKeys = keys.sort((a, b) => a - b);
        setAvailableSemesters(sortedKeys);
        localStorage.setItem('vault_semesters', JSON.stringify(sortedKeys));
      } catch (err) {
        if (availableSemesters.length === 0) setAvailableSemesters([1, 2, 3, 4, 5, 6]);
      } finally {
        setLoading(false);
        const elapsed = Date.now() - startTime;
        setTimeout(() => {
          setSiteReady(true);
          setShowRain(true);
          setTimeout(() => setShowRain(false), 4000);
        }, Math.max(0, 1000 - elapsed));
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get('https://maths-arity.fastapicloud.dev/review/get?top=3');
        // Filter out empty arrays and map to clean object if needed
        const reviewList = Object.values(response.data).filter(r => r && r.length > 0);
        setReviews(reviewList);
      } catch (err) {
        console.error("Review fetch failed", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchSemesters();
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!siteReady ? (
          <VaultLoader key="loader" />
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="relative"
          >
            {showRain && <SymbolRain />}
            
            <div className="fixed inset-0 z-0 pointer-events-none">
              <FloatingMathParticles />
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse z-[-1]"></div>
              <div 
                className="absolute inset-0 opacity-[0.03] z-[-1]" 
                style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
              ></div>
            </div>

            {/* --- NAVBAR --- */}
            <motion.nav 
               initial={{ y: -100 }}
               animate={{ y: 0 }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="fixed top-0 w-full z-[100] border-b border-white/5 bg-black/40 backdrop-blur-xl px-6 py-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
                <div className="w-9 h-9 bg-emerald-600 text-white flex items-center justify-center rounded-lg font-black text-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-all">∆</div>
                <span className="text-xl font-black tracking-tighter uppercase">MathVault</span>
              </div>

              <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                <a href="#resources" className="hover:text-emerald-400 transition">Vaults</a>
                <a href="#about" className="flex items-center gap-2 hover:text-emerald-400 transition">
                  <Users size={14} /> CREATORS
                </a>
                <button onClick={() => navigate('/reviews')} className="hover:text-emerald-400 transition uppercase tracking-[0.2em]">
                  Reviews
                </button>
                <button className="bg-white text-black px-6 py-2 rounded-full hover:bg-emerald-400 transition-all active:scale-95 text-[11px] font-bold">CONTACT US</button>
              </div>

              <button 
                className="md:hidden text-white z-[110] p-2 bg-white/5 rounded-lg border border-white/10 active:scale-90 transition-transform" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
              </button>
            </motion.nav>

            {/* --- CONTENT WRAPPER --- */}
            <div className="relative z-10">
              {/* --- HERO SECTION --- */}
              <header className="relative pt-48 pb-20 px-6 max-w-7xl mx-auto text-center">
                <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                  <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-[9px] font-black tracking-[0.2em] text-emerald-400 uppercase bg-emerald-500/5 border border-emerald-500/20 rounded-full">
                    <Sparkles size={12} /> Rajdhani College • DU • Student Initiative
                  </motion.div>
                  <motion.h1 variants={fadeInUp} className="text-6xl md:text-[8rem] font-black mb-8 leading-[0.8] tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30">
                    BY THE STUDENTS. <br />FOR THE STUDENTS.
                  </motion.h1>
                  <motion.p variants={fadeInUp} className="text-lg text-stone-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed uppercase tracking-wide text-[10px]">
                    The high-performance repository for B.Sc Math Honors. <br />Every PYQ, Note, Syllabus, and Lecture in one clean space.
                  </motion.p>
                  <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <a href="#resources" className="px-10 py-5 bg-emerald-500 text-black font-black rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_40_rgba(16,185,129,0.25)] active:scale-95 text-[10px] tracking-widest uppercase">Explore Vaults</a>
                    <a href={COMMUNITY_LINK} target="_blank" rel="noopener noreferrer" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white/10 transition-all text-[10px] tracking-widest uppercase backdrop-blur-sm flex items-center justify-center gap-2">
                      <MessageCircle size={14} /> Join Community
                    </a>
                  </div>
                </motion.div>
              </header>

              {/* --- SEMESTER VAULT SECTION --- */}
              <section id="resources" className="py-32 px-6 relative">
                <div className="max-w-5xl mx-auto">
                  <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
                    <h2 className="text-4xl font-black tracking-tighter uppercase">Vault <span className="text-emerald-500 italic">Access</span></h2>
                    <p className="text-stone-500 text-[9px] font-black tracking-[0.4em] uppercase text-right">Choose your phase</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                      <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white/5 rounded-2xl border border-white/5">
                        <Loader2 className="animate-spin text-emerald-500 mb-4" size={28} />
                        <span className="text-[9px] font-black tracking-widest uppercase text-stone-600">Retrieving Metadata...</span>
                      </div>
                    ) : (
                      availableSemesters.map(sem => (
                        <motion.div 
                          key={sem}
                          whileHover={{ scale: 1.02, y: -4 }}
                          onClick={() => navigate(`/semester/${sem}`)} 
                          className="group cursor-pointer bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] relative overflow-hidden transition-all hover:bg-[#111] hover:border-emerald-500/50 backdrop-blur-md"
                        >
                          <div className="flex justify-between items-start mb-10 relative z-10">
                            <span className="text-stone-600 font-black text-[10px] uppercase tracking-[0.3em]">Phase 0{sem}</span>
                            <div className="p-1.5 bg-white/5 rounded-md group-hover:bg-emerald-500 transition-all group-hover:text-black">
                                <ArrowUpRight size={16} />
                            </div>
                          </div>
                          <h3 className="text-6xl font-black mb-1 relative z-10 group-hover:text-emerald-400 transition-colors tracking-tighter">SEM 0{sem}</h3>
                          <p className="text-[9px] font-black text-stone-500 uppercase tracking-[0.4em] relative z-10">Academic Node</p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </section>

              {/* --- REVIEWS BENTO SECTION --- */}
              <section className="py-24 px-6 relative bg-white/[0.01]">
                <div className="max-w-6xl mx-auto">
                  <div className="flex justify-between items-end mb-12">
                    <h2 className="text-4xl font-black tracking-tighter uppercase">Student <span className="text-emerald-500 italic">Reviews</span></h2>
                    <button onClick={() => navigate('/reviews')} className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-2 hover:gap-3 transition-all">
                      View All <ArrowUpRight size={14}/>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reviewsLoading ? (
                      <div className="col-span-full py-12 flex justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>
                    ) : reviews.length > 0 ? (
                      reviews.map((rev, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden group hover:border-emerald-500/30 transition-all"
                        >
                          <div className="flex flex-col h-full relative z-10">
                            <div className="mb-6 flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center font-black text-emerald-500 uppercase text-xs">
                                {rev[0]?.[0]}
                              </div>
                              <div className="flex-grow">
                                <p className="font-black text-[10px] uppercase tracking-wider">{rev[0]}</p>
                                <p className="text-[8px] text-stone-500 uppercase font-bold">{rev[1]}</p>
                              </div>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={8} fill={i < (rev[3] || 5) ? "#10b981" : "none"} className={i < (rev[3] || 5) ? "text-emerald-500" : "text-stone-800"} />
                                ))}
                              </div>
                            </div>
                            <p className="text-stone-300 text-sm italic leading-relaxed">"{rev[2]}"</p>
                          </div>
                          <Quote size={40} className="absolute -right-2 -bottom-2 text-white/[0.02] group-hover:text-emerald-500/5 transition-colors" />
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-20 text-stone-800 text-[10px] font-black uppercase tracking-[0.5em]">No transmissions in vault.</div>
                    )}
                  </div>
                </div>
              </section>

              {/* --- ABOUT US --- */}
              <footer className="py-20 px-6 border-t border-white/5 bg-[#010101] relative text-center md:text-left">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-10">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                     <div className="w-9 h-9 bg-emerald-600 text-white flex items-center justify-center rounded-lg font-black text-xl shadow-lg shadow-emerald-500/20">∆</div>
                     <span className="font-black text-lg tracking-tighter uppercase">MathVault</span>
                  </div>
                  <div className="text-[9px] font-black text-stone-700 uppercase tracking-[0.5em]">Built for Rajdhani College by Students</div>
                  <div className="flex justify-center md:justify-end gap-8 text-[9px] font-black text-stone-600 uppercase tracking-widest">
                     <a href="#" className="hover:text-emerald-400 transition-all">Github</a>
                     <a href={COMMUNITY_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-all">Community</a>
                  </div>
                </div>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;