import React from "react";
import Link from "next/link";
import { Container, Flex, Section, Text } from "@radix-ui/themes";
import { BiRightArrowAlt } from "react-icons/bi";

interface ContactAction {
  label: string;
  type: string;
  icon: boolean;
  link: string;
}

interface ContactHeroData {
  tagline?: string;
  headline?: string;
  text?: string;
  text2?: string;
  actions?: ContactAction[];
  color?: string;
  _template: string;
}

/**
 * Contact page hero — quiet and direct.
 * No large workflow diagram, no proof strip.
 * One amber contact action (mailto:filip@vandenit.be).
 * A subtle cobalt system rule anchors the section.
 */
export const ContactHero = ({ data }: { data: ContactHeroData }) => {
  return (
    <Section
      size="2"
      pt={{ initial: "6", sm: "9" }}
      pb="4"
      className="vdit-content-section vdit-contact-hero-section"
    >
      <Container size="3" px="6">
        <div className="vdit-contact-hero">
          {/* Subtle cobalt system rule */}
          <div className="vdit-contact-rule" aria-hidden="true" />

          {/* Kicker */}
          <p className="vdit-kicker vdit-contact-kicker">
            <span>Contact</span>
            <span className="vdit-kicker-tail">
              <span aria-hidden="true">&nbsp;·&nbsp;</span>
              <span className="vdit-nowrap">Let&rsquo;s Talk</span>
            </span>
          </p>

          {/* H1 */}
          {data.tagline && (
            <h1 className="vdit-contact-title">{data.tagline}</h1>
          )}

          {/* Lead text */}
          {data.headline && (
            <Text as="p" size={{ initial: "3", sm: "4" }} className="vdit-contact-lead">
              {data.headline}
            </Text>
          )}

          {/* Amber contact action */}
          {data.actions && (
            <Flex
              gap="3"
              direction={{ initial: "column", xs: "row" }}
              wrap="wrap"
              className="vdit-contact-actions"
            >
              {data.actions.map((action, i) => {
                const href =
                  action.type === "email"
                    ? action.link?.startsWith("mailto:")
                      ? action.link
                      : `mailto:${action.link || ""}`
                    : action.link || "/";

                const className = "vdit-button vdit-button--primary";

                if (href.startsWith("mailto:")) {
                  return (
                    <a key={i} href={href} className={className}>
                      {action.label}
                      {action.icon && <BiRightArrowAlt aria-hidden="true" />}
                    </a>
                  );
                }
                return (
                  <Link key={i} href={href} className={className}>
                    {action.label}
                    {action.icon && <BiRightArrowAlt aria-hidden="true" />}
                  </Link>
                );
              })}
            </Flex>
          )}
        </div>
      </Container>
    </Section>
  );
};