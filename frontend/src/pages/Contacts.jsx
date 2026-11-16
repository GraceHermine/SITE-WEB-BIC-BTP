// import { useEffect, useMemo, useRef, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import "../styles/Contacts.css";

// const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// /* =========================================================
//    DONNÉES
//    ========================================================= */

// const MODELES = [
//   { id: "f3", label: "Modèle F3 — 85 m²", desc: "2 chambres · séjour · cuisine" },
//   { id: "f4", label: "Modèle F4 — 120 m²", desc: "3 chambres · séjour · cuisine" },
//   { id: "duplex", label: "Villa Duplex — 180 m²", desc: "4 chambres · R+1 · terrasse" },
//   { id: "indecis", label: "Je ne sais pas encore", desc: "Parlons-en ensemble" },
// ];

// const GAMMES = [
//   { id: "essentiel", label: "Essentiel", desc: "Le nécessaire, bien fait" },
//   { id: "confort", label: "Confort", desc: "Le bon équilibre" },
//   { id: "prestige", label: "Prestige", desc: "Le sur-mesure assumé" },
//   { id: "indecis", label: "Je ne sais pas encore", desc: "On vous guide" },
// ];

// const BUDGETS = [
//   { id: "moins-50", label: "< 50 M FCFA" },
//   { id: "50-70", label: "50 – 70 M FCFA" },
//   { id: "70-100", label: "70 – 100 M FCFA" },
//   { id: "plus-100", label: "> 100 M FCFA" },
//   { id: "indecis", label: "Je ne sais pas" },
// ];

// const DELAIS = [
//   { id: "urgent", label: "Dès que possible" },
//   { id: "3mois", label: "Dans 3 mois" },
//   { id: "6mois", label: "Dans 6 mois" },
//   { id: "annee", label: "Dans l'année" },
//   { id: "reflechi", label: "Je me renseigne" },
// ];

// const CANAUX = [
//   {
//     id: "whatsapp",
//     icon: "◉",
//     title: "WhatsApp",
//     desc: "Le plus rapide. Réponse en moins d'une heure.",
//     value: "+225 00 00 00 00 00",
//     href: "https://wa.me/22500000000",
//     accent: "#25D366",
//   },
//   {
//     id: "phone",
//     icon: "☎",
//     title: "Téléphone",
//     desc: "Du lundi au samedi, 8h – 18h.",
//     value: "+225 00 00 00 00 00",
//     href: "tel:+22500000000",
//     accent: "#1E5BD8",
//   },
//   {
//     id: "email",
//     icon: "✉",
//     title: "E-mail",
//     desc: "Pour les dossiers détaillés et les plans.",
//     value: "contact@bicbtp.ci",
//     href: "mailto:contact@bicbtp.ci",
//     accent: "#0E2A5C",
//   },
//   {
//     id: "visite",
//     icon: "⌖",
//     title: "Visite",
//     desc: "Sur rendez-vous — chantier ou bureau.",
//     value: "Abidjan, Côte d'Ivoire",
//     href: null,
//     accent: "#E8833A",
//   },
// ];

// const ETAPES_FORM = [
//   { id: "projet", label: "Votre projet" },
//   { id: "besoins", label: "Vos besoins" },
//   { id: "coordonnees", label: "Vos coordonnées" },
// ];

// /* =========================================================
//    VALIDATION
//    ========================================================= */

// function validateEmail(v) {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
// }
// function validatePhone(v) {
//   return /^(\+?\d[\d\s\-().]{7,})$/.test(v);
// }

// /* =========================================================
//    HOOK : apparition au scroll (IntersectionObserver)
//    ========================================================= */
// function useReveal() {
//   useEffect(() => {
//     const els = document.querySelectorAll(".reveal");
//     if (!els.length) return;
//     const io = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((e) => {
//           if (e.isIntersecting) {
//             e.target.classList.add("is-visible");
//             io.unobserve(e.target);
//           }
//         });
//       },
//       { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
//     );
//     els.forEach((el) => io.observe(el));
//     return () => io.disconnect();
//   }, []);
// }

// /* =========================================================
//    PAGE
//    ========================================================= */
// export default function Contacts() {
//   const [searchParams] = useSearchParams();

//   /* Pré-remplissage contextuel */
//   const initialModele = useMemo(() => searchParams.get("modele") || searchParams.get("ref") || "", [searchParams]);
//   const initialGamme = useMemo(() => searchParams.get("gamme") || "", [searchParams]);
//   const initialPoste = useMemo(() => searchParams.get("poste") || "", [searchParams]);

//   /* État du formulaire */
//   const [etape, setEtape] = useState(0);
//   const [form, setForm] = useState({
//     modele: initialModele && MODELES.some(m => m.id === initialModele) ? initialModele : "",
//     gamme: initialGamme && GAMMES.some(g => g.id === initialGamme) ? initialGamme : "",
//     poste: initialPoste || "",
//     budget: "",
//     delai: "",
//     terrain: "",
//     message: "",
//     nom: "",
//     email: "",
//     telephone: "",
//     consent: false,
//   });

//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [status, setStatus] = useState("idle"); // idle | sending | success | error
//   const [serverError, setServerError] = useState(null);

//   const formRef = useRef(null);

//   /* ✅ ACTIVE LES ANIMATIONS REVEAL */
//   useReveal();

//   /* Mise à jour d'un champ */
//   const setField = (key, value) => {
//     setForm((f) => ({ ...f, [key]: value }));
//     if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
//   };

//   const markTouched = (key) => setTouched((t) => ({ ...t, [key]: true }));

