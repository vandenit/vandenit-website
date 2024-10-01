"use client";
import * as React from "react";
import type { Template } from "tinacms";
import { Actions } from "./actions";
import { Box, Flex } from "@radix-ui/themes";
import { PageBlocksActions } from "../../tina/__generated__/types";

export const ActionsBlock = ({ data }: { data: PageBlocksActions }) => {

  return (
    <Box  pb="2" pt="2">
      <Flex mt="6" align="center" justify="center">
          <Actions
            actions={data.actions}
          />
        </Flex>
    </Box>
  );
};

export const actionField = {
    label: "Actions",
    name: "actions",
    type: "object",
    list: true,
    ui: {
      defaultItem: {
        label: "Action Label",
        type: "button",
        icon: true,
        link: "/",
      },
      itemProps: (item) => ({ label: item.label }),
    },
    fields: [
      {
        label: "Label",
        name: "label",
        type: "string",
      },
      {
        label: "Type",
        name: "type",
        type: "string",
        options: [
          { label: "Button", value: "button" },
          { label: "Link", value: "link" },
          { label: "Email", value: "email" },
        ],
      },
      {
        label: "Icon",
        name: "icon",
        type: "boolean",
      },
      {
        label: "Link",
        name: "link",
        type: "string",
      },
    ],
  };

export const actionsBlockSchema: Template = {
  name: "actions",
  label: "Actions",
  ui: {
    previewSrc: "/blocks/hero.png"
  },
  fields: [
    actionField as any
  ],
};
