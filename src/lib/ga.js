// src/lib/ga.js
export function pageview(path) {
  if (!window.gtag) return; // safety check
  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: path,
  });
}
