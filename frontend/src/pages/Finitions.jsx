import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/Finitions.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

/* =========================================================
   DONNÉES — contenu enrichi
   ========================================================= */

const GAMMES = [
  {
    id: "essentiel",
    name: "Essentiel",
    tagline: "Le nécessaire, bien fait",
    description:
      "Tout ce qu'il faut pour habiter, sans superflu. Des matériaux fiables, une pose soignée, un budget maîtrisé. La maison est prête, solide, à vous.",
    color: "#5a6a83",
    coef: 1,
  },
  {
    id: "confort",
    name: "Confort",
    tagline: "Le bon équilibre",
    description:
      "Le niveau que nous recommandons le plus souvent. De meilleurs matériaux, des détails qui changent le quotidien, un budget encore raisonnable.",
    color: "#1E5BD8",
    coef: 1.35,
  },
  {
    id: "prestige",
    name: "Prestige",
    tagline: "Le sur-mesure assumé",
    description:
      "Pour ceux qui veulent du caractère. Grands formats, menuiseries sur mesure, éclairage scénographié. Le temps et le budget suivent.",
    color: "#0E2A5C",
    coef: 1.8,
  },
];

const POSTES = [
  {
    id: "sols",
    title: "Sols & carrelage",
    icon: "▦",
    description:
      "Le premier contact avec la maison. Un sol bien choisi change la perception d'un espace avant même qu'on y entre.",
    options: {
      essentiel: "Grès cérame 60×60, pose droite",
      confort: "Grès cérame 80×80, pose calepinée",
      prestige: "Grand format 120×120 ou pierre naturelle",
    },
  },
  {
    id: "cuisine",
    title: "Cuisine équipée",
    icon: "◫",
    description:
      "Le cœur de la maison. Agencement, plan de travail, rangements : tout est pensé pour le geste quotidien.",
    options: {
      essentiel: "Linéaire, plan stratifié, rangements fermés",
      confort: "En L ou en U, plan quartz, tiroirs coulissants",
      prestige: "Îlot central, plan pierre, électroménager intégré",
    },
  },
  {
    id: "sdb",
    title: "Salle de bain",
    icon: "◈",
    description:
      "Le seul endroit où l'on est vraiment seul. Sanitaires, robinetterie, faïence : chaque détail compte.",
    options: {
      essentiel: "Douche à l'italienne, faïence blanche",
      confort: "Douche + vasque double, faïence grand format",
      prestige: "Baignoire îlot, double vasque, pierre naturelle",
    },
  },
  {
    id: "menuiseries",
    title: "Menuiseries",
    icon: "◧",
    description:
      "Ce qui se touche tous les jours. Portes intérieures, placards, dressings : la qualité se ressent au quotidien.",
    options: {
      essentiel: "Portes alvéolaires, placards standards",
      confort: "Portes âme pleine, placards sur mesure",
      prestige: "Portes à galandage, dressings toute hauteur",
    },
  },
  {
    id: "peinture",
    title: "Peinture & décor",
    icon: "◐",
    description:
      "Ce qui donne l'ambiance. Couleurs, finitions murales, textures : la personnalité de chaque pièce.",
    options: {
      essentiel: "Peinture mate blanche, plinthes simples",
      confort: "Deux teintes par pièce, plinthes profilées",
      prestige: "Béton ciré, papiers peints, staff sur mesure",
    },
  },
  {
    id: "eclairage",
    title: "Éclairage",
    icon: "☼",
    description:
      "Ce qui change tout sans qu'on le voie. Points lumineux, scénographie, LED : la lumière sculpte l'espace.",
    options: {
      essentiel: "Points centraux par pièce",
      confort: "Spots encastrés + variateurs",
      prestige: "Scénographie complète, LED indirectes, domotique",
    },
  },
];

const AMBIANCES = {
  essentiel: {
    label: "Lumière naturelle, matières simples",
    swatches: ["#F4F6FA", "#DCE6F7", "#8ba3c7", "#5a6a83"],
  },
  confort: {
    label: "Bois clair, bleu profond, cuivre discret",
    swatches: ["#F4F6FA", "#1E5BD8", "#C9A66B", "#0E2A5C"],
  },
  prestige: {
    label: "Pierre, laiton, noyer, lumière basse",
    swatches: ["#EFE7DB", "#B8894A", "#4A2E1F", "#0E2A5C"],
  },
};

const TICKER_ITEMS = [
  "Sols grands formats",
  "Cuisines équipées",
  "Salles de bain sur mesure",
  "Menuiseries à la demande",
  "Éclairage scénographié",
  "3 gammes · 6 postes · 1 seule règle",
];

