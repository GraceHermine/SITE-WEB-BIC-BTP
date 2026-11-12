import { useEffect, useRef, useState, useCallback } from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import { adaptHeroSlide, adaptHouse } from "../api/adapters";
import { useApi } from "../hooks/useApi";
import { useInfo } from "../hooks/useInfo";

/* =========================================================
   FALLBACKS (affichés si l'API est indisponible)
   ========================================================= */

const FALLBACK_HERO = [
  {
    title: "Villa contemporaine",
    subtitle: "Le béton, la lumière, le silence.",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0cBRxY4pYqEuoXuuc0X73lUXByafVA42O_RDuntVd2uEbfMeKQvNxNWBBwvISU6U3ArDL9oLidXY-2x412_ZBV_1K9Iu3i9IWjGhE10g6vfwXalT1Xr9u6EUgaVsnIXjbKCwYJAInRM-AcNmiFpKkZCmy3j1NFB4W6WUSi4LnBTIv80jQtsZErhBIMVJ0pHRNc2zv6aQEe_udgHx5AQcxV74e9-OH4cj-PnjC0Gs",
  },
  {
    title: "Maison moderne",
    subtitle: "Un gros œuvre rapide. Un intérieur qui prend son temps.",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBslXqjUeHQlH6R9Vjuwe9QN06I7nUwN0tbFP5EgZlCvDuX3e2xQwkPMpJj-4gp2b0WbH05JXOhIxopUicqr0C098pJEwYWDdVARIdpxk0i7RH-bXlucyAivnzZsMuTEcSn0_OooZehaXjUi5ZUZ5MtHELdL_OZJjqCpx0rIsMTsdrOluaHrmEwQeN-yKmWt2MR4t0C7FuLORgJBi5T2tVXzmLyYId9OBpzJAUAX24",
  },
  {
    title: "Villa duplex",
    subtitle: "Deux niveaux. Une seule promesse : la solidité.",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHex-azUInK6fnHBCzBw7sL9K0RRegSpYWFrp4o8cmLJODjOA4IyAMrLk1WsV9D3GVEzq9MTAIi155_FPaOh5A6h8BPvPmT0z847HRAEBSRVL-qEzONWHlKggeNHT0wO50gIVWL4mEvaVVFTsvgXfsh2fjBTPqR74BwS5PaszDk732MTUV4KID2ttpb3o0dcS8Ax7DOGbH_B7Vq8mYJJmPnkJ6aON9MxlcmUm6VSA",
  },
];

const FALLBACK_HOUSES_RAW = [
  {
    name: "Modèle F3",
    surface: "85 m²",
    description: "2 chambres · séjour · cuisine",
    price: "45 000 000 FCFA",
    badge: "Le plus demandé",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDheccIcyTYGXXim5nmC8Fk2MPt2mzQW7Uls5XD69KBva2pocL4T4FSPoNusTDC9c2WWuZlzSyjHToAqdqliXPGeNHAbpqG8h1G1tnrw9wTJxonJR3btxu8WcyJaMfHTIp9DKz6mwaJouXgGqe-HD2KHzpom-YNzbBds5FyCWSAuNP6sENaiv9ZduNIUynZ0laY0fRQLZt4r6UQDPb65AMxtcUXVKwhniRLchtshuE",
  },
  {
    name: "Modèle F4",
    surface: "120 m²",
    description: "3 chambres · séjour · cuisine",
    price: "62 000 000 FCFA",
    badge: "Idéal famille",
    image_url: FALLBACK_HERO[1].image_url,
  },
  {
    name: "Villa Duplex",
    surface: "180 m²",
    description: "4 chambres · R+1 · terrasse",
    price: "89 000 000 FCFA",
    badge: "Prestige",
    image_url: FALLBACK_HERO[2].image_url,
  },
];

/* Adapté UNE SEULE FOIS → références stables → pas de re-montage. */
const FALLBACK_HOUSES = FALLBACK_HOUSES_RAW.map((h) => adaptHouse(h));

/* =========================================================
   CONTENU STATIQUE
   ========================================================= */

const TICKER_ITEMS = [
  "Murs coulés en 48 h",
  "Budget connu à la signature",
  "Finitions à votre image",
  "Structure identique, chantier après chantier",
  "Sans joint faible",
  "Délais tenus",
];

