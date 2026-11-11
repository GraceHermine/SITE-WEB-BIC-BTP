import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* ===== BANDEAU PRINCIPAL (structure identique au modèle) ===== */}
      <div className="footer-main">

        {/* --- PANNEAU GAUCHE : bleu foncé + diagonales --- */}
        <div className="footer-brand-panel">
          <div className="brand-content">
            <h3 className="brand-logo">BIC BTP</h3>
            <p className="brand-tagline">CONSTRUIRE VITE ET SOLIDE</p>
            <p className="brand-sub">FINIR AVEC CARACTÈRE</p>
          </div>
        </div>

        {/* --- PANNEAU DROIT : fond blanc + colonnes --- */}
        <div className="footer-content-panel">
          <div className="footer-columns">

            {/* Colonne Navigation */}
            <div className="footer-col">
              <h4>Navigation</h4>
              <ul>
                <li><a href="/methode">Notre méthode</a></li>
                <li><a href="/maisons">Nos maisons</a></li>
                <li><a href="/finitions">Finitions</a></li>
                <li><a href="/realisations">Réalisations</a></li>
                <li><a href="/a-propos">À propos</a></li>
                <li><a href="/devis">Devis &amp; contact</a></li>
              </ul>
            </div>

            {/* Colonne Contact */}
            <div className="footer-col">
              <h4>Contact</h4>
              <ul className="contact-list">
                <li>
                  <span className="contact-label">Téléphone / WhatsApp</span>
                  <strong>+225 00 00 00 00 00</strong>
                </li>
                <li>
                  <span className="contact-label">E-mail</span>
                  <strong>contact@bicbtp.ci</strong>
                </li>
                <li>
                  <span className="contact-label">Adresse</span>
                  <strong>Abidjan, Côte d'Ivoire</strong>
                </li>
              </ul>
            </div>

            {/* Colonne Informations */}
            <div className="footer-col footer-legal">
              <h4>Informations</h4>
              <p>
                Les images et visuels présentés sur ce site sont d'inspiration
                et non contractuels. Les finitions et équipements peuvent varier.
              </p>
              <p className="gammes">
                Gammes : <strong>Essentiel</strong> · <strong>Confort</strong> ·{" "}
                <strong>Prestige</strong>
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ===== BARRE INFÉRIEURE (bleu uni, comme le bandeau bas du modèle) ===== */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} BIC BTP. Tous droits réservés.</p>
          <div className="footer-bottom-links">
            <a href="/mentions-legales">Mentions légales</a>
            <a href="/confidentialite">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}