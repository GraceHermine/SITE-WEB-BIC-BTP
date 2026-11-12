import { Link } from "react-router-dom";
import "../styles/Footer.css";
import { useInfo } from "../hooks/useInfo";

/* =========================================================
   FALLBACKS (affichés si l'API est indisponible)
   ========================================================= */

const FALLBACK_INFO = {
  site_name: "BIC BTP",
  baseline: "CONSTRUIRE VITE ET SOLIDE",
  description: "FINIR AVEC CARACTÈRE",
  phone_primary: "+225 00 00 00 00 00",
  phone_secondary: "",
  whatsapp_number: "22500000000",
  email_primary: "contact@bicbtp.ci",
  email_secondary: "",
  address_line1: "",
  address_line2: "",
  city: "Abidjan",
  country: "Côte d'Ivoire",
  postal_code: "",
  opening_hours: "",
  social_links: [],
  footer_columns: [],
  legal_mentions: "",
  privacy_url: "",
  cgu_url: "",
  copyright_text: "",
  company_registration: "",
  announcement: "",
  logo_url: "",
};

/* Colonnes par défaut si l'API ne fournit pas `footer_columns` */
const DEFAULT_NAV_LINKS = [
  { label: "Notre méthode", url: "/methode" },
  { label: "Nos maisons", url: "/maisons" },
  { label: "Finitions", url: "/finitions" },
  { label: "Réalisations", url: "/realisations" },
  { label: "À propos", url: "/a-propos" },
  { label: "Devis & contact", url: "/devis" },
];

const DEFAULT_LEGAL_LINKS = [
  { label: "Mentions légales", url: "/mentions-legales" },
  { label: "Politique de confidentialité", url: "/confidentialite" },
];

/* =========================================================
   HELPERS
   ========================================================= */

