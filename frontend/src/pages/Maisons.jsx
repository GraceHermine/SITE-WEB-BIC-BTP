import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/Maisons.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

/* =========================================================
   DONNÉES — fallback local (calqué sur le PPT + logique métier)
   ========================================================= */

const FALLBACK_HOUSES = [
  {
    id: "f3",
    name: "Modèle F3",
    tagline: "Le premier chez-soi",
    surface: 85,
    chambres: 2,
    sallesBain: 1,
    niveaux: 1,
    price: 45000000,
    priceLabel: "45 000 000 FCFA",
    description: "2 chambres · séjour · cuisine",
    longDescription:
      "Un plan compact, pensé pour une famille qui démarre. Le séjour et la cuisine s'ouvrent l'un sur l'autre, les deux chambres se partagent une salle de bain. Rien d'inutile, rien d'oublié.",
    badge: "Le plus demandé",
    gamme: "Essentiel",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDheccIcyTYGXXim5nmC8Fk2MPt2mzQW7Uls5XD69KBva2pocL4T4FSPoNusTDC9c2WWuZlzSyjHToAqdqliXPGeNHAbpqG8h1G1tnrw9wTJxonJR3btxu8WcyJaMfHTIp9DKz6mwaJouXgGqe-HD2KHzpom-YNzbBds5FyCWSAuNP6sENaiv9ZduNIUynZ0laY0fRQLZt4r6UQDPb65AMxtcUXVKwhniRLchtshuE",
    features: [
      "Cuisine ouverte sur séjour",
      "2 chambres avec placards",
      "Salle de bain avec douche",
      "Terrasse couverte 12 m²",
    ],
  },
  {
    id: "f4",
    name: "Modèle F4",
    tagline: "La famille s'agrandit",
    surface: 120,
    chambres: 3,
    sallesBain: 2,
    niveaux: 1,
    price: 62000000,
    priceLabel: "62 000 000 FCFA",
    description: "3 chambres · séjour · cuisine",
    longDescription:
      "Une chambre de plus, une salle de bain de plus, et surtout : un séjour qui respire. Le F4 est notre plan le plus équilibré — assez grand pour vivre à cinq, assez simple pour tenir un budget.",
    badge: "Idéal famille",
    gamme: "Confort",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBslXqjUeHQlH6R9Vjuwe9QN06I7nUwN0tbFP5EgZlCvDuX3e2xQwkPMpJj-4gp2b0WbH05JXOhIxopUicqr0C098pJEwYWDdVARIdpxk0i7RH-bXlucyAivnzZsMuTEcSn0_OooZehaXjUi5ZUZ5MtHELdL_OZJjqCpx0rIsMTsdrOluaHrmEwQeN-yKmWt2MR4t0C7FuLORgJBi5T2tVXzmLyYId9OBpzJAUAX24",
    features: [
      "Séjour double orientation",
      "3 chambres dont 1 suite parentale",
      "2 salles de bain",
      "Cuisine fermée avec cellier",
      "Terrasse 18 m²",
    ],
  },
  {
    id: "duplex",
    name: "Villa Duplex",
    tagline: "Deux niveaux, deux vies",
    surface: 180,
    chambres: 4,
    sallesBain: 3,
    niveaux: 2,
    price: 89000000,
    priceLabel: "89 000 000 FCFA",
    description: "4 chambres · R+1 · terrasse",
    longDescription:
      "Le duplex sépare ce qui doit l'être : les enfants en haut, les parents en bas. Un étage pour dormir, un autre pour recevoir. Et une terrasse qui regarde au-dessus du quartier.",
    badge: "Prestige",
    gamme: "Prestige",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHex-azUInK6fnHBCzBw7sL9K0RRegSpYWFrp4o8cmLJODjOA4IyAMrLk1WsV9D3GVEzq9MTAIi155_FPaOh5A6h8BPvPmT0z847HRAEBSRVL-qEzONWHlKggeNHT0wO50gIVWL4mEvaVVFTsvgXfsh2fjBTPqR74BwS5PaszDk732MTUV4KID2ttpb3o0dcS8Ax7DOGbH_B7Vq8mYJJmPnkJ6aON9MxlcmUm6VSA",
    features: [
      "R+1 avec escalier central",
      "4 chambres dont 2 suites",
      "3 salles de bain",
      "Terrasse 25 m² à l'étage",
      "Garage 2 voitures",
    ],
  },
];

