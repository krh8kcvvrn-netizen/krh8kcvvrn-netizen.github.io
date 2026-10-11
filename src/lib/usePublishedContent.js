import { useEffect, useState } from "react";
import { readContent } from "./content";

export function usePublishedContent() {
  const [content, setContent] = useState(() => readContent(null));

  useEffect(() => {
    let active = true;
    let request = 0;

    async function load() {
      const id = ++request;
      try {
        const response = await fetch("/api/content", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (!active || id !== request) return;
        const next = readContent(data);
        setContent((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next));
      } catch {
        // Keep the last text if the admin service is briefly unavailable.
      }
    }

    load();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 2000);
    window.addEventListener("focus", load);
    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener("focus", load);
    };
  }, []);

  return content;
}
