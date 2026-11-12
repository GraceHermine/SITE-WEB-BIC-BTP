import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "../styles/Realisations.css";
import { useApi } from "../hooks/useApi";
import { adaptRealisation } from "../api/adapters";
import "../styles/Realisations.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

/* =========================================================
   DONNÉES enrichies — alignées sur le PPT BIC BTP
   (moules A/B/C/D, gammes Essentiel/Confort/Prestige,
   6 étapes, cibles diaspora & investisseurs)
   ========================================================= */

const FALLBACK_REALISATIONS = [
  {
    id: "villa-cocody",
    title: "Villa Duplex — Prestige",
    location: "Cocody, Abidjan",
    year: "2024",
    model: "Villa Duplex",
    surface: 180,
    duration: "6 mois",
    durationShort: "6",
    phase: "livre",
    category: "villa",
    gamme: "Prestige",
    client: "Famille de la diaspora",
    description:
      "Un duplex livré en 6 mois, du soubassement aux finitions Prestige. Murs coulés en 8 jours avec les moules A/B/C/D, toiture posée en 3 semaines, finitions sur mesure (sols grands formats, cuisine îlot, salle de bain en pierre) pendant 12 semaines.",
    highlights: [
      "Murs coulés d'un seul tenant en 8 jours",
      "Cuisine îlot sur mesure + salle de bain en pierre",
      "Budget tenu, livré avant la date contractuelle",
    ],
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHex-azUInK6fnHBCzBw7sL9K0RRegSpYWFrp4o8cmLJODjOA4IyAMrLk1WsV9D3GVEzq9MTAIi155_FPaOh5A6h8BPvPmT0z847HRAEBSRVL-qEzONWHlKggeNHT0wO50gIVWL4mEvaVVFTsvgXfsh2fjBTPqR74BwS5PaszDk732MTUV4KID2ttpb3o0dcS8Ax7DOGbH_B7Vq8mYJJmPnkJ6aON9MxlcmUm6VSA",
    before_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzPBIW-SSJIoMUFjWhnNGphP7d8JIT4Lz6Uo6dOUyUzwaWEErCsHfC5eNpNfffAyxRdoOJ248O1vyYvkhBhmJC9ZNdZBqhEk8zbxnktvxe-jly7jugwefuTG_0nzGDknDwB3KXn1CZ1e3jUWSN4fGBJh9bAtUJxbs-XHl89y7jVSoSM77MjFnUFdvzQ68-zOv-7nigMndHhmAhwvS5C5rXdCxYgdOeC87n6RaNXeg",
    tags: ["Duplex", "Prestige", "Coulage en moules", "Diaspora"],
  },
  {
    id: "f4-yopougon",
    title: "Modèle F4 — Confort",
    location: "Yopougon, Abidjan",
    year: "2024",
    model: "Modèle F4",
    surface: 120,
    duration: "4 mois",
    durationShort: "4",
    phase: "livre",
    category: "maison",
    gamme: "Confort",
    client: "Primo-accédant",
    description:
      "Un F4 livré clé en main en 4 mois, gamme Confort. Le client a personnalisé les sols, la cuisine et la salle de bain. Les murs ont été coulés en 6 jours — un seul tenant, sans joint faible.",
    highlights: [
      "3 chambres + séjour + cuisine équipée",
      "Sols et cuisine personnalisés (gamme Confort)",
      "Livré clé en main en 4 mois",
    ],
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBslXqjUeHQlH6R9Vjuwe9QN06I7nUwN0tbFP5EgZlCvDuX3e2xQwkPMpJj-4gp2b0WbH05JXOhIxopUicqr0C098pJEwYWDdVARIdpxk0i7RH-bXlucyAivnzZsMuTEcSn0_OooZehaXjUi5ZUZ5MtHELdL_OZJjqCpx0rIsMTsdrOluaHrmEwQeN-yKmWt2MR4t0C7FuLORgJBi5T2tVXzmLyYId9OBpzJAUAX24",
    before_url: null,
    tags: ["F4", "Confort", "Clé en main"],
  },
  {
    id: "f3-bingerville",
    title: "Modèle F3 — Essentiel",
    location: "Bingerville",
    year: "2023",
    model: "Modèle F3",
    surface: 85,
    duration: "3 mois",
    durationShort: "3",
    phase: "livre",
    category: "maison",
    gamme: "Essentiel",
    client: "Jeune famille",
    description:
      "Un F3 pour une famille qui démarrait. Gamme Essentiel, sans compromis sur la structure. Livré en 3 mois, budget tenu à 3 % près. Un exemple de ce que permet la standardisation des plans.",
    highlights: [
      "2 chambres + séjour + cuisine",
      "Structure identique aux autres F3 du catalogue",
      "Budget tenu à 3 % près",
    ],
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDheccIcyTYGXXim5nmC8Fk2MPt2mzQW7Uls5XD69KBva2pocL4T4FSPoNusTDC9c2WWuZlzSyjHToAqdqliXPGeNHAbpqG8h1G1tnrw9wTJxonJR3btxu8WcyJaMfHTIp9DKz6mwaJouXgGqe-HD2KHzpom-YNzbBds5FyCWSAuNP6sENaiv9ZduNIUynZ0laY0fRQLZt4r6UQDPb65AMxtcUXVKwhniRLchtshuE",
    before_url: null,
    tags: ["F3", "Essentiel", "Budget tenu"],
  },
  {
    id: "duplex-riviera",
    title: "Villa Duplex — Prestige (en cours)",
    location: "Riviera, Abidjan",
    year: "2024",
    model: "Villa Duplex",
    surface: 200,
    duration: "En cours",
    durationShort: "—",
    phase: "chantier",
    category: "villa",
    gamme: "Prestige",
    client: "Investisseur",
    description:
      "Un duplex en cours de finition. Murs coulés, toiture posée, réseaux tirés. Les finitions Prestige sont en cours : sols grands formats, cuisine îlot, salle de bain en pierre. Le gros œuvre a pris 3 semaines après le soubassement.",
    highlights: [
      "Gros œuvre terminé en 3 semaines",
      "Finitions Prestige en cours",
      "Réseaux électriques et plomberie tirés",
    ],
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0cBRxY4pYqEuoXuuc0X73lUXByafVA42O_RDuntVd2uEbfMeKQvNxNWBBwvISU6U3ArDL9oLidXY-2x412_ZBV_1K9Iu3i9IWjGhE10g6vfwXalT1Xr9u6EUgaVsnIXjbKCwYJAInRM-AcNmiFpKkZCmy3j1NFB4W6WUSi4LnBTIv80jQtsZErhBIMVJ0pHRNc2zv6aQEe_udgHx5AQcxV74e9-OH4cj-PnjC0Gs",
    before_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzPBIW-SSJIoMUFjWhnNGphP7d8JIT4Lz6Uo6dOUyUzwaWEErCsHfC5eNpNfffAyxRdoOJ248O1vyYvkhBhmJC9ZNdZBqhEk8zbxnktvxe-jly7jugwefuTG_0nzGDknDwB3KXn1CZ1e3jUWSN4fGBJh9bAtUJxbs-XHl89y7jVSoSM77MjFnUFdvzQ68-zOv-7nigMndHhmAhwvS5C5rXdCxYgdOeC87n6RaNXeg",
    tags: ["Duplex", "Prestige", "En cours", "Investisseur"],
  },
  {
    id: "f4-abobo",
    title: "Modèle F4 — gros œuvre",
    location: "Abobo, Abidjan",
    year: "2024",
    model: "Modèle F4",
    surface: 120,
    duration: "En cours",
    durationShort: "—",
    phase: "chantier",
    category: "maison",
    gamme: "Confort",
    client: "Famille",
    description:
      "Un F4 au stade du gros œuvre. Les moules viennent d'être décoffrés : les murs sont d'un seul tenant, prêts pour la toiture. Le coulage a pris 6 jours, comme prévu au planning.",
    highlights: [
      "Moules A/B/C/D décoffrés",
      "Murs monolithiques, sans joint faible",
      "Toiture prévue la semaine suivante",
    ],
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzPBIW-SSJIoMUFjWhnNGphP7d8JIT4Lz6Uo6dOUyUzwaWEErCsHfC5eNpNfffAyxRdoOJ248O1vyYvkhBhmJC9ZNdZBqhEk8zbxnktvxe-jly7jugwefuTG_0nzGDknDwB3KXn1CZ1e3jUWSN4fGBJh9bAtUJxbs-XHl89y7jVSoSM77MjFnUFdvzQ68-zOv-7nigMndHhmAhwvS5C5rXdCxYgdOeC87n6RaNXeg",
    before_url: null,
    tags: ["F4", "Gros œuvre", "Coulage en moules"],
  },
  {
    id: "moules-demo",
    title: "Le coulage en action",
    location: "Chantier école, Abidjan",
    year: "2023",
    model: "Démonstration",
    surface: null,
    duration: "2 jours",
    durationShort: "2",
    phase: "process",
    category: "process",
    gamme: "—",
    client: "Démonstration publique",
    description:
      "Un chantier de démonstration filmé en 2 jours. Montage des moules A/B/C/D, ferraillage, réservations (gaines, ouvertures), coulage du béton d'un seul tenant, décoffrage : le procédé complet, sans montage.",
    highlights: [
      "Les 4 moules utilisés : A (plein), B (fenêtre), C (porte), D (angle)",
      "Coulage d'un seul tenant, sans reprise",
      "Décoffrage et réemploi sur le chantier suivant",
    ],
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzPBIW-SSJIoMUFjWhnNGphP7d8JIT4Lz6Uo6dOUyUzwaWEErCsHfC5eNpNfffAyxRdoOJ248O1vyYvkhBhmJC9ZNdZBqhEk8zbxnktvxe-jly7jugwefuTG_0nzGDknDwB3KXn1CZ1e3jUWSN4fGBJh9bAtUJxbs-XHl89y7jVSoSM77MjFnUFdvzQ68-zOv-7nigMndHhmAhwvS5C5rXdCxYgdOeC87n6RaNXeg",
    before_url: null,
    tags: ["Procédé", "Démonstration", "Coulage", "Moules A/B/C/D"],
  },
];

