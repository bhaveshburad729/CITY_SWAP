import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <div className="brand">
            <span className="brand-logo">🌆</span>
            <span className="brand-title">CITY<span className="accent">_SWAP</span></span>
          </div>
          <p className="footer-tagline">
            Connecting global travelers & locals to swap gear, accommodations, and experiences across cities worldwide.
          </p>
        </div>

        <div className="footer-col">
          <h4>Architecture & Stack</h4>
          <ul>
            <li>Frontend: React (Vite)</li>
            <li>Backend: Python (FastAPI)</li>
            <li>HTTP Client: Axios</li>
            <li>Styling: Custom CSS System</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#explore">Explore Swaps</a></li>
            <li><a href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer">API Documentation (/docs)</a></li>
            <li><a href="http://127.0.0.1:8000/api/health" target="_blank" rel="noreferrer">API Health Endpoint</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CITY_SWAP Platform. Built as per AI Full-Stack Standards.</p>
      </div>
    </footer>
  );
};

export default Footer;
