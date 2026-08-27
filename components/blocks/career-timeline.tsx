import React from "react";
import { Container, Section } from "@radix-ui/themes";

interface CareerTimelineItem {
  title: string;
  text: string;
  icon?: {
    name: string;
    color: string;
  };
}

interface CareerTimelineData {
  title?: string;
  featuresId?: string;
  items?: CareerTimelineItem[];
  color?: string;
  _template: string;
}

/**
 * Career highlights rendered as a restrained timeline / evidence rail.
 * Uses the existing Vanden IT visual language: cobalt rail on the left,
 * mono markers (01, 02, 03), ruled cells with title + body.
 * Mobile: vertical stepper. Desktop: three connected columns.
 */
export const CareerTimeline = ({ data }: { data: CareerTimelineData }) => {
  const items = data.items || [];

  return (
    <Section
      size="2"
      mb="3"
      className="vdit-content-section vdit-career-section"
    >
      <Container size="3" px="6">
        <section
          className="vdit-career-timeline"
          aria-labelledby={
            data.featuresId
              ? `${data.featuresId}-title`
              : "career-timeline-title"
          }
        >
          {data.title && (
            <h2
              id={data.featuresId ? `${data.featuresId}-title` : "career-timeline-title"}
              className="vdit-career-heading"
            >
              {data.title}
            </h2>
          )}
          {/* VoiceOver strips <ol> list semantics with list-style:none; role="list" restores them */}
          <ol className="vdit-career-list" role="list">
            {items.map((item, i) => (
              <li key={i} className="vdit-career-step">
                <span className="vdit-career-marker" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="vdit-career-step-title">{item.title}</h3>
                <p className="vdit-career-step-body">{item.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </Container>
    </Section>
  );
};