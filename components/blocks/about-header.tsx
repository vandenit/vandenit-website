import React from "react";
import { Container, Section } from "@radix-ui/themes";

interface AboutHeaderData {
  avatarHeader?: string;
  avatarsName?: string;
  description?: string;
  _template: string;
}

/**
 * About page header — typographic monogram checkpoint.
 * No portrait is available; instead of a flat circular placeholder
 * we render a deliberate monogram block using the Vanden IT visual language:
 * cobalt rule, mono kicker, display monogram, name, and editorial description.
 */
export const AboutHeader = ({ data }: { data: AboutHeaderData }) => {
  const initials =
    (data.avatarsName || "")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "FV";

  return (
    <Section
      size="2"
      pt={{ initial: "6", sm: "9" }}
      pb="4"
      className="vdit-content-section vdit-about-header-section"
    >
      <Container size="3" px="6">
        <header className="vdit-about-header">
          {/* Cobalt system rule */}
          <div className="vdit-about-rule" aria-hidden="true" />

          {/* Kicker */}
          <p className="vdit-kicker vdit-about-kicker">
            <span>About</span>
            <span className="vdit-kicker-tail">
              <span aria-hidden="true">&nbsp;·&nbsp;</span>
              <span className="vdit-nowrap">Senior Engineer</span>
            </span>
          </p>

          <div className="vdit-about-header-inner">
            {/* Monogram checkpoint — amber human node */}
            <div className="vdit-monogram" aria-hidden="true">
              <span className="vdit-monogram-text">{initials}</span>
            </div>

            {/* Name and description */}
            <div className="vdit-about-header-copy">
              {data.avatarHeader && (
                <h1 className="vdit-about-title">{data.avatarHeader}</h1>
              )}
              {data.avatarsName && (
                <p className="vdit-about-name">{data.avatarsName}</p>
              )}
              {data.description && (
                <p className="vdit-about-description">{data.description}</p>
              )}
            </div>
          </div>
        </header>
      </Container>
    </Section>
  );
};