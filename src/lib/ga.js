// src/lib/ga.js
import ReactGA from "react-ga4";

// Log a pageview
export const pageview = (url) => {
  ReactGA.send({ hitType: "pageview", page: url });
};

// (optional) Log a custom event
export const event = ({ action, category, label, value }) => {
  ReactGA.event(action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
