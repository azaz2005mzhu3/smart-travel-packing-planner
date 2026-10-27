# DESIGN.md — Smart Travel Packing Planner

## Design direction
**Sky Blue Minimalist** is the proposed design direction. Two static design trials were created first: `design-trials/sky-blue.html` and `design-trials/warm-editorial.html`. Review both before styling the final app.

## Why this direction
The cool colors, clear hierarchy and generous spacing help travelers scan weather information and packing recommendations quickly.

## Colors
- Background: `#EDF7FC`
- Primary text: `#163B53`
- Primary button: `#1678A5`
- Hero: `#D8EFFB`
- Card: `#FFFFFF`
- Borders: `#CBE3EF`
- Error: `#A32929`
- Success: `#167347`

## Typography
Use a system sans-serif stack, no external fonts or CDNs. Body text at least 16px. Headings should be bold and readable.

## Layout
Maximum content width around 960px. Header and introduction, destination search, city matches, date fields, forecast, packing checklist and progress. Use white cards, rounded corners and consistent spacing. Stack columns on mobile. Controls at least 44px tall.

## All five states
- Empty: helpful instructions before search, or no-results explanation.
- Loading: visible status and disabled active button.
- Error: inline message with retry.
- Invalid: field-specific validation without losing user input.
- In use: weather summary, computed packing list and progress.

## Accessibility
Use semantic HTML, associated labels, keyboard focus rings, live status announcements and sufficient color contrast. Do not rely only on color.

## Implementation note
These are design decisions, not evidence of a working app. The student should review both trials before final styling.