const GAMMES = ["Essentiel", "Confort", "Prestige"];
const CHAMBRES_OPTIONS = [
  { label: "Toutes", value: 0 },
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
  { label: "4+", value: 4 },
];
const SURFACE_OPTIONS = [
  { label: "Toutes", value: 0 },
  { label: "80 m² +", value: 80 },
  { label: "100 m² +", value: 100 },
  { label: "150 m² +", value: 150 },
];
const BUDGET_OPTIONS = [
  { label: "Tous", value: 0 },
  { label: "< 50 M", value: 50000000 },
  { label: "< 70 M", value: 70000000 },
  { label: "< 100 M", value: 100000000 },
];
const SORT_OPTIONS = [
  { label: "Surface croissante", value: "surface-asc" },
  { label: "Surface décroissante", value: "surface-desc" },
  { label: "Prix croissant", value: "price-asc" },
  { label: "Prix décroissant", value: "price-desc" },
];

async function fetchJson(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* =========================================================
   HOOKS
   ========================================================= */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
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
  }, []);
}

/* =========================================================
   SOUS-COMPOSANTS
   ========================================================= */

function FilterPill({ label, active, onClick }) {
  return (
    <button
      className={`filter-pill ${active ? "is-active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function HouseCard({ house, index, onOpen }) {
  return (
    <article
      className="house-card reveal"
      style={{ transitionDelay: `${index * 80}ms` }}
      onClick={() => onOpen(house)}
      tabIndex={0}
      role="button"
      aria-label={`Voir la fiche ${house.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(house);
        }
      }}
    >
      <div className="house-img">
        <img src={house.image_url} alt={house.name} loading="lazy" />
        {house.badge && <span className="house-badge">{house.badge}</span>}
        <span className="house-gamme">{house.gamme}</span>
      </div>
      <div className="house-body">
        <div className="house-head">
          <h3>{house.name}</h3>
          <span className="house-tagline">{house.tagline}</span>
        </div>
        <p className="house-desc">{house.description}</p>

        <div className="house-specs">
          <span className="spec">
            <strong>{house.surface}</strong> m²
          </span>
          <span className="spec">
            <strong>{house.chambres}</strong> ch.
          </span>
          <span className="spec">
            <strong>{house.sallesBain}</strong> sdb
          </span>
          <span className="spec">
            <strong>R+{house.niveaux - 1}</strong>
          </span>
        </div>

        <div className="price-row">
          <div>
            <small>À partir de</small>
            <strong>{house.priceLabel}</strong>
          </div>
          <span className="btn-icon" aria-hidden>→</span>
        </div>
      </div>
    </article>
  );
}

