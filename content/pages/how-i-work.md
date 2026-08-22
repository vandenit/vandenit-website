---
title: How I Work
blocks:
  - tagline: AI does the heavy lifting. Experience does the judgment.
    headline: >
      I work with AI agents to build, review, and ship software — faster
      than I could alone, and with more consistency than ad-hoc use of the
      same tools. The agents handle volume. I handle everything that
      requires knowing when to stop and push back.
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
      Hermes — an open-source AI agent with persistent memory, reusable
      skills, and access to the full codebase across sessions. It runs on
      an open-weight model via Ollama Cloud, with zero logging and zero
      data retention by default. It carries context across sessions —
      remembering what we decided, what went wrong, and what we learned
      from it.


      When something breaks, the lesson gets saved — as a memory entry or a
      skill update — so the same mistake doesn't happen twice. The agent gets
      better over time, not because the model changes, but because the context
      does.


      **Hermes handles:** implementation, test generation, code review passes,
      refactoring, documentation, and first-pass architecture proposals. It does
      this fast, and it does it consistently.


      **I handle:** the gut check. Does this feel right? Is the security posture
      sensible for what this system actually does? Where are the performance
      trade-offs, and do they matter here? How does this fit into the broader
      integration strategy? And — critically — when is the agent confidently
      wrong, and what do I say to redirect it?


      That last one matters more than it sounds. AI agents can fail quietly. They
      produce well-structured, grammatically correct, thoroughly commented code
      that does the wrong thing. Catching that is a judgment call, not a
      checklist. That judgment is the part that's hard to automate — it comes
      from years of seeing these failures before.


      The workflow is not proprietary. It is teachable. Getting your team
      building this way — and avoiding the failure modes — is exactly what the
      AI Workflow Audit is for.
    _template: content

  - body: >
      ## When Experience Matters


      Here is a concrete example. A client reported that device changes from
      their mobile app were not reaching the central unit. The AI analyzed
      the codebase, found the missing sync logic, wrote a fix, and added a
      test. The test failed. The AI spent three iterations on the test, then
      concluded: the code fix is correct, the test helper has a technical
      issue with the RabbitMQ Java client, and further debugging would not
      be productive in this session.


      That is the moment where judgment matters. The AI was ready to ship
      the fix and move on. I disagreed. A failing test means either the code
      or the test is wrong, and you do not know which until you understand
      why. If there is a real issue and you ship anyway, you just moved a
      production bug one step closer to the customer.


      I asked the AI to describe the failing test's behavior to Claude for
      a fresh analysis. Claude read the test and the fix, identified the
      actual problem: the fix itself had a subtle ordering issue. Sync
      messages were being sent before the database transaction committed,
      meaning the central unit could receive a sync for a device that did
      not exist yet. Claude proposed a correction to both the code and the
      test.


      The fix was corrected, the test passed. I then asked the AI to update
      its skills and memory to learn from this incident: never abandon a
      failing test without understanding the root cause, and always treat a
      failing test as a signal, not an obstacle. That feedback is now
      captured for every future session.


      Result: a production incident was prevented, the test suite became
      more reliable, and the AI's future behavior improved. Not because the
      model got smarter, but because the feedback was captured.


      That is the gap: an AI agent can mistake a plausible result for a
      finished one. The work is knowing when a failing test means the
      problem is not yet understood.
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
          designed to preserve an exit path.
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
