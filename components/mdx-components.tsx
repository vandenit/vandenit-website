import { format } from "date-fns";
import React from "react";
import Image from "next/image";
import { NewsletterSignup } from "./mdx/newsletter-signup";
import { BlockQuote } from "./mdx/block-quote";
import { SecurityAlert } from "./mdx/security-alert";
import { CodeExample } from "./mdx/code-example";

export const mdxComponents = {
  // Custom components for MDX
  pre: ({ children, ...props }) => (
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto" {...props}>
      {children}
    </pre>
  ),
  code: ({ children, ...props }) => (
    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
      {children}
    </code>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic" {...props}>
      {children}
    </blockquote>
  ),
  img: ({ src, alt, ...props }) => (
    <Image
      src={src || ''}
      alt={alt || ''}
      width={800}
      height={400}
      className="rounded-lg"
      {...props}
    />
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
