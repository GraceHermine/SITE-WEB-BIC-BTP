// src/hooks/useInfo.js
import { useEffect, useState } from "react";
import { fetchJson, ApiError } from "../api/client";

/**
 * Charge l'objet singleton /api/info/ (coordonnées, réseaux, etc.).
 * Renvoie l'objet brut (pas un tableau).
 */
export function useInfo() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchJson("/api/info/", { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setInfo(data);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err instanceof ApiError ? err : new ApiError(err.message));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  return { info, loading, error, reload };
}