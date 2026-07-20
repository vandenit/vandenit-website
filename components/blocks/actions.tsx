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

const PrimaryButton = ({ action, onClick }: { action: ActionItem; onClick?: () => void }) => (
  <Button
    size="3"
    variant="solid"
    color="blue"
    onClick={onClick ? onClick : undefined}
    asChild={!!action.link}
    style={{ width: '100%' }}
    className="action-button"
  >
    {action.link ? (
      <Link href={action.link}>
        {action.label}
        {action.icon && <BiRightArrowAlt />}
      </Link>
    ) : (
      <>
        {action.label}
        {action.icon && <BiRightArrowAlt />}
      </>
    )}
  </Button>
);

const SecondaryButton = ({ action, onClick }: { action: ActionItem; onClick?: () => void }) => (
  <Button
    size="3"
    variant="outline"
    color="gray"
    onClick={onClick ? onClick : undefined}
    asChild={!!action.link}
    style={{ width: '100%' }}
    className="action-button"
  >
    {action.link ? (
      <Link href={action.link}>
        {action.label}
        {action.icon && <BiRightArrowAlt />}
      </Link>
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
  const openEmail = (email: string) => () => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <Flex align="center" justify="center" direction={{ initial: "column", sm: "row" }} gap="3" width={{ initial: '100%', sm: 'auto' }}>
      {actions &&
        actions.map((action, index) => {
          const isPrimary = index === 0;
          if (action.type === "button") {
            return isPrimary
              ? <PrimaryButton key={index} action={action} />
              : <SecondaryButton key={index} action={action} />;
          }
          if (action.type === "email") {
            return isPrimary
              ? <PrimaryButton key={index} action={action} onClick={openEmail(action.link)} />
              : <SecondaryButton key={index} action={action} onClick={openEmail(action.link)} />;
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