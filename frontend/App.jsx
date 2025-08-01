import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import OpportunitiesPage from './pages/OpportunitiesPage';
import MapPage from './pages/MapPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/opportunities/:id" element={<OpportunityDetails />} />
            {/* Add more routes here as we build more pages */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

