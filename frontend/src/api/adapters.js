// src/api/adapters.js

/** Formate un entier en "45 000 000 FCFA" */
function formatFCFA(n) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "";
  return n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ") + " FCFA";
}

/**
 * Normalise un House (API ou fallback) vers la forme attendue par Home.jsx.
 * - surface → "85 m²"
 * - price   → "45 000 000 FCFA"
 */
export function adaptHouse(raw) {
  if (!raw) return null;

  const surface =
    typeof raw.surface === "number"
      ? `${raw.surface} m²`
      : raw.surface || "";

  const price =
    raw.priceLabel ||
    (typeof raw.price === "number" ? formatFCFA(raw.price) : raw.price) ||
    "";

  return {
    id: raw.id ?? raw.slug ?? raw.name,
    slug: raw.slug ?? "",
    name: raw.name ?? "",
    tagline: raw.tagline ?? "",
    description: raw.description ?? "",
    longDescription: raw.longDescription ?? raw.long_description ?? "",
    surface,
    surfaceRaw: typeof raw.surface === "number" ? raw.surface : 0,
    chambres: raw.chambres ?? 0,
    sallesBain: raw.sallesBain ?? raw.salles_bain ?? 0,
    niveaux: raw.niveaux ?? 1,
    price,
    priceRaw: raw.price ?? 0,
    badge: raw.badge ?? "",
    gamme: raw.gamme ?? "Confort",
    image_url: raw.image_url ?? "",
    features: Array.isArray(raw.features) ? raw.features : [],
  };
}

/** Normalise un HeroSlide */
export function adaptHeroSlide(raw) {
  if (!raw) return null;
  return {
    id: raw.id ?? raw.image_url,
    title: raw.title ?? "",
    subtitle: raw.subtitle ?? "",
    image_url: raw.image_url ?? "",
  };
}

/* ---------- Finitions (bundle) ---------- */
export function adaptFinitionBundle(raw) {
  if (!raw || typeof raw !== "object") return null;

  const gammes = Array.isArray(raw.gammes)
    ? raw.gammes.map((g) => ({
        id: g.slug ?? g.id,
        name: g.name ?? "",
        tagline: g.tagline ?? "",
        description: g.description ?? "",
        color: g.color ?? "#1E5BD8",
        coef: typeof g.coef === "number" ? g.coef : 1,
      }))
    : [];

  const postes = Array.isArray(raw.postes)
    ? raw.postes.map((p) => ({
        id: p.slug ?? p.id,
        title: p.title ?? "",
        icon: p.icon ?? "◆",
        description: p.description ?? "",
        options:
          p.options && typeof p.options === "object" ? p.options : {},
      }))
    : [];

  const ambiances =
    raw.ambiances && typeof raw.ambiances === "object"
      ? raw.ambiances
      : {};

  return { gammes, postes, ambiances };
}

/* ---------- Réalisations ---------- */
export function adaptRealisation(raw) {
  if (!raw) return null;
  return {
    id: raw.id ?? raw.slug ?? raw.title,
    slug: raw.slug ?? "",
    title: raw.title ?? "",
    location: raw.location ?? "",
    year: String(raw.year ?? ""),
    model: raw.model ?? "",
    surface:
      typeof raw.surface === "number" && raw.surface > 0 ? raw.surface : null,
    duration: raw.duration ?? "",
    durationShort: raw.durationShort ?? raw.duration_short ?? "",
    phase: raw.phase ?? "livre",
    category: raw.category ?? "maison",
    gamme: raw.gamme ?? "—",
    client: raw.client ?? "",
    description: raw.description ?? "",
    highlights: Array.isArray(raw.highlights) ? raw.highlights : [],
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    image_url: raw.image_url ?? "",
    before_url: raw.before_url ?? "",
  };
}