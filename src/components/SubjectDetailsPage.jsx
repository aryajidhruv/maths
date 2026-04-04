import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, PlayCircle, FileText, Loader2, X, StickyNote 
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

  // 1. Fetch Units and Dynamic PYQ Years from Backend
  useEffect(() => {
    const fetchData = async () => {
      setLoadingUnits(true);
      setLoadingYears(true);
      try {
        // Fetch Units
        const unitRes = await axios.get(`${API_BASE_URL}/metadata`, {
          params: { of: 'units', core_id: subjectId }
        });
        setUnits(Array.isArray(unitRes.data) ? unitRes.data : Object.values(unitRes.data));

        // FETCH YEARS DYNAMICALLY
        const pyqRes = await axios.get(`${API_BASE_URL}/metadata`, {
          params: { of: 'pyqs', core_id: subjectId }
        });
        
        // This takes ["2023.pdf", "2025.pdf"] and turns it into ["2025", "2023"]
        const years = pyqRes.data
          
          .sort((a, b) => b - a); // Sort descending (latest year first)
          
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
        params: {
          unit: unitNo || undefined, 
          yr: year || undefined
        }
      });

      if (response.data?.resource_url) {
        window.open(response.data.resource_url, '_blank');
      } else {
        alert("Resource link not found in backend.");
      }
    } catch (err) {
      alert("Error accessing the vault.");
    } finally {
      setActionLoading(false);
      setIsYearModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans pb-20 selection:bg-emerald-100">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-stone-200/60 px-6 py-4 sticky top-0 z-[100] flex justify-between items-center shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 bg-stone-100 rounded-xl hover:bg-emerald-50 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-[1000] tracking-tighter uppercase text-stone-900">{subjectName}</h1>
        <div className="bg-stone-950 text-white w-10 h-10 flex items-center justify-center rounded-xl font-black">∆</div>
      </nav>

      {/* Global Action Loader */}
      {actionLoading && (
        <div className="fixed inset-0 z-[200] bg-stone-900/20 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-white p-6 rounded-3xl shadow-2xl flex items-center gap-4 border border-stone-100">
            <Loader2 className="animate-spin text-emerald-600" />
            <span className="font-black text-xs uppercase tracking-widest text-stone-600">Syncing...</span>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Top Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-16">
            <button onClick={() => setIsYearModalOpen(true)} className="flex items-center justify-center gap-4 p-8 bg-white border border-stone-200 rounded-[2.5rem] hover:border-emerald-500 transition-all group shadow-sm">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all"><FileText size={20}/></div>
                <span className="font-black text-[11px] uppercase tracking-widest">PYQ Papers</span>
            </button>
            <button onClick={() => handleResourceAccess('syllabus')} className="flex items-center justify-center gap-4 p-8 bg-white border border-stone-200 rounded-[2.5rem] hover:border-emerald-500 transition-all group shadow-sm">
                <div className="p-3 bg-stone-100 text-stone-600 rounded-xl group-hover:bg-stone-900 group-hover:text-white transition-all"><BookOpen size={20}/></div>
                <span className="font-black text-[11px] uppercase tracking-widest">Syllabus</span>
            </button>
        </div>

        {/* Units List */}
        <div className="space-y-6">
          <h3 className="text-2xl font-[1000] tracking-tighter text-stone-900 uppercase mb-8">Unit Vault</h3>
          {loadingUnits ? (
            <div className="flex justify-center py-24"><Loader2 className="animate-spin text-emerald-500" size={32}/></div>
          ) : (
            units.map((unit, i) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className="bg-white border border-stone-200 rounded-[2.5rem] p-6 md:p-8 hover:border-emerald-200 transition-all group shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center gap-8 text-left">
                  <div className="flex-1 flex gap-6">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-stone-50 border border-stone-100 text-stone-950 flex items-center justify-center font-black text-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">{i + 1}</div>
                    <p className="font-black text-stone-800 text-lg leading-tight flex-1 flex items-center">{unit}</p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => handleResourceAccess('notes', i + 1)} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-7 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-stone-900 transition-all">
                      <StickyNote size={16}/> Notes
                    </button>
                    <button onClick={() => handleResourceAccess('videos', i + 1)} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-7 py-4 bg-stone-100 text-stone-700 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-50 transition-all">
                      <PlayCircle size={16}/> Video
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* DYNAMIC YEAR MODAL (Synced with Backend) */}
      <AnimatePresence>
        {isYearModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-stone-950/40 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-[3rem] p-10 relative shadow-2xl">
              <button onClick={() => setIsYearModalOpen(false)} className="absolute top-8 right-8 text-stone-300 hover:text-stone-900 transition-colors"><X size={24}/></button>
              <h2 className="text-2xl font-[1000] tracking-tighter text-stone-900 mb-8 text-center uppercase tracking-widest">Select Year</h2>
              
              {loadingYears ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500"/></div>
              ) : pyqYears.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {pyqYears.map(year => (
                    <button 
                      key={year} 
                      onClick={() => handleResourceAccess('pyqs', null, year)} 
                      className="py-5 bg-stone-50 border border-stone-100 rounded-2xl font-black text-stone-900 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                    >
                      {year}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                    <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">No papers found</p>
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