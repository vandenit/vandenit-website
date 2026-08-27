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
    <Section size="2" mb="3" className="vdit-content-section">
      <Container size="3" px="6">
        <Box className="vdit-article-content vdit-reading-measure">
          <MarkdownRenderer content={data.body} />
        </Box>
      </Container>
    </Section>
  );
};