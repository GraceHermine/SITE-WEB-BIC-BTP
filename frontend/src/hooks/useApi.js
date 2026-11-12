// src/hooks/useApi.js
import { useEffect, useRef, useState, useCallback } from "react";
import { fetchJson, asArray, ApiError } from "../api/client";

/**
 * Charge une ressource API.
 *
 * - Par défaut : liste (`asArray` → adapt par item).
 * - `mode: "object"` : renvoie l'objet brut (ex: bundle finitions, singleton).
 * - `pick` : extrait un sous-champ (ex: data.gammes).
 */
export function useApi(path, { adapt, enabled = true, mode = "list", pick } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    fetchJson(path, { signal: controller.signal })
      .then((raw) => {
        let payload;

        if (mode === "object") {
          payload = pick && raw ? raw[pick] : raw;
          if (adapt) payload = adapt(payload);
        } else {
          const arr = asArray(raw);
          payload = arr.map((x) => (adapt ? adapt(x) : x)).filter(Boolean);
        }

        setData(payload);
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err instanceof ApiError ? err : new ApiError(err.message));
        setLoading(false);
      });

    return () => controller.abort();
  }, [path, enabled, reloadKey, adapt, mode, pick]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return { data, loading, error, reload };
}