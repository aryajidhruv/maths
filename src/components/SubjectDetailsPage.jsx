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
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 rounded-full blur-[120px]" />
      </div>

      <nav className="sticky top-0 z-[100] bg-black/60 backdrop-blur-xl border-b border-white/10 px-6 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white/5 border border-white/20 rounded-xl hover:border-emerald-500/50 transition-all">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-sm font-black tracking-tighter uppercase">{subjectName}</h1>
          <div className="bg-emerald-500 text-black w-10 h-10 flex items-center justify-center rounded-xl font-black">∆</div>
        </div>
      </nav>

      {/* Action Loader */}
      <AnimatePresence>
        {actionLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-emerald-500" size={48} />
              <span className="font-black text-xs uppercase tracking-[0.4em] text-emerald-500">Processing</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-5xl mx-auto px-6 pt-16">
        <header className="mb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-6 font-black text-[10px] uppercase tracking-widest">
            <Sparkles size={14} /> Subject Resources
          </motion.div>
          <h2 className="text-5xl md:text-8xl font-[1000] tracking-tighter uppercase leading-[0.85]">
            Curated <br /><span className="italic text-emerald-500">Materials.</span>
          </h2>
        </header>

        {/* Top Bento Cards with Highlighted Borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <button onClick={() => setIsYearModalOpen(true)} className="group relative p-8 rounded-[2.5rem] bg-[#0A0A0A] border border-white/20 hover:border-emerald-500/60 hover:bg-[#0f0f0f] transition-all text-left shadow-2xl">
            <div className="mb-12 p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit border border-emerald-500/20 group-hover:border-emerald-500 transition-all"><FileText size={32} /></div>
            <h3 className="text-3xl font-black tracking-tighter uppercase">Question Papers</h3>
            <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mt-2">Dynamic PYQ Archive</p>
            <ChevronRight className="absolute bottom-10 right-10 text-stone-700 group-hover:text-emerald-500 transition-all" />
          </button>

          <button onClick={() => handleResourceAccess('syllabus')} className="group relative p-8 rounded-[2.5rem] bg-[#0A0A0A] border border-white/20 hover:border-white/50 transition-all text-left shadow-2xl">
            <div className="mb-12 p-4 bg-white/5 text-white rounded-2xl w-fit border border-white/10 group-hover:border-white/30 transition-all"><BookOpen size={32} /></div>
            <h3 className="text-3xl font-black tracking-tighter uppercase">Syllabus</h3>
            <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mt-2">Full Course Roadmap</p>
            <ChevronRight className="absolute bottom-10 right-10 text-stone-700 group-hover:text-white transition-all" />
          </button>
        </div>

        {/* Units with High Contrast Borders */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black tracking-tighter uppercase mb-8 opacity-50">Unit Curriculum</h3>
          {loadingUnits ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" /></div>
          ) : (
            <div className="space-y-4">
              {units.map((unit, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  className="group bg-[#0A0A0A] border border-white/10 hover:border-emerald-500/40 rounded-[2rem] p-6 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.05)]"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1 flex items-center gap-6">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-black border border-white/20 flex items-center justify-center font-black text-emerald-500 group-hover:border-emerald-500 transition-all">{i + 1}</div>
                      <p className="font-black text-lg tracking-tight leading-tight">{unit}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleResourceAccess('notes', i + 1)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"><StickyNote size={14} /> Notes</button>
                      <button onClick={() => handleResourceAccess('videos', i + 1)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"><PlayCircle size={14} /> Video</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal with defined border */}
      <AnimatePresence>
        {isYearModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0A0A0A] border border-white/20 w-full max-w-md rounded-[3rem] p-10 relative shadow-[0_0_50px_rgba(0,0,0,1)]">
              <button onClick={() => setIsYearModalOpen(false)} className="absolute top-8 right-8 text-stone-500 hover:text-white"><X size={24} /></button>
              <h2 className="text-2xl font-black uppercase text-center mb-8 tracking-widest">Select Year</h2>
              {loadingYears ? <Loader2 className="animate-spin mx-auto text-emerald-500" /> : (
                <div className="grid grid-cols-2 gap-3">
                  {pyqYears.map(year => (
                    <button key={year} onClick={() => handleResourceAccess('pyqs', null, year)} className="py-6 bg-white/5 border border-white/10 rounded-2xl font-black hover:bg-emerald-600 hover:text-black transition-all">{year}</button>
                  ))}
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