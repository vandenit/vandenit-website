import { format } from "date-fns";
import React from "react";
import Image from "next/image";
import { Heading, Text, Link, Code, Blockquote, Box } from '@radix-ui/themes';
import { NewsletterSignup } from "./mdx/newsletter-signup";
import { BlockQuote } from "./mdx/block-quote";
import { SecurityAlert } from "./mdx/security-alert";
import { CodeExample } from "./mdx/code-example";

export const mdxComponents = {
  // Standard HTML elements with Radix UI styling
  h1: ({ children, ...props }) => (
    <Heading as="h1" size="8" mb="4" mt="6" {...props}>
      {children}
    </Heading>
  ),
  h2: ({ children, ...props }) => (
    <Heading as="h2" size="7" mb="3" mt="5" {...props}>
      {children}
    </Heading>
  ),
  h3: ({ children, ...props }) => (
    <Heading as="h3" size="6" mb="3" mt="4" {...props}>
      {children}
    </Heading>
  ),
  h4: ({ children, ...props }) => (
    <Heading as="h4" size="5" mb="2" mt="4" {...props}>
      {children}
    </Heading>
  ),
  h5: ({ children, ...props }) => (
    <Heading as="h5" size="4" mb="2" mt="3" {...props}>
      {children}
    </Heading>
  ),
  h6: ({ children, ...props }) => (
    <Heading as="h6" size="3" mb="2" mt="3" {...props}>
      {children}
    </Heading>
  ),
  p: ({ children, ...props }) => (
    <Text as="p" size="3" mb="3" style={{ lineHeight: '1.6' }} {...props}>
      {children}
    </Text>
  ),
  a: ({ href, children, ...props }) => (
    <Link href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </Link>
  ),
  pre: ({ children, ...props }) => (
    <Box mb="4" style={{
      backgroundColor: 'var(--gray-3)',
      padding: '1rem',
      borderRadius: '8px',
      overflow: 'auto'
    }} {...props}>
      {children}
    </Box>
  ),
  code: ({ children, ...props }) => (
    <Code size="2" style={{ padding: '2px 4px' }} {...props}>
      {children}
    </Code>
  ),
  blockquote: ({ children, ...props }) => (
    <Blockquote size="3" mb="3" style={{
      borderLeft: '4px solid var(--accent-9)',
      paddingLeft: '1rem',
      fontStyle: 'italic'
    }} {...props}>
      {children}
    </Blockquote>
  ),
  img: ({ src, alt, ...props }) => (
    <Box mb="4" style={{ textAlign: 'center' }}>
      <Image
        src={src || ''}
        alt={alt || ''}
        width={800}
        height={400}
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '8px'
        }}
        {...props}
      />
    </Box>
  ),
  ul: ({ children, ...props }) => (
    <ul style={{
      marginBottom: '0.75rem',
      paddingLeft: '1.5rem',
      lineHeight: '1.6'
    }} {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol style={{
      marginBottom: '0.75rem',
      paddingLeft: '1.5rem',
      lineHeight: '1.6'
    }} {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li style={{ marginBottom: '0.25rem' }} {...props}>
      <Text size="3">{children}</Text>
    </li>
  ),
  // Custom components for specific use cases
  DateTime: ({ format: formatType = "local" }: { format?: string }) => {
    const dt = React.useMemo(() => {
      return new Date();
    }, []);

    switch (formatType) {
      case "iso":
        return <span>{format(dt, "yyyy-MM-dd")}</span>;
      case "utc":
        return <span>{format(dt, "eee, dd MMM yyyy HH:mm:ss OOOO")}</span>;
      case "local":
        return <span>{format(dt, "P")}</span>;
      default:
        return <span>{format(dt, "P")}</span>;
    }
  },
  // Custom security blog components
  NewsletterSignup,
  BlockQuote,
  SecurityAlert,
  CodeExample,
};
