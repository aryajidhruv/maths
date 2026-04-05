import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Removed useNavigate here
import ScrollToTop from './ScrollToTop';
import LandingPage from './components/LandingPage';
import SemesterPage from './components/SemesterPage';
import SubjectDetailsPage from './components/SubjectDetailsPage'; // Or wherever you saved it

function App() {
  return (
    <Router>
      <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/semester/:semId" element={<SemesterPage />} />

        <Route path="/semester/:semId/subject/:subjectId" element={<SubjectDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;