# DESIGN.md — Smart Travel Packing Planner

## Selected Design Direction: Option B — Warm Editorial

I compared two static design trials:

- `design-trials/sky-blue.html` — Sky Blue Minimalist
- `design-trials/warm-editorial.html` — Warm Editorial

**Decision:** I prefer Option B because its visual presentation is more appealing. The warm neutral palette and editorial typography make the travel planning experience feel more polished and distinctive. This is the direction for the final website.

## Visual Style

Warm, minimal, elegant and travel-inspired. Use generous whitespace, clear hierarchy, subtle borders and restrained decoration. The design should remain practical and easy to navigate.

## Color Palette

- **Page Background:** `#FAF4E9` (warm cream)
- **Card Background:** `#FFFDF8` (soft white)
- **Main Text:** `#403C32` (charcoal brown)
- **Primary Button:** `#835E48` (warm brown)
- **Accent:** `#A86E4A` (terracotta brown)
- **Border:** `#D9C6AF` (warm beige)
- **Error:** `#A32929` (dark red)
- **Success:** `#276749` (dark green)

## Typography

Use Georgia or another system serif for prominent editorial headings. Use a system sans-serif for inputs, buttons, checklists and smaller supporting text to keep functional content easy to read.

No external fonts or CDN.

## Layout

Use a centered maximum width of approximately 960px.

Start with a large editorial hero headline and short introduction. Below it, arrange destination search and date controls, forecast summary, packing categories and progress tracker in a logical order.

Use softly bordered cream cards with modest corner rounding (about 8–12px), not oversized pill-shaped components.

Provide comfortable spacing. On mobile, stack sections into a single column and keep buttons and inputs at least 44px tall.

## Components

### Header
- Understated wordmark.
- Generous spacing.

### Form
- Clearly labeled city search.
- Location choices.
- Travel dates.

### Primary Button
- Solid warm brown.
- High-contrast white text.

### Weather
- Concise daily summary.
- Helpful travel note.

### Packing List
- Organized categories.
- Suggested quantities.
- Accessible checkboxes.

### Progress
- Numerical completion percentage.
- Progress bar.

## UI States

### Empty State
Show an inviting instruction and empty planner.

### No Results State
Show a clear city search message and allow another search.

### Loading State
Display visible status while preserving entered values.

### Error State
Show an accessible inline message and a retry action.

### Invalid Input State
Show field-specific guidance before any API request.

### In-Use State
Display actual weather data, computed packing suggestions and live checklist progress.

## Accessibility and Responsiveness

Use semantic HTML, visible keyboard focus, associated labels, `aria-live` status messages, sufficient contrast and responsive CSS.

Do not communicate state through color alone.

## Implementation Rules

This file records the student's chosen design direction after comparing two trial pages.

Follow this design when styling the real application.

Use only plain HTML, CSS and JavaScript, without external UI libraries, frameworks or CDN assets.