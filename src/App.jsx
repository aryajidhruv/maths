import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

import ScrollToTop from './ScrollToTop';
import LandingPage from './components/LandingPage';
import SemesterPage from './components/SemesterPage';
import SubjectDetailsPage from './components/SubjectDetailsPage'; 
import ReviewsPage from './components/ReviewsPage';
import Motivation from './components/Motivation';
import Contact from './components/Contact';

// Replace with your actual Measurement ID from Google Analytics
const TRACKING_ID = "G-XXXXXXXXXX"; 
ReactGA.initialize("G-9JDG6LLSQ8");

// Component to handle page view tracking
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      <AnalyticsTracker />
      <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/motivation" element={<Motivation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/semester/:semId" element={<SemesterPage />} />
        <Route path="/semester/:semId/subject/:subjectId" element={<SubjectDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;