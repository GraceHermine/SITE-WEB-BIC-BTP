import { useState } from "react";
import "../styles/Header.css"; 

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="site-header">
      <div className="container header-container">
        {/* Logo */}
        <a href="/" className="logo" aria-label="Accueil BIC BTP">
          <img src="/BICBTP.png" alt="Logo BIC BTP" /> 
        </a>

        {/* Navigation desktop */}
        <nav className="desktop-nav">
          <a href="/">Accueil</a>
          <a href="/method">Notre méthode</a>
          <a href="/maisons">Nos maisons</a>
          <a href="/finitions">Finitions</a>
          <a href="/realisations">Réalisations</a>
          <a href="/about">À propos</a>
        </nav>

        {/* Actions (Devis + Mobile) */}
        <div className="header-actions">
          <a href="/contact" className="btn-devis">Devis & Contact</a>
          
          <button 
            className="mobile-toggle" 
            onClick={toggleMenu}
            aria-label="Ouvrir le menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <div className={`mobile-nav ${isMenuOpen ? "open" : ""}`}>
        <nav>
          <a href="/" onClick={toggleMenu}>Accueil</a>
          <a href="/methode" onClick={toggleMenu}>Notre méthode</a>
          <a href="/maisons" onClick={toggleMenu}>Nos maisons</a>
          <a href="/finitions" onClick={toggleMenu}>Finitions</a>
          <a href="/realisations" onClick={toggleMenu}>Réalisations</a>
          <a href="/about" onClick={toggleMenu}>À propos</a>
          <a href="/contact" onClick={toggleMenu} className="btn-devis-mobile">Devis & Contact</a>
        </nav>
      </div>
    </header>
  );
}