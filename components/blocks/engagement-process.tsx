import React from "react";
import { Container, Section } from "@radix-ui/themes";

const steps = [
  {
    number: "01",
    title: "Join and understand",
    body: "I start with the real environment: the codebase, architecture, delivery pressure, team responsibilities, and current tooling. The goal is to understand before changing anything.",
  },
  {
    number: "02",
    title: "Contribute to delivery",
    body: "I take ownership of real engineering work — implementation, architecture decisions, reviews, production issues, and the technical conversations needed to keep delivery moving.",
  },
  {
    number: "03",
    title: "Improve the workflow",
    body: "While working with the team, I identify where better tooling or a structured AI workflow could reduce repetition, shorten feedback loops, or strengthen review and documentation.",
  },
  {
    number: "04",
    title: "Leave durable practices",
    body: "Useful patterns are documented and adapted to the team. The objective is not dependence on a consultant or a specific tool, but a workflow the team understands and can continue to refine.",
  },
];

export const EngagementProcess = () => {
  return (
    <Section size="2" mb="3" className="vdit-content-section">
      <Container size="3" px="6">
        <section className="vdit-process" aria-labelledby="engagement-process-title">
          <h2 id="engagement-process-title" className="vdit-process-heading">
            How an engagement develops
          </h2>
          <ol className="vdit-process-list">
            {steps.map((step) => (
              <li key={step.number} className="vdit-process-step">
                <span className="vdit-process-marker" aria-hidden="true">
                  {step.number}
                </span>
                <h3 className="vdit-process-step-title">{step.title}</h3>
                <p className="vdit-process-step-body">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </Container>
    </Section>
  );
};