//   /* Validation par étape */
//   const validateStep = (stepIndex) => {
//     const newErrors = {};
//     if (stepIndex === 0) {
//       if (!form.modele) newErrors.modele = "Choisissez un modèle, ou « Je ne sais pas encore ».";
//       if (!form.budget) newErrors.budget = "Indiquez une fourchette de budget.";
//     }
//     if (stepIndex === 1) {
//       if (!form.delai) newErrors.delai = "Indiquez votre délai souhaité.";
//     }
//     if (stepIndex === 2) {
//       if (!form.nom.trim()) newErrors.nom = "Votre nom est requis.";
//       if (!form.telephone.trim()) {
//         newErrors.telephone = "Un numéro de téléphone est requis.";
//       } else if (!validatePhone(form.telephone)) {
//         newErrors.telephone = "Format de téléphone invalide.";
//       }
//       if (form.email && !validateEmail(form.email)) {
//         newErrors.email = "Format d'e-mail invalide.";
//       }
//       if (!form.consent) newErrors.consent = "Vous devez accepter pour envoyer.";
//     }
//     return newErrors;
//   };

//   const isStepValid = (stepIndex) => Object.keys(validateStep(stepIndex)).length === 0;

//   const goNext = () => {
//     const errs = validateStep(etape);
//     if (Object.keys(errs).length) {
//       setErrors(errs);
//       Object.keys(errs).forEach(markTouched);
//       return;
//     }
//     if (etape < ETAPES_FORM.length - 1) setEtape(etape + 1);
//   };
//   const goPrev = () => { if (etape > 0) setEtape(etape - 1); };

//   /* Envoi */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errs = validateStep(2);
//     if (Object.keys(errs).length) {
//       setErrors(errs);
//       Object.keys(errs).forEach(markTouched);
//       return;
//     }
//     setStatus("sending");
//     setServerError(null);
//     try {
//       const res = await fetch(`${API_BASE}/api/contact/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Accept: "application/json" },
//         body: JSON.stringify(form),
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       setStatus("success");
//       setEtape(0);
//       setForm({
//         modele: "", gamme: "", poste: "", budget: "", delai: "",
//         terrain: "", message: "", nom: "", email: "", telephone: "", consent: false,
//       });
//       setTouched({});
//     } catch (err) {
//       console.warn("Envoi échoué.", err);
//       setStatus("error");
//       setServerError("L'envoi a échoué. Réessayez, ou contactez-nous par WhatsApp.");
//     }
//   };

//   /* Scroll top à changement d'étape */
//   useEffect(() => {
//     if (formRef.current) {
//       formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   }, [etape]);

//   /* Progression */
//   const progress = ((etape + 1) / ETAPES_FORM.length) * 100;

//   return (
//     <main className="contacts-page page-construction-bg">

//       {/* ============ HERO ============ */}
//       <section className="contacts-hero">
//         <div className="contacts-hero-bg" aria-hidden />

//         {/* ✅ Animations construction */}
//         <div className="hero-construction" aria-hidden>
//           <div className="hero-grid" />
//           <div className="hero-crane hero-crane-1" />
//           <div className="hero-crane hero-crane-2" />
//           <div className="hero-scaffold" />
//           <div className="hero-beam" />
//         </div>

//         <div className="container contacts-hero-content">
//           <span className="badge">
//             <span className="badge-dot" /> Contact &amp; Devis
//           </span>
//           <h1>
//             Pas un formulaire.<br />
//             <span>Une conversation.</span>
//           </h1>
//           <p>
//             Vous avez un terrain, un projet, une question. Nous avons une méthode
//             et 15 minutes à vous accorder. Choisissez votre canal — WhatsApp,
//             téléphone, ou le formulaire ci-dessous. On s'occupe du reste.
//           </p>
//         </div>
//       </section>

//       {/* ============ CANAUX DE CONTACT ============ */}
//       <section className="section canaux">
//         <div className="container">
//           <div className="section-header reveal">
//             <span className="section-label">Nous joindre</span>
//             <h2>Quatre façons de nous parler.</h2>
//             <p>Choisissez celle qui vous ressemble.</p>
//           </div>

//           <div className="canaux-grid">
//             {CANAUX.map((c, i) => (
//               <a
//                 key={c.id}
//                 href={c.href || "#formulaire"}
//                 className="canal-card reveal"
//                 style={{ transitionDelay: `${i * 80}ms`, "--accent": c.accent }}
//                 target={c.href?.startsWith("http") ? "_blank" : undefined}
//                 rel={c.href?.startsWith("http") ? "noopener noreferrer" : undefined}
//               >
//                 <span className="canal-icon" aria-hidden>{c.icon}</span>
//                 <h3>{c.title}</h3>
//                 <p className="canal-desc">{c.desc}</p>
//                 <span className="canal-value">{c.value}</span>
//                 <span className="canal-arrow" aria-hidden>→</span>
//               </a>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ============ FORMULAIRE MULTI-ÉTAPES ============ */}
//       <section className="section formulaire" id="formulaire">
//         <div className="container formulaire-layout">

//           {/* Colonne gauche : intro */}
//           <aside className="formulaire-intro reveal">
//             <span className="section-label">Devis</span>
//             <h2>Parlons de votre projet.</h2>
//             <p className="intro-text">
//               Trois étapes, deux minutes. Vous nous dites ce que vous voulez,
//               nous vous répondons sous 24 h avec une première estimation et
//               une proposition de rendez-vous.
//             </p>

//             <ul className="intro-points">
//               <li>
//                 <span className="point-check" aria-hidden>✓</span>
//                 <div>
//                   <strong>Réponse sous 24 h</strong>
//                   <p>Un humain vous répond, pas un robot.</p>
//                 </div>
//               </li>
//               <li>
//                 <span className="point-check" aria-hidden>✓</span>
//                 <div>
//                   <strong>Estimation gratuite</strong>
//                   <p>Un premier chiffrage, sans engagement.</p>
//                 </div>
//               </li>
//               <li>
//                 <span className="point-check" aria-hidden>✓</span>
//                 <div>
//                   <strong>Rendez-vous offert</strong>
//                   <p>15 minutes, sur WhatsApp ou sur votre terrain.</p>
//                 </div>
//               </li>
//             </ul>

//             {/* Contexte détecté */}
//             {(form.modele || form.gamme) && (
//               <div className="contexte-detecte">
//                 <span className="contexte-label">Contexte détecté</span>
//                 <div className="contexte-tags">
//                   {form.modele && <span className="contexte-tag">Modèle : {form.modele}</span>}
//                   {form.gamme && <span className="contexte-tag">Gamme : {form.gamme}</span>}
//                   {form.poste && <span className="contexte-tag">Poste : {form.poste}</span>}
//                 </div>
//               </div>
//             )}
//           </aside>