/** Construit une adresse lisible à partir des champs Info. */
function formatAddress(info) {
  const parts = [
    info.address_line1,
    info.address_line2,
    [info.postal_code, info.city].filter(Boolean).join(" "),
    info.country,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "Abidjan, Côte d'Ivoire";
}

/** Normalise un lien (interne vs externe). */
function FooterLink({ href, children, className }) {
  if (!href) return <span className={className}>{children}</span>;
  const isExternal = /^https?:\/\//i.test(href);
  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

/** Icône texte pour les réseaux (fallback si pas d'image). */
function socialGlyph(icon) {
  const map = {
    instagram: "◎",
    facebook: "f",
    linkedin: "in",
    twitter: "𝕏",
    x: "𝕏",
    youtube: "▶",
    tiktok: "♪",
    whatsapp: "✆",
  };
  return map[(icon || "").toLowerCase()] || "•";
}

/* =========================================================
   COMPOSANT
   ========================================================= */

export default function Footer() {
  const { info: apiInfo, loading, error, reload } = useInfo();

  /* On fusionne : les champs API écrasent les fallbacks, mais un champ
     vide/absent côté API garde la valeur de secours. */
  const info = { ...FALLBACK_INFO, ...(apiInfo || {}) };

  /* footer_columns : si l'API fournit un tableau non vide, on l'utilise.
     Sinon, on construit les colonnes par défaut (Navigation + Légal). */
  const apiColumns = Array.isArray(info.footer_columns)
    ? info.footer_columns.filter((c) => c && Array.isArray(c.links))
    : [];
  const hasApiColumns = apiColumns.length > 0;

  const navLinks =
    hasApiColumns && apiColumns[0]?.links?.length
      ? apiColumns[0].links
      : DEFAULT_NAV_LINKS;

  const legalLinks =
    info.privacy_url || info.cgu_url
      ? [
          info.legal_mentions || info.privacy_url
            ? {
                label: "Politique de confidentialité",
                url: info.privacy_url || "/confidentialite",
              }
            : null,
          info.cgu_url ? { label: "CGU", url: info.cgu_url } : null,
        ].filter(Boolean)
      : DEFAULT_LEGAL_LINKS;

  const copyright =
    info.copyright_text ||
    `© ${new Date().getFullYear()} ${info.site_name}. Tous droits réservés.`;

  return (
    <footer className="site-footer">
      {/* ===== BANDEAU PRINCIPAL ===== */}
      <div className="footer-main">
        {/* --- PANNEAU GAUCHE --- */}
        <div className="footer-brand-panel">
          <div className="brand-content">
            {info.logo_url ? (
              <img
                src={info.logo_url}
                alt={info.site_name}
                className="brand-logo-img"
                style={{ maxHeight: 48, marginBottom: 12 }}
              />
            ) : (
              <h3 className="brand-logo">{info.site_name}</h3>
            )}
            {info.baseline && (
              <p className="brand-tagline">{info.baseline}</p>
            )}
            {info.description && (
              <p className="brand-sub">{info.description}</p>
            )}
          </div>
        </div>

        {/* --- PANNEAU DROIT --- */}
        <div className="footer-content-panel">
          <div className="footer-columns">
            {/* Colonne Navigation */}
            <div className="footer-col">
              <h4>Navigation</h4>
              <ul>
                {navLinks.map((l, i) => (
                  <li key={`nav-${i}`}>
                    <FooterLink href={l.url}>{l.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne Contact */}
            <div className="footer-col">
              <h4>Contact</h4>
              <ul className="contact-list">
                {(info.phone_primary || info.phone_secondary) && (
                  <li>
                    <span className="contact-label">
                      Téléphone / WhatsApp
                    </span>
                    {info.phone_primary && (
                      <strong>
                        <a
                          href={`tel:${info.phone_primary.replace(/\s/g, "")}`}
                          style={{ color: "inherit" }}
                        >
                          {info.phone_primary}
                        </a>
                      </strong>
                    )}
                    {info.phone_secondary && (
                      <strong style={{ display: "block" }}>
                        <a
                          href={`tel:${info.phone_secondary.replace(/\s/g, "")}`}
                          style={{ color: "inherit" }}
                        >
                          {info.phone_secondary}
                        </a>
                      </strong>
                    )}
                  </li>
                )}

                {info.email_primary && (
                  <li>
                    <span className="contact-label">E-mail</span>
                    <strong>
                      <a
                        href={`mailto:${info.email_primary}`}
                        style={{ color: "inherit" }}
                      >
                        {info.email_primary}
                      </a>
                    </strong>
                  </li>
                )}

                <li>
                  <span className="contact-label">Adresse</span>
                  <strong>{formatAddress(info)}</strong>
                </li>

                {info.opening_hours && (
                  <li>
                    <span className="contact-label">Horaires</span>
                    <strong>{info.opening_hours}</strong>
                  </li>
                )}

                {info.company_registration && (
                  <li>
                    <span className="contact-label">Immatriculation</span>
                    <strong>{info.company_registration}</strong>
                  </li>
                )}
              </ul>

              {/* Réseaux sociaux */}
              {Array.isArray(info.social_links) &&
                info.social_links.length > 0 && (
                  <div className="footer-social" style={{ marginTop: 16 }}>
                    {info.social_links.map((s, i) => (
                      <a
                        key={`social-${i}`}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label || s.icon || "Réseau social"}
                        title={s.label || s.icon || ""}
                        className="footer-social-link"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 32,
                          height: 32,
                          marginRight: 8,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.08)",
                          color: "inherit",
                          textDecoration: "none",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        {socialGlyph(s.icon)}
                      </a>
                    ))}
                  </div>
                )}
            </div>

            {/* Colonne Informations */}
            <div className="footer-col footer-legal">
              <h4>Informations</h4>
              <p>
                Les images et visuels présentés sur ce site sont d'inspiration
                et non contractuels. Les finitions et équipements peuvent
                varier.
              </p>
              <p className="gammes">
                Gammes : <strong>Essentiel</strong> ·{" "}
                <strong>Confort</strong> · <strong>Prestige</strong>
              </p>

              {info.announcement && (
                <p
                  className="footer-announcement"
                  style={{
                    marginTop: 12,
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.06)",
                    fontSize: "0.85rem",
                  }}
                >
                  {info.announcement}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== BARRE INFÉRIEURE ===== */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-content">
          <p>{copyright}</p>
          <div className="footer-bottom-links">
            {legalLinks.map((l, i) => (
              <FooterLink key={`legal-${i}`} href={l.url}>
                {l.label}
              </FooterLink>
            ))}
          </div>
        </div>
      </div>

      {/* ===== STATUT API (discret) ===== */}
      {error && (
        <div
          style={{
            background: "#2a1a1a",
            color: "#f3c9c9",
            fontSize: "0.75rem",
            textAlign: "center",
            padding: "6px 12px",
          }}
          role="alert"
        >
          Coordonnées par défaut —{" "}
          <button
            type="button"
            onClick={reload}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              textDecoration: "underline",
              cursor: "pointer",
              padding: 0,
              font: "inherit",
            }}
          >
            réessayer
          </button>
        </div>
      )}

      {loading && !apiInfo && (
        <div
          aria-live="polite"
          style={{
            position: "absolute",
            left: "-9999px",
          }}
        >
          Chargement des informations…
        </div>
      )}
    </footer>
  );
}