const HERO_STATS = [
  { value: "3", label: "gammes au choix" },
  { value: "6", label: "postes de finition" },
  { value: "15 min", label: "pour cadrer votre projet" },
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


function usePostesGridReveal() {
  useEffect(() => {
    const cards = document.querySelectorAll(".poste-card");
    if (!cards.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    cards.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* =========================================================
   SOUS-COMPOSANTS
   ========================================================= */

/* Blocs de construction animés en arrière-plan du hero */
function HeroBlocks() {
  // Grille 4×5 = 20 blocs. On masque quelques blocs pour dessiner une silhouette.
  const EMPTY = new Set([3, 7, 12, 18]);
  return (
    <div className="finitions-hero-blocks" aria-hidden>
      {Array.from({ length: 20 }, (_, i) => (
        <span
          key={i}
          className={`finitions-hero-block ${EMPTY.has(i) ? "is-empty" : ""}`}
        />
      ))}
    </div>
  );
}   

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="finitions-ticker" aria-hidden>
      <div className="finitions-ticker-track">
        {items.map((t, i) => (
          <span key={i} className="finitions-ticker-item">
            {t}
            <span className="finitions-ticker-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function GammeCard({ gamme, active, onSelect }) {
  return (
    <button
      className={`gamme-card ${active ? "is-active" : ""}`}
      onClick={() => onSelect(gamme.id)}
      style={{ "--gamme-color": gamme.color }}
      aria-pressed={active}
    >
      <span className="gamme-card-tag" style={{ color: gamme.color }}>
        {gamme.name}
      </span>
      <h3>{gamme.tagline}</h3>
      <p>{gamme.description}</p>
      <span className="gamme-card-cta">
        {active ? "Gamme sélectionnée ✓" : "Choisir cette gamme →"}
      </span>
    </button>
  );
}

/* =========================================================
   PAGE
   ========================================================= */
export default function Finitions() {
  const [postes, setPostes] = useState(POSTES);
  const [activeGamme, setActiveGamme] = useState("confort");
  const [activePoste, setActivePoste] = useState(POSTES[0].id);
  const [loading, setLoading] = useState(true);

  const configRef = useRef(null);

  useReveal();
  usePostesGridReveal();

  /* Chargement API (optionnel — fallback local) */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchJson("/api/finitions/");
        if (cancelled) return;
        if (Array.isArray(data) && data.length) setPostes(data);
      } catch (err) {
        console.warn("API indisponible, données locales utilisées.", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const gamme = useMemo(() => GAMMES.find((g) => g.id === activeGamme), [activeGamme]);
  const poste = useMemo(
    () => postes.find((p) => p.id === activePoste),
    [postes, activePoste]
  );
  const ambiance = AMBIANCES[activeGamme];

  /* Scroll doux vers le configurateur quand on choisit une gamme */
  const handleSelectGamme = (id) => {
    setActiveGamme(id);
    if (configRef.current) {
      const rect = configRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.7;
      if (!isVisible) {
        configRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <main className="finitions-page">
      {/* ============ HERO ============ */}
      <section className="finitions-hero">
        <div className="finitions-hero-bg" aria-hidden />
        <div className="finitions-hero-scan" aria-hidden />
        <HeroBlocks />
        <div className="container finitions-hero-content">
          <span className="badge">
            <span className="badge-dot" /> Notre différence
          </span>
          <h1>
            Le gros œuvre, c'est notre affaire.
            <br />
            <span>Le reste, c'est vous.</span>
          </h1>
          <p>
            Une fois les murs coulés, la maison n'est encore qu'une coquille.
            C'est ici que tout se joue : les sols que vous allez fouler, la cuisine
            où vous allez cuisiner, la lumière que vous allez allumer. Six postes,
            trois gammes, une seule règle : vous décidez.
          </p>
          <div className="finitions-hero-actions">
            <a href="#gammes" className="btn btn-primary">
              Voir les 3 gammes <span aria-hidden>→</span>
            </a>
            <a href="/contact" className="btn btn-ghost">
              Demander un devis
            </a>
          </div>

          <div className="finitions-hero-stats">
            {HERO_STATS.map((s) => (
              <div className="finitions-hero-stat" key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TICKER ============ */}
      <Ticker />

      {/* ============ 3 GAMMES ============ */}
      <section className="section gammes-section" id="gammes">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Les gammes</span>
            <h2>
              Trois niveaux. <em>Un seul objectif :</em> vous ressembler.
            </h2>
            <p>
              La gamme ne change pas la structure. Elle change ce que vous touchez,
              voyez et vivez au quotidien. Choisissez votre point de départ — vous
              pourrez ajuster poste par poste ensuite.
            </p>
          </div>

          <div className="gammes-grid">
            {GAMMES.map((g, i) => (
              <div
                className="reveal"
                key={g.id}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <GammeCard
                  gamme={g}
                  active={activeGamme === g.id}
                  onSelect={handleSelectGamme}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONFIGURATEUR INTERACTIF ============ */}
      <section className="section configurateur" ref={configRef}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Configurateur</span>
            <h2>Composez votre intérieur.</h2>
            <p>
              Cliquez sur un poste de finition pour voir ce qu'il devient dans
              chaque gamme. Votre sélection se met à jour en direct.
            </p>
          </div>

          <div className="config-layout reveal">
            {/* Colonne gauche : liste des postes */}
            <div className="config-postes">
              <div className="config-postes-header">
                <span className="config-postes-label">6 postes</span>
                <span
                  className="config-postes-gamme"
                  style={{ color: gamme.color }}
                >
                  Gamme {gamme.name}
                </span>
              </div>
              <ul className="config-postes-list">
                {postes.map((p) => (
                  <li key={p.id}>
                    <button
                      className={`config-poste-btn ${
                        activePoste === p.id ? "is-active" : ""
                      }`}
                      onClick={() => setActivePoste(p.id)}
                      aria-pressed={activePoste === p.id}
                    >
                      <span className="config-poste-icon" aria-hidden>
                        {p.icon}
                      </span>
                      <span className="config-poste-title">{p.title}</span>
                      <span className="config-poste-arrow" aria-hidden>
                        →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne droite : détail du poste actif */}
            <div className="config-detail" key={`${poste?.id}-${activeGamme}`}>
              <div className="config-detail-head">
                <span className="config-detail-icon" aria-hidden>
                  {poste?.icon}
                </span>
                <div>
                  <h3>{poste?.title}</h3>
                  <p className="config-detail-desc">{poste?.description}</p>
                </div>
              </div>

              {/* Comparaison des 3 gammes pour ce poste */}
              <div className="config-options">
                {GAMMES.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className={`config-option ${
                      activeGamme === g.id ? "is-active" : ""
                    }`}
                    style={{ "--opt-color": g.color }}
                    onClick={() => setActiveGamme(g.id)}
                    aria-pressed={activeGamme === g.id}
                  >
                    <span
                      className="config-option-label"
                      style={{ color: g.color }}
                    >
                      {g.name}
                    </span>
                    <p>{poste?.options?.[g.id]}</p>
                    {activeGamme === g.id && (
                      <span className="config-option-check" aria-hidden>
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Ambiance visuelle */}
              <div className="config-ambiance">
                <span className="config-ambiance-label">
                  Ambiance {gamme.name}
                </span>
                <p className="config-ambiance-desc">{ambiance.label}</p>
                <div className="config-swatches">
                  {ambiance.swatches.map((c, i) => (
                    <span
                      key={i}
                      className="swatch"
                      style={{ background: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              {/* CTA contextuel */}
              <div className="config-cta">
                <a
                  href={`/contact?gamme=${activeGamme}&poste=${activePoste}`}
                  className="btn btn-primary"
                >
                  Demander un devis {gamme.name} <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* ============ LES 6 POSTES EN DÉTAIL ============ */}
        <section className="section postes-detail">
        <div className="container">
            <div className="section-header reveal">
            <span className="section-label">Les 6 postes</span>
            <h2>Ce sur quoi vous décidez.</h2>
            <p>
                Chaque poste est un choix. Voici ce qu'il couvre, ce qu'il change,
                et pourquoi il compte.
            </p>
            </div>

            <div className="postes-grid">
            {postes.map((p, i) => (
                <article
                className="poste-card"
                key={p.id}
                style={{ transitionDelay: `${i * 90}ms` }}
                >
                <span className="poste-icon" aria-hidden>
                    {p.icon}
                </span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="poste-options-mini">
                    {GAMMES.map((g) => (
                    <span
                        key={g.id}
                        className="poste-mini-pill"
                        style={{ "--pill-color": g.color }}
                        title={`${g.name} : ${p.options[g.id]}`}
                    >
                        {g.name}
                    </span>
                    ))}
                </div>
                </article>
            ))}
            </div>
        </div>
        </section>

      {/* ============ AMBIANCES PAR GAMME ============ */}
      <section className="section ambiances">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Les ambiances</span>
            <h2>Ce que chaque gamme raconte.</h2>
            <p>
              Trois gammes, trois univers. Cliquez sur une ambiance pour voir ce
              qu'elle change dans la maison.
            </p>
          </div>

          <div className="ambiances-grid">
            {GAMMES.map((g, i) => {
              const amb = AMBIANCES[g.id];
              return (
                <button
                  key={g.id}
                  className={`ambiance-card reveal ${
                    activeGamme === g.id ? "is-active" : ""
                  }`}
                  onClick={() => handleSelectGamme(g.id)}
                  style={{
                    transitionDelay: `${i * 100}ms`,
                    "--amb-color": g.color,
                  }}
                  aria-pressed={activeGamme === g.id}
                >
                  <div
                    className="ambiance-visual"
                    style={{
                      background: `linear-gradient(135deg, ${amb.swatches[0]} 0%, ${amb.swatches[1]} 100%)`,
                    }}
                  >
                    <div className="ambiance-swatches">
                      {amb.swatches.map((c, j) => (
                        <span
                          key={j}
                          className="swatch-large"
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="ambiance-body">
                    <span className="ambiance-name" style={{ color: g.color }}>
                      {g.name}
                    </span>
                    <h3>{amb.label}</h3>
                    <p>{g.tagline}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="section cta">
        <div className="container cta-box reveal">
          <span className="cta-label">Prêt à choisir ?</span>
          <h2>Vos finitions, votre signature.</h2>
          <p>
            Un échange de 15 minutes suffit pour cadrer votre gamme, vos postes
            prioritaires et votre budget finitions. Sans engagement.
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