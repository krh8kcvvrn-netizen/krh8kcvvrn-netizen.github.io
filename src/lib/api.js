export function apiUrl(path) {
  const base = String(import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
  return `${base}${path}`;
}
