import React from "react";
import { Container, Section } from "@radix-ui/themes";

const beats = [
  {
    number: "01",
    label: "Problem",
    state: "system",
    body: "Device changes from a mobile app were not reaching the central unit.",
  },
  {
    number: "02",
    label: "First AI implementation",
    state: "system",
    body: "The agent found missing sync logic, wrote a fix, and added a test — but the test failed.",
  },
  {
    number: "03",
    label: "Wrong conclusion",
    state: "warning",
    body: "After several attempts, the agent concluded that the test helper was unreliable and the code could still ship.",
    invalid: true,
  },
  {
    number: "04",
    label: "Human intervention",
    state: "human",
    body: "I refused to treat the failing test as an obstacle. A second review exposed an ordering bug: sync messages were sent before the database transaction committed.",
  },
  {
    number: "05",
    label: "Result",
    state: "result",
    body: "The implementation was corrected, the test passed, a production incident was prevented, and the lesson was stored for future sessions.",
  },
];

export const DecisionTrace = () => {
  return (
    <Section size="2" mb="3" className="vdit-content-section">
      <Container size="3" px="6">
        <section
          className="vdit-decision-trace"
          aria-labelledby="decision-trace-title"
        >
          <h2 id="decision-trace-title" className="vdit-decision-heading">
            When Experience Makes the Judgment Calls
          </h2>
          <p className="vdit-decision-intro">
            AI can produce a plausible answer before it has understood the
            problem. Experience matters most at that boundary.
          </p>
          <ol className="vdit-decision-list" role="list">
            {beats.map((beat) => (
              <li
                key={beat.number}
                className="vdit-decision-beat"
                data-state={beat.state}
              >
                <div className="vdit-decision-beat-header">
                  <span className="vdit-decision-marker" aria-hidden="true">
                    {beat.number}
                  </span>
                  <h3 className="vdit-decision-label">{beat.label}</h3>
                  {beat.invalid && (
                    <span className="vdit-decision-invalid-tag" aria-label="Invalid conclusion">
                      <span aria-hidden="true">✕</span> Invalid
                    </span>
                  )}
                </div>
                <p className="vdit-decision-beat-body">{beat.body}</p>
              </li>
            ))}
          </ol>
          <p className="vdit-decision-summary">
            AI handled the volume. Experience made the judgment call.
          </p>
        </section>
      </Container>
    </Section>
  );
};