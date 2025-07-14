"use client";
import React from "react";
import { Container, Section } from "@radix-ui/themes";
import { MarkdownRenderer } from "../markdown-renderer";

interface ContentBlockData {
  body: string;
  color?: string;
  _template: string;
}

export const Content = ({ data }: { data: ContentBlockData }) => {
  return (
    <Section mt="0" mb="0" pt="0" pb="0">
      <Container>
        <MarkdownRenderer content={data.body} />
      </Container>
    </Section>
  );
};


