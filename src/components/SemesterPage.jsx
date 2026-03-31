import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, PlayCircle, FileText, Search, 
  Loader2, ChevronRight, X, StickyNote, Eye, List, 
  Sparkles, Hash, Download, Layout 
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const SemesterPage = () => {
  const { semId } = useParams();
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pyqs'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [units, setUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);

  const getApiResourceType = (tab) => {
    const types = { notes: 'notes', syllabus: 'notes', videos: 'v_refs', pyqs: 'pyqs' };
    return types[tab] || 'notes';
  };

  const getResourceUrl = (subjectId, year = null) => {
    const resourceType = getApiResourceType(activeTab);
    let url = `https://maths-arity.fastapicloud.dev/maths/resources/${subjectId}/${semId}/${resourceType}`;
    if (activeTab === 'pyqs' && year) url += `?yr=${year}`;
    return url;
  };

  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [subjects, searchTerm]);

  // Renamed function to reflect Unit terminology
  const handleViewUnits = async (subject) => {
    setSelectedSubject(subject);
    setIsUnitModalOpen(true);
    setLoadingUnits(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/metadata`, {
        params: { of: 'units', core_id: subject.id },
        headers: { 'accept': 'application/json' }
      });
      setUnits(Array.isArray(response.data) ? response.data : Object.values(response.data));
    } catch (err) {
      setUnits(["Units metadata not available."]);
    } finally {
      setLoadingUnits(false);
    }
  };

  const handleAccessClick = (subject) => {
    if (activeTab === 'pyqs') {
      setSelectedSubject({ ...subject, mode: 'download' });
      setIsYearModalOpen(true);
    } else {
      window.open(getResourceUrl(subject.id), '_blank');
    }
  };

  const handlePreviewClick = (subject) => {
    if (activeTab === 'pyqs') {
      setSelectedSubject({ ...subject, mode: 'preview' });
      setIsYearModalOpen(true);
    } else {
      setPreviewUrl(getResourceUrl(subject.id));
    }
  };

  const handleYearSelection = (year) => {
    const url = getResourceUrl(selectedSubject.id, year);
    if (selectedSubject.mode === 'preview') {
      setPreviewUrl(url);
    } else {
      window.open(url, '_blank');
    }
    setIsYearModalOpen(false);
  };

  useEffect(() => {
    const fetchSemesterData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/metadata`, {
          params: { of: 'cores' },
          headers: { 'accept': 'application/json' }
        });
        const currentSemSubjects = response.data[semId];
        if (currentSemSubjects) {
          setSubjects(Object.entries(currentSemSubjects).map(([id, name]) => ({
            id, name: name.charAt(0).toUpperCase() + name.slice(1), 
          })));
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchSemesterData();
  }, [semId]);

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans relative pb-20 selection:bg-emerald-100 overflow-x-hidden">
      
      {/* MATHEMATICAL GRID BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04]" 
           style={{ backgroundImage: `linear-gradient(#065f46 1.5px, transparent 1.5px), linear-gradient(90deg, #065f46 1.5px, transparent 1.5px)`, backgroundSize: '40px 40px' }}>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-stone-200/60 px-6 py-4 sticky top-0 z-[100] flex justify-between items-center shadow-sm">
        <button onClick={() => navigate('/')} className="group flex items-center gap-2 text-stone-600 font-bold hover:text-emerald-700 transition">
          <div className="p-2 bg-stone-100 rounded-xl group-hover:bg-emerald-50 transition-colors">
            <ArrowLeft size={18}/>
          </div>
          <span className="hidden sm:inline text-xs font-black uppercase tracking-widest">Vault</span>
        </button>
        
        <div className="flex flex-col items-center">
           <h1 className="text-xl font-[1000] text-stone-900 tracking-tighter">SEM 0{semId}</h1>
           <div className="h-1 w-6 bg-emerald-500 rounded-full mt-0.5"></div>
        </div>

        <div className="bg-stone-950 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg font-black text-lg">∆</div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
        
        {/* --- DYNAMIC TABS --- */}
        <div className="flex gap-2 md:gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {[
            {id:'pyqs', label:'Papers', icon:<FileText size={18}/>}, 
            {id:'notes', label:'Notes', icon:<StickyNote size={18}/>}, 
            {id:'syllabus', label:'Syllabus', icon:<BookOpen size={18}/>}, 
            {id:'videos', label:'Lectures', icon:<PlayCircle size={18}/>}
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex items-center gap-2.5 px-6 py-4 rounded-[1.5rem] font-black transition-all whitespace-nowrap text-xs uppercase tracking-[0.15em] ${
                activeTab === tab.id 
                ? 'bg-stone-950 text-white shadow-xl shadow-stone-200 -translate-y-1' 
                : 'bg-white text-stone-400 border border-stone-200 hover:border-emerald-300'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="relative mb-12">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={22} />
          <input 
            type="text" 
            placeholder={`Filter ${activeTab}...`} 
            className="w-full pl-16 pr-8 py-5 bg-white border border-stone-200 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm font-medium" 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        {/* --- SUBJECT CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredSubjects.map((subject, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={subject.id} 
                className="bg-white p-7 md:p-9 rounded-[3rem] border border-stone-200/60 hover:border-emerald-500/40 hover:shadow-2xl transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    {activeTab === 'videos' ? <PlayCircle size={24}/> : activeTab === 'notes' ? <StickyNote size={24}/> : <FileText size={24}/>}
                  </div>
                  {/* UPDATED: Renamed from Structure to Units */}
                  <button onClick={() => handleViewUnits(subject)} className="text-[10px] font-black bg-stone-100 px-4 py-2 rounded-xl text-stone-500 hover:bg-stone-900 hover:text-white transition-all uppercase tracking-widest">
                    Units
                  </button>
                </div>
                <h3 className="font-black text-2xl md:text-3xl text-stone-900 mb-10 tracking-tighter leading-tight">{subject.name}</h3>
                <div className="flex gap-4 relative z-10">
                  <button onClick={() => handlePreviewClick(subject)} className="flex-1 py-4 bg-stone-50 text-stone-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-stone-100 transition-all">
                    Preview
                  </button>
                  <button onClick={() => handleAccessClick(subject)} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-stone-950 transition-all shadow-lg shadow-emerald-100">
                    {activeTab === 'pyqs' ? 'Fetch' : 'Open'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* --- UNITS MODAL (Renamed Title) --- */}
      <AnimatePresence>
        {isUnitModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-stone-900/60 backdrop-blur-md">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: 'spring', damping: 25 }} className="bg-white w-full max-w-xl rounded-t-[3rem] sm:rounded-[3rem] p-8 md:p-10 shadow-2xl relative max-h-[85vh] overflow-hidden flex flex-col">
              <button onClick={() => setIsUnitModalOpen(false)} className="absolute top-8 right-8 p-2 text-stone-400 hover:text-stone-900 transition-all"><X size={28} /></button>
              {/* UPDATED: Modal title now reflects Units */}
              <div className="mb-8">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2 block">Course Content</span>
                <h2 className="text-3xl font-black text-stone-950 tracking-tighter">{selectedSubject?.name}</h2>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pb-10 custom-scrollbar">
                {loadingUnits ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={32} /></div> : 
                  units.map((unit, idx) => (
                    <div key={idx} className="p-6 bg-stone-50 border border-stone-200/50 rounded-3xl flex gap-5 hover:bg-white transition-colors group">
                      <span className="bg-white border border-stone-200 text-stone-950 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 group-hover:border-emerald-500 group-hover:text-emerald-600 transition-all">U{idx + 1}</span>
                      <p className="text-stone-700 text-sm font-bold leading-relaxed">{unit}</p>
                    </div>
                  ))
                }
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- YEAR MODAL --- */}
      <AnimatePresence>
        {isYearModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-stone-900/60 backdrop-blur-sm">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-10 shadow-2xl relative">
              <button onClick={() => setIsYearModalOpen(false)} className="absolute top-8 right-8 text-stone-400 hover:text-stone-900 transition-colors"><X size={28} /></button>
              <h2 className="text-3xl font-black mb-10 tracking-tighter">Select Year</h2>
              <div className="grid grid-cols-2 gap-4">
                {['2021', '2022', '2023', '2024'].map((year) => (
                  <button key={year} onClick={() => handleYearSelection(year)} className="py-6 bg-stone-50 border border-stone-200 rounded-[2rem] font-black text-stone-900 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                    {year}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- PERFORMANCE-OPTIMIZED FULLSCREEN PREVIEW --- */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div 
            key="preview-overlay"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] bg-stone-900 flex flex-col"
          >
            <div className="p-4 md:p-6 flex justify-between items-center bg-stone-900 text-white border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-xs">PDF</div>
                <span className="font-bold text-xs truncate max-w-[200px]">{selectedSubject?.name}</span>
              </div>
              <button 
                onClick={() => setPreviewUrl(null)} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={32} />
              </button>
            </div>
            <div className="flex-1 w-full bg-stone-800">
              {previewUrl && (
                <iframe 
                  src={previewUrl} 
                  className="w-full h-full border-none" 
                  title="PDF Preview"
                  loading="lazy"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SemesterPage;