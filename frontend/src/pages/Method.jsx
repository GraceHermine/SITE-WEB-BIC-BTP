import { useEffect, useRef, useState } from "react";
import "../styles/Method.css";

/* =========================================================
   DONNÉES — reformulées, pas recopiées
   ========================================================= */

const PILIERS = [
  {
    num: "01",
    title: "L'usine, pour le gros œuvre",
    desc: "Des moules calibrés, réutilisables, qui coulent les murs d'un seul tenant. Pas de bloc par bloc, pas de joint faible : la structure est identique, maison après maison.",
    icon: "▤",
  },
  {
    num: "02",
    title: "Le catalogue, pour les plans",
    desc: "Des maisons éprouvées, dessinées une fois pour toutes. Moins d'études, des coûts connus d'avance, des délais tenus.",
    icon: "▥",
  },
  {
    num: "03",
    title: "L'atelier, pour les finitions",
    desc: "Sols, cuisine, salle de bain, menuiseries, couleurs, lumière : c'est ici que votre maison devient la vôtre.",
    icon: "✦",
  },
];

const COULAGE_STEPS = [
  {
    num: "1",
    title: "Les moules se posent",
    desc: "Sur le soubassement nivelé, les coffrages sont alignés selon le plan. Un moule = un mur. Rien d'approximatif.",
  },
  {
    num: "2",
    title: "L'acier se glisse",
    desc: "Armatures en place, gaines électriques et ouvertures (portes, fenêtres) sont réservées dans le moule.",
  },
  {
    num: "3",
    title: "Le béton coule",
    desc: "Murs et structure d'un seul tenant. Pas de reprise, pas de joint faible, pas de surprise dans dix ans.",
  },
  {
    num: "4",
    title: "Les moules repartent",
    desc: "Décoffrage, nettoyage, réemploi sur le chantier suivant. Ce qui est réutilisé ne se paie pas deux fois.",
  },
];

const MOULES = [
  {
    code: "A",
    name: "Mur plein",
    role: "La base structurelle, sans ouverture. C'est lui qui porte.",
    dims: "× 2,70 m",
    color: "#1E5BD8",
    shape: "plein",
  },
  {
    code: "B",
    name: "Mur fenêtre",
    role: "La lumière est réservée dès le coulage. Le cadre est déjà là.",
    dims: "× 2,70 m",
    color: "#7ea5e8",
    shape: "fenetre",
  },
  {
    code: "C",
    name: "Mur porte",
    role: "L'entrée et les passages : prévus dans le moule, pas découpés après.",
    dims: "× 2,70 m",
    color: "#E8833A",
    shape: "porte",
  },
  {
    code: "D",
    name: "Angle",
    role: "La jonction, propre à chaque coin. C'est lui qui tient l'ensemble.",
    dims: "× m",
    color: "#0E2A5C",
    shape: "angle",
  },
];

const ETAPES = [
  {
    num: "01",
    title: "Choix du plan",
    client: "Vous choisissez un modèle, un terrain, une gamme.",
    technique: "Étude de sol, validation du plan, calage du budget.",
    phase: "etude",
    duration: "2 à 4 semaines",
  },
  {
    num: "02",
    title: "Fondations",
    client: "On prépare le sol. C'est invisible, mais tout en dépend.",
    technique: "Soubassement, dalle, ferraillage des fondations.",
    phase: "gros-oeuvre",
    duration: "2 à 3 semaines",
  },
  {
    num: "03",
    title: "Coulage en moules",
    client: "Les murs apparaissent en quelques jours.",
    technique: "Montage des moules, coulage, décoffrage, réemploi.",
    phase: "gros-oeuvre",
    duration: "5 à 10 jours",
  },
  {
    num: "04",
    title: "Toiture & réseaux",
    client: "La maison est close. L'électricité et la plomberie se dessinent.",
    technique: "Charpente, couverture, passages de gaines, tableau.",
    phase: "gros-oeuvre",
    duration: "3 à 5 semaines",
  },
  {
    num: "05",
    title: "Finitions",
    client: "C'est ici que votre maison devient la vôtre.",
    technique: "Sols, cuisine, salle de bain, peinture, éclairage.",
    phase: "finitions",
    duration: "6 à 12 semaines",
  },
  {
    num: "06",
    title: "Remise des clés",
    client: "Vous entrez. On reste joignables.",
    technique: "Réception, levée des réserves, suivi post-livraison.",
    phase: "finitions",
    duration: "1 à 2 semaines",
  },
];

const COMPARATIF = [
  { critere: "Murs", trad: "Maçonnés bloc par bloc", bic: "Coulés d'un seul tenant" },
  { critere: "Homogénéité", trad: "Variable selon les équipes", bic: "Identique, maison après maison" },
  { critere: "Gros œuvre", trad: "Plusieurs mois", bic: "Quelques jours après le soubassement" },
  { critere: "Études", trad: "Au cas par cas", bic: "Plans déjà validés" },
  { critere: "Budget", trad: "Exposé aux imprévus", bic: "Connu dès la signature" },
  { critere: "Personnalisation", trad: "Sur la structure", bic: "Sur les finitions" },
];