//           {/* Colonne droite : formulaire */}
//           <div className="form-card reveal" ref={formRef}>

//             {/* Succès */}
//             {status === "success" && (
//               <div className="form-success">
//                 <span className="success-icon" aria-hidden>✓</span>
//                 <h3>Message envoyé.</h3>
//                 <p>
//                   Merci, nous avons bien reçu votre demande. Vous recevrez une
//                   réponse sous 24 h ouvrées. En attendant, si c'est urgent,
//                   écrivez-nous sur WhatsApp.
//                 </p>
//                 <div className="success-actions">
//                   <a
//                     href="https://wa.me/22500000000"
//                     className="btn btn-primary"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     WhatsApp direct <span aria-hidden>→</span>
//                   </a>
//                   <button
//                     className="btn btn-outline"
//                     onClick={() => setStatus("idle")}
//                   >
//                     Nouvelle demande
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Formulaire */}
//             {status !== "success" && (
//               <>
//                 {/* Barre de progression */}
//                 <div className="form-progress">
//                   <div className="form-progress-bar" style={{ width: `${progress}%` }} />
//                 </div>

//                 {/* Stepper */}
//                 <div className="form-stepper">
//                   {ETAPES_FORM.map((e, i) => (
//                     <div
//                       key={e.id}
//                       className={`step ${i === etape ? "is-current" : ""} ${i < etape ? "is-done" : ""}`}
//                     >
//                       <span className="step-num">
//                         {i < etape ? "✓" : i + 1}
//                       </span>
//                       <span className="step-label">{e.label}</span>
//                     </div>
//                   ))}
//                 </div>

//                 <form onSubmit={handleSubmit} noValidate>

//                   {/* ÉTAPE 1 : PROJET */}
//                   {etape === 0 && (
//                     <div className="form-step">
//                       <h3 className="form-step-title">Quel projet vous intéresse ?</h3>

//                       <div className="form-group">
//                         <label className="form-label">
//                           Modèle <span className="required">*</span>
//                         </label>
//                         <div className="radio-grid">
//                           {MODELES.map((m) => (
//                             <button
//                               key={m.id}
//                               type="button"
//                               className={`radio-card ${form.modele === m.id ? "is-selected" : ""}`}
//                               onClick={() => setField("modele", m.id)}
//                               aria-pressed={form.modele === m.id}
//                             >
//                               <span className="radio-title">{m.label}</span>
//                               <span className="radio-desc">{m.desc}</span>
//                             </button>
//                           ))}
//                         </div>
//                         {errors.modele && touched.modele && <span className="form-error">{errors.modele}</span>}
//                       </div>

//                       <div className="form-group">
//                         <label className="form-label">
//                           Budget envisagé <span className="required">*</span>
//                         </label>
//                         <div className="pills">
//                           {BUDGETS.map((b) => (
//                             <button
//                               key={b.id}
//                               type="button"
//                               className={`pill ${form.budget === b.id ? "is-selected" : ""}`}
//                               onClick={() => setField("budget", b.id)}
//                               aria-pressed={form.budget === b.id}
//                             >
//                               {b.label}
//                             </button>
//                           ))}
//                         </div>
//                         {errors.budget && touched.budget && <span className="form-error">{errors.budget}</span>}
//                       </div>
//                     </div>
//                   )}

//                   {/* ÉTAPE 2 : BESOINS */}
//                   {etape === 1 && (
//                     <div className="form-step">
//                       <h3 className="form-step-title">Où en êtes-vous ?</h3>

//                       <div className="form-group">
//                         <label className="form-label">
//                           Gamme de finitions souhaitée
//                         </label>
//                         <div className="pills">
//                           {GAMMES.map((g) => (
//                             <button
//                               key={g.id}
//                               type="button"
//                               className={`pill ${form.gamme === g.id ? "is-selected" : ""}`}
//                               onClick={() => setField("gamme", g.id)}
//                               aria-pressed={form.gamme === g.id}
//                             >
//                               {g.label}
//                             </button>
//                           ))}
//                         </div>
//                       </div>

//                       <div className="form-group">
//                         <label className="form-label">
//                           Délai souhaité <span className="required">*</span>
//                         </label>
//                         <div className="pills">
//                           {DELAIS.map((d) => (
//                             <button
//                               key={d.id}
//                               type="button"
//                               className={`pill ${form.delai === d.id ? "is-selected" : ""}`}
//                               onClick={() => setField("delai", d.id)}
//                               aria-pressed={form.delai === d.id}
//                             >
//                               {d.label}
//                             </button>
//                           ))}
//                         </div>
//                         {errors.delai && touched.delai && <span className="form-error">{errors.delai}</span>}
//                       </div>

//                       <div className="form-group">
//                         <label className="form-label" htmlFor="terrain">Terrain disponible ?</label>
//                         <input
//                           id="terrain"
//                           type="text"
//                           className="form-input"
//                           placeholder="Ex. 500 m² à Bingerville, titre foncier en cours"
//                           value={form.terrain}
//                           onChange={(e) => setField("terrain", e.target.value)}
//                         />
//                       </div>

//                       <div className="form-group">
//                         <label className="form-label" htmlFor="message">Un mot sur votre projet</label>
//                         <textarea
//                           id="message"
//                           className="form-input form-textarea"
//                           rows={4}
//                           placeholder="Ce que vous voulez, ce qui compte pour vous, ce qui vous inquiète…"
//                           value={form.message}
//                           onChange={(e) => setField("message", e.target.value)}
//                         />
//                       </div>
//                     </div>
//                   )}

//                   {/* ÉTAPE 3 : COORDONNÉES */}
//                   {etape === 2 && (
//                     <div className="form-step">
//                       <h3 className="form-step-title">Comment vous joindre ?</h3>

