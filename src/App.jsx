import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Removed useNavigate here
import LandingPage from './components/LandingPage';
import SemesterPage from './components/SemesterPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/semester/:semId" element={<SemesterPage />} />
      </Routes>
    </Router>
  );
}

export default App;