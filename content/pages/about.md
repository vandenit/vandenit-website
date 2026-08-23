---
title: About
blocks:
  - avatarHeader: Senior Engineer & Fractional Tech Lead
    avatarsName: Filip Van den Broeck
    description: >-
      Senior full-stack engineer and fractional tech lead based in Antwerp.
      15 years of experience building and maintaining enterprise systems,
      now combined with a structured, hands-on approach to AI-assisted
      development.
    avatarImage:
      src: /uploads/main/unnamed.jpg
      alt: Filip Van den Broeck
    _template: avatar
  - body: >
      ## The Story So Far


      I spent most of my career inside enterprise engineering at BNP
      Paribas Fortis. I worked as a senior developer and later as
      Technical Lead for the Enablement project within Centric, a
      financial platform serving more than 100,000 users.


      Alongside that work, I built DinnerGift from scratch and ran it as
      a commercial platform — owning the backend, frontend, architecture,
      deployment, and long-term maintenance.


      Those environments taught me what production responsibility actually
      means: making trade-offs under delivery pressure, keeping systems
      understandable over time, and knowing when a technically plausible
      solution is not yet safe to ship.


      ## The Shift


      Over the last two years, I have been exploring what changes when AI
      becomes part of the everyday engineering workflow — not as an
      autocomplete tool, but as a collaborator that can research,
      implement, test, review, and document.


      I built a workflow in which AI agents handle much of that volume
      while I remain responsible for architecture, security, quality, and
      release decisions. The most important lessons have not come from
      the tasks the agents complete successfully, but from learning where
      they sound confident while being wrong.


      That workflow now shapes how I work. When I join a team as a
      developer or tech lead, I can also help introduce the useful parts
      of it — adapted to the team's codebase, constraints, and existing
      practices.


      ### The tools behind my workflow


      I run Hermes Agent, an open-source autonomous AI coding platform,
      as my core development tool. It operates in a persistent loop:
      receiving tasks, reasoning through them, writing and executing
      code, reading test output, and self-correcting. The open-weight
      model is served through [Ollama
      Cloud](https://ollama.com/cloud). Ollama states that prompt and
      response content is not stored or logged and is not used for
      training; vendor documentation should be reviewed against the
      requirements of each engagement.


      Alongside Hermes, I use Claude for visual design review — it can
      see and score a screenshot, but never touches code. Two AIs, two
      roles: one implements, one critiques.


      ## What This Means for You


      I begin with the actual work: understanding the codebase, delivery
      pressure, technical constraints, and the way the team collaborates.


      From that position, I can help improve both the software and the
      workflow around it. That may include architectural guidance,
      hands-on implementation, stronger review practices, or introducing
      AI support where it removes repetitive work without weakening
      accountability.


      The goal is not to maximize AI usage. The goal is to help the team
      deliver good software more consistently.


      If that sounds like what you need, [see how I work](/how-i-work).
    color: ''
    _template: content
  - title: What I Bring to the Team
    featuresId: workingwithme
    items:
      - icon:
          name: FaCheckCircle
          color: green
        title: Production Engineering
        text: >-
          Fifteen years of building and maintaining real systems.
          Architecture and implementation decisions are grounded in
          reliability, security, delivery pressure, and long-term
          maintainability.
        richText: ''
      - icon:
          name: FaUserShield
          color: purple
        title: Technical Leadership
        text: >-
          Clear technical direction without disappearing into
          abstractions. I contribute to the work, support engineers,
          make trade-offs explicit, and communicate honestly with
          product owners and stakeholders.
        richText: ''
      - icon:
          name: FaBrain
          color: blue
        title: AI-Augmented Delivery
        text: >-
          A structured AI workflow for implementation, testing, review,
          and documentation. I bring the practices I use in my own
          production work and adapt them to the team's actual
          environment.
        richText: ''
    color: tint
    _template: features
  - title: Experience Highlights
    featuresId: experience
    items:
      - icon:
          name: FaBuilding
          color: blue
        title: Technical Lead — BNP Paribas Fortis / Centric
        text: >-
          Technical Lead for the Enablement project within Centric, a financial
          platform used by 100,000+ users. Contributed across backend and
          frontend delivery, architecture decisions, and team quality
          practices.
        richText: ''
      - icon:
          name: FaGift
          color: green
        title: Owner & Full-Stack Developer — DinnerGift
        text: >-
          Built end-to-end from concept to production: React/Next.js frontend,
          Express REST API, MongoDB, and CircleCI CI/CD pipeline. Ran
          independently for years as a commercial platform.
        richText: ''
      - icon:
          name: FaRobot
          color: orange
        title: AI-Augmented Development Workflow
        text: >-
          Configured and extended Hermes Agent, an open-source autonomous
          coding platform, into a production workflow — custom skills,
          persistent memory, and multi-agent orchestration. Paired with
          Claude for visual design review, so implementation and critique
          are handled by separate AIs. Runs on open-weight models via
          Ollama Cloud.
        richText: ''
    color: tint
    _template: features
  - actions:
      - label: See how I work
        type: button
        icon: true
        link: /how-i-work
    _template: actions
---