//                       <div className="form-row">
//                         <div className="form-group">
//                           <label className="form-label" htmlFor="nom">
//                             Nom complet <span className="required">*</span>
//                           </label>
//                           <input
//                             id="nom"
//                             type="text"
//                             className={`form-input ${errors.nom && touched.nom ? "has-error" : ""}`}
//                             placeholder="Votre nom"
//                             value={form.nom}
//                             onChange={(e) => setField("nom", e.target.value)}
//                             onBlur={() => markTouched("nom")}
//                             autoComplete="name"
//                           />
//                           {errors.nom && touched.nom && <span className="form-error">{errors.nom}</span>}
//                         </div>

//                         <div className="form-group">
//                           <label className="form-label" htmlFor="telephone">
//                             Téléphone / WhatsApp <span className="required">*</span>
//                           </label>
//                           <input
//                             id="telephone"
//                             type="tel"
//                             className={`form-input ${errors.telephone && touched.telephone ? "has-error" : ""}`}
//                             placeholder="+225 00 00 00 00 00"
//                             value={form.telephone}
//                             onChange={(e) => setField("telephone", e.target.value)}
//                             onBlur={() => markTouched("telephone")}
//                             autoComplete="tel"
//                           />
//                           {errors.telephone && touched.telephone && <span className="form-error">{errors.telephone}</span>}
//                         </div>
//                       </div>

//                       <div className="form-group">
//                         <label className="form-label" htmlFor="email">E-mail (optionnel)</label>
//                         <input
//                           id="email"
//                           type="email"
//                           className={`form-input ${errors.email && touched.email ? "has-error" : ""}`}
//                           placeholder="vous@exemple.com"
//                           value={form.email}
//                           onChange={(e) => setField("email", e.target.value)}
//                           onBlur={() => markTouched("email")}
//                           autoComplete="email"
//                         />
//                         {errors.email && touched.email && <span className="form-error">{errors.email}</span>}
//                       </div>

//                       <div className="form-group">
//                         <label className="form-checkbox">
//                           <input
//                             type="checkbox"
//                             checked={form.consent}
//                             onChange={(e) => setField("consent", e.target.checked)}
//                           />
//                           <span>
//                             J'accepte que BIC BTP me recontacte au sujet de mon projet.
//                             Aucune donnée ne sera cédée à un tiers.
//                           </span>
//                         </label>
//                         {errors.consent && touched.consent && <span className="form-error">{errors.consent}</span>}
//                       </div>
//                     </div>
//                   )}

//                   {/* Actions */}
//                   {serverError && (
//                     <div className="form-server-error">
//                       {serverError}{" "}
//                       <a href="https://wa.me/22500000000" target="_blank" rel="noopener noreferrer">
//                         Ouvrir WhatsApp
//                       </a>
//                     </div>
//                   )}

//                   <div className="form-actions">
//                     {etape > 0 && (
//                       <button type="button" className="btn btn-outline" onClick={goPrev} disabled={status === "sending"}>
//                         ← Retour
//                       </button>
//                     )}
//                     {etape < ETAPES_FORM.length - 1 ? (
//                       <button
//                         type="button"
//                         className="btn btn-primary form-next"
//                         onClick={goNext}
//                         disabled={!isStepValid(etape)}
//                       >
//                         Continuer <span aria-hidden>→</span>
//                       </button>
//                     ) : (
//                       <button
//                         type="submit"
//                         className="btn btn-primary form-submit"
//                         disabled={status === "sending"}
//                       >
//                         {status === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}
//                         {status !== "sending" && <span aria-hidden>→</span>}
//                       </button>
//                     )}
//                   </div>

//                   <p className="form-note">
//                     <span aria-hidden>🔒</span> Vos données ne servent qu'à vous répondre.
//                     Aucune revente, aucun spam.
//                   </p>
//                 </form>
//               </>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* ============ FAQ ============ */}
//       <section className="section faq">
//         <div className="container">
//           <div className="section-header reveal">
//             <span className="section-label">Questions fréquentes</span>
//             <h2>Ce qu'on nous demande souvent.</h2>
//             <p>Trois questions qui reviennent. Les réponses sont directes.</p>
//           </div>

//           <div className="faq-list">
//             {[
//               {
//                 q: "Combien de temps prend un projet, du premier appel à la remise des clés ?",
//                 a: "Comptez 4 à 6 mois pour un F3 ou F4, 6 à 8 mois pour un duplex. Le gros œuvre lui-même prend quelques semaines — c'est le délai des finitions (que vous choisissez) qui fait la différence.",
//               },
//               {
//                 q: "Le prix affiché sur le site est-il définitif ?",
//                 a: "Non, c'est un prix « à partir de », hors terrain et hors frais annexes. Le devis que nous vous envoyons après l'échange est, lui, ferme et définitif : il ne bouge pas une fois signé.",
//               },
//               {
//                 q: "Puis-je visiter un chantier ou voir une maison livrée ?",
//                 a: "Oui. Nous organisons des visites de chantier sur rendez-vous, et nous pouvons vous montrer des maisons livrées si les propriétaires sont d'accord. Demandez-le dans le formulaire ou sur WhatsApp.",
//               },
//             ].map((f, i) => (
//               <FaqItem key={i} question={f.q} answer={f.a} index={i} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ============ CTA FINAL ============ */}
//       <section className="section cta">
//         <div className="container cta-box reveal">
//           <span className="cta-label">Le plus simple</span>
//           <h2>Un message. Une réponse.<br />Un rendez-vous.</h2>
//           <p>C'est tout ce qu'il faut pour démarrer.</p>
//           <div className="cta-actions">
//             <a
//               href="https://wa.me/22500000000"
//               className="btn btn-primary"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Écrire sur WhatsApp <span aria-hidden>→</span>
//             </a>
//             <a href="tel:+22500000000" className="btn btn-ghost">
//               Appeler maintenant
//             </a>
//           </div>
//         </div>
//       </section>

//     </main>
//   );
// }

