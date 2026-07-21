---
title: How I Work
blocks:
  - tagline: AI does the heavy lifting. Experience does the judgment.
    headline: >
      I work with AI agents to build, review, and ship software faster than a
      solo developer has any right to. The agents handle volume. I handle
      everything that requires knowing when to stop and push back.
    actions:
      - label: See it in practice
        type: button
        icon: true
        link: /posts
      - label: Get in touch
        type: link
        link: /contact
    _template: hero

  - body: >
      ## The Method


      Every project runs through a two-layer process. The first layer is
      Hermes — a local AI agent with persistent memory, reusable skills, and
      access to the full codebase across sessions. It is not a one-shot prompt.
      It remembers what we decided last week, what went wrong, and what we
      learned from it.


      When something breaks, the lesson gets saved — as a memory entry or a
      skill update — so the same mistake doesn't happen twice. The agent gets
      better over time, not because the model changes, but because the context
      does.


      **Hermes handles:** implementation, test generation, code review passes,
      refactoring, documentation, and first-pass architecture proposals. It does
      this fast, and it does it consistently. It doesn't forget what we decided
      last week.


      **I handle:** the gut check. Does this feel right? Is the security posture
      sensible for what this system actually does? Where are the performance
      trade-offs, and do they matter here? How does this fit into the broader
      integration strategy? And — critically — when is the agent confidently
      wrong, and what do I say to redirect it?


      That last one matters more than it sounds. AI agents fail quietly. They
      produce well-structured, grammatically correct, thoroughly commented code
      that does the wrong thing. Catching that is a judgment call, not a
      checklist. That judgment is what fifteen years in the industry buys you.


      The workflow is not proprietary. It is teachable. Getting your team
      building this way — and avoiding the failure modes — is exactly what the
      AI Workflow Audit is for.
    _template: content

  - body: >
      ## When Experience Matters


      Here is a concrete example. A client site was getting strong Lighthouse
      mobile scores in CI. Playwright was happy. Eight separate AI review passes
      across two tools did not flag anything. The score looked fine.


      On a real phone, the layout was broken. Text was unreadably small,
      elements were overflowing, the experience was unusable.


      The cause was a missing viewport meta tag. One line. The kind of thing
      that every browser simulation gets wrong because it is not simulating —
      it is approximating. Lighthouse runs in a controlled Chromium instance with
      a forced viewport. A Samsung Galaxy in someone's hand does not.


      No agent caught it. I caught it because I tested on a real device, which
      is a habit, not a workflow step.


      That is the gap. Tools simulate. Humans verify. The value of experience is
      not that it replaces tooling — it is that it knows where tooling lies to
      you.
    _template: content

  - title: What I Can Do For You
    items:
      - icon:
          name: FaSearch
          color: blue
        title: AI Workflow Audit
        text: >
          I assess your team's development workflow and integrate AI tooling
          where it creates real leverage. Not a generic AI adoption talk — a
          hands-on review of how your team actually works, followed by a
          concrete implementation plan.
      - icon:
          name: FaUserTie
          color: blue
        title: Fractional Tech Lead
        text: >
          An experienced tech lead for your product on a part-time basis.
          Architecture decisions, code review, team mentoring — with AI
          augmentation built in from day one. You get senior oversight without
          the full-time hire.
      - icon:
          name: FaServer
          color: blue
        title: AI Tooling Setup
        text: >
          Custom AI agents, self-hosted workflows, and development tooling
          built around your team's actual process. No per-seat SaaS costs,
          no vendor lock-in.
    _template: features

  - body: >
      ## See It In Practice


      The best way to understand this workflow is to see it running. The posts
      on this site are produced by the same system they describe — Hermes
      writes, Claude reviews, I decide what ships. The tooling, the process, and
      the failure modes are all documented as we go.


      [Read the posts →](/posts)
    _template: content
---