const PHASES = [
  { id: "all", label: "Tout voir" },
  { id: "livre", label: "Livrés" },
  { id: "chantier", label: "En cours" },
  { id: "process", label: "Procédé" },
];

const CATEGORIES = [
  { id: "all", label: "Toutes" },
  { id: "maison", label: "Maisons" },
  { id: "villa", label: "Villas" },
  { id: "process", label: "Procédé" },
];

const GAMMES = [
  { id: "all", label: "Toutes gammes" },
  { id: "Essentiel", label: "Essentiel" },
  { id: "Confort", label: "Confort" },
  { id: "Prestige", label: "Prestige" },
];

const STATS = [
  { value: 6, suffix: "", label: "chantiers documentés" },
  { value: 4, suffix: " mois", label: "délai moyen livraison" },
  { value: 100, suffix: "%", label: "budgets tenus" },
  { value: 8, suffix: " j", label: "coulage moyen" },
];
 
/* =========================================================
   HOOKS
   ========================================================= */

function useReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, deps); // ← re-run quand les filtres changent
}

function useCountUp(target, duration = 1400, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return value;
}

/* Parallaxe douce sur le hero */
function useParallax(ref) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const onScroll = () => {
            const y = window.scrollY;
            el.style.transform = `translate3d(0, ${y * 0.15}px, 0)`;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [ref]);
}

