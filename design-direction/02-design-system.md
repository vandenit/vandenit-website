# Design System — The Engineer & The System

## Design principle

The site should feel like a calm engineering instrument, not an AI demo. Every decorative choice must reinforce one of three states:

1. **System activity** — cobalt lines branch, compare and investigate.
2. **Human judgment** — amber nodes interrupt, converge and approve.
3. **Production** — a stable high-contrast line continues after verification.

## Color roles

Use the variables in `styles/vandenit-theme.css`.

- Midnight backgrounds create depth without pure-black emptiness.
- Bone-white text adds warmth and a literary/editorial quality.
- Cobalt is reserved for Daniël, analysis, links and secondary technical emphasis.
- Amber is reserved for Filip, decisions, verification and the most important CTA.
- Red appears only for genuine risk/error states.

Do not use amber and blue interchangeably. Their meaning is part of the brand.

## Typography

Recommended stack:

- **Display:** Barlow Condensed, headings only.
- **Body/UI:** Geist.
- **Technical labels/code:** Geist Mono.

Load fonts with `next/font` and expose them through CSS variables. Keep body copy conventional and readable. The retro-futurist quality should come mainly from display headings, uppercase kickers, numbering and letter spacing.

Rules:

- Use condensed display type for H1/H2 and numeric chapter markers.
- Do not use condensed type for paragraphs, forms or long labels.
- Use uppercase mono labels sparingly.
- Limit body text to approximately 65–72 characters per line.

## Geometry

- Corners are mostly square or slightly rounded: 2–8px.
- Use 1px ruled borders and crop marks instead of large shadows.
- Use concentric circles only for human checkpoints, not everywhere.
- Use grids and orbital arcs at very low opacity.
- Avoid glass panels and blurred translucent cards.

## Layout

### Desktop

- Prefer asymmetry: copy on one side, system evidence on the other.
- Use a 12-column grid and keep no more than five visual nodes on one horizontal level.
- Alternate dense evidence sections with quiet editorial sections.

### Mobile

- Convert horizontal systems into a vertical reading path.
- Put content and CTAs before diagrams.
- Reduce branches and labels rather than shrinking them.
- Never hide essential explanations inside the diagram.

## Components

### Kicker

Small uppercase mono text with a ruled line. Example: `HOW I WORK // CONTROLLED ACCELERATION`.

### Human checkpoint

Amber concentric node with a short label such as `HUMAN DECISION` or `VERIFIED BY FILIP`. Use only at meaningful decision boundaries.

### System path

Thin cobalt SVG paths, usually 1.5–2px. Branches show parallel work. Dots show work units. One red mark may identify a risk.

### Evidence panel

Square or slightly clipped outline, no large shadow. Use for real proof: metrics, screenshots, decisions or results. Do not use it merely to decorate ordinary paragraphs.

### Buttons

- Primary: amber background with dark text for the main human action.
- Secondary: transparent with amber or neutral border.
- Technical/link action: cobalt text or border.
- Keep a clearly visible focus ring distinct from hover.

## Voice of Daniël

Daniël should appear as short system annotations, not as a chatbot or speaking mascot.

Good:

- `DANIËL // ANALYSIS ACTIVE`
- `3 APPROACHES COMPARED`
- `RISK FLAGGED`
- `HUMAN DECISION REQUIRED`

Avoid:

- conversational chat bubbles;
- claims of consciousness or autonomy;
- jokes that undermine professional credibility;
- literal Asimov names, quotations or copyrighted visual references beyond the private inspiration.

## Background texture

Use `assets/engineering-grid.svg` at very low opacity or reproduce it in CSS. It should be noticeable only when looking for it. A texture that competes with body text is too strong.

