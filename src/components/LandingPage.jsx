import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Loader2 } from 'lucide-react'; // Added for a subtle loading state
import { API_BASE_URL } from '../config';

const LandingPage = () => {
  const navigate = useNavigate();
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [loading, setLoading] = useState(true);

  // API Connection: Fetching semesters from your friend's 'cores' metadata
  useEffect(() => {
    const fetchSemesters = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/metadata`, {
          params: { of: 'cores' },
          headers: { 'accept': 'application/json' }
        });

        // Extracting keys ("1", "2", etc.) and converting to numbers
        const keys = Object.keys(response.data).map(k => parseInt(k));
        setAvailableSemesters(keys.sort((a, b) => a - b));
      } catch (err) {
        console.error("API Sync Error:", err);
        // Fallback to default 1-6 if API fails so UI doesn't stay empty
        setAvailableSemesters([1, 2, 3, 4, 5, 6]);
      } finally {
        setLoading(false);
      }
    };

    fetchSemesters();
  }, []);

  const features = [
    {title: "Centralized PYQs", desc: "Access 10 years of organized Previous Year Papers without digging through chaotic groups.", icon: "📚"},
    {title: "Curated resources", desc: "Hand-picked syllabus-compliant notes for ODE, Group Theory, Real Analysis, and more.", icon: "📝"},
    {title: "Student-Led", desc: "Built by Math students who understand the specific requirements and exam patterns.", icon: "🎓"},
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-emerald-100 scroll-smooth">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="bg-emerald-600 text-white w-10 h-10 flex items-center justify-center rounded-2xl font-black text-2xl shadow-lg shadow-emerald-200">
            ∆
          </div>
          <span className="text-2xl font-extrabold text-stone-950 tracking-tighter">
            <span className="text-emerald-700">Math</span>Vault
          </span>
        </div>
        <div className="flex items-center gap-8 text-sm font-semibold text-stone-700">
          <a href="#resources" className="hover:text-emerald-700 transition">PYQs</a>
          <a href="#how" className="hover:text-emerald-700 transition">How to Contribute</a>
          <button className="bg-stone-950 text-white px-6 py-3 rounded-full hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-stone-200">
            Explore Dashboard
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-20 px-6 bg-white border-b border-stone-100 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-emerald-700 uppercase bg-emerald-50 rounded-full border border-emerald-100">
              Mathematics Honors Hub
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-stone-950 mb-6 leading-tight tracking-tighter">
              Get organised <span className="text-emerald-600 italic">past year papers</span> in one click.
            </h1>
            <p className="text-lg text-stone-600 mb-12 leading-relaxed max-w-xl">
              Ditch the scattered notes. MathVault centralizes your curriculum, PYQs, and study resources specifically for Delhi University Math students.
            </p>
            <div className="flex flex-wrap gap-5">
              <a href="#resources" className="px-10 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 hover:-translate-y-1 transition-all shadow-xl shadow-emerald-200">
                Browse Semesters
              </a>
              <a href="#why" className="px-10 py-4 bg-white text-stone-800 font-bold border-2 border-stone-200 rounded-2xl hover:bg-stone-50 transition-all">
                About The Project
              </a>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className=" bg-emerald-50 rounded-3xl border-4 border-emerald-100 flex items-center justify-center text-8xl shadow-2xl shadow-emerald-100 p-8 overflow-hidden">
               <span className="opacity-10 absolute scale-[4] rotate-12 font-mono text-emerald-900">∫ dx f(x) lim θ² ∆∑</span>
               <span className="text-emerald-900 drop-shadow-lg">∑²</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Why We Built This Section */}
      <section id="why" className="py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-stone-950 mb-16 text-center tracking-tighter">Specifically designed for <span className="text-emerald-700 italic">Math Honors.</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl border border-stone-100 shadow-xl shadow-stone-100/50 hover:border-emerald-200 transition"
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h4 className="text-xl font-bold text-stone-900 mb-3 tracking-tight">{feature.title}</h4>
                <p className="text-stone-600 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resource Grid Section - NOW API DRIVEN */}
      <section id="resources" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-stone-950 tracking-tighter mb-4">Select Your Semester</h2>
            <p className="text-stone-500 font-medium">Click on a semester to access the full dashboard of resources.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {loading ? (
              <div className="col-span-full py-10 flex flex-col items-center text-stone-400">
                <Loader2 className="animate-spin mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">Syncing with xuzu.in...</p>
              </div>
            ) : (
              availableSemesters.map(sem => (
                <button 
                  key={sem}
                  onClick={() => navigate(`/semester/${sem}`)} 
                  className="group relative bg-stone-50 border border-stone-200 p-8 rounded-3xl text-center hover:border-emerald-400 hover:bg-white transition-all overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-emerald-600 font-bold">→</span>
                  </div>
                  <h3 className="text-4xl font-black text-stone-900 mb-2 group-hover:text-emerald-700 transition-colors">0{sem}</h3>
                  <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">Semester</p>
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-100 text-stone-700 py-16 px-6 border-t border-stone-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
          <p className="text-sm max-w-xs">Made with ☕ and React for the Delhi University Math Community.</p>
          <div className="md:text-right">
            <p className="text-sm font-bold text-stone-950">@BadyCode Project</p>
            <p className="text-xs text-stone-500 mt-1">&copy; 2026 MathVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;