// /* =========================================================
//    FAQ ITEM (accordéon)
//    ========================================================= */
// function FaqItem({ question, answer, index }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <div className={`faq-item reveal ${open ? "is-open" : ""}`} style={{ transitionDelay: `${index * 60}ms` }}>
//       <button className="faq-question" onClick={() => setOpen(!open)} aria-expanded={open}>
//         <span className="faq-num">0{index + 1}</span>
//         <span className="faq-text">{question}</span>
//         <span className="faq-toggle" aria-hidden>{open ? "−" : "+"}</span>
//       </button>
//       <div className="faq-answer">
//         <p>{answer}</p>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/Contacts.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

/* =========================================================
   DONNÉES
   ========================================================= */
const PROJETS = [
  { id: "construction", label: "Construction neuve" },
  { id: "renovation", label: "Rénovation" },
  { id: "extension", label: "Extension" },
  { id: "amenagement", label: "Aménagement intérieur" },
  { id: "indecis", label: "Je ne sais pas encore" },
];

const BUDGETS = [
  { id: "moins-50", label: "< 50 M FCFA" },
  { id: "50-70", label: "50 – 70 M FCFA" },
  { id: "70-100", label: "70 – 100 M FCFA" },
  { id: "plus-100", label: "> 100 M FCFA" },
  { id: "indecis", label: "Je ne sais pas" },
];

const DELAIS = [
  { id: "urgent", label: "Dès que possible" },
  { id: "3mois", label: "Dans 3 mois" },
  { id: "6mois", label: "Dans 6 mois" },
  { id: "annee", label: "Dans l'année" },
  { id: "reflechi", label: "Je me renseigne" },
];

const TERRAINS = [
  { id: "oui-titre", label: "Oui, avec titre foncier" },
  { id: "oui-sans", label: "Oui, sans titre" },
  { id: "non", label: "Non, pas encore" },
  { id: "recherche", label: "En recherche" },
];

const CANAUX = [
  {
    id: "whatsapp",
    icon: "◉",
    title: "WhatsApp",
    desc: "Le plus rapide. Réponse en moins d'une heure.",
    value: "+225 00 00 00 00 00",
    href: "https://wa.me/22500000000",
    accent: "#25D366",
  },
  {
    id: "phone",
    icon: "☎",
    title: "Téléphone",
    desc: "Du lundi au samedi, 8h – 18h.",
    value: "+225 00 00 00 00 00",
    href: "tel:+22500000000",
    accent: "#1E5BD8",
  },
  {
    id: "email",
    icon: "✉",
    title: "E-mail",
    desc: "Pour les dossiers détaillés et les plans.",
    value: "contact@bicbtp.ci",
    href: "mailto:contact@bicbtp.ci",
    accent: "#0E2A5C",
  },
  {
    id: "visite",
    icon: "⌖",
    title: "Visite",
    desc: "Sur rendez-vous — chantier ou bureau.",
    value: "Abidjan, Côte d'Ivoire",
    href: null,
    accent: "#E8833A",
  },
];

const ETAPES_FORM = [
  { id: "projet", label: "Votre projet" },
  { id: "besoins", label: "Vos besoins" },
  { id: "coordonnees", label: "Vos coordonnées" },
];

const AIDES_ETAPES = {
  0: "Dites-nous quel type de projet vous envisagez et où se situe le terrain.",
  1: "Ces détails nous aident à préparer un chiffrage réaliste (comme sur un devis).",
  2: "Nous ne partageons vos coordonnées avec personne. Un seul humain vous rappellera.",
};

const FORM_VIDE = {
  type_projet: "construction",
  localisation: "",
  surface_terrain: "",
  budget: "",
  delai: "",
  terrain: "",
  message: "",
  nom: "",
  email: "",
  telephone: "",
  consent: false,
  _hp: "",
};

/* =========================================================
   VALIDATION
   ========================================================= */
function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function validatePhone(v) {
  return /^\+?\d{8,15}$/.test((v || "").replace(/[\s\-().]/g, ""));
}

function validateField(key, value) {
  switch (key) {
    case "type_projet":
      return value ? null : "Choisissez un type de projet.";
    case "localisation":
      return value?.trim() ? null : "Indiquez la localisation.";
    case "surface_terrain":
      return value && Number(value) > 0 ? null : "Indiquez une surface valide.";
    case "budget":
      return value ? null : "Indiquez un budget.";
    case "delai":
      return value ? null : "Indiquez un délai.";
    case "nom":
      return value?.trim() ? null : "Votre nom est requis.";
    case "telephone":
      if (!value?.trim()) return "Numéro requis.";
      if (!validatePhone(value)) return "Format invalide (ex. +225...).";
      return null;
    case "email":
      return value && !validateEmail(value) ? "Format d'e-mail invalide." : null;
    case "consent":
      return value ? null : "Vous devez accepter.";
    default:
      return null;
  }
}

/* =========================================================
   HOOK + WRAPPER : apparition au scroll (compatible re-render)
   ========================================================= */
function useRevealRef() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  
  return [ref, visible];
}

