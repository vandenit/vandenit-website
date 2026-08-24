"use client";
import * as React from "react";
import Link from "next/link";
import { Container, Flex, Heading, Text } from "@radix-ui/themes";
import { BiRightArrowAlt } from "react-icons/bi";

interface HeroAction {
  label: string;
  type: string;
  icon: boolean;
  link: string;
}

interface HeroBlockData {
  tagline?: string;
  headline?: string;
  text?: string;
  text2?: string;
  proofBar?: string;
  actions?: HeroAction[];
  image?: {
    src: string;
    alt: string;
  };
  color?: string;
  _template: string;
}

/**
 * "Discuss a project" = amber primary (human action).
 * Everything else = cobalt secondary.
 */
function isDiscussAction(action: HeroAction): boolean {
  return /discuss/i.test(action.label) || /contact/i.test(action.link);
}

function HeroButton({ action }: { action: HeroAction }) {
  const isPrimary = isDiscussAction(action);
  const href = action.type === "email"
    ? (action.link?.startsWith('mailto:') ? action.link : `mailto:${action.link || ''}`)
    : (action.link || '/');

  const className = isPrimary ? "vdit-button vdit-button--primary" : "vdit-button vdit-button--cobalt";

  if (href.startsWith('mailto:')) {
    return (
      <a href={href} className={className}>
        {action.label}
        {action.icon && <BiRightArrowAlt aria-hidden="true" />}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {action.label}
      {action.icon && <BiRightArrowAlt aria-hidden="true" />}
    </Link>
  );
}

/* Proof strip items — static, matches actual content */
const PROOF_ITEMS = [
  {
    value: "15",
    unit: "years",
    label: "Senior engineering experience",
    annotation: "CAREER SPAN",
  },
  {
    value: "100K+",
    unit: "users",
    label: "Production systems delivered",
    annotation: "SCALE",
  },
  {
    value: "Full stack",
    unit: "",
    label: "Backend, frontend & technical leadership",
    annotation: "SCOPE",
  },
];

export const Hero = ({ data }: { data: HeroBlockData }) => {
  return (
    <section className="vdit-hero">
      <Container size="3" px="6">
        {/* Asymmetric two-column on desktop, single column on mobile */}
        <div className="vdit-hero-inner">
          {/* Left column: copy and CTAs */}
          <div>
            {/* Kicker */}
            <p className="vdit-kicker" style={{ marginBottom: '1.25rem' }}>
              Senior Engineering&nbsp;·&nbsp;AI-Augmented Delivery
            </p>

            {/* H1 */}
            <Heading
              as="h1"
              size={{ initial: '8', sm: '9' }}
              weight="bold"
              style={{
                fontFamily: 'var(--vdit-font-display)',
                color: 'var(--vdit-color-text)',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
                textWrap: 'balance',
              }}
            >
              {data.tagline}
            </Heading>

            {/* Subtext */}
            <Text
              as="p"
              size={{ initial: '3', sm: '4' }}
              style={{
                color: 'var(--vdit-color-text-muted)',
                lineHeight: 1.65,
                maxWidth: '52ch',
                marginBottom: '2rem',
              }}
            >
              {data.headline}
            </Text>

            {/* CTA buttons */}
            {data.actions && (
              <Flex gap="3" direction={{ initial: 'column', xs: 'row' }} wrap="wrap">
                {data.actions.map((action, i) => (
                  <HeroButton key={i} action={action} />
                ))}
              </Flex>
            )}
          </div>

          {/* Right column: system diagram (desktop only via .vdit-hero-diagram CSS) */}
          <div className="vdit-hero-diagram" aria-hidden="true">
            <img
              src="/daniel-flow-desktop.svg"
              alt=""
              width="600"
              height="210"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                opacity: 0.9,
              }}
            />
          </div>
        </div>

        {/* Mobile-only system diagram (below copy, shown below sm breakpoint) */}
        <div
          aria-hidden="true"
          className="vdit-hero-diagram-mobile"
          style={{ marginTop: '2.5rem' }}
        >
          <img
            src="/daniel-flow-mobile.svg"
            alt=""
            width="360"
            height="360"
            style={{
              width: '100%',
              maxWidth: '300px',
              height: 'auto',
              display: 'block',
              margin: '0 auto',
              opacity: 0.85,
            }}
          />
        </div>
      </Container>

      {/* Proof strip — ruled cells below the hero */}
      <div style={{ marginTop: 'var(--vdit-space-7)' }}>
        <Container size="3" px="6">
          <div className="vdit-proof-strip">
            {PROOF_ITEMS.map((item, i) => (
              <div key={i}>
                <p
                  className="vdit-system-label"
                  style={{ marginBottom: '0.25rem', marginTop: 0 }}
                >
                  {item.annotation}
                </p>
                <p
                  style={{
                    margin: '0 0 0.25rem',
                    fontFamily: 'var(--vdit-font-display)',
                    fontSize: 'var(--vdit-step-2)',
                    fontWeight: 700,
                    color: 'var(--vdit-color-text)',
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {item.value}
                  {item.unit && (
                    <span
                      style={{
                        fontSize: '0.5em',
                        fontWeight: 400,
                        color: 'var(--vdit-color-text-muted)',
                        marginLeft: '0.3em',
                        letterSpacing: 0,
                      }}
                    >
                      {item.unit}
                    </span>
                  )}
                </p>
                <p
                  style={{
                    margin: 0,
                    color: 'var(--vdit-color-text-muted)',
                    fontSize: 'var(--vdit-step--1)',
                    lineHeight: 1.4,
                  }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
};
