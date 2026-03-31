import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, PlayCircle, FileText, Search, Loader2, AlertCircle, ChevronRight, X, StickyNote, Eye, List } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';

const SemesterPage = () => {
  const { semId } = useParams();
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pyqs'); 
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [units, setUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);

  const getApiResourceType = (tab) => {
    switch (tab) {
      case 'notes': return 'notes';
      case 'syllabus': return 'notes';
      case 'videos': return 'v_refs';
      case 'pyqs': return 'pyqs';
      default: return 'notes';
    }
  };

  const getResourceUrl = (subjectId, year = null) => {
    const resourceType = getApiResourceType(activeTab);
    let url = `https://maths-arity.fastapicloud.dev/maths/resources/${subjectId}/${semId}/${resourceType}`;
    if (activeTab === 'pyqs' && year) url += `?yr=${year}`;
    return url;
  };

  const handleViewUnits = async (subject) => {
    setSelectedSubject(subject);
    setIsUnitModalOpen(true);
    setLoadingUnits(true);
    setUnits([]); 
    
    try {
      const response = await axios.get(`${API_BASE_URL}/metadata`, {
        params: { of: 'units', core_id: subject.id },
        headers: { 'accept': 'application/json' }
      });
      setUnits(Array.isArray(response.data) ? response.data : Object.values(response.data));
    } catch (err) {
      setUnits(["Units metadata not available for this subject."]);
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
      setError(null);
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
      } catch (err) {
        setError("Could not load subjects from MathVault.");
      } finally {
        setLoading(false);
      }
    };
    fetchSemesterData();
  }, [semId]);

  return (
    <div className="min-h-screen bg-stone-50 font-sans relative pb-10">
      {/* Navigation - Responsive Padding */}
      <nav className="bg-white border-b border-stone-200 px-4 md:px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-stone-600 font-bold hover:text-emerald-700 transition text-sm md:text-base">
          <ArrowLeft size={18}/> <span className="hidden sm:inline">Back</span>
        </button>
        <h1 className="text-lg md:text-xl font-black">Semester 0{semId}</h1>
        <div className="w-10"></div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Tab Selection - Scrollable on mobile */}
        <div className="flex gap-2 md:gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {[
            {id:'pyqs', label:'PYQs', icon:<FileText size={18}/>}, 
            {id:'notes', label:'Notes', icon:<StickyNote size={18}/>}, 
            {id:'syllabus', label:'Syllabus', icon:<BookOpen size={18}/>}, 
            {id:'videos', label:'Videos', icon:<PlayCircle size={18}/>}
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex items-center gap-2 px-5 md:px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap text-sm md:text-base ${
                activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-white text-stone-500 border border-stone-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative mb-8 md:mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`} 
            className="w-full pl-12 pr-6 py-3 md:py-4 bg-white border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm" 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        {/* Subjects Grid - 1 Col on Mobile, 2 Col on MD+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {subjects.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((subject) => (
            <div key={subject.id} className="bg-white p-5 md:p-6 rounded-[2rem] border border-stone-200 hover:border-emerald-500 transition-all group shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  {activeTab === 'videos' ? <PlayCircle size={22}/> : activeTab === 'notes' ? <StickyNote size={22}/> : <FileText size={22}/>}
                </div>
                <button 
                  onClick={() => handleViewUnits(subject)}
                  className="flex items-center gap-1 text-[10px] font-black bg-stone-100 px-3 py-1.5 rounded-full text-stone-500 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                >
                  <List size={12}/> UNITS
                </button>
              </div>
              <h3 className="font-bold text-lg md:text-xl text-stone-900 mb-6 leading-tight min-h-[3rem]">{subject.name}</h3>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => handlePreviewClick(subject)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-100 text-stone-700 rounded-xl font-bold text-sm hover:bg-stone-200 transition-all active:scale-95"><Eye size={18} /> Preview</button>
                <button onClick={() => handleAccessClick(subject)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-950 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all active:scale-95">Open <ChevronRight size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- UNITS MODAL (Full screen on mobile) --- */}
      <AnimatePresence>
        {isUnitModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-stone-900/60 backdrop-blur-md">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
              <button onClick={() => setIsUnitModalOpen(false)} className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900"><X size={24} /></button>
              <h2 className="text-xl md:text-2xl font-black mb-1 pr-8">{selectedSubject?.name}</h2>
              <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-6">Subject Curriculum</p>
              
              <div className="flex-1 overflow-y-auto space-y-3 pb-6">
                {loadingUnits ? <div className="flex flex-col items-center py-10 text-stone-400"><Loader2 className="animate-spin mb-2" /> <p className="text-xs font-bold">LOADING...</p></div> : 
                  units.map((unit, idx) => (
                    <div key={idx} className="p-4 bg-stone-50 border border-stone-100 rounded-2xl flex items-start gap-4">
                      <span className="bg-white border border-stone-200 text-stone-400 w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0">{idx + 1}</span>
                      <p className="text-stone-700 text-sm font-semibold">{unit}</p>
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
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-stone-900/60 backdrop-blur-sm">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative">
              <button onClick={() => setIsYearModalOpen(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-900"><X size={24} /></button>
              <h2 className="text-xl md:text-2xl font-black mb-6">Select Year</h2>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {['2021', '2022', '2023', '2024'].map((year) => (
                  <button key={year} onClick={() => handleYearSelection(year)} className="py-4 bg-stone-50 border border-stone-200 rounded-2xl font-bold hover:bg-emerald-600 hover:text-white transition-all active:scale-95">{year}</button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- PREVIEW OVERLAY --- */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[130] bg-stone-900 flex flex-col">
            <div className="p-4 flex justify-between items-center bg-stone-900 text-white">
              <span className="font-bold text-xs md:text-sm truncate pr-4">Preview: {selectedSubject?.name}</span>
              <button onClick={() => setPreviewUrl(null)} className="p-2 hover:bg-stone-800 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 w-full bg-stone-800 overflow-hidden">
              <iframe src={previewUrl} className="w-full h-full border-none shadow-2xl" title="PDF Preview" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SemesterPage;