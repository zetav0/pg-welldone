import { useEffect, useState } from "react";

/* Shared breakpoints (px). Mobile-first: values are max-widths for "down" queries. */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/**
 * Subscribe to a CSS media query and re-render on change.
 * SSR-safe: returns `false` until mounted on the client.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True when the viewport is at or below the given breakpoint (defaults to `md`, 768px). */
export function useIsMobile(maxWidth: number = breakpoints.md): boolean {
  return useMediaQuery(`(max-width: ${maxWidth - 1}px)`);
}
