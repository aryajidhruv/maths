import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, PlayCircle, FileText, Loader2, X, Sparkles, ChevronRight, Download, Eye 
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
        const unitRes = await axios.get(`${API_BASE_URL}/metadata/maths`, {
          params: { of: 'units', core_id: subjectId }
        });
        setUnits(Array.isArray(unitRes.data) ? unitRes.data : Object.values(unitRes.data));

        const pyqRes = await axios.get(`${API_BASE_URL}/metadata/maths`, {
          params: { of: 'pyqs', core_id: subjectId }
        });
        const years = Array.isArray(pyqRes.data) ? pyqRes.data.sort((a, b) => b - a) : [];
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

  /**
   * STAGE 1: AUTH INITIALIZATION
   * Fetches the JWT token required for resource access
   */
  const getAuthToken = async (resourceType) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/init`, null, {
        params: {
          discipline: 'maths',
          core_id: subjectId,
          type: resourceType
        }
      });
      // The schema implies successful response returns the token. 
      // Adjusted to common FastAPI JWT response structure.
      return response.data.access_token || response.data;
    } catch (err) {
      console.error("Secure Session Initialization Failed:", err);
      return null;
    }
  };

  /**
   * STAGE 2: AUTHORIZED RESOURCE ACCESS
   */
  const handleResourceAccess = async (type, unitNo = null, year = null, mode = 'preview') => {
    setActionLoading(true);
    try {
      const resourceType = type === 'videos' ? 'v_refs' : type;
      
      // 1. Handshake with /auth/init to get JWT
      const token = await getAuthToken(resourceType);
      
      if (!token) {
        alert("Security Error: Access token could not be verified.");
        return;
      }

      // 2. Request Resource with Bearer Token in Headers
      const url = `${API_BASE_URL}/resource/maths/${subjectId}/${resourceType}`;
      const response = await axios.get(url, {
        params: { 
          unit: unitNo || undefined, 
          yr: year || undefined 
        },
        headers: { 
          'Authorization': `Bearer ${token.token}`,
          'Accept': 'application/json' 
        }
      });

      const resourceUrl = response.data?.resource_url?.[0];

      if (!resourceUrl || typeof resourceUrl !== "string") {
        alert("The requested node is empty in the vault.");
        return;
      }

      // 3. Delivery Logic
      if (mode === 'download') {
        try {
          const fileRes = await axios.get(resourceUrl, { responseType: 'blob' });
          const blob = new Blob([fileRes.data], { type: 'application/pdf' });
          const blobUrl = window.URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = blobUrl;
          const identifier = unitNo ? `Unit_${unitNo}` : `Session_${year}`;
          const fileName = `${subjectName}_${identifier}_${type}.pdf`.replace(/\s+/g, '_');
          
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        } catch (downloadErr) {
          window.open(resourceUrl, '_blank');
        }
      } else {
        window.open(resourceUrl, '_blank');
      }
    } catch (err) {
      console.error("Vault Access Error:", err);
      alert("Authentication failed or resource is restricted.");
    } finally {
      setActionLoading(false);
      setIsYearModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans pb-24">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 rounded-full blur-[120px]" />
      </div>

      <nav className="sticky top-0 z-[100] bg-black/60 backdrop-blur-xl border-b border-white/10 px-6 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white/5 border border-white/20 rounded-xl hover:border-emerald-500/50 transition-all">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xs font-black tracking-widest uppercase opacity-70">{subjectName}</h1>
          <div className="bg-emerald-500 text-black w-10 h-10 flex items-center justify-center rounded-xl font-black">∆</div>
        </div>
      </nav>

      {/* Auth Loader */}
      <AnimatePresence>
        {actionLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <Loader2 className="animate-spin text-emerald-500" size={64} />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-black text-[10px] uppercase tracking-[0.6em] text-emerald-500 mb-1">Authorizing Access</p>
                <p className="text-[8px] uppercase tracking-widest text-white/30 font-bold">Connecting to Secure Node...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-5xl mx-auto px-6 pt-16">
        <header className="mb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-6 font-black text-[10px] uppercase tracking-widest">
            <Sparkles size={14} /> Subject Resources
          </motion.div>
          <h2 className="text-6xl md:text-8xl font-[1000] tracking-tighter uppercase leading-[0.85]">
            Access <br /><span className="italic text-emerald-500">Vault.</span>
          </h2>
        </header>

        {/* Global Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <button onClick={() => setIsYearModalOpen(true)} className="group relative p-8 rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 hover:border-emerald-500/60 transition-all text-left shadow-2xl overflow-hidden">
            <div className="mb-12 p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit border border-emerald-500/20 group-hover:border-emerald-500 transition-all"><FileText size={32} /></div>
            <h3 className="text-3xl font-black tracking-tighter uppercase">Exam Papers</h3>
            <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest mt-2">Historical PYQ Library</p>
            <ChevronRight className="absolute bottom-10 right-10 text-stone-700 group-hover:text-emerald-500 transition-all" />
          </button>

          <button onClick={() => handleResourceAccess('syllabus')} className="group relative p-8 rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 hover:border-white/40 transition-all text-left shadow-2xl">
            <div className="mb-12 p-4 bg-white/5 text-white rounded-2xl w-fit border border-white/10 group-hover:border-white/30 transition-all"><BookOpen size={32} /></div>
            <h3 className="text-3xl font-black tracking-tighter uppercase">Syllabus</h3>
            <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest mt-2">Course Objectives</p>
            <ChevronRight className="absolute bottom-10 right-10 text-stone-700 group-hover:text-white transition-all" />
          </button>
        </div>

        {/* Unit Breakdown */}
        <section className="space-y-6">
          <h3 className="text-xl font-black tracking-tighter uppercase mb-8 opacity-40">Unit Curriculum</h3>
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
                  className="group bg-[#0A0A0A] border border-white/5 hover:border-emerald-500/30 rounded-[2.5rem] p-8 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                    <div className="flex-1 flex items-center gap-6">
                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-black border border-white/10 flex items-center justify-center font-black text-xl text-emerald-500 group-hover:border-emerald-500 transition-all">{i + 1}</div>
                      <p className="font-black text-xl tracking-tight leading-tight max-w-md">{unit}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 lg:ml-auto">
                      <button 
                        onClick={() => handleResourceAccess('notes', i + 1, null, 'preview')} 
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                      >
                        <Eye size={16} /> Preview
                      </button>
                      
                      <button 
                        onClick={() => handleResourceAccess('notes', i + 1, null, 'download')} 
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                      >
                        <Download size={16} /> Download
                      </button>

                      <button 
                        onClick={() => handleResourceAccess('videos', i + 1)} 
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 text-stone-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
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

      {/* PYQ Year Selection Modal */}
      <AnimatePresence>
        {isYearModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0A0A0A] border border-white/10 w-full max-w-md rounded-[3.5rem] p-12 relative shadow-[0_0_100px_rgba(0,0,0,1)]">
              <button onClick={() => setIsYearModalOpen(false)} className="absolute top-10 right-10 text-stone-500 hover:text-white transition-colors"><X size={28} /></button>
              <h2 className="text-2xl font-black uppercase text-center mb-10 tracking-widest">Select Session</h2>
              {loadingYears ? <Loader2 className="animate-spin mx-auto text-emerald-500" /> : (
                <div className="grid grid-cols-2 gap-4">
                  {pyqYears.map(year => (
                    <button 
                      key={year} 
                      onClick={() => handleResourceAccess('pyqs', null, year, 'download')} 
                      className="py-6 bg-white/5 border border-white/10 rounded-2xl font-black text-lg hover:bg-emerald-600 hover:text-black transition-all flex flex-col items-center gap-2"
                    >
                      {year}
                      <Download size={16} className="opacity-40" />
                    </button>
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