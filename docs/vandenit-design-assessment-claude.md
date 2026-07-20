# 🎨 Design Assessment — vandenit.be

> **Context**: Freelance tech consultancy. Goal: inspire trust, professionalism, and attract B2B clients.

---

## 1. First Impression — Professional or Amateur?

**Rating: 5 / 10 — Semi-amateur leaning toward professional**

The site is clean and not broken — it avoids most rookie mistakes (no garish colors, no Comic Sans, no wall of text). However, the first impression is **forgettable**. A prospective client lands here and feels like they've seen this exact layout a hundred times. There's no visual hook — no depth, no personality, no "wow" moment. For a solo tech consultant trying to compete against agencies, that's a serious liability.

The dark header/navbar against a white body creates a jarring visual break immediately. There's no background texture, gradient, or hero image — just white space with big text, which reads as unfinished rather than minimal.

---

## 2. Header / Navigation

**Rating: 6 / 10**

**Positives:**
- Logo mark (circled "V") is clean and recognizable at small sizes.
- Flat nav links (Home, About, Blog, Contact) are concise and scannable.
- No overcrowding.

**Problems:**
- The navbar is **dark/near-black with white text**, but the rest of the page is **pure white**. There's a hard color-boundary with no blending — it feels like two different websites stacked on top of each other.
- There's **no CTA in the header** (e.g., "Get in Touch" button). This is a major missed opportunity — studies consistently show that a sticky header CTA dramatically improves conversion for freelance portfolios.
- No indication of which page is active (no underline, color change, or highlight on "Home").
- Mobile readiness is **unknown from this view** but the flat layout suggests a hamburger menu exists — needs verification.

---

## 3. Hero Section

**Rating: 4 / 10**

**Positives:**
- The heading "Building Scalable Solutions with Cutting-Edge Technologies" is bold and immediately communicates the value prop.
- Two CTAs ("Our Services" and "Meet the Developer") give the user a clear path.

**Problems:**
- **"Cutting-Edge Technologies" is a cliché** that adds zero specificity. What technologies? React, Kubernetes, Go? A client hiring a tech lead wants to know your actual stack.
- The subtext — *"At Vanden IT, we specialize in developing high-performance software solutions that drive business success"* — is pure filler. It's the kind of copy you'd find on a template. "Drive business success" is meaningless to a technical buyer.
- **No visual element in the hero**. No illustration, photo, mockup, abstract graphic, or even a subtle background pattern. It's just big text on a white void. This kills emotional impact.
- CTA buttons are **inconsistently styled**: "Our Services" is outlined/ghost; "Meet the Developer" is filled/solid (dark). The hierarchy is inverted — the primary action (services) should be the filled button, and the secondary (about page) should be outlined.
- The massive font size with extreme tracking/letter-spacing feels heavy and slightly disproportionate to the body text that follows.
- There's excessive whitespace **below** the CTAs before the Services section — not elegant breathing room, just empty.

---

## 4. Content Layout — Spacing, Hierarchy, Readability

**Rating: 6 / 10**

**Positives:**
- Three-column service card layout is a good structural choice for this amount of content.
- Cards have light borders and rounded corners — consistent.
- The "Portfolio" section below uses a full-width card with a carousel — good for showing case studies.

**Problems:**
- Section titles ("Services", "Portfolio") are **left-aligned** while the portfolio card content appears to be **center-aligned**. Inconsistency in alignment signals lack of attention to detail.
- The `Services` section heading has no supporting subtext — just the word "Services" floating above the cards. Missed opportunity to add a one-liner (e.g., "Here's how I can help your business").
- Card heights appear uneven — the three service cards likely use fixed heights and may not behave well with different content lengths.
- The **portfolio carousel** with bare prev/next arrow buttons looks very generic and understyled — the chevron circles look like they came from a UI kit without customization.
- Link colors inside cards (e.g., "Request a free preview", "Explore Our Solutions") appear in a bright blue/teal that feels **too link-y** — they should be styled as more purposeful CTAs (pills or underlined with a right-arrow).

---

## 5. Color Scheme

**Rating: 4 / 10**

| Element | Color | Assessment |
|---|---|---|
| Navbar background | Near-black (`#0D0D1A` ish) | Isolated — not continued anywhere |
| Page background | Pure white `#FFFFFF` | Sterile, no warmth |
| Hero heading | Near-black bold | Good contrast |
| Primary CTA button | Dark filled | Should be the primary accent color |
| Service card icon bg | Blue, Yellow, Red-orange | **Inconsistent and arbitrary** |
| Card link text | Bright teal/blue | Clashes with the overall neutral palette |

The **three service card icons each use a different accent color** (blue for lock, yellow for code, red/orange for headphones). This looks like the icons were copied from three different sources. There is no consistent accent color threading through the design — the brand feels like it has no color identity.

For a tech consultancy, a strong, confident brand color (deep indigo, electric blue, slate-teal) used *consistently* would do wonders.

---

## 6. Typography

**Rating: 6 / 10**

