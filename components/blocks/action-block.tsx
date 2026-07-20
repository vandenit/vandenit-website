"use client";
import * as React from "react";
import { Actions } from "./actions";
import { Box, Flex, Section } from "@radix-ui/themes";

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
    <Section size="3" pb="8" pt="4">
      <Box>
        <Flex align="center" justify="center">
          <Actions actions={data.actions} />
        </Flex>
      </Box>
    </Section>
  );
};