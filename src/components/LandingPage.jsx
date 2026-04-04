import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import axios from 'axios';
import { 
  Loader2, Menu, X, ArrowUpRight, BookOpen, 
  Sparkles, FileText, Layout, Video, Heart, GraduationCap, Database, Monitor, Mail
} from 'lucide-react'; 
import { API_BASE_URL } from '../config';

// --- WAM-STYLE FLOATING MATH BACKGROUND ---
const FloatingMathParticles = () => {
  const symbols = ['∫', 'π', '∞', 'Σ', '√', 'Δ', 'θ', 'λ', 'Ω', '∂', '≈', '≠'];
  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      char: symbols[Math.floor(Math.random() * symbols.length)],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: 14 + Math.random() * 40,
      duration: 20 + Math.random() * 30,
      delay: Math.random() * 5
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          animate={{ 
            y: [-20, 20, -20],
            x: [-15, 15, -15],
            opacity: [0.1, 0.4, 0.1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
          className="absolute font-serif text-emerald-500/40 select-none"
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

  const [availableSemesters, setAvailableSemesters] = useState(() => {
    const saved = localStorage.getItem('vault_semesters');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(availableSemesters.length === 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchSemesters = async () => {
      if (availableSemesters.length === 0) setLoading(true);
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
      }
    };
    fetchSemesters();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* 1. ANIMATED AMBIENT BACKGROUND */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <FloatingMathParticles />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-black/40 backdrop-blur-xl px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
          <div className="w-9 h-9 bg-emerald-600 text-white flex items-center justify-center rounded-lg font-black text-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-all">∆</div>
          <span className="text-xl font-black tracking-tighter uppercase">MathVault</span>
        </div>

        {/* Desktop Menu Items */}
        <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
          <a href="#resources" className="hover:text-emerald-400 transition">Vaults</a>
          <a href="#about" className="hover:text-emerald-400 transition">The Team</a>
          <button className="bg-white text-black px-6 py-2 rounded-full hover:bg-emerald-400 transition-all active:scale-95 text-[11px] font-bold">CONTACT US</button>
        </div>

        {/* Hamburger Icon */}
        <button 
          className="md:hidden text-white z-[110] p-2 bg-white/5 rounded-lg border border-white/10 active:scale-90 transition-transform" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>
      </nav>

      {/* --- MOBILE SIDEBAR --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Dark Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90] md:hidden"
            />

            {/* Sidebar Slide-out */}
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
                    <a href="#resources" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black tracking-tighter uppercase hover:text-emerald-500 transition-colors">Vaults</a>
                    <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black tracking-tighter uppercase hover:text-emerald-500 transition-colors">The Team</a>
                    <a href="#" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black tracking-tighter uppercase hover:text-emerald-500 transition-colors">Contact</a>
                  </nav>
                </div>

                <div className="pt-10 border-t border-white/5">
                  <p className="text-stone-500 font-black text-[9px] tracking-[0.2em] uppercase mb-6">College Access</p>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <h5 className="font-black text-sm uppercase tracking-tight">Rajdhani College Node</h5>
                    <p className="text-[10px] text-stone-500 mt-1 uppercase">University of Delhi</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pb-6">
                <button className="w-full bg-emerald-500 text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                  <Mail size={14}/> Contact Team
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-48 pb-20 px-6 max-w-7xl mx-auto text-center z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-[9px] font-black tracking-[0.2em] text-emerald-400 uppercase bg-emerald-500/5 border border-emerald-500/20 rounded-full">
            <Sparkles size={12} /> Rajdhani College • DU • Student Initiative
          </div>
          <h1 className="text-6xl md:text-[8rem] font-black mb-8 leading-[0.8] tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30">
            BY THE STUDENTS. <br />FOR THE STUDENTS.
          </h1>
          <p className="text-lg text-stone-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed uppercase tracking-wide text-[10px]">
            The high-performance repository for B.Sc Math Honors. <br />Every PYQ, Note, Syllabus, and Lecture in one clean space.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="#resources" className="px-10 py-5 bg-emerald-500 text-black font-black rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_40px_rgba(16,185,129,0.25)] active:scale-95 text-[10px] tracking-widest uppercase">Explore Vaults</a>
            <a href="#about" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white/10 transition-all text-[10px] tracking-widest uppercase backdrop-blur-sm">Meet the Creators</a>
          </div>
        </motion.div>
      </header>

      {/* ... Rest of your sections (Bento, Semesters, About, Footer) remain the same ... */}
      
      {/* --- CORE OFFERINGS BENTO --- */}
      <section className="max-w-6xl mx-auto px-6 py-10 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: <FileText size={20}/>, title: "PYQ PAPERS", desc: "Organized Previous years.", color: "emerald" },
              { icon: <BookOpen size={20}/>, title: "HAND NOTES", desc: "DU Faculty Aligned.", color: "blue" },
              { icon: <Layout size={20}/>, title: "SYLLABUS", desc: "Direct Exam Mapping.", color: "purple" },
              { icon: <Video size={20}/>, title: "LECTURES", desc: "Visual Theorem Proofs.", color: "red" }
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-emerald-500/30 transition-all backdrop-blur-sm">
                  <div className={`p-3 bg-${item.color}-500/10 text-${item.color}-500 w-fit rounded-xl mb-6 group-hover:scale-110 transition-transform`}>{item.icon}</div>
                  <h4 className="text-xl font-black mb-1 tracking-tight">{item.title}</h4>
                  <p className="text-stone-500 text-[9px] font-bold uppercase tracking-widest leading-relaxed">{item.desc}</p>
              </div>
            ))}
        </div>
      </section>

      {/* --- SEMESTER VAULT SECTION --- */}
      <section id="resources" className="py-32 px-6 relative z-10">
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
          </div>
        </div>
      </section>

      {/* --- HUGE ABOUT US / THE TEAM SECTION --- */}
      <section id="about" className="py-52 px-6 relative z-10 bg-[#080808]">
        <div className="max-w-7xl mx-auto relative">
            <div className="mb-32">
                <div className="inline-flex items-center gap-2 text-emerald-500 font-black text-[11px] tracking-[0.6em] uppercase mb-8">
                    <GraduationCap size={16}/> Rajdhani College Collective
                </div>
                <h2 className="text-7xl md:text-[9rem] font-black tracking-tighter uppercase mb-12 leading-[0.85] text-white">
                    THE BRAINS <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-200">BEHIND THE VAULT.</span>
                </h2>
                <div className="h-1 w-40 bg-emerald-500 mb-12"></div>
                <p className="text-xl md:text-3xl text-stone-400 max-w-4xl leading-snug font-medium tracking-tight">
                    We are final-year B.Sc Mathematics Honors students at Rajdhani College. 
                    What started as a personal struggle to find quality resources evolved 
                    into a high-performance ecosystem for the entire DU community.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                    { 
                        name: "Dhruv Arya", 
                        role: "Frontend Architecture", 
                        icon: <Monitor className="text-blue-500" size={40}/>, 
                        desc: "Mastermind behind the high-performance user interface and seamless navigation logic." 
                    },
                    { 
                        name: "Aditya Balotra", 
                        role: "Backend Systems", 
                        icon: <Database className="text-emerald-500" size={40}/>, 
                        desc: "The engineer responsible for the secure, globally-distributed vault infrastructure and API core." 
                    }
                ].map((member, i) => (
                    <motion.div 
                        key={i} 
                        whileHover={{ y: -10 }}
                        className="p-16 bg-white/[0.02] border border-white/10 rounded-[4rem] hover:border-emerald-500/40 transition-all group backdrop-blur-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-20 transition-opacity">
                            {member.icon}
                        </div>
                        <div className="w-20 h-20 bg-white/5 text-white flex items-center justify-center rounded-3xl mb-10 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-all">
                            {member.icon}
                        </div>
                        <h4 className="text-4xl font-black mb-3 tracking-tighter uppercase">{member.name}</h4>
                        <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.4em] mb-8">{member.role}</p>
                        <p className="text-lg text-stone-500 leading-relaxed font-medium max-w-sm">{member.desc}</p>
                    </motion.div>
                ))}
            </div>

            <div className="mt-32 p-20 bg-emerald-500 rounded-[5rem] text-black relative overflow-hidden group shadow-[0_0_80px_rgba(16,185,129,0.3)]">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="text-center md:text-left">
                        <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-none">JOIN THE <br/>COLLECTIVE.</h3>
                        <p className="font-bold text-emerald-950 uppercase text-sm tracking-widest max-w-md">Contribute notes, papers, or technical suggestions to help the Rajdhani community grow.</p>
                    </div>
                    <button className="bg-black text-white px-16 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:scale-110 transition-all active:scale-95 shadow-2xl shrink-0">Contact the Team</button>
                </div>
                <Heart className="absolute -bottom-20 -right-20 text-emerald-600/20 w-96 h-96 rotate-12" />
            </div>
        </div>
      </section>

      <footer className="py-20 px-6 border-t border-white/5 bg-[#010101] z-10 relative text-center md:text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-10">
          <div className="flex items-center gap-3 justify-center md:justify-start">
             <div className="w-9 h-9 bg-emerald-600 text-white flex items-center justify-center rounded-lg font-black text-xl shadow-lg shadow-emerald-500/20">∆</div>
             <span className="font-black text-lg tracking-tighter uppercase">MathVault</span>
          </div>
          <div className="text-[9px] font-black text-stone-700 uppercase tracking-[0.5em]">
             Built for Rajdhani College by Students
          </div>
          <div className="flex justify-center md:justify-end gap-8 text-[9px] font-black text-stone-600 uppercase tracking-widest">
             <a href="#" className="hover:text-emerald-400 transition-all">Github</a>
             <a href="#" className="hover:text-emerald-400 transition-all">Community</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;