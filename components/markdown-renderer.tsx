import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Heading, Text, Link, Code, Blockquote } from '@radix-ui/themes';
import Image from 'next/image';


interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className 
}) => {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Headings
          h1: ({ children }: any) => (
            <Heading as="h1" size="8" mb="4" mt="6">
              {children}
            </Heading>
          ),
          h2: ({ children }: any) => (
            <Heading as="h2" size="7" mb="3" mt="5">
              {children}
            </Heading>
          ),
          h3: ({ children }: any) => (
            <Heading as="h3" size="6" mb="3" mt="4">
              {children}
            </Heading>
          ),
          h4: ({ children }: any) => (
            <Heading as="h4" size="5" mb="2" mt="4">
              {children}
            </Heading>
          ),
          h5: ({ children }: any) => (
            <Heading as="h5" size="4" mb="2" mt="3">
              {children}
            </Heading>
          ),
          h6: ({ children }: any) => (
            <Heading as="h6" size="3" mb="2" mt="3">
              {children}
            </Heading>
          ),
          
          // Paragraphs
          p: ({ children }: any) => (
            <Text as="p" size="3" mb="3" style={{ lineHeight: '1.6' }}>
              {children}
            </Text>
          ),

          // Links
          a: ({ href, children }: any) => (
            <Link href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </Link>
          ),
          
          // Code
          code: ({ children, className, ...props }: any) => {
            const isInline = !className?.includes('language-');
            if (isInline) {
              return (
                <Code size="2" style={{ padding: '2px 4px' }}>
                  {children}
                </Code>
              );
            }
            return (
              <pre style={{
                backgroundColor: 'var(--gray-3)',
                padding: '1rem',
                borderRadius: '8px',
                overflow: 'auto',
                marginBottom: '1rem'
              }}>
                <Code size="2">
                  {children}
                </Code>
              </pre>
            );
          },
          
          // Blockquotes
          blockquote: ({ children }: any) => (
            <Blockquote size="3" mb="3" style={{
              borderLeft: '4px solid var(--accent-9)',
              paddingLeft: '1rem',
              fontStyle: 'italic'
            }}>
              {children}
            </Blockquote>
          ),

          // Lists
          ul: ({ children }: any) => (
            <ul style={{
              marginBottom: '1rem',
              paddingLeft: '1.5rem',
              lineHeight: '1.6'
            }}>
              {children}
            </ul>
          ),
          ol: ({ children }: any) => (
            <ol style={{
              marginBottom: '1rem',
              paddingLeft: '1.5rem',
              lineHeight: '1.6'
            }}>
              {children}
            </ol>
          ),
          li: ({ children }: any) => (
            <li style={{ marginBottom: '0.5rem' }}>
              <Text size="3">{children}</Text>
            </li>
          ),

          // Images
          img: ({ src, alt }: any) => {
            if (!src) return null;
            return (
              <div style={{ margin: '1rem 0', textAlign: 'center' }}>
                <Image
                  src={src}
                  alt={alt || ''}
                  width={800}
                  height={400}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '8px'
                  }}
                />
              </div>
            );
          },
          
          // Horizontal rule
          hr: () => (
            <hr style={{ 
              border: 'none',
              borderTop: '1px solid var(--gray-6)',
              margin: '2rem 0'
            }} />
          ),
          
          // Tables
          table: ({ children }: any) => (
            <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid var(--gray-6)'
              }}>
                {children}
              </table>
            </div>
          ),
          th: ({ children }: any) => (
            <th style={{
              padding: '0.75rem',
              backgroundColor: 'var(--gray-3)',
              border: '1px solid var(--gray-6)',
              textAlign: 'left'
            }}>
              <Text size="3" weight="bold">{children}</Text>
            </th>
          ),
          td: ({ children }: any) => (
            <td style={{
              padding: '0.75rem',
              border: '1px solid var(--gray-6)'
            }}>
              <Text size="3">{children}</Text>
            </td>
          ),


        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