**Positives:**
- The sans-serif font choice is modern and readable.
- Bold weight on the hero heading creates strong typographic hierarchy.
- Body text size is legible.

**Problems:**
- The hero H1 is **very large** (appears ~72–80px) with tight line-height and very heavy tracking. This combination makes multi-line headings look like a wall rather than a statement.
- There are only **two weight levels visible**: bold heading, regular body. No medium weights, no italic, no visual variation. The typography feels flat.
- The "Services" section title appears in **bold but the same size as card titles** (`Custom Software Development` is bold too) — this creates ambiguity in hierarchy.
- Card body text (the descriptions) uses a noticeably smaller size that could border on too-small at 1x zoom, especially for older audiences.

---

## 7. Visual Elements — Icons, Images, Cards, Shadows

**Rating: 4 / 10**

**Icons:**
- The three service icons (lock, code brackets, headphone) are from what appears to be a **standard Heroicons / FontAwesome set** — nothing wrong with that, but the circular colored backgrounds are inconsistent (different colors per card as noted above).
- The icon size inside the circle is small — they feel like decorative afterthoughts rather than meaningful visual anchors.

**Cards:**
- Service cards have a subtle border and rounded corners — acceptable but uninspired. No shadow, no hover effect visible.
- The cards look **clickable** but it's unclear whether the whole card is a link or just the text link at the bottom.

**Images:**
- The portfolio section shows what appears to be a **screenshot of a dashboard** in the BNP Paribas case study. Good — real work shown. However, it's cropped and sized inconsistently.

**Shadows:**
- Essentially **no shadows** anywhere. A subtle `box-shadow` on cards would add depth and lift them off the page background. Right now cards feel pasted flat.

---

## 8. Overall Polish

### ✅ What Works
- The site is **fast and not broken** — no layout shifts or obvious rendering issues.
- Navigation is simple and clear.
- Having a portfolio section with real client work (BNP Paribas) is a **strong trust signal** — many freelancers skip this.
- The two CTAs in the hero give users a clear path.
- Mobile-first thinking is implied by the clean layout.

### ❌ What Looks Broken or Dated
- **The dark header marooned on a white page** — looks like the site was half-designed.
- **Inconsistent icon accent colors** — looks like a demo, not a brand.
- **Zero visual depth** — no gradients, no images, no subtle patterns. Feels like a mockup rather than a finished site.
- **Generic copy** — "cutting-edge technologies" and "drive business success" are red flags that signal low effort to a discerning B2B client.
- **CTA button hierarchy is inverted** — the outlined button for the primary action and filled for secondary is backwards.
- The word "**centric**" in the portfolio is a hyperlink in bright blue — it looks like unformatted Wikipedia text inside a case study card, breaking the visual polish completely.
- "**Tech lead at centric - Bnp paribas**" — inconsistent capitalization (lowercase "centric", uppercase "Bnp" instead of "BNP") reads as unprofessional for a site trying to position itself at the enterprise level.

---

## 9. Top 5 Improvements

### 🥇 #1 — Create a Cohesive Visual Identity with One Brand Accent Color
Pick a **single, confident accent color** (e.g., `#4F6EF7` — a rich indigo-blue) and apply it consistently: primary CTA button, icon backgrounds, link hovers, active nav item, section headings. Right now the site has no color DNA.

### 🥈 #2 — Add Visual Depth to the Hero Section
The white void hero is the single biggest missed opportunity. Add **one of the following**:
- A subtle abstract tech background (code particles, grid lines, gradient mesh)
- A professional headshot or workspace photo
- An animated SVG/Lottie illustration related to development
- Even a dark-to-white radial gradient would add professionalism

### 🥉 #3 — Rewrite the Hero Copy to be Specific
Replace *"Cutting-Edge Technologies"* with your actual stack. Example:
> **"Scalable Software, Built with React, Node.js & Cloud-Native Architecture"**
> *"I help Belgian startups and scale-ups build secure, high-performance platforms — from MVP to enterprise scale."*

This immediately differentiates from generic agencies and speaks directly to the ICP (Ideal Customer Profile).

### 🏅 #4 — Fix Button Hierarchy and Add a Header CTA
- Make "Our Services" (primary) the **filled/solid** button using your brand color.
- Make "Meet the Developer" (secondary) the **outlined ghost** button.
- Add a **"Let's Talk"** button to the top-right corner of the navbar (sticky on scroll).

### 🎖️ #5 — Add Social Proof Above the Fold
A solo freelancer's biggest challenge is trust. Add **one of these directly below the hero**:
- Logos of companies worked with (BNP Paribas Fortis, Centric, etc.) — even just 3–4 logos on a muted strip.
- A short testimonial quote from a past client.
- Stats bar: "8+ years experience · 20+ projects delivered · 3 enterprise clients"

This alone could double conversion rates for a freelance consultancy site.

---

> **Summary verdict**: The site is structurally sound but visually underpowered. It communicates competence without inspiring confidence. With targeted improvements to brand color consistency, hero visual impact, and copy specificity, this could go from a 5/10 to an 8/10 in a single sprint.
