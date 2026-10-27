# AGENTS.md — AI Agent Rules

- Follow PROPOSAL.md, PRD.md and DESIGN.md.
- Use the simplest code that works, and add nothing I did not ask for.
- Use plain HTML, CSS and JavaScript. No React, Tailwind, frameworks, libraries or CDN assets.
- Keep JavaScript easy to understand and explain during the showcase.
- Use Open-Meteo Geocoding and Forecast endpoints; do not hard-code Tokyo as the only city.
- Every fetch must use try/catch and check response.ok. Validate JSON fields before using them.
- Do not commit API keys or other secrets.
- Implement empty, loading, error, invalid input and in-use states.
- Validate trip dates within the supported forecast window.
- Use accessible semantic HTML and responsive CSS.
- Save checklist progress in localStorage separately for each trip.
- Work in small, descriptive commits and explain changes.
- Never claim a feature is tested until it has been tested in a browser.