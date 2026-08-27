"use client";
import Link from "next/link";
import * as React from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { Flex } from "@radix-ui/themes";

interface ActionItem {
  label: string;
  type: string;
  icon: boolean;
  link: string;
}

/**
 * "Discuss a project" / contact links = amber primary (human judgment).
 * Workflow / informational links = cobalt secondary.
 */
function isHumanAction(action: ActionItem): boolean {
  return /discuss/i.test(action.label) || /contact/i.test(action.link);
}

const PrimaryButton = ({ action, href }: { action: ActionItem; href?: string }) => {
  const inner = (
    <>
      {action.label}
      {action.icon && <BiRightArrowAlt aria-hidden="true" />}
    </>
  );
  const cls = "vdit-button vdit-button--primary action-button";
  if (!href) return <button className={cls}>{inner}</button>;
  if (href.startsWith('mailto:')) return <a href={href} className={cls}>{inner}</a>;
  return <Link href={href} className={cls}>{inner}</Link>;
};

const SecondaryButton = ({ action, href }: { action: ActionItem; href?: string }) => {
  const inner = (
    <>
      {action.label}
      {action.icon && <BiRightArrowAlt aria-hidden="true" />}
    </>
  );
  const cls = "vdit-button vdit-button--cobalt action-button";
  if (!href) return <button className={cls}>{inner}</button>;
  if (href.startsWith('mailto:')) return <a href={href} className={cls}>{inner}</a>;
  return <Link href={href} className={cls}>{inner}</Link>;
};

export const Actions = ({
  actions,
}: {
  actions: ActionItem[];
}) => {
  return (
    <Flex
      align="center"
      justify="center"
      direction={{ initial: "column", sm: "row" }}
      gap="3"
      width={{ initial: '100%', sm: 'auto' }}
    >
      {actions &&
        actions.map((action, index) => {
          const isHuman = isHumanAction(action) || index === 0;
          if (action.type === "email") {
            const mailtoHref = action.link?.startsWith('mailto:') ? action.link : `mailto:${action.link || ''}`;
            return isHuman
              ? <PrimaryButton key={index} action={action} href={mailtoHref} />
              : <SecondaryButton key={index} action={action} href={mailtoHref} />;
          }
          if (action.type === "button") {
            const isPrimary = isHumanAction(action);
            return isPrimary
              ? <PrimaryButton key={index} action={action} href={action.link || undefined} />
              : <SecondaryButton key={index} action={action} href={action.link || undefined} />;
          }
          if (action.type === "link" || action.type === "linkExternal") {
            return (
              <SecondaryButton key={index} action={action} href={action.link || "/"} />
            );
          }
          return null;
        })}
    </Flex>
  );
};