const MANIFESTE = [
  {
    num: "01",
    title: "Le béton ne triche pas",
    text: "Un mur coulé d'un seul tenant ne ment pas. Pas de joint faible, pas de variation d'une équipe à l'autre. La structure est identique, maison après maison. C'est notre point de départ.",
  },
  {
    num: "02",
    title: "Le temps est un matériau",
    text: "Chaque jour gagné sur le gros œuvre est un jour investi dans les finitions. Nous ne vendons pas de la vitesse : nous vendons le temps que la vitesse libère.",
  },
  {
    num: "03",
    title: "La maison, c'est vous",
    text: "La structure est standard, l'intérieur ne l'est pas. Sols, cuisine, salle de bain, lumière : vous décidez. Nous posons le cadre, vous signez la maison.",
  },
];

const PREUVES = [
  {
    icon: "◆",
    title: "Murs d'un seul tenant",
    text: "Coulés dans des moules calibrés. Pas de bloc par bloc, pas de joint faible, pas de reprise.",
  },
  {
    icon: "⟳",
    title: "Moules réutilisables",
    text: "Les mêmes coffrages servent sur chaque chantier. Ce qui est amorti ne se facture pas deux fois.",
  },
  {
    icon: "◎",
    title: "Prix connu à la signature",
    text: "Plans standards, moules amortis, finitions cadrées. Pas d'imprévu caché, pas de rallonge.",
  },
  {
    icon: "✦",
    title: "Finitions 100 % personnalisables",
    text: "Le temps gagné sur la structure est investi dans ce qui se voit et se vit au quotidien.",
  },
];

const FINITIONS = [
  { title: "Sols & carrelage", desc: "Grands formats, grès cérame, pose millimétrée", icon: "▦" },
  { title: "Cuisine équipée", desc: "Agencement, plan de travail, rangements pensés", icon: "◫" },
  { title: "Salle de bain", desc: "Sanitaires, robinetterie, faïence choisie", icon: "◈" },
  { title: "Menuiseries", desc: "Portes intérieures, placards sur mesure", icon: "◧" },
  { title: "Peinture & décor", desc: "Couleurs, finitions murales, ambiances", icon: "◐" },
  { title: "Éclairage", desc: "Points lumineux, scénographie, LED", icon: "☼" },
];

const STATS = [
  { value: 6, suffix: "", label: "étapes, pas une de plus" },
  { value: 4, suffix: "", label: "moules pour toute la maison" },
  { value: 3, suffix: "", label: "gammes de finitions" },
  { value: 100, suffix: "%", label: "prix connu d'avance" },
];

/* =========================================================
   HOOKS CUSTOM
   ========================================================= */

/**
 * Reveal au scroll — version robuste :
 *  - révèle immédiatement les éléments déjà dans le viewport
 *    (évite les cartes invisibles après un re-montage React) ;
 *  - un MutationObserver rattrape les nœuds `.reveal` ajoutés
 *    plus tard (ex. cartes arrivées de l'API).
 */
function useReveal(deps = []) {
  useEffect(() => {
    let io = null;

    const revealIfVisible = (el) => {
      const rect = el.getBoundingClientRect();
      const inViewport =
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.height > 0;
      if (inViewport) {
        el.classList.add("is-visible");
        return true;
      }
      return false;
    };

    const setup = () => {
      const els = document.querySelectorAll(".reveal:not(.is-visible)");
      if (!els.length) return;

      if (!io) {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add("is-visible");
                io.unobserve(e.target);
              }
            });
          },
          { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
        );
      }

      els.forEach((el) => {
        if (!revealIfVisible(el)) io.observe(el);
      });
    };

    setup();

    const mo = new MutationObserver(() => setup());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (io) io.disconnect();
      mo.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Compteur animé. */
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

/** Parallaxe légère sur le hero. */
function useParallax(ref, factor = 0.25) {
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const y = window.scrollY;
      ref.current.style.transform = `translate3d(0, ${y * factor}px, 0)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref, factor]);
}

/** Bouton magnétique. */
function useMagnet(ref, strength = 0.25) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const onLeave = () => {
      el.style.transform = "translate(0,0)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, strength]);
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
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const n = useCountUp(value, 1400, visible);

  return (
    <div className="stat" ref={ref} style={{ transitionDelay: `${delay}ms` }}>
      <span className="stat-value">
        {n}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker" aria-hidden>
      <div className="ticker-track">
        {items.map((t, i) => (
          <span key={i} className="ticker-item">
            {t}
            <span className="ticker-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function HeroCta() {
  const btnRef = useRef(null);
  useMagnet(btnRef, 0.3);
  return (
    <Link to="/maisons" className="btn btn-primary btn-magnetic" ref={btnRef}>
      Voir le catalogue <span aria-hidden>→</span>
    </Link>
  );
}

/** Bandeau d'état pour les sections chargées par API. */
function SectionStatus({ loading, error, onRetry, loadedMessage }) {
  if (loading) {
    return (
      <p className="legal-text" role="status" aria-live="polite">
        Chargement…
      </p>
    );
  }
  if (error) {
    return (
      <div className="legal-text" role="alert">
        {loadedMessage || "Contenu indisponible"} —{" "}
        <button
          type="button"
          onClick={onRetry}
          className="btn btn-outline"
          style={{ padding: "8px 16px", marginLeft: 8 }}
        >
          Réessayer
        </button>
      </div>
    );
  }
  return null;
}

/* =========================================================
   PAGE
   ========================================================= */

function Home() {
  /* -------- Hero -------- */
  const {
    data: heroData,
    error: heroError,
    reload: reloadHero,
  } = useApi("/api/hero/", { adapt: adaptHeroSlide });

  const [heroImages, setHeroImages] = useState(FALLBACK_HERO);
  const [activeImage, setActiveImage] = useState(0);
  const autoplay = useRef(null);
  const heroBgRef = useRef(null);

  useParallax(heroBgRef, 0.18);

  useEffect(() => {
    if (heroData && heroData.length > 0) {
      setHeroImages(heroData);
      setActiveImage(0);
    } else if (heroError) {
      setHeroImages(FALLBACK_HERO);
      setActiveImage(0);
    }
  }, [heroData, heroError]);

  /* Autoplay — proprement nettoyé */
  useEffect(() => {
    if (!heroImages.length) return;
    autoplay.current = setInterval(() => {
      setActiveImage((p) => (p + 1) % heroImages.length);
    }, 6500);
    return () => {
      if (autoplay.current) {
        clearInterval(autoplay.current);
        autoplay.current = null;
      }
    };
  }, [heroImages.length]);

  const stopAutoplay = useCallback(() => {
    if (autoplay.current) {
      clearInterval(autoplay.current);
      autoplay.current = null;
    }
  }, []);

  const changeImage = useCallback(
    (dir) => {
      stopAutoplay();
      setActiveImage((p) => (p + dir + heroImages.length) % heroImages.length);
    },
    [heroImages.length, stopAutoplay]
  );

  const selectImage = useCallback(
    (idx) => {
      stopAutoplay();
      setActiveImage(idx);
    },
    [stopAutoplay]
  );

  const current = heroImages[activeImage];

  /* -------- Houses -------- */
  const {
    data: housesData,
    loading: housesLoading,
    error: housesError,
    reload: reloadHouses,
  } = useApi("/api/houses/", { adapt: adaptHouse });

  // Références stables : pas de .map(adaptHouse) à chaque render.
  const houses =
    housesData && housesData.length > 0 ? housesData : FALLBACK_HOUSES;

  /* -------- Info (coordonnées) -------- */
  const { info } = useInfo();

  const whatsappUrl = info?.whatsapp_number
    ? `https://wa.me/${String(info.whatsapp_number).replace(/\D/g, "")}`
    : "https://wa.me/22500000000";

  /* -------- Reveal --------
   * On ne dépend PAS de houses.length (sinon l'observer est recréé
   * et les cartes déjà révélées clignotent). Le MutationObserver
   * interne au hook gère les cartes ajoutées après coup.
   */
  useReveal([heroImages.length]);

  return (
    <main className="home-page">
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-parallax" ref={heroBgRef}>
          {heroImages.map((img, i) => (
            <div
              key={img.id ?? i}
              className={`hero-bg ${i === activeImage ? "is-active" : ""}`}
              style={{ backgroundImage: `url(${img.image_url})` }}
              aria-hidden={i !== activeImage}
            />
          ))}
        </div>

        <div className="hero-overlay" />
        <div className="hero-noise" aria-hidden />
        <div className="hero-bg-text" aria-hidden>
          BIC BTP
        </div>

        <div className="container hero-content">
          <div className="hero-text">
            <span className="badge">
              <span className="badge-dot" />
              Structure industrielle · finitions sur mesure
            </span>

            <h1>
              <span className="hero-title-line">Le béton</span>
              <span className="hero-title-line">ne ment pas.</span>
              <span className="hero-title-line hero-title-accent">
                Votre intérieur, si.
              </span>
            </h1>

            <p className="hero-sub">
              Murs coulés en 48 h dans des moules calibrés. Le temps gagné,
              nous l'investissons dans ce qui se voit : vos finitions.
            </p>

            <div className="hero-actions">
              <HeroCta />
              <Link to="/method" className="btn btn-ghost">
                Voir la méthode
              </Link>
            </div>

            <ul className="hero-trust">
              <li>
                <strong>48 h</strong>
                <span>pour monter les murs</span>
              </li>
              <li>
                <strong>0 surprise</strong>
                <span>sur le prix</span>
              </li>
              <li>
                <strong>100 %</strong>
                <span>finitions sur mesure</span>
              </li>
            </ul>
          </div>

          <div className="hero-gallery">
            <div className="hero-card">
              <div className="hero-caption">
                <span className="hero-caption-index">
                  {String(activeImage + 1).padStart(2, "0")}
                  <span className="caption-sep">/</span>
                  {String(heroImages.length).padStart(2, "0")}
                </span>
                <h3>{current?.title}</h3>
                <p>{current?.subtitle}</p>
              </div>

              <div className="thumbnails">
                {heroImages.map((img, idx) => (
                  <button
                    key={img.id ?? idx}
                    type="button"
                    className={`thumb ${activeImage === idx ? "active" : ""}`}
                    onClick={() => selectImage(idx)}
                    aria-label={`Voir : ${img.title}`}
                  >
                    <img src={img.image_url} alt={img.title} />
                  </button>
                ))}
              </div>

              <div className="controls">
                <button
                  type="button"
                  onClick={() => changeImage(-1)}
                  aria-label="Précédent"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => changeImage(1)}
                  aria-label="Suivant"
                >
                  →
                </button>
              </div>
            </div>

            <div className="hero-progress" aria-hidden>
              {heroImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`hero-progress-seg ${
                    activeImage === idx ? "is-active" : ""
                  }`}
                />
              ))}
            </div>

            {heroError && (
              <div
                className="legal-text"
                role="alert"
                style={{ color: "#fff", opacity: 0.7, fontSize: ".75rem" }}
              >
                Slides par défaut —{" "}
                <button
                  type="button"
                  onClick={reloadHero}
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
          </div>
        </div>

        <div className="hero-scroll-hint" aria-hidden>
          <span>Défiler</span>
          <span className="hero-scroll-line" />
        </div>
      </section>

      {/* ============ TICKER ============ */}
      <Ticker />

      {/* ============ STATS ============ */}
      <section className="stats-bar">
        <div className="container stats-grid">
          {STATS.map((s, i) => (
            <StatItem key={i} {...s} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* ============ MANIFESTE ============ */}
      <section className="section manifeste">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Manifeste</span>
            <h2>
              Trois convictions. <br />
              Pas trois slogans.
            </h2>
          </div>

          <div className="manifeste-grid">
            {MANIFESTE.map((m, i) => (
              <article
                className="manifeste-card reveal"
                key={m.num}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="manifeste-num">{m.num}</span>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PREUVES ============ */}
      <section className="section preuves">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Preuves</span>
            <h2>Ce que vous gagnez, concrètement</h2>
            <p>Pas des promesses : des faits vérifiables sur chaque chantier.</p>
          </div>

          <div className="grid-4">
            {PREUVES.map((item, i) => (
              <article
                className="card reveal"
                key={i}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MÉTHODE ============ */}
      <section className="section methode">
        <div className="container split-layout">
          <div className="image-wrapper reveal">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzPBIW-SSJIoMUFjWhnNGphP7d8JIT4Lz6Uo6dOUyUzwaWEErCsHfC5eNpNfffAyxRdoOJ248O1vyYvkhBhmJC9ZNdZBqhEk8zbxnktvxe-jly7jugwefuTG_0nzGDknDwB3KXn1CZ1e3jUWSN4fGBJh9bAtUJxbs-XHl89y7jVSoSM77MjFnUFdvzQ68-zOv-7nigMndHhmAhwvS5C5rXdCxYgdOeC87n6RaNXeg"
              alt="Chantier BIC BTP — murs coulés en moules"
            />
            <span className="tag">Le coulage en moules</span>
          </div>

          <div className="text-wrapper reveal">
            <span className="section-label">Comment on construit</span>
            <h2>Quatre moules. Une infinité de maisons.</h2>
            <p className="lead">
              Un mur plein. Un mur avec fenêtre. Un mur avec porte. Un angle.
              C'est tout. Quatre formes qui, combinées, donnent votre F3, votre
              duplex, votre villa.
            </p>

            <ul className="list">
              <li>
                <span className="num">A</span>
                <div>
                  <strong>Mur plein</strong>
                  <p>La base structurelle, sans ouverture.</p>
                </div>
              </li>
              <li>
                <span className="num">B</span>
                <div>
                  <strong>Mur fenêtre</strong>
                  <p>La lumière est réservée dès le coulage.</p>
                </div>
              </li>
              <li>
                <span className="num">C</span>
                <div>
                  <strong>Mur porte</strong>
                  <p>L'entrée, les passages — prévus dans le moule.</p>
                </div>
              </li>
              <li>
                <span className="num">D</span>
                <div>
                  <strong>Angle</strong>
                  <p>La jonction, propre à chaque coin.</p>
                </div>
              </li>
            </ul>

            <Link to="/methode" className="btn btn-primary">
              Voir les 6 étapes <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FINITIONS ============ */}
      <section className="section finitions">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Là où tout se joue</span>
            <h2>Le temps gagné, on le met ici.</h2>
            <p>
              Six postes de finition. Trois gammes. Une seule règle : vous
              décidez.
            </p>
          </div>

          <div className="grid-3">
            {FINITIONS.map((f, i) => (
              <article
                className="finition-item reveal"
                key={i}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="finition-icon" aria-hidden>
                  {f.icon}
                </span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>

          <div className="gammes reveal">
            <span className="gammes-label">Gammes :</span>
            <span className="gamme-pill">Essentiel</span>
            <span className="gamme-pill">Confort</span>
            <span className="gamme-pill">Prestige</span>
          </div>
        </div>
      </section>

      {/* ============ CATALOGUE ============ */}
      <section className="section catalogue">
        <div className="container">
          <div className="section-header flex-between reveal">
            <div>
              <span className="section-label">Catalogue</span>
              <h2>Des plans éprouvés. Des prix connus.</h2>
              <p>Surface, chambres, budget : tout est clair avant de commencer.</p>
            </div>
            <Link to="/maisons" className="btn btn-outline">
              Voir tout
            </Link>
          </div>

          <SectionStatus
            loading={housesLoading}
            error={housesError}
            onRetry={reloadHouses}
            loadedMessage="Catalogue indisponible"
          />

          {/* On ne rend les cartes qu'une fois le chargement terminé
              (ou en cas d'erreur avec fallback) → pas de double montage. */}
          {!housesLoading && (
            <div className="grid-3">
              {houses.map((house, i) => (
                <article
                  className="house-card reveal"
                  key={`house-${house.id ?? house.slug ?? i}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="house-img">
                    <img
                      src={house.image_url}
                      alt={house.name}
                      loading="lazy"
                    />
                    <span className="surface">{house.surface}</span>
                    {house.badge && (
                      <span className="house-badge">{house.badge}</span>
                    )}
                  </div>
                  <div className="house-body">
                    <h3>{house.name}</h3>
                    <p>{house.description}</p>
                    <div className="price-row">
                      <div>
                        <small>À partir de</small>
                        <strong>{house.price}</strong>
                      </div>
                      <Link
                        to="/contact"
                        className="btn-icon"
                        aria-label={`Devis pour ${house.name}`}
                      >
                        →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <p className="legal-text">
            * Visuels d'inspiration non contractuels. Finitions et équipements
            variables selon la gamme choisie.
          </p>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="section cta">
        <div className="container cta-box reveal">
          <span className="cta-label">Prochaine étape</span>
          <h2>
            Parlons de votre maison.
            <br />
            Pas de la nôtre.
          </h2>
          <p>
            15 minutes suffisent pour cadrer votre projet, votre budget, votre
            calendrier.
          </p>
          <div className="cta-actions">
            <Link to="/contact" className="btn btn-primary">
              Demander un devis <span aria-hidden>→</span>
            </Link>
            <a
              href={whatsappUrl}
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

export default Home;