function Reveal({ as: Tag = "div", className = "", delay = 0, style, children, ...rest }) {
  const [ref, visible] = useRevealRef();
  
  const mergedStyle = {
    ...(delay ? { transitionDelay: `${delay}ms` } : {}),
    ...style,
  };

  return (
    <Tag
      ref={ref}
      className={`${className} reveal ${visible ? "is-visible" : ""}`.trim()}
      style={Object.keys(mergedStyle).length ? mergedStyle : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* =========================================================
   PAGE
   ========================================================= */
export default function Contacts() {
  const [searchParams] = useSearchParams();

  /* Pré-remplissage contextuel */
  const initialProjet = useMemo(
    () => searchParams.get("projet") || searchParams.get("ref") || "",
    [searchParams]
  );
  const initialPoste = useMemo(() => searchParams.get("poste") || "", [searchParams]);

  /* État du formulaire */
  const [etape, setEtape] = useState(0);
  const [form, setForm] = useState({
    ...FORM_VIDE,
    type_projet: PROJETS.some((p) => p.id === initialProjet) ? initialProjet : "construction",
    message: initialPoste ? `Poste souhaité : ${initialPoste}` : "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [serverError, setServerError] = useState(null);
  const [reference, setReference] = useState(null);

  const formRef = useRef(null);

  /* Mise à jour d'un champ */
  const setField = (key, value) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (touched[key]) {
        setErrors((e) => ({ ...e, [key]: validateField(key, value) }));
      }
      return next;
    });
  };

  const markTouched = (key) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((e) => ({ ...e, [key]: validateField(key, form[key]) }));
  };

  /* Validation par étape */
  const validateStep = (stepIndex) => {
    const keysByStep = {
      0: ["type_projet", "localisation", "surface_terrain"],
      1: ["budget", "delai"],
      2: ["nom", "telephone", "email", "consent"],
    };
    const errs = {};
    (keysByStep[stepIndex] || []).forEach((k) => {
      const err = validateField(k, form[k]);
      if (err) errs[k] = err;
    });
    return errs;
  };

  const goNext = () => {
    const errs = validateStep(etape);
    if (Object.keys(errs).length) {
      setErrors(errs);
      Object.keys(errs).forEach((k) => setTouched((t) => ({ ...t, [k]: true })));
      return;
    }
    if (etape < ETAPES_FORM.length - 1) setEtape(etape + 1);
  };

  const goPrev = () => {
    if (etape > 0) setEtape(etape - 1);
  };

  /* Envoi */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep(2);
    if (Object.keys(errs).length) {
      setErrors(errs);
      Object.keys(errs).forEach((k) => setTouched((t) => ({ ...t, [k]: true })));
      return;
    }

    setStatus("sending");
    setServerError(null);

    try {
      const res = await fetch(`${API_BASE}/api/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...form,
          surface_terrain: Number(form.surface_terrain),
        }),
      });

      if (res.status === 422 || res.status === 400) {
        const data = await res.json().catch(() => ({}));
        if (data?.errors) {
          const backendErrors = {};
          Object.entries(data.errors).forEach(([k, msgs]) => {
            backendErrors[k] = Array.isArray(msgs) ? msgs[0] : msgs;
          });
          setErrors((prev) => ({ ...prev, ...backendErrors }));
          setStatus("idle");
          setServerError("Certains champs doivent être corrigés.");
          return;
        }
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setReference(data.reference || null);
      setStatus("success");
      setEtape(0);
      setForm(FORM_VIDE);
      setTouched({});
      setErrors({});
    } catch (err) {
      console.warn("Envoi échoué.", err);
      setStatus("error");
      setServerError("L'envoi a échoué. Réessayez, ou contactez-nous par WhatsApp.");
    }
  };

  /* Scroll top à changement d'étape */
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [etape]);

  /* Progression */
  const progress = ((etape + 1) / ETAPES_FORM.length) * 100;

  /* Désactivation du bouton Continuer */
  const stepInvalide = Object.keys(validateStep(etape)).length > 0;

  return (
    <main className="contacts-page page-construction-bg">
      {/* ============ HERO ============ */}
      <section className="contacts-hero">
        <div className="contacts-hero-bg" aria-hidden />

        <div className="hero-construction" aria-hidden>
          <div className="hero-grid" />
          <div className="hero-crane hero-crane-1" />
          <div className="hero-crane hero-crane-2" />
          <div className="hero-scaffold" />
          <div className="hero-beam" />
        </div>

        <div className="container contacts-hero-content">
          <span className="badge">
            <span className="badge-dot" /> Contact &amp; Devis
          </span>
          <h1>
            Pas un formulaire.<br />
            <span>Une conversation.</span>
          </h1>
          <p>
            Vous avez un terrain, un projet, une question. Nous avons une méthode
            et 15 minutes à vous accorder. Choisissez votre canal — WhatsApp,
            téléphone, ou le formulaire ci-dessous. On s'occupe du reste.
          </p>
        </div>
      </section>

      {/* ============ CANAUX DE CONTACT ============ */}
      <section className="section canaux">
        <div className="container">
          <Reveal className="section-header">
            <span className="section-label">Nous joindre</span>
            <h2>Quatre façons de nous parler.</h2>
            <p>Choisissez celle qui vous ressemble.</p>
          </Reveal>

          <div className="canaux-grid">
            {CANAUX.map((c, i) => (
              <Reveal
                key={c.id}
                as="a"
                href={c.href || "#formulaire"}
                className="canal-card"
                delay={i * 80}
                style={{ "--accent": c.accent }}
                target={c.href?.startsWith("http") ? "_blank" : undefined}
                rel={c.href?.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <span className="canal-icon" aria-hidden>{c.icon}</span>
                <h3>{c.title}</h3>
                <p className="canal-desc">{c.desc}</p>
                <span className="canal-value">{c.value}</span>
                <span className="canal-arrow" aria-hidden>→</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FORMULAIRE MULTI-ÉTAPES ============ */}
      <section className="section formulaire" id="formulaire">
        <div className="container formulaire-layout">
          {/* Colonne gauche : intro */}
          <Reveal as="aside" className="formulaire-intro">
            <span className="section-label">Devis</span>
            <h2>Parlons de votre projet.</h2>
            <p className="intro-text">
              Trois étapes, deux minutes. Vous nous dites ce que vous voulez,
              nous vous répondons sous 24 h avec une première estimation et
              une proposition de rendez-vous.
            </p>

            <ul className="intro-points">
              <li>
                <span className="point-check" aria-hidden>✓</span>
                <div>
                  <strong>Réponse sous 24 h</strong>
                  <p>Un humain vous répond, pas un robot.</p>
                </div>
              </li>
              <li>
                <span className="point-check" aria-hidden>✓</span>
                <div>
                  <strong>Estimation gratuite</strong>
                  <p>Un premier chiffrage, sans engagement.</p>
                </div>
              </li>
              <li>
                <span className="point-check" aria-hidden>✓</span>
                <div>
                  <strong>Rendez-vous offert</strong>
                  <p>15 minutes, sur WhatsApp ou sur votre terrain.</p>
                </div>
              </li>
            </ul>

            {/* Contexte détecté */}
            {(form.type_projet || form.budget) && (
              <div className="contexte-detecte">
                <span className="contexte-label">Contexte détecté</span>
                <div className="contexte-tags">
                  {form.type_projet && (
                    <span className="contexte-tag">
                      Projet : {PROJETS.find((p) => p.id === form.type_projet)?.label}
                    </span>
                  )}
                  {form.budget && (
                    <span className="contexte-tag">
                      Budget : {BUDGETS.find((b) => b.id === form.budget)?.label}
                    </span>
                  )}
                  {form.localisation && (
                    <span className="contexte-tag">Lieu : {form.localisation}</span>
                  )}
                </div>
              </div>
            )}
          </Reveal>

          {/* Colonne droite : formulaire (enveloppé dans Reveal + div interne pour le ref) */}
          <Reveal className="form-card">
            <div ref={formRef}>
              {/* Succès */}
              {status === "success" && (
                <div className="form-success">
                  <span className="success-icon" aria-hidden>✓</span>
                  <h3>Message envoyé.</h3>
                  <p>
                    Merci, nous avons bien reçu votre demande
                    {reference ? ` (réf. ${reference})` : ""}. Elle a été transmise par e-mail à notre équipe.
                    Vous recevrez une réponse sous 24 h ouvrées.
                  </p>
                  <div className="success-actions">
                    <a
                      href="https://wa.me/22500000000"
                      className="btn btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp direct <span aria-hidden>→</span>
                    </a>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setStatus("idle")}
                    >
                      Nouvelle demande
                    </button>
                  </div>
                </div>
              )}

              {/* Formulaire */}
              {status !== "success" && (
                <>
                  {/* Barre de progression */}
                  <div className="form-progress">
                    <div className="form-progress-bar" style={{ width: `${progress}%` }} />
                  </div>

                  {/* Stepper */}
                  <div className="form-stepper">
                    {ETAPES_FORM.map((e, i) => (
                      <div
                        key={e.id}
                        className={`step ${i === etape ? "is-current" : ""} ${i < etape ? "is-done" : ""}`}
                      >
                        <span className="step-num">{i < etape ? "✓" : i + 1}</span>
                        <span className="step-label">{e.label}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    {/* Honeypot anti-bot */}
                    <input
                      type="text"
                      name="_hp"
                      value={form._hp}
                      onChange={(e) => setField("_hp", e.target.value)}
                      style={{ display: "none" }}
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    {/* ÉTAPE 1 : PROJET */}
                    {etape === 0 && (
                      <div className="form-step">
                        <h3 className="form-step-title">Votre projet</h3>
                        <p className="form-hint">{AIDES_ETAPES[0]}</p>

                        <div className="form-group">
                          <label className="form-label">
                            Type de projet <span className="required">*</span>
                          </label>
                          <div className="pills">
                            {PROJETS.map((p) => (
                              <button
                                key={p.id}
                                type="button"
                                className={`pill ${form.type_projet === p.id ? "is-selected" : ""}`}
                                onClick={() => {
                                  setField("type_projet", p.id);
                                  markTouched("type_projet");
                                }}
                                aria-pressed={form.type_projet === p.id}
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                          {errors.type_projet && touched.type_projet && (
                            <span className="form-error">{errors.type_projet}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label" htmlFor="localisation">
                            Localisation du terrain <span className="required">*</span>
                          </label>
                          <input
                            id="localisation"
                            type="text"
                            className={`form-input ${errors.localisation && touched.localisation ? "has-error" : ""}`}
                            placeholder="Ex: Cocody, Abidjan"
                            value={form.localisation}
                            onChange={(e) => setField("localisation", e.target.value)}
                            onBlur={() => markTouched("localisation")}
                          />
                          {errors.localisation && touched.localisation && (
                            <span className="form-error">{errors.localisation}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label" htmlFor="surface_terrain">
                            Surface du terrain (m²) <span className="required">*</span>
                          </label>
                          <input
                            id="surface_terrain"
                            type="number"
                            min="1"
                            className={`form-input ${errors.surface_terrain && touched.surface_terrain ? "has-error" : ""}`}
                            placeholder="Ex: 500"
                            value={form.surface_terrain}
                            onChange={(e) => setField("surface_terrain", e.target.value)}
                            onBlur={() => markTouched("surface_terrain")}
                          />
                          {errors.surface_terrain && touched.surface_terrain && (
                            <span className="form-error">{errors.surface_terrain}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ÉTAPE 2 : BESOINS */}
                    {etape === 1 && (
                      <div className="form-step">
                        <h3 className="form-step-title">Vos besoins</h3>
                        <p className="form-hint">{AIDES_ETAPES[1]}</p>

                        <div className="form-group">
                          <label className="form-label">
                            Budget envisagé <span className="required">*</span>
                          </label>
                          <div className="pills">
                            {BUDGETS.map((b) => (
                              <button
                                key={b.id}
                                type="button"
                                className={`pill ${form.budget === b.id ? "is-selected" : ""}`}
                                onClick={() => {
                                  setField("budget", b.id);
                                  markTouched("budget");
                                }}
                                aria-pressed={form.budget === b.id}
                              >
                                {b.label}
                              </button>
                            ))}
                          </div>
                          {errors.budget && touched.budget && (
                            <span className="form-error">{errors.budget}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            Délai souhaité <span className="required">*</span>
                          </label>
                          <div className="pills">
                            {DELAIS.map((d) => (
                              <button
                                key={d.id}
                                type="button"
                                className={`pill ${form.delai === d.id ? "is-selected" : ""}`}
                                onClick={() => {
                                  setField("delai", d.id);
                                  markTouched("delai");
                                }}
                                aria-pressed={form.delai === d.id}
                              >
                                {d.label}
                              </button>
                            ))}
                          </div>
                          {errors.delai && touched.delai && (
                            <span className="form-error">{errors.delai}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">Statut du terrain</label>
                          <div className="pills">
                            {TERRAINS.map((t) => (
                              <button
                                key={t.id}
                                type="button"
                                className={`pill ${form.terrain === t.id ? "is-selected" : ""}`}
                                onClick={() => setField("terrain", t.id)}
                                aria-pressed={form.terrain === t.id}
                              >
                                {t.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label" htmlFor="message">
                            Détails du projet (optionnel)
                          </label>
                          <textarea
                            id="message"
                            className="form-input form-textarea"
                            rows={4}
                            placeholder="Précisez vos attentes (ex: 3 chambres, piscine...)"
                            value={form.message}
                            onChange={(e) => setField("message", e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {/* ÉTAPE 3 : COORDONNÉES */}
                    {etape === 2 && (
                      <div className="form-step">
                        <h3 className="form-step-title">Vos coordonnées</h3>
                        <p className="form-hint">{AIDES_ETAPES[2]}</p>

                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label" htmlFor="nom">
                              Nom / Société <span className="required">*</span>
                            </label>
                            <input
                              id="nom"
                              type="text"
                              className={`form-input ${errors.nom && touched.nom ? "has-error" : ""}`}
                              placeholder="Votre nom"
                              value={form.nom}
                              onChange={(e) => setField("nom", e.target.value)}
                              onBlur={() => markTouched("nom")}
                              autoComplete="name"
                            />
                            {errors.nom && touched.nom && (
                              <span className="form-error">{errors.nom}</span>
                            )}
                          </div>

                          <div className="form-group">
                            <label className="form-label" htmlFor="telephone">
                              Téléphone / WhatsApp <span className="required">*</span>
                            </label>
                            <input
                              id="telephone"
                              type="tel"
                              className={`form-input ${errors.telephone && touched.telephone ? "has-error" : ""}`}
                              placeholder="+225 00 00 00 00 00"
                              value={form.telephone}
                              onChange={(e) => setField("telephone", e.target.value)}
                              onBlur={() => markTouched("telephone")}
                              autoComplete="tel"
                            />
                            {errors.telephone && touched.telephone && (
                              <span className="form-error">{errors.telephone}</span>
                            )}
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label" htmlFor="email">
                            E-mail (optionnel)
                          </label>
                          <input
                            id="email"
                            type="email"
                            className={`form-input ${errors.email && touched.email ? "has-error" : ""}`}
                            placeholder="vous@exemple.com"
                            value={form.email}
                            onChange={(e) => setField("email", e.target.value)}
                            onBlur={() => markTouched("email")}
                            autoComplete="email"
                          />
                          {errors.email && touched.email && (
                            <span className="form-error">{errors.email}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-checkbox">
                            <input
                              type="checkbox"
                              checked={form.consent}
                              onChange={(e) => {
                                setField("consent", e.target.checked);
                                markTouched("consent");
                              }}
                            />
                            <span>
                              J'accepte que BIC BTP me recontacte au sujet de mon projet.
                              Aucune donnée ne sera cédée à un tiers.
                            </span>
                          </label>
                          {errors.consent && touched.consent && (
                            <span className="form-error">{errors.consent}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Erreur serveur */}
                    {serverError && (
                      <div className="form-server-error">
                        {serverError}{" "}
                        <a href="https://wa.me/22500000000" target="_blank" rel="noopener noreferrer">
                          Ouvrir WhatsApp
                        </a>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="form-actions">
                      {etape > 0 && (
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={goPrev}
                          disabled={status === "sending"}
                        >
                          ← Retour
                        </button>
                      )}
                      {etape < ETAPES_FORM.length - 1 ? (
                        <button
                          type="button"
                          className="btn btn-primary form-next"
                          onClick={goNext}
                          disabled={status === "sending" || stepInvalide}
                        >
                          Continuer <span aria-hidden>→</span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-primary form-submit"
                          disabled={status === "sending"}
                        >
                          {status === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}
                          {status !== "sending" && <span aria-hidden>→</span>}
                        </button>
                      )}
                    </div>

                    <p className="form-note">
                      <span aria-hidden>🔒</span> Vos données ne servent qu'à vous répondre.
                      Aucune revente, aucun spam.
                    </p>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="section faq">
        <div className="container">
          <Reveal className="section-header">
            <span className="section-label">Questions fréquentes</span>
            <h2>Ce qu'on nous demande souvent.</h2>
            <p>Trois questions qui reviennent. Les réponses sont directes.</p>
          </Reveal>

          <div className="faq-list">
            {[
              {
                q: "Combien de temps prend un projet, du premier appel à la remise des clés ?",
                a: "Comptez 4 à 6 mois pour un F3 ou F4, 6 à 8 mois pour un duplex. Le gros œuvre lui-même prend quelques semaines c'est le délai des finitions (que vous choisissez) qui fait la différence.",
              },
              {
                q: "Le prix affiché sur le site est-il définitif ?",
                a: "Non, c'est un prix « à partir de », hors terrain et hors frais annexes. Le devis que nous vous envoyons après l'échange est, lui, ferme et définitif : il ne bouge pas une fois signé.",
              },
              {
                q: "Puis-je visiter un chantier ou voir une maison livrée ?",
                a: "Oui. Nous organisons des visites de chantier sur rendez-vous, et nous pouvons vous montrer des maisons livrées si les propriétaires sont d'accord. Demandez-le dans le formulaire ou sur WhatsApp.",
              },
            ].map((f, i) => (
              <FaqItem key={i} question={f.q} answer={f.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="section cta">
        <Reveal className="cta-box">
          <span className="cta-label">Le plus simple</span>
          <h2>Un message. Une réponse.<br />Un rendez-vous.</h2>
          <p>C'est tout ce qu'il faut pour démarrer.</p>
          <div className="cta-actions">
            <a
              href="https://wa.me/22500000000"
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Écrire sur WhatsApp <span aria-hidden>→</span>
            </a>
            <a href="tel:+22500000000" className="btn btn-ghost">
              Appeler maintenant
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

/* =========================================================
   FAQ ITEM (accordéon)
   ========================================================= */
function FaqItem({ question, answer, index }) {
  const [open, setOpen] = useState(false);
  const [ref, visible] = useRevealRef();

  return (
    <div
      ref={ref}
      className={`faq-item reveal ${visible ? "is-visible" : ""} ${open ? "is-open" : ""}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <button
        type="button"
        className="faq-question"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="faq-num">0{index + 1}</span>
        <span className="faq-text">{question}</span>
        <span className="faq-toggle" aria-hidden>{open ? "−" : "+"}</span>
      </button>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
}