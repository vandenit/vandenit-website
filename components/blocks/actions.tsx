"use client";
import Link from "next/link";
import * as React from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { Button, Flex } from "@radix-ui/themes";

interface ActionItem {
  label: string;
  type: string;
  icon: boolean;
  link: string;
}

const PrimaryButton = ({ action, href }: { action: ActionItem; href?: string }) => (
  <Button
    size="3"
    variant="solid"
    color="blue"
    asChild={!!href}
    style={{ width: '100%' }}
    className="action-button"
  >
    {href ? (
      href.startsWith('mailto:') ? (
        <a href={href}>
          {action.label}
          {action.icon && <BiRightArrowAlt />}
        </a>
      ) : (
        <Link href={href}>
          {action.label}
          {action.icon && <BiRightArrowAlt />}
        </Link>
      )
    ) : (
      <>
        {action.label}
        {action.icon && <BiRightArrowAlt />}
      </>
    )}
  </Button>
);

const SecondaryButton = ({ action, href }: { action: ActionItem; href?: string }) => (
  <Button
    size="3"
    variant="outline"
    color="gray"
    asChild={!!href}
    style={{ width: '100%' }}
    className="action-button"
  >
    {href ? (
      href.startsWith('mailto:') ? (
        <a href={href}>
          {action.label}
          {action.icon && <BiRightArrowAlt />}
        </a>
      ) : (
        <Link href={href}>
          {action.label}
          {action.icon && <BiRightArrowAlt />}
        </Link>
      )
    ) : (
      <>
        {action.label}
        {action.icon && <BiRightArrowAlt />}
      </>
    )}
  </Button>
);

export const Actions = ({
  actions,
}: {
  actions: ActionItem[];
}) => {
  return (
    <Flex align="center" justify="center" direction={{ initial: "column", sm: "row" }} gap="3" width={{ initial: '100%', sm: 'auto' }}>
      {actions &&
        actions.map((action, index) => {
          const isPrimary = index === 0;
          if (action.type === "email") {
            const mailtoHref = action.link?.startsWith('mailto:') ? action.link : `mailto:${action.link || ''}`;
            return isPrimary
              ? <PrimaryButton key={index} action={action} href={mailtoHref} />
              : <SecondaryButton key={index} action={action} href={mailtoHref} />;
          }
          if (action.type === "button") {
            return isPrimary
              ? <PrimaryButton key={index} action={action} href={action.link || undefined} />
              : <SecondaryButton key={index} action={action} href={action.link || undefined} />;
          }
          if (action.type === "link" || action.type === "linkExternal") {
            return (
              <Button
                key={index}
                size="3"
                variant="ghost"
                color="gray"
                asChild
              >
                <Link href={action.link || "/"}>
                  {action.label}
                  {action.icon && <BiRightArrowAlt />}
                </Link>
              </Button>
            );
          }
          return null;
        })}
    </Flex>
  );
};