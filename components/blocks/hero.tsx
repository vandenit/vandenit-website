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
        {/* Equal two-column on desktop, single column on mobile */}
        <div className="vdit-hero-inner">
          {/* Left column: copy and CTAs */}
          <div className="vdit-hero-copy">
            {/* Kicker */}
            <p className="vdit-kicker vdit-hero-kicker">
              <span>Senior Engineering</span>
              <span className="vdit-kicker-tail">
                <span aria-hidden="true">&nbsp;·&nbsp;</span>
                <span className="vdit-nowrap">AI‑Augmented Delivery</span>
              </span>
            </p>

            {/* H1 */}
            <Heading
              as="h1"
              size={{ initial: '8', sm: '8' }}
              weight="bold"
              className="vdit-hero-title"
            >
              {data.tagline}
            </Heading>

            {/* Subtext */}
            <Text
              as="p"
              size={{ initial: '3', sm: '4' }}
              className="vdit-hero-lead"
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
            />
          </div>
        </div>

        {/* Mobile-only system diagram (below copy, shown below sm breakpoint) */}
        <div
          aria-hidden="true"
          className="vdit-hero-diagram-mobile"
        >
          <img
            src="/daniel-flow-mobile.svg"
            alt=""
            width="75"
            height="150"
          />
        </div>
      </Container>

      {/* Proof strip — ruled cells below the hero */}
      <div className="vdit-proof-strip-wrapper">
        <Container size="3" px="6">
          <div className="vdit-proof-strip">
            {PROOF_ITEMS.map((item, i) => (
              <div key={i}>
                <p className="vdit-system-label vdit-proof-item-label">
                  {item.annotation}
                </p>
                <p className="vdit-proof-value">
                  {item.value}
                  {item.unit && (
                    <span className="vdit-proof-unit">
                      {item.unit}
                    </span>
                  )}
                </p>
                <p className="vdit-proof-desc">
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
