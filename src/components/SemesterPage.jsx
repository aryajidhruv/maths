import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, PlayCircle, FileText, Search, Loader2, AlertCircle, ChevronRight, X } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { motion } from 'framer-motion';

const SemesterPage = () => {
  const { semId } = useParams();
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pyqs'); 
  const [searchTerm, setSearchTerm] = useState('');

  // MODAL STATE
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getApiResourceType = (tab) => {
    switch (tab) {
      case 'syllabus': return 'notes';
      case 'videos': return 'v_refs';
      case 'pyqs': return 'pyqs';
      default: return 'notes';
    }
  };

  // Open PDF Logic
  const openPdf = (subjectId, year = null) => {
    const resourceType = getApiResourceType(activeTab);
    let finalUrl = `https://backend.xuzu.in/maths/resources/${subjectId}/${semId}/${resourceType}`;
    
    // If it's a PYQ, we MUST add the year parameter as per your friend's API error
    if (activeTab === 'pyqs' && year) {
      finalUrl += `?yr=${year}`;
    }
    
    window.open(finalUrl, '_blank');
    setIsModalOpen(false);
  };

  const handleAccessClick = (subject) => {
    if (activeTab === 'pyqs') {
      setSelectedSubject(subject);
      setIsModalOpen(true);
    } else {
      // Syllabus and Videos don't need a year, so open directly
      openPdf(subject.id);
    }
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

        const allSemestersData = response.data;
        const currentSemSubjects = allSemestersData[semId];

        if (currentSemSubjects) {
          const subjectList = Object.entries(currentSemSubjects).map(([id, name]) => ({
            id,
            name: name.charAt(0).toUpperCase() + name.slice(1), 
          }));
          setSubjects(subjectList);
        } else {
          setSubjects([]);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Could not load subjects from MathVault.");
      } finally {
        setLoading(false);
      }
    };

    fetchSemesterData();
  }, [semId]);

  const filtered = subjects.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans relative">
      {/* Navigation */}
      <nav className="bg-white border-b border-stone-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-stone-600 hover:text-emerald-700 font-bold transition">
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className="text-xl font-black text-stone-900 tracking-tight">Semester 0{semId}</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {['pyqs', 'syllabus', 'videos'].map((tabId) => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                activeTab === tabId 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'bg-white text-stone-500 border border-stone-200'
              }`}
            >
              {tabId.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input 
            type="text" 
            placeholder={`Search subjects...`}
            className="w-full pl-12 pr-6 py-4 bg-white border border-stone-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading / Error / Content */}
        {loading ? (
          <div className="flex flex-col items-center py-20 text-stone-400"><Loader2 className="animate-spin" /></div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-3xl">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((subject) => (
              <div key={subject.id} className="bg-white p-6 rounded-3xl border border-stone-200 hover:border-emerald-500 transition-all group shadow-sm hover:shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    {activeTab === 'videos' ? <PlayCircle size={24}/> : <FileText size={24}/>}
                  </div>
                  <span className="text-[10px] font-black bg-stone-100 px-3 py-1 rounded-full text-stone-500">CODE: {subject.id}</span>
                </div>
                <h3 className="font-bold text-xl text-stone-900 mb-2 leading-tight">{subject.name}</h3>
                <p className="text-sm text-stone-500 mb-8">Access {activeTab} resources</p>
                <button 
                  onClick={() => handleAccessClick(subject)}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-stone-950 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg"
                >
                  Access {activeTab.toUpperCase()} <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- YEAR SELECTION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative"
          >
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-stone-400 hover:text-stone-900">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-stone-900 mb-2">Select Year</h2>
            <p className="text-stone-500 text-sm mb-8 font-medium">Which paper for {selectedSubject?.name} do you need?</p>
            
            <div className="grid grid-cols-2 gap-4">
              {['2021', '2022', '2023', '2024'].map((year) => (
                <button
                  key={year}
                  onClick={() => openPdf(selectedSubject.id, year)}
                  className="py-4 bg-stone-50 border border-stone-200 rounded-2xl font-bold text-stone-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all"
                >
                  {year}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SemesterPage;