/* =========================================================
   SOUS-COMPOSANTS
   ========================================================= */

function StatItem({ value, suffix, label, delay }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
        { threshold: 0.4 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);
    const n = useCountUp(value, 1400, visible);
    return (
        <div className="stat reveal" ref={ref} style={{ transitionDelay: `${delay}ms` }}>
        <span className="stat-value">{n}{suffix}</span>
        <span className="stat-label">{label}</span>
        </div>
    );
}

function FilterPill({ label, active, onClick, count }) {
    return (
        <button
        className={`filter-pill ${active ? "is-active" : ""}`}
        onClick={onClick}
        aria-pressed={active}
        >
            {label}
            {typeof count === "number" && (
                <span className="filter-pill-count">{count}</span>
            )}
        </button>
    );
}

/* Carte réalisation */
function RealisationCard({ item, index, onOpen }) {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      className="realisation-card  "
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => onOpen(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      tabIndex={0}
      role="button"
      aria-label={`Voir la réalisation ${item.title} à ${item.location}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(item);
        }
      }}
    >
      <div className="realisation-img">
        <img src={item.image_url} alt={item.title} loading="lazy" />
        <div className={`realisation-img-overlay ${hovered ? "is-hovered" : ""}`} />
        <span className={`phase-badge phase-${item.phase}`}>
          {item.phase === "livre" && "Livré"}
          {item.phase === "chantier" && "En cours"}
          {item.phase === "process" && "Procédé"}
        </span>
        <span className="year-badge">{item.year}</span>
        {item.before_url && (
          <span className="before-badge">Avant / Après</span>
        )}
      </div>
      <div className="realisation-body">
        <div className="realisation-head">
          <h3>{item.title}</h3>
          <span className="realisation-location">{item.location}</span>
        </div>
        <p className="realisation-desc">{item.description}</p>
        <div className="realisation-meta">
          {item.surface && (
            <span className="meta-item">
              <strong>{item.surface}</strong> m²
            </span>
          )}
          <span className="meta-item">
            <strong>{item.duration}</strong>
          </span>
          <span className="meta-item meta-model">{item.model}</span>
        </div>
        <div className="realisation-tags">
          {item.tags.map((t, i) => (
            <span key={i} className="tag-mini">{t}</span>
          ))}
        </div>
        <span className="realisation-arrow" aria-hidden>→</span>
      </div>
    </article>
  );
}

/* Lightbox détail */
function RealisationModal({ item, onClose }) {
  const [showBefore, setShowBefore] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === " " && item.before_url) {
        e.preventDefault();
        setShowBefore((s) => !s);
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, item.before_url]);

  if (!item) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button className="modal-close" onClick={onClose} aria-label="Fermer">✕</button>

        {/* Image + avant/après */}
        <div className="modal-img-wrap">
          <img
            src={showBefore && item.before_url ? item.before_url : item.image_url}
            alt={item.title}
            className="modal-img"
          />
          {item.before_url && (
            <button
              className={`before-after-btn ${showBefore ? "is-before" : ""}`}
              onClick={() => setShowBefore((s) => !s)}
            >
              {showBefore ? "Voir l'après →" : "← Voir l'avant"}
            </button>
          )}
          <span className={`phase-badge phase-${item.phase} modal-phase`}>
            {item.phase === "livre" && "Livré"}
            {item.phase === "chantier" && "En cours"}
            {item.phase === "process" && "Procédé"}
          </span>
          {item.gamme && item.gamme !== "—" && (
            <span className="modal-gamme">Gamme {item.gamme}</span>
          )}
        </div>

        <div className="modal-body">
          <span className="modal-location">{item.location} · {item.year} · {item.client}</span>
          <h2 id="modal-title">{item.title}</h2>
          <p className="modal-desc">{item.description}</p>

          <div className="modal-specs">
            {item.surface && (
              <div className="modal-spec">
                <span className="spec-value">{item.surface}</span>
                <span className="spec-label">m²</span>
              </div>
            )}
            <div className="modal-spec">
              <span className="spec-value">{item.duration}</span>
              <span className="spec-label">durée</span>
            </div>
            <div className="modal-spec">
              <span className="spec-value modal-spec-text">{item.model}</span>
              <span className="spec-label">modèle</span>
            </div>
          </div>

          {item.highlights && (
            <div className="modal-highlights">
              <span className="modal-highlights-title">Points clés</span>
              <ul>
                {item.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="modal-tags">
            {item.tags.map((t, i) => (
              <span key={i} className="tag-mini">{t}</span>
            ))}
          </div>

          <div className="modal-cta">
            <a href={`/contact?ref=${item.id}`} className="btn btn-primary">
              Un projet similaire ? <span aria-hidden>→</span>
            </a>
            <a href="/maisons" className="btn btn-outline">Voir les modèles</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
   ========================================================= */
export default function Realisations() {
  /* -------- API -------- */
  const {
    data: realisationsData,
    loading,
    error,
    reload,
  } = useApi("/api/realisations/", { adapt: adaptRealisation });

  /* Référence stable : API > fallback. Jamais de .map(adapt) à chaque render. */
  const realisations =
    realisationsData && realisationsData.length > 0
      ? realisationsData
      : FALLBACK_REALISATIONS;

  const [selected, setSelected] = useState(null);

  const [phase, setPhase] = useState("all");
  const [category, setCategory] = useState("all");
  const [gamme, setGamme] = useState("all");

  const heroBgRef = useRef(null);
  useParallax(heroBgRef);
  useReveal([realisations.length]); // ⚠️ PAS sur les filtres → pas de clignotement

  /* Spotlight CTA final */
  useEffect(() => {
    const section = document.getElementById("cta-final");
    if (!section) return;
    const onMove = (e) => {
      const rect = section.getBoundingClientRect();
      section.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      section.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    section.addEventListener("pointermove", onMove);
    return () => section.removeEventListener("pointermove", onMove);
  }, []);

  /* Compteurs */
  const counts = useMemo(() => {
    const c = { phase: {}, category: {}, gamme: {} };
    realisations.forEach((r) => {
      c.phase[r.phase] = (c.phase[r.phase] || 0) + 1;
      c.category[r.category] = (c.category[r.category] || 0) + 1;
      c.gamme[r.gamme] = (c.gamme[r.gamme] || 0) + 1;
    });
    return c;
  }, [realisations]);

  /* Filtrage */
  const filtered = useMemo(() => {
    let list = [...realisations];
    if (phase !== "all") list = list.filter((r) => r.phase === phase);
    if (category !== "all") list = list.filter((r) => r.category === category);
    if (gamme !== "all") list = list.filter((r) => r.gamme === gamme);
    return list;
  }, [realisations, phase, category, gamme]);

  const hasFilters = phase !== "all" || category !== "all" || gamme !== "all";
  const resetFilters = useCallback(() => {
    setPhase("all");
    setCategory("all");
    setGamme("all");
  }, []);

  return (
    <main className="realisations-page">
      {/* ============ HERO ============ */}
      <section className="realisations-hero">
        <div className="realisations-hero-bg" ref={heroBgRef} aria-hidden />
        <div className="container realisations-hero-content">
          <span className="badge">
            <span className="badge-dot" /> Réalisations · BIC BTP
          </span>
          <h1>
            On ne vous raconte pas.<br />
            <span>On vous montre.</span>
          </h1>
          <p>
            Chaque chantier est documenté : les moules avant le coulage, les murs
            après, la toiture, les finitions. Pas de rendu 3D prometteur, pas de
            photo d'illustration. Des vraies maisons, des vrais délais, des vrais
            budgets — avec la méthode des <strong>moules préfabriqués</strong> et
            des <strong>plans standards</strong>.
          </p>
          <div className="realisations-hero-actions">
            <a href="#galerie" className="btn btn-primary">
              Voir la galerie <span aria-hidden>→</span>
            </a>
            <a href="/contact" className="btn btn-ghost">
              Parler de mon projet
            </a>
          </div>
          <div className="realisations-hero-meta">
            <div className="hero-meta-item">
              <strong>{realisations.length}</strong>
              <span>chantiers documentés</span>
            </div>
            <div className="hero-meta-item">
              <strong>3</strong>
              <span>gammes de finitions</span>
            </div>
            <div className="hero-meta-item">
              <strong>4</strong>
              <span>moules réutilisés</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="stats-bar">
        <div className="container stats-grid">
          {STATS.map((s, i) => (
            <StatItem key={i} {...s} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* ============ GALERIE ============ */}
      <section className="section galerie" id="galerie">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">La galerie</span>
            <h2>Nos chantiers. Trois phases. Trois gammes.</h2>
            <p>
              Filtrez par phase (livrés, en cours, procédé), par type de
              construction (maisons, villas) et par gamme de finitions
              (Essentiel, Confort, Prestige).
            </p>
          </div>

          {/* Filtres */}
          <div className="filters reveal">
            <div className="filter-group">
              <span className="filter-label">Phase</span>
              <div className="filter-pills">
                {PHASES.map((p) => (
                  <FilterPill
                    key={p.id}
                    label={p.label}
                    active={phase === p.id}
                    onClick={() => setPhase(p.id)}
                    count={p.id === "all" ? realisations.length : counts.phase[p.id]}
                  />
                ))}
              </div>
            </div>
            <div className="filter-group">
              <span className="filter-label">Type</span>
              <div className="filter-pills">
                {CATEGORIES.map((c) => (
                  <FilterPill
                    key={c.id}
                    label={c.label}
                    active={category === c.id}
                    onClick={() => setCategory(c.id)}
                    count={c.id === "all" ? realisations.length : counts.category[c.id]}
                  />
                ))}
              </div>
            </div>
            <div className="filter-group">
              <span className="filter-label">Gamme</span>
              <div className="filter-pills">
                {GAMMES.map((g) => (
                  <FilterPill
                    key={g.id}
                    label={g.label}
                    active={gamme === g.id}
                    onClick={() => setGamme(g.id)}
                    count={g.id === "all" ? realisations.length : counts.gamme[g.id]}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="filters-result reveal">
            <span>
              <strong>{filtered.length}</strong> réalisation{filtered.length > 1 ? "s" : ""}
              {hasFilters && (
                <>
                  {" "}correspondant{filtered.length > 1 ? "s" : ""} à vos filtres
                  <button className="reset-filters" onClick={resetFilters}>
                    Réinitialiser
                  </button>
                </>
              )}
            </span>
            {error && (
              <span className="api-note">
                Réalisations par défaut —{" "}
                <button
                  type="button"
                  onClick={reload}
                  style={{ background: "none", border: "none",
                    color: "inherit", textDecoration: "underline",
                    cursor: "pointer", padding: 0, font: "inherit" }}
                >
                  réessayer
                </button>
              </span>
            )}
          </div>

          {loading && (
            <div className="loading-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div className="skeleton-card" key={i}>
                  <div className="skeleton skeleton-img" />
                  <div className="skeleton-body">
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-line short" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="realisations-grid">
              {filtered.map((item, i) => (
                <RealisationCard
                  key={item.id || i}
                  item={item}
                  index={i}
                  onOpen={setSelected}
                />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="empty-state reveal">
              <span className="empty-icon">◎</span>
              <h3>Aucune réalisation ne correspond à ces filtres.</h3>
              <p>
                Essayez d'élargir votre sélection, ou parlons directement de
                votre projet.
              </p>
              <div className="empty-actions">
                <button className="btn btn-primary" onClick={resetFilters}>
                  Réinitialiser les filtres
                </button>
                <a href="/contact" className="btn btn-outline">Nous contacter</a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============ PROCESSUS ============ */}
      <section className="section process">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Le procédé</span>
            <h2>Ce que vous ne voyez pas d'habitude.</h2>
            <p>
              Un chantier BIC BTP se déroule en trois temps visibles. Nous les
              documentons systématiquement — avec les <strong>quatre moules</strong>
              A (plein), B (fenêtre), C (porte), D (angle).
            </p>
          </div>

          <div className="process-grid">
            {[
              { step: "01", title: "Avant le coulage",
                desc: "Le soubassement est nivelé, les moules A/B/C/D sont posés selon le plan, le ferraillage et les réservations (gaines, ouvertures) sont en place." },
              { step: "02", title: "Pendant le coulage",
                desc: "Le béton est versé d'un seul tenant. Pas de reprise, pas de joint, pas de bloc par bloc. Le mur naît en quelques heures." },
              { step: "03", title: "Après le décoffrage",
                desc: "Les moules repartent sur le chantier suivant, le mur reste. Homogène, calibré, prêt pour la toiture et les finitions." },
            ].map((p, i) => (
              <div className="process-card reveal" key={i} style={{ transitionDelay: `${i * 100}ms` }}>
                <span className="process-num">{p.step}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="process-line" />
              </div>
            ))}
          </div>

          <div className="process-cta reveal">
            <a href="/methode" className="btn btn-primary">
              Comprendre la méthode <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="section cta" id="cta-final">
        <div className="cta-aurora" aria-hidden />
        <div className="cta-grid-lines" aria-hidden />
        <div className="cta-orbs" aria-hidden>
          <span className="cta-orb cta-orb-1" />
          <span className="cta-orb cta-orb-2" />
          <span className="cta-orb cta-orb-3" />
        </div>

        <div className="container cta-box">
          <span className="cta-label reveal">
            <span className="cta-label-dot" /> Votre chantier, le prochain ?
          </span>
          <h2 className="cta-title reveal" style={{ transitionDelay: "80ms" }}>
            Montrez-nous votre terrain.
            <br />
            <span className="cta-title-accent">On vous montrera le reste.</span>
          </h2>
          <p className="cta-sub reveal" style={{ transitionDelay: "160ms" }}>
            Un échange de 15 minutes suffit pour savoir si votre projet ressemble
            à l'un de ces chantiers — ou s'il faut l'adapter.
          </p>
          <div className="cta-actions reveal" style={{ transitionDelay: "240ms" }}>
            <a href="/contact" className="btn btn-primary cta-btn-magnetic">
              <span>Demander un devis</span>
              <span className="cta-btn-arrow" aria-hidden>→</span>
            </a>
            <a href="https://wa.me/22500000000" className="btn btn-ghost cta-btn-ghost"
               target="_blank" rel="noopener noreferrer">
              <span className="cta-wa-icon" aria-hidden>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.7-.9-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 4.9L2 22l5.3-1.4c1.4.7 3 1.1 4.7 1.1 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
                </svg>
              </span>
              WhatsApp direct
            </a>
          </div>
          <div className="cta-trust reveal" style={{ transitionDelay: "320ms" }}>
            <span className="cta-trust-item">
              <strong>14</strong> projets livrés cette année
            </span>
            <span className="cta-trust-sep" aria-hidden>·</span>
            <span className="cta-trust-item">
              <strong>0</strong> dépassement de budget
            </span>
            <span className="cta-trust-sep" aria-hidden>·</span>
            <span className="cta-trust-item">
              Réponse sous <strong>24 h</strong>
            </span>
          </div>
        </div>
      </section>

      {selected && (
        <RealisationModal item={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}