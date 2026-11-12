// src/api/client.js
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(message, status = 0, payload = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

/**
 * Wrapper fetch avec timeout, abort et erreurs typées.
 */
export async function fetchJson(path, { timeout = 8000, signal } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!res.ok) {
      let payload = null;
      try {
        payload = await res.json();
      } catch {
        /* ignore */
      }
      throw new ApiError(`HTTP ${res.status}`, res.status, payload);
    }

    return await res.json();
  } catch (err) {
    if (err.name === "AbortError") {
      throw new ApiError("Délai de la requête dépassé", 0, null);
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || "Erreur réseau", 0, null);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * DRF peut renvoyer un tableau OU un objet paginé { results: [...] }.
 * Cette fonction garantit toujours un tableau.
 */
export function asArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}