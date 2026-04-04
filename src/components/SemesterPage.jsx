import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const SemesterPage = () => {
  const { semId } = useParams();
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
          const formattedSubjects = Object.entries(currentSemSubjects).map(([id, name]) => ({
            id, 
            name: name.charAt(0).toUpperCase() + name.slice(1), 
          }));
          setSubjects(formattedSubjects);
        } else {
          setError(`No subjects mapped for Semester ${semId} yet.`);
        }
      } catch (err) { 
        setError("Failed to sync with Vault. Please check your connection.");
      } finally { 
        setLoading(false); 
      }
    };
    fetchSemesterData();
  }, [semId]);

  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [subjects, searchTerm]);

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans pb-20 selection:bg-emerald-100">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04]" 
           style={{ backgroundImage: `linear-gradient(#065f46 1.5px, transparent 1.5px), linear-gradient(90deg, #065f46 1.5px, transparent 1.5px)`, backgroundSize: '40px 40px' }}>
      </div>

      <nav className="bg-white/80 backdrop-blur-xl border-b border-stone-200/60 px-6 py-4 sticky top-0 z-[100] flex justify-between items-center shadow-sm">
        <button onClick={() => navigate('/')} className="group flex items-center gap-2 text-stone-600 font-bold hover:text-emerald-700 transition">
          <ArrowLeft size={18}/> <span className="hidden sm:inline text-xs font-black uppercase tracking-widest">Back</span>
        </button>
        <h1 className="text-xl font-[1000] text-stone-900 tracking-tighter uppercase">Semester 0{semId}</h1>
        <div className="bg-stone-950 text-white w-10 h-10 flex items-center justify-center rounded-xl font-black">∆</div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 relative z-10">
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-4 text-red-600">
            <AlertCircle size={20} />
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        <div className="relative mb-12">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={22} />
          <input 
            type="text" 
            placeholder="Search subjects..." 
            className="w-full pl-16 pr-8 py-5 bg-white border border-stone-200 rounded-[2.5rem] outline-none shadow-sm font-medium focus:border-emerald-500 transition-all" 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <Loader2 className="animate-spin text-emerald-600 mb-4" size={40} />
            <p className="text-xs font-black uppercase tracking-[0.2em]">Syncing Subjects...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => (
              <motion.div 
                whileHover={{ y: -8 }}
                key={subject.id} 
                onClick={() => navigate(`/semester/${semId}/subject/${subject.id}`, { state: { subjectName: subject.name } })}
                className="bg-white p-8 rounded-[3rem] border border-stone-200 cursor-pointer hover:border-emerald-500 transition-all group shadow-sm hover:shadow-xl"
              >
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <span className="font-black text-xl">{subject.name.charAt(0)}</span>
                </div>
                <h3 className="font-black text-2xl text-stone-900 mb-4 tracking-tighter leading-tight">{subject.name}</h3>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Enter Subject →</p>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SemesterPage;