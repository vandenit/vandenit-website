---
title: How I Work
blocks:
  - tagline: I join the team. Ship real work. Improve how the work gets done.
    headline: >-
      I work as a senior developer or fractional tech lead inside the
      existing delivery process. That gives me the context to contribute
      directly, make better technical decisions, and help the team
      introduce AI workflows where they create practical leverage.
    actions:
      - label: Discuss a project
        type: button
        icon: true
        link: /contact
      - label: Read the case study
        type: button
        icon: false
        link: /posts/blind-coder-sighted-reviewer
    _template: hero

  - body: >
      ## How an engagement develops


      ### 1. Join and understand


      I start with the real environment: the codebase, architecture,
      delivery pressure, team responsibilities, and current tooling. The
      goal is to understand before changing anything.


      ### 2. Contribute to delivery


      I take ownership of real engineering work — implementation,
      architecture decisions, reviews, production issues, and the
      technical conversations needed to keep delivery moving.


      ### 3. Improve the workflow


      While working with the team, I identify where better tooling or a
      structured AI workflow could reduce repetition, shorten feedback
      loops, or strengthen review and documentation.


      ### 4. Leave durable practices


      Useful patterns are documented and adapted to the team. The
      objective is not dependence on a consultant or a specific tool, but
      a workflow the team understands and can continue to refine.
    _template: content

  - body: >
      ## Senior Full-Stack Development


      I contribute across backend and frontend, with particular experience
      in Java, Spring, JavaScript/TypeScript, React, APIs, authentication,
      and production delivery. I am most useful where a team needs someone
      who can move between implementation details and the broader
      architectural picture.


      The role is hands-on. I write code, investigate failures, review
      changes, and take responsibility for getting work safely into
      production.
    _template: content

  - body: >
      ## Fractional Tech Lead


      Some teams need experienced technical direction but not another
      full-time management layer. As a fractional tech lead, I combine
      delivery work with architecture decisions, code review, mentoring,
      technical planning, and communication with stakeholders.


      Because I remain close to the code, technical direction stays
      connected to what the team is actually building.
    _template: content

  - body: >
      ## AI Workflow Improvement


      I have developed a structured multi-agent workflow for my own
      production work. AI agents can assist with research, implementation,
      tests, review passes, refactoring, and documentation. I remain
      responsible for architecture, security, correctness, and deciding
      what ships.


      When I work inside a team, I can help introduce the parts of that
      workflow that fit the environment. That might mean improving prompts
      and context, adding independent review, capturing recurring lessons,
      strengthening test feedback, or removing repetitive handoffs.


      This is not a generic rollout and it is not about maximizing AI
      usage. We start from real delivery friction and only introduce
      practices that make the work better.


      My AI workflow is proven in my own production work. Applying and
      refining it inside other engineering teams is part of my embedded
      developer or tech lead engagement, not currently sold as a standalone
      transformation audit.
    _template: content

  - body: >
      ## When Experience Makes the Judgment Calls


      AI can produce a plausible answer before it has understood the
      problem. Experience matters most at that boundary.


      ### Problem


      Device changes from a mobile app were not reaching the central unit.


      ### First AI implementation


      The agent found missing sync logic, wrote a fix, and added a test
      — but the test failed.


      ### Wrong conclusion


      After several attempts, the agent concluded that the test helper
      was unreliable and the code could still ship.


      ### Human intervention


      I refused to treat the failing test as an obstacle. A second review
      exposed an ordering bug: sync messages were sent before the database
      transaction committed.


      ### Result


      The implementation was corrected, the test passed, a production
      incident was prevented, and the lesson was stored for future
      sessions.


      AI handled the volume. Experience made the judgment call.
    _template: content

  - body: >
      ## See It In Practice


      The best way to understand this workflow is to see it running. The
      case study on this site was produced by the same system it describes
      — Hermes writes, Claude reviews, I decide what ships. The tooling,
      the process, and the failure modes are all documented as we go.


      [Read the case study →](/posts/blind-coder-sighted-reviewer)
    _template: content
---