const TICKER_ITEMS = [
  "Murs coulés d'un seul tenant",
  "4 moules, toutes les maisons",
  "Prix connu à la signature",
  "Finitions 100 % personnalisables",
  "Sans joint faible",
  "Délais tenus",
];

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

function useParallax(ref, factor = 0.15) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      el.style.transform = `translate3d(0, ${window.scrollY * factor}px, 0)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref, factor]);
}

/* =========================================================
   SOUS-COMPOSANTS
   ========================================================= */

function MouleShape({ shape, color }) {
  return (
    <div className="moule-shape" style={{ "--moule-color": color }}>
      {shape === "plein" && <div className="moule-plein" />}
      {shape === "fenetre" && (
        <div className="moule-fenetre">
          <span className="trou" />
        </div>
      )}
      {shape === "porte" && (
        <div className="moule-porte">
          <span className="trou" />
        </div>
      )}
      {shape === "angle" && <div className="moule-angle" />}
    </div>
  );
}

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="method-ticker" aria-hidden>
      <div className="method-ticker-track">
        {items.map((t, i) => (
          <span key={i} className="method-ticker-item">
            {t}
            <span className="method-ticker-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* Étape timeline avec double lecture (client / technique) */
function TimelineStep({ etape, delay }) {
  const [open, setOpen] = useState(false);
  return (
    <li
      className={`timeline-item phase-${etape.phase} reveal`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <button
        className="timeline-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="timeline-num">{etape.num}</span>
        <div className="timeline-body">
          <div className="timeline-head">
            <h3>{etape.title}</h3>
            <span className="timeline-duration">{etape.duration}</span>
          </div>
          <p className="timeline-client">{etape.client}</p>
          <div className={`timeline-extra ${open ? "is-open" : ""}`}>
            <span className="timeline-extra-label">Côté chantier</span>
            <p>{etape.technique}</p>
          </div>
        </div>
        <span className={`timeline-chevron ${open ? "is-open" : ""}`} aria-hidden>
          +
        </span>
      </button>
    </li>
  );
}

/* =========================================================
   PAGE
   ========================================================= */
export default function Method() {
  const [activeMoule, setActiveMoule] = useState(0);
  const [comparMode, setComparMode] = useState("bic"); // "trad" | "bic"
  const heroBgRef = useRef(null);

  useParallax(heroBgRef, 0.2);
  useReveal();

  const moule = MOULES[activeMoule];

  return (
    <main className="method-page">

      {/* ============ HERO ============ */}
      <section className="method-hero">
        <div className="method-hero-parallax" ref={heroBgRef}>
          <div className="method-hero-bg" />
        </div>
        <div className="container method-hero-content">
          <span className="badge">
            <span className="badge-dot" /> Notre méthode
          </span>
          <h1>
            L'usine pour le gros œuvre.<br />
            <span>L'atelier pour le reste.</span>
          </h1>
          <p>
            Nos maisons ont deux vies. La première, rapide et standardisée,
            se joue en coulant des murs dans des moules calibrés. La seconde,
            lente et sur mesure, se joue dans vos finitions. C'est la nôtre
            de méthode : ne pas confondre les deux.
          </p>
          <div className="method-hero-actions">
            <a href="/maisons" className="btn btn-primary">
              Voir le catalogue <span aria-hidden>→</span>
            </a>
            <a href="/contact" className="btn btn-ghost">
              Demander un devis
            </a>
          </div>
        </div>
      </section>

      {/* ============ TICKER ============ */}
      <Ticker />

      {/* ============ 3 PILIERS ============ */}
      <section className="section method-piliers">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Le principe</span>
            <h2>Deux vitesses, un seul chantier.</h2>
            <p>
              Le gros œuvre doit aller vite. Les finitions doivent prendre leur temps.
              Nous avons construit une méthode qui respecte les deux.
            </p>
          </div>

          <div className="grid-3">
            {PILIERS.map((p, i) => (
              <article
                className="pilier-card reveal"
                key={p.num}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="pilier-icon" aria-hidden>{p.icon}</span>
                <span className="pilier-num">{p.num}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LE COULAGE EN MOULES ============ */}
      <section className="section method-coulage">
        <div className="container split-layout">
          <div className="coulage-visual reveal" aria-hidden>
            <div className="coulage-illustration">
              <div className="coulage-ben" />
              <div className="coulage-jet" />
              <div className="coulage-moule moule-gauche" />
              <div className="coulage-moule moule-droite" />
              <div className="coulage-beton" />
            </div>
            <span className="tag">Le geste</span>
          </div>

          <div className="coulage-text reveal">
            <span className="section-label">Le coulage en moules</span>
            <h2>Quatre gestes. Un mur.</h2>
            <p className="coulage-lead">
              On ne monte pas un mur. On le coule. C'est plus rapide, plus solide,
              et surtout : identique à chaque fois.
            </p>
            <ol className="coulage-steps">
              {COULAGE_STEPS.map((s) => (
                <li key={s.num}>
                  <span className="step-bullet">{s.num}</span>
                  <div>
                    <strong>{s.title}</strong>
                    <p>{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ============ LES 4 MOULES — interactif ============ */}
      <section className="section method-moules">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">La bibliothèque</span>
            <h2>Quatre formes. Toutes les maisons.</h2>
            <p>
              Un mur plein. Un mur avec fenêtre. Un mur avec porte. Un angle.
              Cliquez sur un moule pour voir son rôle.
            </p>
          </div>

          <div className="moules-showcase reveal">
            {/* Sélecteur */}
            <div className="moules-selector">
              {MOULES.map((m, i) => (
                <button
                  key={m.code}
                  className={`moule-tab ${activeMoule === i ? "is-active" : ""}`}
                  onClick={() => setActiveMoule(i)}
                  style={{ "--moule-color": m.color }}
                >
                  <span className="moule-tab-code">Moule {m.code}</span>
                  <span className="moule-tab-name">{m.name}</span>
                </button>
              ))}
            </div>

            {/* Détail du moule actif */}
            <div className="moule-detail" key={moule.code}>
              <div className="moule-detail-visual">
                <MouleShape shape={moule.shape} color={moule.color} />
              </div>
              <div className="moule-detail-info">
                <span
                  className="moule-code"
                  style={{ color: moule.color }}
                >
                  Moule {moule.code}
                </span>
                <h3>{moule.name}</h3>
                <p className="moule-role">{moule.role}</p>
                <p className="moule-dims">{moule.dims}</p>
              </div>
            </div>
          </div>

          <p className="moules-note reveal">
            <strong>Modèle F3</strong> : quelques A, quelques B, quelques C, quatre D.
            Le plan décide. Les moules s'assemblent.
          </p>
        </div>
      </section>

      {/* ============ 6 ÉTAPES ============ */}
      <section className="section method-etapes">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Le parcours</span>
            <h2>Six étapes. Deux rythmes.</h2>
            <p>
              Cliquez sur une étape pour voir ce qui se passe côté chantier.
              Le gros œuvre va vite, les finitions prennent le temps qu'il faut.
            </p>
          </div>

          <div className="etapes-legend reveal">
            <span className="legend-item">
              <span className="dot dot-etude" /> Étude
            </span>
            <span className="legend-item">
              <span className="dot dot-gros" /> Gros œuvre — rapide
            </span>
            <span className="legend-item">
              <span className="dot dot-finitions" /> Finitions — soignées
            </span>
          </div>

          <ol className="timeline">
            {ETAPES.map((e, i) => (
              <TimelineStep key={e.num} etape={e} delay={i * 60} />
            ))}
          </ol>
        </div>
      </section>

      {/* ============ COMPARATIF — toggle interactif ============ */}
      <section className="section method-comparatif">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">La différence</span>
            <h2>Ce qui change vraiment.</h2>
            <p>
              Basculez entre les deux méthodes pour voir ce qui se joue sur
              votre chantier.
            </p>
          </div>

          <div className="compar-toggle reveal">
            <button
              className={`compar-btn ${comparMode === "trad" ? "is-active" : ""}`}
              onClick={() => setComparMode("trad")}
            >
              Construction traditionnelle
            </button>
            <button
              className={`compar-btn ${comparMode === "bic" ? "is-active" : ""}`}
              onClick={() => setComparMode("bic")}
            >
              Méthode BIC BTP
            </button>
          </div>

          <div className="comparatif-table reveal" role="table" aria-label="Comparatif construction traditionnelle et méthode BIC BTP">
            <div className="comp-row comp-head" role="row">
              <span role="columnheader">Critère</span>
              <span role="columnheader" className={comparMode === "trad" ? "is-highlight" : ""}>
                Traditionnel
              </span>
              <span role="columnheader" className={`comp-bic ${comparMode === "bic" ? "is-highlight" : ""}`}>
                BIC BTP
              </span>
            </div>
            {COMPARATIF.map((row) => (
              <div className="comp-row" role="row" key={row.critere}>
                <span role="cell" className="comp-critere">{row.critere}</span>
                <span
                  role="cell"
                  className={`comp-trad ${comparMode === "trad" ? "is-highlight" : "is-dim"}`}
                >
                  {row.trad}
                </span>
                <span
                  role="cell"
                  className={`comp-bic ${comparMode === "bic" ? "is-highlight" : "is-dim"}`}
                >
                  <span className="check" aria-hidden>✓</span> {row.bic}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="section cta">
        <div className="container cta-box reveal">
          <span className="cta-label">Le plus dur est fait</span>
          <h2>Une fois le soubassement terminé,<br />le reste va vite.</h2>
          <p>
            Le gros œuvre, c'est notre affaire. Les finitions, c'est la vôtre.
            Parlons-en 15 minutes.
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

    </main>
  );
}