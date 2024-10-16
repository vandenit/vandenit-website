"use client";
import Link from "next/link";
import * as React from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { PageBlocksActionsActions, PageBlocksHeroActions } from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import { useLayout } from "../layout/layout-context";
import { Box, Button, Flex, Grid } from "@radix-ui/themes";
import styles from './Actions.module.css';

const ActionButton = ({
  action,
  onClick,
}: {
  action: PageBlocksHeroActions | PageBlocksActionsActions;
  onClick?: () => void;
}) => (
  <Button
    size={{ sm: '4' }} variant="classic"
    mb={{ initial: '4', sm: '0' }}
    ml={{ initial: '0', sm: '2' }}
    mr={{ initial: '0', sm: '2' }}
    data-tina-field={tinaField(action)}
    onClick={onClick ? onClick : undefined}
    className={styles.actionButton}
  >
    {action.label}
    {action.icon && (
      <BiRightArrowAlt />
    )}
  </Button>
);

export const Actions = ({
  actions,
}: {
  actions: PageBlocksHeroActions[] | PageBlocksActionsActions[];
}) => {
  const { theme } = useLayout();
  const openEmail = (email: string) => () => {
    window.location.href = `mailto:${email}`;
  };
  return (
    <Flex align="center" justify="center" direction={{ initial: "column", sm: "row" }}>
      {actions &&
        actions.map(function (action, index) {
          let element = null;
          if (action.type === "button") {
            element = (
              <Box key={index}>
                <Link key={index} href={action.link ? action.link : "/"}>
                  <ActionButton action={action} />
                </Link>
              </Box>
            );
          }
          else if (action.type === "link" || action.type === "linkExternal") {
            element = (
              <Link
                key={index}
                href={action.link ? action.link : "/"}
                data-tina-field={tinaField(action)}
              >
                {action.label}
                {action.icon && (
                  <BiRightArrowAlt />
                )}
              </Link>
            );
          }
          else if (action.type === "email") {
            element = (
              <Box key={index}>
                <ActionButton onClick={openEmail(action.link)} action={action} />
              </Box>
            );
          }
          return element;
        })}
    </Flex >
  );
};
