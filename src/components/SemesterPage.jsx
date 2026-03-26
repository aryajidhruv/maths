import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, PlayCircle, FileText, Search, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const SemesterPage = () => {
  const { semId } = useParams();
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pyqs'); 
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSemesterData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetching the 'cores' metadata as per your curl
        const response = await axios.get(`${API_BASE_URL}/metadata`, {
          params: { of: 'cores' },
          headers: { 'accept': 'application/json' }
        });

        const allSemestersData = response.data;
        
        // The API returns { "1": { "1": "algebra"... }, "2": {...} }
        // We extract only the subjects for the current semId
        const currentSemSubjects = allSemestersData[semId];

        if (currentSemSubjects) {
          // Convert the object { "1": "algebra" } into an array for easy mapping
          const subjectList = Object.entries(currentSemSubjects).map(([id, name]) => ({
            id,
            name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
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
    <div className="min-h-screen bg-stone-50 font-sans">
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
        {/* Resource Selection Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'pyqs', label: 'PYQs', icon: <FileText size={18}/> },
            { id: 'syllabus', label: 'Syllabus', icon: <BookOpen size={18}/> },
            { id: 'videos', label: 'Videos', icon: <PlayCircle size={18}/> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'bg-white text-stone-500 border border-stone-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input 
            type="text" 
            placeholder={`Search ${activeTab} for ${semId}th sem subjects...`}
            className="w-full pl-12 pr-6 py-4 bg-white border border-stone-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 text-stone-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-medium">Syncing with xuzu.in...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-3xl border border-red-100 flex items-center gap-4">
            <AlertCircle /> {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.length > 0 ? (
              filtered.map((subject) => (
                <div key={subject.id} className="bg-white p-6 rounded-3xl border border-stone-200 hover:border-emerald-500 transition-all group shadow-sm hover:shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {activeTab === 'videos' ? <PlayCircle size={24}/> : <BookOpen size={24}/>}
                    </div>
                    <span className="text-[10px] font-black bg-stone-100 px-3 py-1 rounded-full text-stone-500 uppercase">
                      Code: {subject.id}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-xl text-stone-900 mb-2 leading-tight">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-stone-500 mb-8 font-medium">
                    View {activeTab.toUpperCase()} for this subject
                  </p>
                  
                  <button className="flex items-center justify-center gap-2 w-full py-4 bg-stone-950 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all active:scale-95 shadow-lg">
                    Access {activeTab.toUpperCase()}
                    <ChevronRight size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-stone-200 rounded-3xl text-stone-400">
                No subjects found for this semester.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SemesterPage;