import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Loader2, Menu, X, ArrowUpRight, Zap, BookOpen, Users } from 'lucide-react'; 
import { API_BASE_URL } from '../config';

const LandingPage = () => {
  const navigate = useNavigate();
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchSemesters = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/metadata`, {
          params: { of: 'cores' },
          headers: { 'accept': 'application/json' }
        });
        const keys = Object.keys(response.data).map(k => parseInt(k));
        setAvailableSemesters(keys.sort((a, b) => a - b));
      } catch (err) {
        setAvailableSemesters([1, 2, 3, 4, 5, 6]);
      } finally {
        setLoading(false);
      }
    };
    fetchSemesters();
  }, []);

  const features = [
    {title: "Centralized PYQs", desc: "Access 10 years of organized papers without chaotic Telegram groups.", icon: "📚"},
    {title: "Curated Resources", desc: "Hand-picked syllabus-compliant notes for ODE, Group Theory, and more.", icon: "📝"},
    {title: "Student-Led", desc: "Built by DU Math students who understand the specific exam patterns.", icon: "🎓"},
  ];

  // Animation variants for the grid
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans selection:bg-emerald-100 scroll-smooth overflow-x-hidden">
      
      {/* 1. ADDED: MATHEMATICAL GRID BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `linear-gradient(#065f46 1px, transparent 1px), linear-gradient(90deg, #065f46 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
      </div>

      {/* --- RESPONSIVE NAVIGATION (Glassmorphism) --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
          <div className="bg-emerald-600 text-white w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl md:rounded-2xl font-black text-xl md:text-2xl shadow-lg group-hover:rotate-12 transition-transform">
            ∆
          </div>
          <span className="text-xl md:text-2xl font-extrabold text-stone-950 tracking-tighter">
            <span className="text-emerald-700">Math</span>Vault
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-stone-500">
          <a href="#resources" className="hover:text-emerald-700 transition">Resources</a>
          <a href="#why" className="hover:text-emerald-700 transition">About</a>
          <button className="bg-stone-950 text-white px-6 py-2.5 rounded-full hover:bg-emerald-600 transition-all active:scale-95 shadow-lg">
            Explore
          </button>
        </div>

        <button className="md:hidden p-2 text-stone-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28}/> : <Menu size={28}/>}
        </button>

        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 w-full bg-white border-b border-stone-200 p-6 flex flex-col gap-6 md:hidden shadow-xl font-bold">
            <a href="#resources" onClick={() => setIsMenuOpen(false)}>PYQs</a>
            <a href="#why" onClick={() => setIsMenuOpen(false)}>Contribute</a>
          </motion.div>
        )}
      </nav>

      {/* --- HERO SECTION (Enhanced with Floating Symbols) --- */}
      <header className="relative py-16 md:py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-1 mb-6 text-[10px] font-black tracking-[0.2em] text-emerald-700 uppercase bg-emerald-50 rounded-full border border-emerald-100">
              Delhi University • Open Source
            </span>
            <h1 className="text-5xl md:text-7xl font-[1000] text-stone-950 mb-8 leading-[0.9] tracking-tighter">
              Master the <br />
              <span className="text-emerald-600 italic">Curriculum.</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-500 mb-12 leading-relaxed max-w-xl font-medium">
              The unified repository for DU Math Honors. Ditch the chaotic groups; find every PYQ and note in one clean space.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#resources" className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-stone-950 transition-all shadow-xl shadow-emerald-100 active:scale-95">
                Get Started <ArrowUpRight size={20}/>
              </a>
            </div>
          </motion.div>

          {/* Graphic: More Abstract/Premium */}
          <div className="relative hidden lg:block">
            <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="bg-white rounded-[4rem] border border-stone-200 shadow-2xl p-20 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-emerald-50/50"></div>
               <span className="text-9xl font-black text-emerald-600 relative z-10 drop-shadow-sm">∫</span>
               <div className="absolute top-10 right-10 text-4xl font-serif italic text-stone-200">dx</div>
               <div className="absolute bottom-10 left-10 text-4xl font-serif italic text-stone-200">f(x)</div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* 2. ADDED: MINI STATS BAR */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl"><BookOpen size={24}/></div>
                <div><h4 className="font-black text-xl">500+</h4><p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Resources</p></div>
            </div>
            <div className="flex items-center gap-4 border-y md:border-y-0 md:border-x border-stone-100 py-6 md:py-0 md:px-8">
                <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl"><Zap size={24}/></div>
                <div><h4 className="font-black text-xl">Fast Access</h4><p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Instant Preview</p></div>
            </div>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl"><Users size={24}/></div>
                <div><h4 className="font-black text-xl">Community</h4><p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Student Driven</p></div>
            </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="why" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <h2 className="text-4xl font-black text-stone-950 tracking-tighter">Engineered for <br /><span className="text-emerald-700">Mathematics.</span></h2>
            <p className="text-stone-500 font-bold max-w-xs text-sm">Every feature is built to save you time during the exam season.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/40 group transition-all">
                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform inline-block">{feature.icon}</div>
                <h4 className="text-2xl font-black text-stone-900 mb-4">{feature.title}</h4>
                <p className="text-stone-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SEMESTER GRID (Staggered Animation) --- */}
      <section id="resources" className="py-24 bg-stone-950 rounded-t-[4rem] text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Select Pathway</h2>
            <p className="text-emerald-400 font-bold text-xs uppercase tracking-[0.3em]">Direct Vault Access</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {loading ? (
              <div className="col-span-full py-10 flex flex-col items-center opacity-50">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="text-xs font-black uppercase tracking-widest">Loading Semesters...</p>
              </div>
            ) : (
              availableSemesters.map(sem => (
                <motion.button 
                  key={sem}
                  variants={itemVariants}
                  onClick={() => navigate(`/semester/${sem}`)} 
                  className="group relative bg-white/5 border border-white/10 p-10 rounded-[2.5rem] text-center hover:bg-emerald-600 transition-all active:scale-95"
                >
                  <div className="absolute top-4 right-6 text-white/20 group-hover:text-white transition-colors">
                      <ArrowUpRight size={24}/>
                  </div>
                  <h3 className="text-5xl font-black mb-2">0{sem}</h3>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-white/80">Semester</p>
                </motion.button>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-stone-950 text-white/40 py-16 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="text-white font-black text-lg mb-1">MathVault</p>
            <p className="text-xs font-bold uppercase tracking-widest">BadyCode × DU Math</p>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-center">
            Designed for students who want to focus on proofs, not PDF searches.
          </p>
          <div className="text-center md:text-right">
            <p className="text-[10px] mb-2 font-black uppercase tracking-widest">© 2026</p>
            <p className="text-white font-bold underline decoration-emerald-500 underline-offset-8 decoration-2 cursor-pointer">Github Repository</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;