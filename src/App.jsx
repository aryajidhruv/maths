import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import LandingPage from './components/LandingPage';
import SemesterPage from './components/SemesterPage';
import SubjectDetailsPage from './components/SubjectDetailsPage'; 
import ReviewsPage from './components/ReviewsPage';
import Motivation from './components/Motivation'; // Added Motivation
import Contact from './components/Contact'; // Check this path!

function App() {
  return (
    <Router>
      <ScrollToTop /> 
      <Routes>
        {/* Main Entry Points */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/motivation" element={<Motivation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reviews" element={<ReviewsPage />} />

        {/* Academic Vault Routes */}
        <Route path="/semester/:semId" element={<SemesterPage />} />
        <Route path="/semester/:semId/subject/:subjectId" element={<SubjectDetailsPage />} />
        
        {/* Catch-all or 404 can be added here if needed */}
      </Routes>
    </Router>
  );
}

export default App;