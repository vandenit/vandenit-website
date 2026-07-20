"use client";
import React from "react";
import { Container, Section, Box } from "@radix-ui/themes";
import { MarkdownRenderer } from "../markdown-renderer";

interface ContentBlockData {
  body: string;
  color?: string;
  _template: string;
}

export const Content = ({ data }: { data: ContentBlockData }) => {
  return (
    <Section size="3" mb="5">
      <Container size="3" px="6">
        <Box style={{ maxWidth: '720px', margin: '0 auto' }}>
          <MarkdownRenderer content={data.body} />
        </Box>
      </Container>
    </Section>
  );
};