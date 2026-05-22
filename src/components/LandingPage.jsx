import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import axios from 'axios';
import { 
  Loader2, Menu, X, ArrowUpRight, BookOpen, 
  Sparkles, FileText, Layout, Video, Heart, GraduationCap, Database, Monitor, Mail,
  MessageCircle, Users, MessageSquareQuote, Star, Target, ChevronUp, FileQuestion,
  StickyNote, Film, ClipboardList
} from 'lucide-react'; 
import { API_BASE_URL } from '../config';
import ReactGA from 'react-ga4';

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
    exit={{ opacity: 0, transition: { duration: 0.3 } }}
    className="fixed inset-0 z-[1000] bg-[#050505] flex flex-col items-center justify-center p-6"
  >
    <div className="relative flex flex-col items-center">
      <motion.div 
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="w-14 h-14 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center rounded-xl font-black text-2xl mb-6 shadow-[0_0_40px_rgba(16,185,129,0.1)] relative z-10"
      >
        ∆
      </motion.div>

      <motion.p 
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0, repeat: Infinity }}
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

// --- NEW: ANIMATED COUNTER ---
const AnimatedCounter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}{suffix}</span>;
};

// --- NEW: STATS BAR ---
const StatsBar = () => {
  const [inView, setInView] = useState(false);
  const stats = [
    { label: 'PYQs Archived', value: 100, suffix: '+' },
    { label: 'Semesters Covered', value: 8, suffix: '' },
    { label: 'Notes Uploaded', value: 20, suffix: '+' },
    { label: 'Students Helped', value: 20, suffix: '+' },
  ];

  return (
    <motion.section
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-16 px-6 border-y border-white/5 bg-white/[0.01]"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="text-center">
            <p className="text-4xl md:text-5xl font-black tracking-tighter text-emerald-400 mb-2">
              {inView ? <AnimatedCounter target={s.value} suffix={s.suffix} /> : `0${s.suffix}`}
            </p>
            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-stone-500">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

// --- NEW: WHAT'S INSIDE SECTION ---
const FeaturesSection = () => {
  const features = [
    {
      icon: <FileQuestion size={28} />,
      title: "Previous Year Questions",
      desc: "Semester-wise PYQs with solutions, sorted by subject and year. Stop hunting across drives.",
    },
    {
      icon: <StickyNote size={28} />,
      title: "Handwritten & Typed Notes",
      desc: "Curated notes from toppers and seniors. Everything you need, nothing you don't.",
    },
    {
      icon: <ClipboardList size={28} />,
      title: "Syllabus & Structure",
      desc: "Up-to-date syllabus breakdowns for every semester so you always know what's coming.",
    },
    {
      icon: <Film size={28} />,
      title: "Lecture References",
      desc: "Handpicked YouTube playlists and lecture links mapped directly to your syllabus topics.",
    },
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-12 border-b border-white/5 pb-8"
        >
          <h2 className="text-4xl font-black tracking-tighter uppercase">What's <span className="text-emerald-500 italic">Inside</span></h2>
          <p className="text-stone-500 text-[9px] font-black tracking-[0.4em] uppercase text-right">Everything. Organised.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="group bg-white/[0.02] border border-white/5 p-8 rounded-3xl hover:border-emerald-500/30 hover:bg-[#111] transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-full h-full bg-emerald-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="w-14 h-14 bg-white/5 text-emerald-500 flex items-center justify-center rounded-2xl mb-6 group-hover:bg-emerald-500/10 transition-all">
                {f.icon}
              </div>
              <h3 className="text-xl font-black tracking-tight uppercase mb-3">{f.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// --- NEW: REVIEWS SECTION ---
const ReviewsSection = ({ reviews, loading, navigate }) => {
  if (loading) return null;
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-32 px-6 bg-[#080808]/60">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-12 border-b border-white/5 pb-8"
        >
          <h2 className="text-4xl font-black tracking-tighter uppercase">What They <span className="text-emerald-500 italic">Say</span></h2>
          <button
            onClick={() => navigate('/reviews')}
            className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            All Reviews <ArrowUpRight size={12} />
          </button>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl flex flex-col gap-5 hover:border-emerald-500/20 transition-all"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    size={14}
                    className={si < (review.rating ?? 5) ? 'text-emerald-400 fill-emerald-400' : 'text-stone-700'}
                  />
                ))}
              </div>
              <p className="text-sm text-stone-400 leading-relaxed font-medium flex-1">
                "{review.text || review.review || review.message}"
              </p>
              <div className="border-t border-white/5 pt-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-white">
                  {review.name || review.author || 'Anonymous'}
                </p>
                {(review.semester || review.year) && (
                  <p className="text-[9px] font-black uppercase tracking-widest text-stone-600 mt-1">
                    {review.semester ? `Semester ${review.semester}` : ''}{review.year ? ` • ${review.year}` : ''}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// --- NEW: SCROLL TO TOP BUTTON ---
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-6 z-[200] w-12 h-12 bg-emerald-500 text-black rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:bg-emerald-400 active:scale-90 transition-all"
          aria-label="Scroll to top"
        >
          <ChevronUp size={22} strokeWidth={3} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [siteReady, setSiteReady] = useState(false);
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
      if (availableSemesters.length === 0) setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/metadata/maths`, {
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
        const remaining = Math.max(0, 1000 - elapsed);
        setTimeout(() => { setSiteReady(true); }, remaining);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/review/get-top`, {
            params: { top: 3 }
        });
        const reviewList = Object.values(response.data);
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
            transition={{ duration: 0.2 }}
            className="relative"
          >
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
                <span className="text-xl font-black tracking-tighter uppercase">fjkjd</span>
              </div>

              <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                <button onClick={() => navigate('/motivation')} className="hover:text-emerald-400 transition uppercase tracking-[0.2em]">Motivation</button>
                <a href="#about" className="flex items-center gap-2 hover:text-emerald-400 transition">
                  <Users size={14} /> CREATORS
                </a>
                <button onClick={() => navigate('/reviews')} className="hover:text-emerald-400 transition uppercase tracking-[0.2em]">
                  Reviews
                </button>
                <button onClick={() => navigate('/contact')} className="bg-white text-black px-6 py-2 rounded-full hover:bg-emerald-400 transition-all active:scale-95 text-[11px] font-bold uppercase tracking-widest">CONTACT US</button>
              </div>

              <button 
                className="md:hidden text-white z-[110] p-2 bg-white/5 rounded-lg border border-white/10 active:scale-90 transition-transform" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
              </button>
            </motion.nav>

            {/* --- MOBILE SIDEBAR --- */}
            <AnimatePresence>
              {isMenuOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90] md:hidden"
                  />
                  <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 h-screen w-[80%] max-w-[320px] bg-[#0A0A0A] border-l border-white/10 z-[105] p-10 flex flex-col md:hidden"
                  >
                    <div className="mt-20 space-y-12">
                      <div className="space-y-4">
                        <p className="text-emerald-500 font-black text-[10px] tracking-[0.4em] uppercase opacity-50">Navigation</p>
                        <nav className="flex flex-col gap-8">
                          <button onClick={() => { setIsMenuOpen(false); navigate('/motivation'); }} className="text-left text-4xl font-black tracking-tighter uppercase hover:text-emerald-500 transition-colors">Motivation</button>
                          <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black tracking-tighter uppercase hover:text-emerald-500 transition-colors flex items-center gap-2">
                            Creators <Users size={28} />
                          </a>
                          <button onClick={() => { setIsMenuOpen(false); navigate('/reviews'); }} className="text-left text-4xl font-black tracking-tighter uppercase hover:text-emerald-500 transition-colors">Reviews</button>
                          <button onClick={() => { setIsMenuOpen(false); navigate('/contact'); }} className="text-left text-4xl font-black tracking-tighter uppercase hover:text-emerald-500 transition-colors">Contact</button>
                        </nav>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

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
                    The high-performance repository for B.Sc Mathematics Honors. <br />Every PYQ, Note, Syllabus, and Lecture in one clean space.
                  </motion.p>
                  <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-6">
                    <a href="#resources" className="px-10 py-5 bg-emerald-500 text-black font-black rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_40_rgba(16,185,129,0.25)] active:scale-95 text-[10px] tracking-widest uppercase">Explore Vaults</a>
                    <a 
                      href={COMMUNITY_LINK} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white/10 transition-all text-[10px] tracking-widest uppercase backdrop-blur-sm flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={14} /> Join Community
                    </a>
                  </motion.div>
                </motion.div>
              </header>

              {/* --- NEW: STATS BAR --- */}
              <StatsBar />

              {/* --- NEW: WHAT'S INSIDE SECTION --- */}
              <FeaturesSection />

              {/* --- SEMESTER VAULT SECTION --- */}
              <section id="resources" className="py-32 px-6 relative">
                <div className="max-w-5xl mx-auto">
                  <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
                    <h2 className="text-4xl font-black tracking-tighter uppercase">Vault <span className="text-emerald-500 italic">Access</span></h2>
                    <p className="text-stone-500 text-[9px] font-black tracking-[0.4em] uppercase text-right">Choose your phase</p>
                  </motion.div>
                  
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                      <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white/5 rounded-2xl border border-white/5">
                        <Loader2 className="animate-spin text-emerald-500 mb-4" size={28} />
                        <span className="text-[9px] font-black tracking-widest uppercase text-stone-600">Retrieving Metadata...</span>
                      </div>
                    ) : (
                      availableSemesters.map(sem => (
                        <motion.div 
                          key={sem}
                          variants={fadeInUp}
                          whileHover={{ scale: 1.02, y: -4 }}
                          onClick={() => navigate(`/semester/${sem}`)} 
                          className="group cursor-pointer bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] relative overflow-hidden transition-all hover:bg-[#111] hover:border-emerald-500/50 backdrop-blur-md"
                        >
                          <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
                  </motion.div>
                </div>
              </section>

              {/* --- NEW: REVIEWS SECTION --- */}
              <ReviewsSection reviews={reviews} loading={reviewsLoading} navigate={navigate} />

              {/* --- ABOUT US / THE TEAM SECTION --- */}
              <section id="about" className="py-52 px-6 relative bg-[#080808]/50">
                <div className="max-w-7xl mx-auto relative">
                    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-32">
                        <div className="inline-flex items-center gap-2 text-emerald-500 font-black text-[11px] tracking-[0.6em] uppercase mb-8">
                            <GraduationCap size={16}/> Rajdhani College Collective
                        </div>
                        <h2 className="text-7xl md:text-[9rem] font-black tracking-tighter uppercase mb-12 leading-[0.85] text-white">
                            THE BRAINS <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-200">BEHIND THE VAULT.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <motion.div 
                            onClick={
                              () => {
                                ReactGA.event("github_click", {
                                  person: "Dhrub Arya",
                                  platform: "github"
                                });
                                window.open('https://github.com/aryajidhruv', '_blank')
                              }
                            }
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="p-16 bg-white/[0.02] border border-white/10 rounded-[4rem] hover:border-emerald-500/40 transition-all group backdrop-blur-xl relative overflow-hidden cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-20 transition-opacity"><Monitor size={40}/></div>
                            <div className="w-20 h-20 bg-white/5 text-white flex items-center justify-center rounded-3xl mb-10 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-all"><Monitor size={40}/></div>
                            <h4 className="text-4xl font-black mb-3 tracking-tighter uppercase">Dhruv Arya</h4>
                            <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.4em] mb-8">Frontend Architecture</p>
                            <p className="text-lg text-stone-500 leading-relaxed font-medium max-w-sm">Mastermind behind the high-performance user interface and seamless navigation logic.</p>
                        </motion.div>

                        <motion.div 
                            onClick={() => {
                              ReactGA.event("github_click", {
                                person: "Dhrub Arya",
                                platform: "github"
                              });
                              window.open('https://github.com/aditya7balotra', '_blank')
                              }
                            } 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="p-16 bg-white/[0.02] border border-white/10 rounded-[4rem] hover:border-emerald-500/40 transition-all group backdrop-blur-xl relative overflow-hidden cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-20 transition-opacity"><Database size={40}/></div>
                            <div className="w-20 h-20 bg-white/5 text-white flex items-center justify-center rounded-3xl mb-10 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-all"><Database size={40}/></div>
                            <h4 className="text-4xl font-black mb-3 tracking-tighter uppercase">Aditya Balotra</h4>
                            <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.4em] mb-8">Backend Systems</p>
                            <p className="text-lg text-stone-500 leading-relaxed font-medium max-w-sm">The engineer responsible for the secure, globally-distributed vault infrastructure and API core.</p>
                        </motion.div>
                    </div>

                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }} 
                      whileInView={{ scale: 1, opacity: 1 }} 
                      className="mt-32 p-20 bg-emerald-500 rounded-[5rem] text-black relative overflow-hidden group shadow-[0_0_80px_rgba(16,185,129,0.3)]"
                    >
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="text-center md:text-left">
                                <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-none">JOIN THE <br/>COLLECTIVE.</h3>
                                <p className="font-bold text-emerald-950 uppercase text-sm tracking-widest max-w-md">Contribute notes, papers, or technical suggestions to help the Rajdhani community grow.</p>
                            </div>
                            <a 
                              href={COMMUNITY_LINK} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="bg-black text-white px-16 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:scale-110 transition-all active:scale-95 shadow-2xl shrink-0 text-center"
                            >
                              Join the Community
                            </a>
                        </div>
                    </motion.div>
                </div>
              </section>

              <footer className="py-20 px-6 border-t border-white/5 bg-[#010101] relative text-center md:text-left">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-10">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                     <div className="w-9 h-9 bg-emerald-600 text-white flex items-center justify-center rounded-lg font-black text-xl shadow-lg shadow-emerald-500/20">∆</div>
                     <span className="font-black text-lg tracking-tighter uppercase">MathVault</span>
                  </div>
                  <div className="text-[9px] font-black text-stone-700 uppercase tracking-[0.5em]">Built for Rajdhani College by Students</div>
                  <div className="flex justify-center md:justify-end gap-8 text-[9px] font-black text-stone-600 uppercase tracking-widest">
                     <a href="https://github.com/aryajidhruv/maths" target="_blank" className="hover:text-emerald-400 transition-all uppercase tracking-widest">Github</a>
                     <button onClick={() => navigate('/contact')} className="hover:text-emerald-400 transition-all uppercase tracking-widest">Contact</button>
                  </div>
                </div>
              </footer>
            </div>

            {/* --- NEW: SCROLL TO TOP --- */}
            <ScrollToTop />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;