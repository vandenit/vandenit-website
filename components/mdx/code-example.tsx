"use client";
import React, { useState } from 'react';
import { Box, Card, Flex, Text, Button, Code, Tabs } from '@radix-ui/themes';
import { CopyIcon, CheckIcon } from '@radix-ui/react-icons';

interface CodeExampleProps {
  title?: string;
  language?: string;
  vulnerable?: string;
  secure?: string;
  children?: string;
}

export const CodeExample: React.FC<CodeExampleProps> = ({
  title,
  language = 'javascript',
  vulnerable,
  secure,
  children
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // If we have both vulnerable and secure code, show tabs
  if (vulnerable && secure) {
    return (
      <Card size="3" style={{ marginBottom: '2rem' }}>
        <Box p="4">
          {title && (
            <Text size="4" weight="bold" style={{ display: 'block', marginBottom: '1rem' }}>
              {title}
            </Text>
          )}
          
          <Tabs.Root defaultValue="vulnerable">
            <Tabs.List>
              <Tabs.Trigger value="vulnerable" color="red">
                ❌ Vulnerable Code
              </Tabs.Trigger>
              <Tabs.Trigger value="secure" color="green">
                ✅ Secure Code
              </Tabs.Trigger>
            </Tabs.List>
            
            <Box pt="3">
              <Tabs.Content value="vulnerable">
                <Box style={{ position: 'relative' }}>
                  <pre style={{
                    backgroundColor: 'var(--red-2)',
                    border: '1px solid var(--red-6)',
                    padding: '1rem',
                    borderRadius: '8px',
                    overflow: 'auto',
                    margin: 0
                  }}>
                    <Code size="2" style={{ whiteSpace: 'pre' }}>
                      {vulnerable}
                    </Code>
                  </pre>
                  <Button
                    size="1"
                    variant="ghost"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px'
                    }}
                    onClick={() => copyToClipboard(vulnerable)}
                  >
                    {copied ? <CheckIcon width="14" height="14" /> : <CopyIcon width="14" height="14" />}
                  </Button>
                </Box>
              </Tabs.Content>
              
              <Tabs.Content value="secure">
                <Box style={{ position: 'relative' }}>
                  <pre style={{
                    backgroundColor: 'var(--green-2)',
                    border: '1px solid var(--green-6)',
                    padding: '1rem',
                    borderRadius: '8px',
                    overflow: 'auto',
                    margin: 0
                  }}>
                    <Code size="2" style={{ whiteSpace: 'pre' }}>
                      {secure}
                    </Code>
                  </pre>
                  <Button
                    size="1"
                    variant="ghost"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px'
                    }}
                    onClick={() => copyToClipboard(secure)}
                  >
                    {copied ? <CheckIcon width="14" height="14" /> : <CopyIcon width="14" height="14" />}
                  </Button>
                </Box>
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </Box>
      </Card>
    );
  }

  // Single code block
  const codeContent = children || vulnerable || secure || '';
  
  return (
    <Card size="3" style={{ marginBottom: '2rem' }}>
      <Box p="4">
        {title && (
          <Text size="4" weight="bold" style={{ display: 'block', marginBottom: '1rem' }}>
            {title}
          </Text>
        )}
        
        <Box style={{ position: 'relative' }}>
          <pre style={{
            backgroundColor: 'var(--gray-3)',
            border: '1px solid var(--gray-6)',
            padding: '1rem',
            borderRadius: '8px',
            overflow: 'auto',
            margin: 0
          }}>
            <Code size="2" style={{ whiteSpace: 'pre' }}>
              {codeContent}
            </Code>
          </pre>
          <Button
            size="1"
            variant="ghost"
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px'
            }}
            onClick={() => copyToClipboard(codeContent)}
          >
            {copied ? <CheckIcon width="14" height="14" /> : <CopyIcon width="14" height="14" />}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};
