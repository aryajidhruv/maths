import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Loader2, Menu, X } from 'lucide-react'; // Added Menu/X for Mobile Nav
import { API_BASE_URL } from '../config';

const LandingPage = () => {
  const navigate = useNavigate();
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile Menu Toggle

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

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-emerald-100 scroll-smooth">
      {/* --- RESPONSIVE NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="bg-emerald-600 text-white w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl md:rounded-2xl font-black text-xl md:text-2xl shadow-lg">
            ∆
          </div>
          <span className="text-xl md:text-2xl font-extrabold text-stone-950 tracking-tighter">
            <span className="text-emerald-700">Math</span>Vault
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-stone-700">
          <a href="#resources" className="hover:text-emerald-700 transition">PYQs</a>
          <a href="#why" className="hover:text-emerald-700 transition">How to Contribute</a>
          <button className="bg-stone-950 text-white px-6 py-3 rounded-full hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-stone-200">
            Explore Dashboard
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-stone-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28}/> : <Menu size={28}/>}
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-stone-200 p-6 flex flex-col gap-6 md:hidden shadow-xl animate-in slide-in-from-top">
            <a href="#resources" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-stone-800">PYQs</a>
            <a href="#why" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-stone-800">Contribute</a>
            <button className="bg-stone-950 text-white py-4 rounded-2xl font-bold">Explore Dashboard</button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="py-12 md:py-24 px-6 bg-white border-b border-stone-100 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 mb-6 text-[10px] md:text-xs font-bold tracking-widest text-emerald-700 uppercase bg-emerald-50 rounded-full border border-emerald-100">
              DU Mathematics Honors Hub
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-stone-950 mb-6 leading-tight tracking-tighter">
              Get organized <span className="text-emerald-600 italic">past year papers</span> in one click.
            </h1>
            <p className="text-base md:text-lg text-stone-600 mb-8 md:mb-12 leading-relaxed max-w-xl">
              Ditch the scattered notes. MathVault centralizes your curriculum, PYQs, and study resources specifically for Delhi University students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <a href="#resources" className="text-center px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95">
                Browse Semesters
              </a>
              <a href="#why" className="text-center px-8 py-4 bg-white text-stone-800 font-bold border-2 border-stone-200 rounded-2xl hover:bg-stone-50 transition-all active:scale-95">
                About The Project
              </a>
            </div>
          </motion.div>

          {/* Graphic Container - Hidden on small mobile to save space */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="hidden sm:block relative">
            <div className="bg-emerald-50 rounded-[3rem] border-4 border-emerald-100 flex items-center justify-center text-6xl md:text-8xl shadow-2xl p-10 md:p-16 overflow-hidden aspect-square lg:aspect-auto lg:h-[400px]">
               <span className="opacity-10 absolute scale-[3] rotate-12 font-mono text-emerald-900 select-none">∫ dx f(x) lim θ² ∆∑</span>
               <span className="text-emerald-900 drop-shadow-lg font-black tracking-tighter">∑²</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* --- FEATURES SECTION --- */}
      <section id="why" className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-950 mb-12 md:mb-16 text-center tracking-tighter">
            Specifically designed for <span className="text-emerald-700 italic">Math Honors.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all">
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h4 className="text-xl font-bold text-stone-900 mb-3 tracking-tight">{feature.title}</h4>
                <p className="text-stone-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SEMESTER GRID --- */}
      <section id="resources" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-950 tracking-tighter mb-4">Select Your Semester</h2>
          <p className="text-stone-500 font-medium mb-12 md:mb-16">Direct access to sorted subject resources.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {loading ? (
              <div className="col-span-full py-10 flex flex-col items-center text-stone-400">
                <Loader2 className="animate-spin mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest tracking-tighter">Syncing Resources...</p>
              </div>
            ) : (
              availableSemesters.map(sem => (
                <button 
                  key={sem}
                  onClick={() => navigate(`/semester/${sem}`)} 
                  className="group relative bg-stone-50 border border-stone-200 p-6 md:p-8 rounded-3xl text-center hover:border-emerald-400 hover:bg-white transition-all active:scale-95"
                >
                  <h3 className="text-3xl md:text-4xl font-black text-stone-900 mb-1 group-hover:text-emerald-700 transition-colors">0{sem}</h3>
                  <p className="text-[10px] md:text-xs font-black text-stone-400 uppercase tracking-[0.2em]">Semester</p>
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-stone-100 text-stone-700 py-12 md:py-16 px-6 border-t border-stone-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
          <div className="space-y-2">
            <p className="text-sm font-bold text-stone-900 uppercase tracking-widest">MathVault DU</p>
            <p className="text-xs max-w-xs text-stone-500">A community project to simplify Mathematics resources for college students.</p>
          </div>
          <div className="md:text-right">
            <p className="text-sm font-bold text-stone-950 underline decoration-emerald-500 underline-offset-4">@BadyCode Project</p>
            <p className="text-[10px] text-stone-400 mt-2">&copy; 2026 MathVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;