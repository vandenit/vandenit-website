# Performance, Responsive and Accessibility Guardrails

## Core implementation rule

The generated PNGs are visual references only. Never ship them as page backgrounds or screenshots of interface text. Build the interface with HTML, CSS and SVG.

## SVG rules

- Give every SVG a `viewBox` and fluid `width: 100%`.
- Keep meaningful text outside SVG where possible.
- Use `vector-effect="non-scaling-stroke"` when a line must retain its visual weight.
- Keep desktop and mobile geometry separate when simplification improves readability.
- Prefer tens of SVG nodes, not hundreds.
- Avoid blur filters, animated masks and continuously moving particles.
- Mark decorative diagrams `aria-hidden="true"` and `focusable="false"`.

## Responsive rules

- Test at 320, 390, 768, 1024, 1280 and 1440 CSS pixels.
- No horizontal page scrolling.
- Keep interactive targets at least 44×44px.
- Use `clamp()` for display typography but cap it before headings become billboard-sized.
- Switch diagrams based on layout needs, not user-agent detection.
- Keep H1, primary CTA and essential proof before or close to the first viewport on mobile.
- Verify on at least one real mobile browser because viewport simulation can hide real-device issues.

## Motion rules

Allowed in v1.1:

- short opacity transitions;
- small transforms;
- one-time SVG line reveals;
- a brief risk pulse;
- checkpoint activation.

Avoid:

- continuous background animation;
- pointer-following effects;
- scroll-jacking;
- parallax on text;
- large canvas scenes;
- essential content that appears only after an animation callback.

Required override:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Accessibility checklist

- Preserve one H1 per page and logical heading levels.
- Keep `aria-current="page"` on active navigation.
- Keep accessible names on carousel/menu/icon buttons.
- Maintain visible `:focus-visible` styles.
- Do not encode meaning by blue/amber alone; include labels or icons.
- All diagram explanations must exist as selectable text.
- Use semantic lists, tables and landmarks.
- Make horizontally scrollable mobile anchor navigation keyboard accessible.
- Ensure code blocks and tables scroll internally instead of widening the viewport.
- Provide alt text for informative screenshots and empty alt text for decorative images.

## Performance checklist

- Do not add a general animation library in the first release.
- Use `next/font` and subset font weights.
- Keep only the display weights actually used.
- Lazy-load below-fold raster screenshots with explicit dimensions.
- Use modern image formats for production screenshots where practical.
- Avoid layout measurements in scroll handlers.
- Use `IntersectionObserver` for optional reveal states.
- Prefer CSS background gradients and the small tile SVG over large texture PNGs.
- Track any change in JavaScript size and LCP against the baseline.

## QA matrix

For every affected route, verify:

| Check | Desktop | Mobile |
|---|---:|---:|
| Build/lint/tests pass | Yes | Yes |
| No horizontal scroll | Yes | Yes |
| Keyboard navigation | Yes | Yes |
| Focus visible | Yes | Yes |
| Text selectable | Yes | Yes |
| Diagram readable/static | Yes | Yes |
| Reduced motion | Yes | Yes |
| Light/dark browser UI contrast | Yes | Yes |
| Real device smoke test | Optional | Required |

