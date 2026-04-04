import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, PlayCircle, FileText, Loader2, X, StickyNote, Sparkles, ChevronRight 
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const SubjectDetailsPage = () => {
  const { subjectId } = useParams(); 
  const navigate = useNavigate();
  const { state } = useLocation();
  const subjectName = state?.subjectName || "Subject Details";

  const [units, setUnits] = useState([]);
  const [pyqYears, setPyqYears] = useState([]); 
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingUnits(true);
      setLoadingYears(true);
      try {
        const unitRes = await axios.get(`${API_BASE_URL}/metadata`, {
          params: { of: 'units', core_id: subjectId }
        });
        setUnits(Array.isArray(unitRes.data) ? unitRes.data : Object.values(unitRes.data));

        const pyqRes = await axios.get(`${API_BASE_URL}/metadata`, {
          params: { of: 'pyqs', core_id: subjectId }
        });
        const years = pyqRes.data.sort((a, b) => b - a);
        setPyqYears(years);
      } catch (err) { 
        console.error("Backend sync failed", err);
      } finally { 
        setLoadingUnits(false); 
        setLoadingYears(false);
      }
    };
    fetchData();
  }, [subjectId]);

  const handleResourceAccess = async (type, unitNo = null, year = null) => {
    setActionLoading(true);
    try {
      const resourceType = type === 'videos' ? 'v_refs' : type;
      const url = `https://maths-arity.fastapicloud.dev/maths/resources/${subjectId}/${resourceType}`;
      
      const response = await axios.get(url, {
        params: { unit: unitNo || undefined, yr: year || undefined }
      });

      if (response.data?.resource_url) {
        window.open(response.data.resource_url, '_blank');
      } else {
        alert("Resource link not found in backend.");
      }
    } catch (err) {
      alert("Resource not available.");
    } finally {
      setActionLoading(false);
      setIsYearModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans pb-24">
      {/* Dynamic Glow Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-[100] bg-black/60 backdrop-blur-xl border-b border-white/5 px-6 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all text-stone-400 hover:text-emerald-400"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-500 mb-0.5">Academic Vault</span>
            <h1 className="text-sm font-black tracking-tighter uppercase">{subjectName}</h1>
          </div>

          <div className="bg-emerald-500 text-black w-10 h-10 flex items-center justify-center rounded-xl font-black shadow-lg shadow-emerald-500/20">
            ∆
          </div>
        </div>
      </nav>

      {/* Global Loading Overlay */}
      <AnimatePresence>
        {actionLoading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Loader2 className="animate-spin text-emerald-500" size={48} />
                <div className="absolute inset-0 blur-xl bg-emerald-500/20 animate-pulse" />
              </div>
              <span className="font-black text-xs uppercase tracking-[0.4em] text-emerald-500">Decrypting...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-5xl mx-auto px-6 pt-16">
        {/* Hero Section */}
        <header className="mb-20 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 mb-6"
          >
            <Sparkles size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Version 2.0 Synced</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-8xl font-[1000] tracking-tighter leading-[0.85] mb-8 uppercase">
            Master the <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 italic">Curriculum.</span>
          </h2>
        </header>

        {/* Bento Grid Top Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          <button 
            onClick={() => setIsYearModalOpen(true)} 
            className="group relative overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br from-stone-900 to-black border border-white/10 hover:border-emerald-500/50 transition-all text-left"
          >
            <div className="mb-12 p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <FileText size={32} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter uppercase">Previous Papers</h3>
            <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mt-2">Historical Exam Archive</p>
            <ChevronRight className="absolute bottom-10 right-10 text-stone-700 group-hover:text-emerald-500 transition-all" />
          </button>

          <button 
            onClick={() => handleResourceAccess('syllabus')} 
            className="group relative overflow-hidden p-8 rounded-[2.5rem] bg-stone-900 border border-white/10 hover:border-white/30 transition-all text-left"
          >
            <div className="mb-12 p-4 bg-white/5 text-white rounded-2xl w-fit group-hover:rotate-12 transition-transform">
              <BookOpen size={32} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter uppercase">Syllabus</h3>
            <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mt-2">Course Roadmap & Objectives</p>
            <ChevronRight className="absolute bottom-10 right-10 text-stone-700 group-hover:text-white transition-all" />
          </button>
        </div>

        {/* Unit Vault */}
        <section className="space-y-10">
          <div className="flex items-end justify-between border-b border-white/10 pb-8">
            <h3 className="text-4xl font-[1000] tracking-tighter uppercase italic">Unit Vault</h3>
            <span className="text-emerald-500/20 font-black text-6xl leading-none">{units.length}</span>
          </div>

          {loadingUnits ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Loader2 className="animate-spin text-emerald-500/50" size={40} />
              <p className="text-[10px] font-black tracking-[0.5em] text-stone-500 uppercase">Indexing Modules</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {units.map((unit, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} 
                  whileInView={{ opacity: 1, x: 0 }} 
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  key={i} 
                  className="group bg-white/5 border border-white/5 rounded-[2rem] p-6 hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-8">
                    <div className="flex-1 flex items-center gap-6">
                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-black border border-white/10 flex items-center justify-center font-black text-xl text-stone-500 group-hover:text-emerald-400 group-hover:border-emerald-500/50 transition-all">
                        {i + 1}
                      </div>
                      <p className="font-black text-lg tracking-tight leading-tight flex-1">{unit}</p>
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => handleResourceAccess('notes', i + 1)} 
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-black rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/10"
                      >
                        <StickyNote size={16} /> Notes
                      </button>
                      <button 
                        onClick={() => handleResourceAccess('videos', i + 1)} 
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest border border-white/10 transition-all"
                      >
                        <PlayCircle size={16} /> Video
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Year Modal */}
      <AnimatePresence>
        {isYearModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsYearModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#0A0A0A] border border-white/10 w-full max-w-md rounded-[3rem] p-10 relative shadow-2xl"
            >
              <button 
                onClick={() => setIsYearModalOpen(false)} 
                className="absolute top-8 right-8 text-stone-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="text-center mb-10">
                <h2 className="text-3xl font-[1000] tracking-tighter uppercase mb-2">Select Year</h2>
                <div className="h-1 w-12 bg-emerald-500 mx-auto rounded-full" />
              </div>
              
              {loadingYears ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" /></div>
              ) : pyqYears.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {pyqYears.map(year => (
                    <button 
                      key={year} 
                      onClick={() => handleResourceAccess('pyqs', null, year)} 
                      className="py-6 bg-white/5 border border-white/10 rounded-2xl font-black hover:bg-emerald-500 hover:text-black transition-all group overflow-hidden relative"
                    >
                      <span className="relative z-10">{year}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-[2rem]">
                  <p className="text-stone-600 font-bold text-xs uppercase tracking-[0.2em]">No archives found</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubjectDetailsPage;