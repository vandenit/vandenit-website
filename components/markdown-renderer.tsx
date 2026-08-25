import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Heading, Text, Link, Code, Blockquote } from "@radix-ui/themes";
import Image from 'next/image';
import { WorkflowVisual } from './article/workflow-visual';
import { ScoreVisual } from './article/score-visual';


interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Check if a code block content is the workflow ASCII diagram
function isWorkflowDiagram(content: string): boolean {
  return content.includes('Hermes (GLM 5)') && content.includes('Claude Sonnet') && content.includes('screenshots');
}

// Check if a code block content is the score progression ASCII diagram
function isScoreDiagram(content: string): boolean {
  return content.includes('Desktop:') && content.includes('Content:') && content.includes('▓');
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
            <Heading as="h1" size="8" mb="4" mt="6" style={{ fontFamily: 'var(--vdit-font-display)', color: 'var(--vdit-color-text)' }}>
              {children}
            </Heading>
          ),
          h2: ({ children }: any) => {
            const text = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
            const slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            return (
              <Heading as="h2" id={slug || undefined} size="7" mb="3" mt="5" style={{ fontFamily: 'var(--vdit-font-display)', color: 'var(--vdit-color-text)' }}>
                {children}
              </Heading>
            );
          },
          h3: ({ children }: any) => (
            <Heading as="h3" size="6" mb="3" mt="4" style={{ fontFamily: 'var(--vdit-font-display)', color: 'var(--vdit-color-text)' }}>
              {children}
            </Heading>
          ),
          h4: ({ children }: any) => (
            <Heading as="h4" size="5" mb="2" mt="4" style={{ fontFamily: 'var(--vdit-font-display)', color: 'var(--vdit-color-text)' }}>
              {children}
            </Heading>
          ),
          h5: ({ children }: any) => (
            <Heading as="h5" size="4" mb="2" mt="3" style={{ fontFamily: 'var(--vdit-font-display)', color: 'var(--vdit-color-text)' }}>
              {children}
            </Heading>
          ),
          h6: ({ children }: any) => (
            <Heading as="h6" size="3" mb="2" mt="3" style={{ fontFamily: 'var(--vdit-font-display)', color: 'var(--vdit-color-text)' }}>
              {children}
            </Heading>
          ),
          
          // Paragraphs
          p: ({ children }: any) => (
            <Text as="p" size="3" mb="3" style={{ lineHeight: '1.6' }}>
              {children}
            </Text>
          ),

          // Links — internal links stay in same tab, external links open new tab
          a: ({ href, children }: any) => {
            const isInternal = href?.startsWith('/') || href?.startsWith('#');
            return (
              <Link href={href} {...(isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
                {children}
              </Link>
            );
          },
          
          // Code blocks (pre + code) — detect ASCII diagrams and replace with visuals
          pre: ({ children }: any) => {
            // Extract text content from the code block
            const codeChild = Array.isArray(children) ? children[0] : children;
            const codeContent = typeof codeChild?.props?.children === 'string' 
              ? codeChild.props.children 
              : Array.isArray(codeChild?.props?.children) 
                ? codeChild.props.children.join('') 
                : '';

            // Replace workflow ASCII diagram
            if (isWorkflowDiagram(codeContent)) {
              return <WorkflowVisual />;
            }

            // Replace score progression ASCII diagram
            if (isScoreDiagram(codeContent)) {
              return <ScoreVisual />;
            }

            // Normal code block
            return (
              <pre style={{
                backgroundColor: 'var(--gray-3)',
                padding: '1rem',
                borderRadius: '8px',
                overflowX: 'auto',
                maxWidth: '100%',
                marginBottom: '1rem',
                fontSize: '13px',
                WebkitOverflowScrolling: 'touch',
              }}>
                {children}
              </pre>
            );
          },
          code: ({ children, className, ...props }: any) => {
            const isBlock = className?.includes('language-');
            if (isBlock) {
              return (
                <Code size="2" style={{ wordBreak: 'normal' }}>
                  {children}
                </Code>
              );
            }
            // Inline code (including language-less fenced blocks rendered inside <pre>)
            return (
              <Code size="2" style={{ padding: '2px 4px', wordBreak: 'break-word' }}>
                {children}
              </Code>
            );
          },
          
          // Blockquotes
          blockquote: ({ children }: any) => (
            <Blockquote size="3" mb="3" style={{
              borderLeft: '4px solid var(--vdit-color-system)',
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
            <div style={{ overflowX: 'auto', maxWidth: '100%', marginBottom: '1rem', WebkitOverflowScrolling: 'touch' }}>
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