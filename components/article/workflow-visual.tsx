import React from "react";

/**
 * Workflow visual — semantic ordered HTML showing the Hermes/Claude review loop.
 * Cobalt for system flow, amber for Filip's human decision.
 * Replaces the ASCII workflow diagram in the article.
 */
export function WorkflowVisual() {
  return (
    <figure className="vdit-workflow-visual">
      <figcaption className="vdit-workflow-caption">
        The review loop: Hermes implements, Claude reviews, Filip decides what ships.
      </figcaption>
      <ol className="vdit-workflow-list" aria-label="AI delivery workflow sequence">
        <li className="vdit-workflow-step" data-role="system">
          <span className="vdit-workflow-marker">01</span>
          <span className="vdit-workflow-actor vdit-system-label">Hermes (GLM 5)</span>
          <span className="vdit-workflow-action">Implements the design plan — modifies files, starts the dev server, captures Playwright screenshots.</span>
        </li>
        <li className="vdit-workflow-step" data-role="system">
          <span className="vdit-workflow-marker">02</span>
          <span className="vdit-workflow-actor vdit-system-label">Evidence</span>
          <span className="vdit-workflow-action">Screenshots at 1280px and 390px are produced as review input.</span>
        </li>
        <li className="vdit-workflow-step" data-role="system">
          <span className="vdit-workflow-marker">03</span>
          <span className="vdit-workflow-actor vdit-system-label">Claude Sonnet</span>
          <span className="vdit-workflow-action">Reviews screenshots with vision, scores design quality /10, and returns a ranked, actionable feedback list.</span>
        </li>
        <li className="vdit-workflow-step" data-role="system">
          <span className="vdit-workflow-marker">04</span>
          <span className="vdit-workflow-actor vdit-system-label">Feedback</span>
          <span className="vdit-workflow-action">Claude's feedback returns to Hermes — specific CSS rules, component props, and ranked priorities.</span>
        </li>
        <li className="vdit-workflow-step" data-role="system">
          <span className="vdit-workflow-marker">05</span>
          <span className="vdit-workflow-actor vdit-system-label">Hermes (GLM 5)</span>
          <span className="vdit-workflow-action">Applies fixes based on the feedback, then takes new screenshots for the next iteration. Repeat ×5.</span>
        </li>
        <li className="vdit-workflow-step" data-role="human">
          <span className="vdit-workflow-marker">06</span>
          <span className="vdit-workflow-actor vdit-human-label">Filip</span>
          <span className="vdit-workflow-action">Decides what ships — reviews the PR, catches what the AIs missed, and approves the merge.</span>
        </li>
      </ol>
      <p className="vdit-workflow-note">
        <span className="vdit-human-label">Human decision:</span> The loop does not close itself.
        Filip reviews the PR before merging and catches issues the AIs cannot — like the missing viewport meta tag that only appeared on a real device.
      </p>
    </figure>
  );
}