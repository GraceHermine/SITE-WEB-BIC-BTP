import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Error.css';

export default function Error() {
  const currentPath = window.location.pathname;

  return (
    <div className="error-container">
      {/* Formes décoratives en arrière-plan */}
      <div className="error-bg-shape error-bg-shape--1" aria-hidden="true" />
      <div className="error-bg-shape error-bg-shape--2" aria-hidden="true" />

      <div className="error-content">
        <div className="error-illustration" aria-hidden="true">
          <span className="error-code" data-text="404">404</span>
        </div>

        <h1 className="error-title">Page introuvable</h1>

        <p className="error-message">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        <p className="error-path">
          <span className="error-path-label">Chemin demandé :</span>
          <code className="error-url">{currentPath}</code>
        </p>

        <div className="error-actions">
          <Link to="/" className="error-button error-button--primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Retour à l'accueil
          </Link>

          <button
            type="button"
            className="error-button error-button--secondary"
            onClick={() => window.history.back()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Page précédente
          </button>
        </div>
      </div>
    </div>
  );
}