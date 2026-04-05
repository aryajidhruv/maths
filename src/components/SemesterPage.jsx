import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Loader2, AlertCircle, Sparkles, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
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
        Accessing Vault Node
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
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      char: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)],
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 0.5,
      duration: 1.2 + Math.random() * 1.5,
      size: 12 + Math.random() * 30,
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

// --- AMBIENT FLOATING BACKGROUND ---
const FloatingMathParticles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      char: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: 16 + Math.random() * 30,
      duration: 20 + Math.random() * 30,
      delay: Math.random() * -15
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          animate={{ 
            y: [0, -60, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360],
            opacity: [0.05, 0.2, 0.05],
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

const SemesterPage = () => {
  const { semId } = useParams();
  const navigate = useNavigate();
  
  const [siteReady, setSiteReady] = useState(false);
  const [showRain, setShowRain] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSemesterData = async () => {
      const startTime = Date.now();
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/metadata`, {
          params: { of: 'cores' },
          headers: { 'accept': 'application/json' }
        });

        const currentSemSubjects = response.data[semId];
        
        if (currentSemSubjects) {
          const formattedSubjects = Object.entries(currentSemSubjects).map(([id, name]) => ({
            id, 
            name: name.charAt(0).toUpperCase() + name.slice(1), 
          }));
          setSubjects(formattedSubjects);
        } else {
          setError(`No subjects mapped for Semester ${semId} yet.`);
        }
      } catch (err) { 
        setError("Vault sync failed. Check your network.");
      } finally { 
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1000 - elapsed);
        
        setTimeout(() => {
          setLoading(false);
          setSiteReady(true);
          setShowRain(true);
          setTimeout(() => setShowRain(false), 4000);
        }, remaining);
      }
    };
    fetchSemesterData();
  }, [semId]);

  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [subjects, searchTerm]);

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
            
            {/* 1. ANIMATED AMBIENT BACKGROUND */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
              <FloatingMathParticles />
              <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse z-[-1]"></div>
              <div className="absolute inset-0 opacity-[0.03] z-[-1]" style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
            </div>

            {/* --- NAVBAR --- */}
            <motion.nav 
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl px-6 py-4 flex justify-between items-center"
            >
              <button 
                onClick={() => navigate('/')} 
                className="group flex items-center gap-3 text-stone-400 hover:text-emerald-400 transition-all active:scale-95"
              >
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-emerald-500 group-hover:text-black transition-all">
                  <ArrowLeft size={18}/>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Return to Hub</span>
              </button>
              
              <div className="flex items-center gap-3">
                <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Accessing Node 0{semId}</span>
                <div className="w-9 h-9 bg-emerald-600 text-white flex items-center justify-center rounded-lg font-black text-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">∆</div>
              </div>
            </motion.nav>

            {/* --- MAIN CONTENT --- */}
            <main className="max-w-6xl mx-auto px-6 pt-40 pb-20 relative z-10">
              <header className="mb-16">
                <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                  <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[9px] font-black tracking-[0.2em] text-emerald-400 uppercase bg-emerald-500/5 border border-emerald-500/20 rounded-full">
                    <Sparkles size={12} /> Rajdhani College • Academic Vault
                  </motion.div>
                  <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-black mb-10 tracking-tighter uppercase leading-[0.85]">
                    SEMESTER <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-200 italic">0{semId} ARCHIVE.</span>
                  </motion.h1>
                </motion.div>

                {/* SEARCH BOX */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative group max-w-2xl">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Filter subjects by name..." 
                    className="w-full pl-16 pr-8 py-5 bg-white/[0.03] border border-white/10 rounded-2xl outline-none shadow-sm font-black uppercase text-[10px] tracking-widest focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all placeholder:text-stone-700" 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                  />
                </motion.div>
              </header>

              {error && (
                <div className="mb-12 p-8 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] flex items-center gap-4 text-red-500 backdrop-blur-md">
                  <AlertCircle size={20} />
                  <p className="font-black text-xs uppercase tracking-widest leading-relaxed">{error}</p>
                </div>
              )}

              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={staggerContainer} 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredSubjects.map((subject) => (
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -5 }}
                    variants={fadeInUp}
                    key={subject.id} 
                    onClick={() => navigate(`/semester/${semId}/subject/${subject.id}`, { state: { subjectName: subject.name } })}
                    className="group cursor-pointer bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden transition-all hover:bg-[#111] hover:border-emerald-500/40 backdrop-blur-md"
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-10 relative z-10">
                      <div className="w-12 h-12 bg-white/5 text-emerald-500 flex items-center justify-center rounded-xl font-black text-xl group-hover:bg-emerald-500 group-hover:text-black transition-all">
                        {subject.name.charAt(0)}
                      </div>
                      <div className="p-2 bg-white/5 rounded-lg group-hover:bg-emerald-500 transition-all group-hover:text-black">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                    <h3 className="text-3xl font-black mb-4 relative z-10 group-hover:text-emerald-400 transition-colors tracking-tighter leading-tight uppercase">
                      {subject.name}
                    </h3>
                    <p className="text-[9px] font-black text-stone-500 uppercase tracking-[0.3em] relative z-10">Access Knowledge Core</p>
                  </motion.div>
                ))}
              </motion.div>

              {!loading && filteredSubjects.length === 0 && (
                <div className="text-center py-24 border border-dashed border-white/5 rounded-[4rem]">
                  <p className="text-stone-700 font-black text-xs uppercase tracking-[0.5em]">No matching records found in vault</p>
                </div>
              )}
            </main>

            <footer className="py-20 text-center opacity-30">
              <p className="text-[9px] font-black uppercase tracking-[0.4em]">Rajdhani College • DU • Mathematics Collective</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SemesterPage;