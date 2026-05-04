import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // Removed 'BrowserRouter as Router'
import ReactGA from 'react-ga4';

import ScrollToTop from './ScrollToTop';
import LandingPage from './components/LandingPage';
import SemesterPage from './components/SemesterPage';
import SubjectDetailsPage from './components/SubjectDetailsPage'; 
import ReviewsPage from './components/ReviewsPage';
import Motivation from './components/Motivation';
import Contact from './components/Contact';

// This is correct - initialized once outside
const TRACKING_ID = "G-JHYM47YGC9"; 
ReactGA.initialize(TRACKING_ID);

function App() {
  const location = useLocation();

  // Integrated the tracker directly into App to keep it simple
  useEffect(() => {
    ReactGA.send({ 
      hitType: "pageview", 
      page: location.pathname + location.search 
    });
  }, [location]);

  return (
    <>
      <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/motivation" element={<Motivation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/semester/:semId" element={<SemesterPage />} />
        <Route path="/semester/:semId/subject/:subjectId" element={<SubjectDetailsPage />} />
      </Routes>
    </>
  );
}

export default App;