function HouseModal({ house, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!house) return null;

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

        <div className="modal-img">
          <img src={house.image_url} alt={house.name} />
          {house.badge && <span className="house-badge">{house.badge}</span>}
        </div>

        <div className="modal-body">
          <span className="modal-gamme">Gamme {house.gamme}</span>
          <h2 id="modal-title">{house.name}</h2>
          <p className="modal-tagline">{house.tagline}</p>

          <p className="modal-desc">{house.longDescription}</p>

          <div className="modal-specs">
            <div className="modal-spec">
              <span className="spec-value">{house.surface}</span>
              <span className="spec-label">m² habitables</span>
            </div>
            <div className="modal-spec">
              <span className="spec-value">{house.chambres}</span>
              <span className="spec-label">chambres</span>
            </div>
            <div className="modal-spec">
              <span className="spec-value">{house.sallesBain}</span>
              <span className="spec-label">salles de bain</span>
            </div>
            <div className="modal-spec">
              <span className="spec-value">R+{house.niveaux - 1}</span>
              <span className="spec-label">niveaux</span>
            </div>
          </div>

          <div className="modal-features">
            <h4>Ce qui est inclus</h4>
            <ul>
              {house.features.map((f, i) => (
                <li key={i}><span className="check">✓</span> {f}</li>
              ))}
            </ul>
          </div>

          <div className="modal-cta">
            <div className="modal-price">
              <small>À partir de</small>
              <strong>{house.priceLabel}</strong>
            </div>
            <div className="modal-actions">
              <a href={`/contact?modele=${house.id}`} className="btn btn-primary">
                Demander un devis <span aria-hidden>→</span>
              </a>
              <a href="/finitions" className="btn btn-outline">Voir les finitions</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
   ========================================================= */
export default function Maisons() {
  const [houses, setHouses] = useState(FALLBACK_HOUSES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);

  const [filterChambres, setFilterChambres] = useState(0);
  const [filterSurface, setFilterSurface] = useState(0);
  const [filterBudget, setFilterBudget] = useState(0);
  const [sort, setSort] = useState("surface-asc");

  useReveal();

  /* Chargement API */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchJson("/api/houses/");
        if (cancelled) return;
        if (Array.isArray(data) && data.length) setHouses(data);
      } catch (err) {
        console.warn("API indisponible, données locales utilisées.", err);
        setError("API indisponible — affichage des modèles locaux.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* Filtrage + tri */
  const filteredHouses = useMemo(() => {
    let list = [...houses];

    if (filterChambres > 0) list = list.filter((h) => h.chambres >= filterChambres);
    if (filterSurface > 0) list = list.filter((h) => h.surface >= filterSurface);
    if (filterBudget > 0) list = list.filter((h) => h.price <= filterBudget);

    switch (sort) {
      case "surface-asc":  list.sort((a, b) => a.surface - b.surface); break;
      case "surface-desc": list.sort((a, b) => b.surface - a.surface); break;
      case "price-asc":    list.sort((a, b) => a.price - b.price); break;
      case "price-desc":   list.sort((a, b) => b.price - a.price); break;
      default: break;
    }
    return list;
  }, [houses, filterChambres, filterSurface, filterBudget, sort]);

  const resetFilters = () => {
    setFilterChambres(0);
    setFilterSurface(0);
    setFilterBudget(0);
    setSort("surface-asc");
  };

  const hasFilters = filterChambres || filterSurface || filterBudget || sort !== "surface-asc";

  return (
    <main className="maisons-page">

      {/* ============ HERO ============ */}
      <section className="maisons-hero">
        <div className="maisons-hero-bg" aria-hidden />
        <div className="container maisons-hero-content">
          <span className="badge">
            <span className="badge-dot" /> Catalogue
          </span>
          <h1>
            Une maison, ce n'est pas un plan.<br />
            <span>C'est un choix.</span>
          </h1>
          <p>
            Trois modèles. Trois façons d'habiter. Même méthode de construction,
            même niveau de finitions — seule la surface et l'organisation changent.
            À vous de voir laquelle vous ressemble.
          </p>
          <div className="maisons-hero-actions">
            <a href="#catalogue" className="btn btn-primary">
              Voir les 3 modèles <span aria-hidden>→</span>
            </a>
            <a href="/methode" className="btn btn-ghost">
              Comprendre la méthode
            </a>
          </div>
        </div>
      </section>

      {/* ============ CATALOGUE ============ */}
      <section className="section catalogue" id="catalogue">
        <div className="container">

          {/* Barre de filtres */}
          <div className="filters reveal">
            <div className="filter-group">
              <span className="filter-label">Chambres</span>
              <div className="filter-pills">
                {CHAMBRES_OPTIONS.map((opt) => (
                  <FilterPill
                    key={opt.value}
                    label={opt.label}
                    active={filterChambres === opt.value}
                    onClick={() => setFilterChambres(opt.value)}
                  />
                ))}
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-label">Surface</span>
              <div className="filter-pills">
                {SURFACE_OPTIONS.map((opt) => (
                  <FilterPill
                    key={opt.value}
                    label={opt.label}
                    active={filterSurface === opt.value}
                    onClick={() => setFilterSurface(opt.value)}
                  />
                ))}
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-label">Budget</span>
              <div className="filter-pills">
                {BUDGET_OPTIONS.map((opt) => (
                  <FilterPill
                    key={opt.value}
                    label={opt.label}
                    active={filterBudget === opt.value}
                    onClick={() => setFilterBudget(opt.value)}
                  />
                ))}
              </div>
            </div>

            <div className="filter-group filter-group-sort">
              <span className="filter-label">Trier par</span>
              <select
                className="filter-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Trier les modèles"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Résultat */}
          <div className="filters-result reveal">
            <span>
              <strong>{filteredHouses.length}</strong> modèle{filteredHouses.length > 1 ? "s" : ""}
              {hasFilters && (
                <>
                  {" "}correspondant{filteredHouses.length > 1 ? "s" : ""} à vos critères
                  <button className="reset-filters" onClick={resetFilters}>
                    Réinitialiser
                  </button>
                </>
              )}
            </span>
            {error && <span className="api-note">{error}</span>}
          </div>

          {/* Loading */}
          {loading && (
            <div className="loading-grid">
              {[1, 2, 3].map((i) => (
                <div className="skeleton-card" key={i}>
                  <div className="skeleton skeleton-img" />
                  <div className="skeleton-body">
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-line short" />
                    <div className="skeleton skeleton-line" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grille */}
          {!loading && filteredHouses.length > 0 && (
            <div className="grid-3">
              {filteredHouses.map((house, i) => (
                <HouseCard
                  key={house.id || i}
                  house={house}
                  index={i}
                  onOpen={setSelectedHouse}
                />
              ))}
            </div>
          )}

          {/* Aucun résultat */}
          {!loading && filteredHouses.length === 0 && (
            <div className="empty-state reveal">
              <span className="empty-icon">◎</span>
              <h3>Aucun modèle ne correspond à ces critères.</h3>
              <p>
                Essayez d'élargir votre budget ou de réduire le nombre de chambres.
                Ou parlons-en : nous avons peut-être le plan qu'il vous faut.
              </p>
              <div className="empty-actions">
                <button className="btn btn-primary" onClick={resetFilters}>
                  Réinitialiser les filtres
                </button>
                <a href="/contact" className="btn btn-outline">Nous contacter</a>
              </div>
            </div>
          )}

          <p className="legal-text">
            * Prix indicatifs à partir de, hors terrain et hors frais annexes.
            Surfaces habitables. Images d'inspiration non contractuelles.
          </p>
        </div>
      </section>

      {/* ============ COMPARATEUR RAPIDE ============ */}
      <section className="section comparateur">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Comparer</span>
            <h2>Les 3 modèles, côte à côte.</h2>
            <p>Un coup d'œil suffit pour voir ce qui change.</p>
          </div>

          <div className="comparateur-table reveal" role="table" aria-label="Comparaison des 3 modèles">
            <div className="comp-row comp-head" role="row">
              <span role="columnheader" className="comp-critere">Critère</span>
              {FALLBACK_HOUSES.map((h) => (
                <span role="columnheader" key={h.id} className="comp-house-name">
                  {h.name}
                </span>
              ))}
            </div>
            {[
              { key: "surface", label: "Surface", suffix: " m²" },
              { key: "chambres", label: "Chambres" },
              { key: "sallesBain", label: "Salles de bain" },
              { key: "niveaux", label: "Niveaux", format: (v) => `R+${v - 1}` },
              { key: "gamme", label: "Gamme" },
              { key: "priceLabel", label: "À partir de" },
            ].map((row) => (
              <div className="comp-row" role="row" key={row.key}>
                <span role="cell" className="comp-critere">{row.label}</span>
                {FALLBACK_HOUSES.map((h) => (
                  <span role="cell" key={h.id} className="comp-value">
                    {row.format ? row.format(h[row.key]) : h[row.key]}
                    {row.suffix || ""}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <div className="comparateur-cta reveal">
            <a href="/contact" className="btn btn-primary">
              Demander un devis personnalisé <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="section cta">
        <div className="container cta-box reveal">
          <span className="cta-label">Vous hésitez encore ?</span>
          <h2>Parlons de votre projet.<br />Pas de nos modèles.</h2>
          <p>
            Un échange de 15 minutes suffit pour savoir quel plan correspond
            à votre terrain, votre budget, votre famille.
          </p>
          <div className="cta-actions">
            <a href="/contact" className="btn btn-primary">
              Demander un devis <span aria-hidden>→</span>
            </a>
            <a
              href="https://wa.me/22500000000"
              className="btn btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp direct
            </a>
          </div>
        </div>
      </section>

      {/* ============ MODAL FICHE ============ */}
      {selectedHouse && (
        <HouseModal house={selectedHouse} onClose={() => setSelectedHouse(null)} />
      )}

    </main>
  );
}