import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, PlayCircle, FileText, Loader2, X, Sparkles, ChevronRight, Download 
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import ReactGA from 'react-ga4';

const SubjectDetailsPage = () => {
  const { subjectId } = useParams(); 
  const navigate = useNavigate();
  const { state } = useLocation();
  const subjectName = state?.subjectName || "Subject Details";

  // Guard: Safely parse ID and handle potential NaN
  const cleanCoreId = subjectId ? parseInt(subjectId.replace(/\D/g, ''), 10) : null;

  const [units, setUnits] = useState([]);
  const [pyqYears, setPyqYears] = useState([]); 
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [loadingYears, setLoadingYears] = useState(true);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!cleanCoreId) {
        setLoadingUnits(false);
        setLoadingYears(false);
        return;
      }
      
      try {
        // Fetch Units Metadata
        const unitRes = await axios.get(`${API_BASE_URL}/metadata/maths`, {
          params: { of: 'units', core_id: cleanCoreId }
        });
        const unitData = unitRes.data;
        setUnits(Array.isArray(unitData) ? unitData : (unitData ? Object.values(unitData) : []));

        // Fetch PYQ Metadata
        const pyqRes = await axios.get(`${API_BASE_URL}/metadata/maths`, {
          params: { of: 'pyqs', core_id: cleanCoreId }
        });
        const years = Array.isArray(pyqRes.data) ? pyqRes.data.sort((a, b) => b - a) : [];
        setPyqYears(years);
      } catch (err) { 
        console.error("Data Fetching failed:", err);
      } finally { 
        setLoadingUnits(false); 
        setLoadingYears(false);
      }
    };
    fetchData();
  }, [cleanCoreId]);

  const getAuthToken = async (resourceType) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/init`, null, {
        params: {
          discipline: 'maths',
          core_id: cleanCoreId.toString(),
          type: resourceType
        }
      });
      return response.data?.access_token || response.data;
    } catch (err) {
      console.error("Auth Token Error:", err);
      return null;
    }
  };

  /**
   * Access handler using the new 'mode' parameter
   */
  const handleResourceAccess = async (type, unitNo = null, year = null, mode = 'preview') => {
    // ReactGA.event({
    //   category: "Resource Access",
    //   action: `${type}_${mode}`,
    //   label: `${subjectName} ${unitNo ? '- Unit ' + unitNo : ''} ${year ? '- Year ' + year : ''}`,
    // });

    ReactGA.event("resource_access", {
      resource_type: type, // 'videos', 'notes', 'pyqs'
      access_mode: mode,   // 'preview', 'download'
      subject_name: subjectName,
      unit_number: unitNo || 'N/A',
      year: year || 'N/A'
    });
    setActionLoading(true);
    try {
      const resourceType = type === 'videos' ? 'v_refs' : type;
      const token = await getAuthToken(resourceType);
      
      if (!token) {
        alert("Security Error: Access token could not be verified.");
        return;
      }

      const url = `${API_BASE_URL}/resource/maths/${cleanCoreId}/${resourceType}`;
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

      const resourceUrl = type == "v_refs" ? response.data?.resource_url?.[0] : response.data?.resource_url;

      if (!resourceUrl) {
        alert("The requested node is empty in the vault.");
        return;
      }

      window.open(resourceUrl, '_blank');
    } catch (err) {
      console.error("Vault Access Error:", err.response?.data || err);
      alert("Resoure not found");
    } finally {
      setActionLoading(false);
      setIsYearModalOpen(false);
    }
  };

  // Prevent blank screen by returning a fallback UI if ID is missing
  if (!cleanCoreId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Invalid Subject ID</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans pb-24">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/5 rounded-full blur-[120px]" />
      </div>

      <nav className="sticky top-0 z-[100] bg-black/60 backdrop-blur-xl border-b border-white/10 px-6 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white/5 border border-white/20 rounded-xl hover:border-emerald-500/50">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-[10px] font-black tracking-[0.3em] uppercase opacity-50">{subjectName}</h1>
          <div className="bg-emerald-500 text-black w-10 h-10 flex items-center justify-center rounded-xl font-black">∆</div>
        </div>
      </nav>

      {/* Loading Modal */}
      <AnimatePresence>
        {actionLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-emerald-500" size={48} />
              <p className="font-black text-[10px] uppercase tracking-widest text-emerald-500">Authorizing Node Access</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-5xl mx-auto px-6 pt-16">
        <header className="mb-16">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
            Secure <br /><span className="italic text-emerald-500">Vault.</span>
          </h2>
        </header>

        {/* Global Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <button onClick={() => setIsYearModalOpen(true)} className="group p-8 rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 hover:border-emerald-500/60 transition-all text-left">
            <FileText size={32} className="mb-8 text-emerald-500" />
            <h3 className="text-3xl font-black uppercase tracking-tighter">Papers</h3>
          </button>

          <button onClick={() => handleResourceAccess('syllabus', null, null, 'preview')} className="group p-8 rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 hover:border-white/40 transition-all text-left">
            <BookOpen size={32} className="mb-8 text-white/40" />
            <h3 className="text-3xl font-black uppercase tracking-tighter">Syllabus</h3>
          </button>
        </div>

        {/* Units Section */}
        <section className="space-y-6">
          <h3 className="text-xs font-black tracking-[0.4em] uppercase opacity-30 mb-8">Curriculum Blocks</h3>
          {loadingUnits ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" /></div>
          ) : (
            <div className="space-y-4">
              {units.map((unit, i) => (
                <div key={i} className="group bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 flex flex-col lg:flex-row lg:items-center gap-8">
                  <div className="flex-1 flex items-center gap-6">
                    <span className="text-emerald-500 font-black text-2xl opacity-40">0{i + 1}</span>
                    <p className="font-black text-xl tracking-tight leading-tight">{unit}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleResourceAccess('notes', i + 1, null, 'download')} className="px-8 py-4 bg-emerald-600 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all">
                      <Download size={16} className="inline mr-2" /> Download
                    </button>
                    <button onClick={() => handleResourceAccess('videos', i + 1, null, 'preview')} className="px-8 py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">
                      Video
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Year Selection Modal */}
      <AnimatePresence>
        {isYearModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0A0A0A] border border-white/10 w-full max-w-sm rounded-[3rem] p-10 relative">
              <button onClick={() => setIsYearModalOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X size={24} /></button>
              <h2 className="text-xl font-black uppercase mb-8 tracking-[0.2em] text-center">Select Session</h2>
              <div className="grid grid-cols-2 gap-3">
                {pyqYears.map(year => (
                  <button key={year} onClick={() => handleResourceAccess('pyqs', null, year, 'download')} className="py-6 bg-white/5 border border-white/10 rounded-2xl font-black text-lg hover:bg-emerald-600 hover:text-black transition-all">
                    {year}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubjectDetailsPage;