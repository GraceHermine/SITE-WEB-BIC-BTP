import { useEffect, useRef, useState } from "react";
import "../styles/About.css";

/* =========================================================
   DONNÉES — ce qui est affirmable + placeholders explicites
   ========================================================= */

const MANIFESTE = [
  {
    num: "01",
    title: "On ne croit pas au hasard.",
    text: "Une maison qui tient debout, ce n'est pas une question de chance. C'est une question de méthode. Nous avons choisi l'industrialisation parce qu'elle supprime les variables : mêmes moules, même béton, même résultat, chantier après chantier.",
  },
  {
    num: "02",
    title: "On ne croit pas au 'on verra bien'.",
    text: "Un budget qui dérape, un délai qui glisse, une finition qui déçoit : ce sont des phrases qu'on n'accepte pas. Chez nous, le prix est connu à la signature, le délai est tenu, la finition est choisie. Pas de mauvaise surprise.",
  },
  {
    num: "03",
    title: "On croit que la maison, c'est vous.",
    text: "La structure, c'est notre affaire. L'intérieur, c'est la vôtre. Nous posons le cadre — solide, homogène, rapide — et vous décidez de ce que vous toucherez, verrez, vivrez au quotidien. C'est ça, notre définition du sur-mesure.",
  },
];

const VALEURS = [
  {
    id: "solidite",
    icon: "◆",
    title: "Solidité",
    short: "Ce qui tient.",
    long: "Un mur coulé d'un seul tenant ne triche pas. Pas de joint faible, pas de reprise, pas de variation d'une équipe à l'autre. La solidité n'est pas un argument marketing : c'est une propriété physique du béton coulé dans un moule calibré.",
  },
  {
    id: "transparence",
    icon: "◎",
    title: "Transparence",
    short: "Ce qui se dit.",
    long: "Un prix connu à la signature, un planning tenu, des photos de chantier à chaque étape. Nous ne promettons pas ce que nous ne pouvons pas tenir. Nous documentons ce que nous faisons.",
  },
  {
    id: "vitesse",
    icon: "⚡",
    title: "Vitesse",
    short: "Ce qui avance.",
    long: "Une fois le soubassement terminé, les murs montent en quelques jours. Ce n'est pas de la précipitation : c'est de l'organisation. Chaque jour gagné sur le gros œuvre est un jour investi dans les finitions.",
  },
  {
    id: "sur-mesure",
    icon: "✦",
    title: "Sur-mesure",
    short: "Ce qui vous ressemble.",
    long: "La structure est standard, l'intérieur ne l'est pas. Sols, cuisine, salle de bain, lumière : vous décidez. Nous ne vendons pas une maison, nous vendons un cadre que vous habitez.",
  },
];

const ENGAGEMENTS = [
  {
    icon: "✓",
    title: "Prix connu à la signature",
    desc: "Pas de rallonge, pas d'imprévu. Le devis signé est le prix final.",
  },
  {
    icon: "⏱",
    title: "Délai tenu",
    desc: "Le planning est contractuel. Si nous sommes en retard, nous nous engageons à vous dédommager.",
  },
  {
    icon: "⟳",
    title: "Photos de chantier à chaque étape",
    desc: "Vous suivez l'avancement, même à distance. Pas de flou, pas d'attente.",
  },
  {
    icon: "◎",
    title: "Suivi post-livraison",
    desc: "12 mois après la remise des clés, nous restons joignables. Un problème ? Nous revenons.",
  },
];

const ETAPES_HISTOIRE = [
  {
    year: "Origine",
    title: "Un constat",
    desc: "La construction traditionnelle en Côte d'Ivoire prend des mois, coûte plus cher que prévu, et dépend de l'équipe qui passe. Nous avons décidé de changer ça.",
  },
  {
    year: "Choix",
    title: "L'industrialisation",
    desc: "Plutôt que de maçonner bloc par bloc, nous avons choisi de couler les murs dans des moules calibrés, réutilisables, standardisés. Quatre formes suffisent à construire toutes les maisons.",
  },
  {
    year: "Aujourd'hui",
    title: "Une méthode qui tient",
    desc: "Des dizaines de murs coulés, des chantiers livrés, des budgets tenus. La méthode fonctionne. Elle est reproductible. Elle est documentée.",
  },
  {
    year: "Demain",
    title: "Passer à l'échelle",
    desc: "Nous voulons que cette méthode devienne la norme, pas l'exception. Construire plus vite, plus solide, plus juste — pour tous ceux qui veulent une maison sans mauvaise surprise.",
  },
];

const CHIFFRES = [
  { value: 4, suffix: "", label: "moules standardisés" },
  { value: 6, suffix: "", label: "étapes par projet" },
  { value: 3, suffix: "", label: "gammes de finitions" },
  { value: 100, suffix: "%", label: "prix connus d'avance" },
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
    <div className="stat" ref={ref} style={{ transitionDelay: `${delay}ms` }}>
      <span className="stat-value">{n}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function ValeurCard({ valeur, active, onSelect }) {
  return (
    <button
      className={`valeur-card ${active ? "is-active" : ""}`}
      onClick={() => onSelect(valeur.id)}
      aria-pressed={active}
    >
      <span className="valeur-icon" aria-hidden>{valeur.icon}</span>
      <h3>{valeur.title}</h3>
      <span className="valeur-short">{valeur.short}</span>
      <span className="valeur-arrow" aria-hidden>→</span>
    </button>
  );
}

/* =========================================================
   PAGE
   ========================================================= */
export default function About() {
  const [activeValeur, setActiveValeur] = useState(VALEURS[0].id);

  useReveal();

  const valeur = VALEURS.find((v) => v.id === activeValeur);

  return (
    <main className="about-page">

      {/* ============ HERO ============ */}
      <section className="about-hero">
        <div className="about-hero-bg" aria-hidden />
        <div className="container about-hero-content">
          <span className="badge">
            <span className="badge-dot" /> À propos
          </span>
          <h1>
            On ne construit pas des maisons.<br />
            <span>On construit des certitudes.</span>
          </h1>
          <p>
            BIC BTP bâtit la structure de ses maisons avec des moules préfabriqués et des plans standardisés. Résultat : un gros œuvre rapide et homogène. Nous concentrons ensuite notre savoir-faire là où il se voit et se vit au quotidien : les finitions intérieures.

          </p>
          <div className="about-hero-actions">
            <a href="#manifeste" className="btn btn-primary">
              Lire notre manifeste <span aria-hidden>→</span>
            </a>
            <a href="/methode" className="btn btn-ghost">
              Comprendre la méthode
            </a>
          </div>
        </div>
      </section>

      {/* ============ CHIFFRES ============ */}
      <section className="stats-bar">
        <div className="container stats-grid">
          {CHIFFRES.map((s, i) => (
            <StatItem key={i} {...s} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* ============ MANIFESTE ============ */}
      <section className="section manifeste" id="manifeste">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Manifeste</span>
            <h2>Trois choses en lesquelles on croit.</h2>
            <p>
              Pas des valeurs affichées sur un mur. Des convictions qui décident
              de chaque choix, sur chaque chantier.
            </p>
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

      {/* ============ VALEURS INTERACTIVES ============ */}
      <section className="section valeurs">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Nos valeurs</span>
            <h2>Quatre mots. Quatre engagements.</h2>
            <p>
              Cliquez sur un mot pour voir ce qu'il change concrètement sur un
              chantier.
            </p>
          </div>

          <div className="valeurs-layout reveal">
            <div className="valeurs-grid">
              {VALEURS.map((v) => (
                <ValeurCard
                  key={v.id}
                  valeur={v}
                  active={activeValeur === v.id}
                  onSelect={setActiveValeur}
                />
              ))}
            </div>

            <div className="valeur-detail" key={valeur.id}>
              <span className="valeur-detail-icon" aria-hidden>{valeur.icon}</span>
              <h3>{valeur.title}</h3>
              <p>{valeur.long}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HISTOIRE / TIMELINE ============ */}
      <section className="section histoire">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Notre histoire</span>
            <h2>D'où l'on vient. Où l'on va.</h2>
            <p>
              Pas une chronologie de dates — une chronologie de choix.
            </p>
          </div>

          <ol className="histoire-timeline">
            {ETAPES_HISTOIRE.map((e, i) => (
              <li
                className="histoire-item reveal"
                key={i}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="histoire-year">{e.year}</span>
                <div className="histoire-body">
                  <h3>{e.title}</h3>
                  <p>{e.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ ENGAGEMENTS ============ */}
      <section className="section engagements">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Nos engagements</span>
            <h2>Ce qu'on vous promet. Ce qu'on tient.</h2>
            <p>
              Quatre engagements concrets, vérifiables sur chaque chantier.
              Pas de promesse en l'air.
            </p>
          </div>

          <div className="engagements-grid">
            {ENGAGEMENTS.map((e, i) => (
              <article
                className="engagement-card reveal"
                key={i}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="engagement-icon" aria-hidden>{e.icon}</span>
                <h3>{e.title}</h3>
                <p>{e.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ÉQUIPE (PLACEHOLDER) ============ */}
      <section className="section equipe">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">L'équipe</span>
            <h2>Derrière la méthode, des gens.</h2>
            <p>
              BIC BTP, c'est une équipe d'ingénieurs, de chefs de chantier et
              d'artisans qui font tenir la méthode, jour après jour.
            </p>
          </div>

          <div className="equipe-placeholder reveal">
            <div className="equipe-avatar-group" aria-hidden>
              {[1, 2, 3, 4].map((i) => (
                <div className="equipe-avatar" key={i}>
                  <span>{["B", "I", "C", "★"][i - 1]}</span>
                </div>
              ))}
            </div>
            <div className="equipe-note">
              <h3>Les visages viendront.</h3>
              <p>
                Nous préparons les portraits et les rôles de chacun. En attendant,
                vous pouvez nous rencontrer sur un chantier, ou nous appeler
                directement.
              </p>
              <a href="/contact" className="btn btn-outline">
                Nous rencontrer <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="section cta">
        <div className="container cta-box reveal">
          <span className="cta-label">Travaillons ensemble</span>
          <h2>Vous avez un terrain.<br />Nous avons une méthode.</h2>
          <p>
            Un échange de 15 minutes suffit pour savoir si nos convictions
            rejoignent les vôtres — et si votre projet peut se construire
            avec nous.
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