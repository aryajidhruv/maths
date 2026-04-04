import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Loader2, AlertCircle, Sparkles, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// --- SHARED WAM-STYLE BACKGROUND ---
const FloatingMathParticles = () => {
  const symbols = ['∫', 'π', '∞', 'Σ', '√', 'Δ', 'θ', 'λ', 'Ω', '∂', '≈', '≠'];
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      char: symbols[Math.floor(Math.random() * symbols.length)],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: 14 + Math.random() * 30,
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

const SemesterPage = () => {
  const { semId } = useParams();
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSemesterData = async () => {
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
        setLoading(false); 
      }
    };
    fetchSemesterData();
  }, [semId]);

  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [subjects, searchTerm]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* 1. ANIMATED AMBIENT BACKGROUND */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <FloatingMathParticles />
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl px-6 py-4 flex justify-between items-center">
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
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-6xl mx-auto px-6 pt-40 pb-20 relative z-10">
        
        <header className="mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[9px] font-black tracking-[0.2em] text-emerald-400 uppercase bg-emerald-500/5 border border-emerald-500/20 rounded-full">
              <Sparkles size={12} /> Rajdhani College • Academic Vault
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter uppercase leading-[0.85]">
              SEMESTER <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-200 italic">0{semId} ARCHIVE.</span>
            </h1>
          </motion.div>

          {/* SEARCH BOX */}
          <div className="relative group max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Filter subjects by name..." 
              className="w-full pl-16 pr-8 py-5 bg-white/[0.03] border border-white/10 rounded-2xl outline-none shadow-sm font-black uppercase text-[10px] tracking-widest focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all placeholder:text-stone-700" 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </header>

        {error && (
          <div className="mb-12 p-8 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] flex items-center gap-4 text-red-500 backdrop-blur-md">
            <AlertCircle size={20} />
            <p className="font-black text-xs uppercase tracking-widest leading-relaxed">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-emerald-500 mb-6" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-600">Decrypting Metadata...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => (
              <motion.div 
                whileHover={{ scale: 1.02, y: -5 }}
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
          </div>
        )}

        {!loading && filteredSubjects.length === 0 && (
          <div className="text-center py-24 border border-dashed border-white/5 rounded-[4rem]">
            <p className="text-stone-700 font-black text-xs uppercase tracking-[0.5em]">No matching records found in vault</p>
          </div>
        )}
      </main>

      <footer className="py-20 text-center opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.4em]">Rajdhani College • DU • Mathematics Collective</p>
      </footer>
    </div>
  );
};

export default SemesterPage;