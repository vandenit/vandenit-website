"use client";
import * as React from "react";
import { Actions } from "./actions";
import { Box, Flex } from "@radix-ui/themes";

interface ActionsBlockData {
  actions: Array<{
    label: string;
    type: string;
    icon: boolean;
    link: string;
  }>;
  _template: string;
}

export const ActionsBlock = ({ data }: { data: ActionsBlockData }) => {

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


