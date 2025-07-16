"use client";
import React from 'react';
import { Box, Card, Flex, Text, Avatar, Blockquote } from '@radix-ui/themes';
import { QuoteIcon } from '@radix-ui/react-icons';

interface BlockQuoteProps {
  authorName?: string;
  authorTitle?: string;
  authorAvatar?: string;
  children: React.ReactNode;
}

export const BlockQuote: React.FC<BlockQuoteProps> = ({
  authorName,
  authorTitle,
  authorAvatar,
  children
}) => {
  return (
    <Card size="3" style={{ marginBottom: '2rem' }}>
      <Box p="4">
        <Flex direction="column" gap="4">
          <Box style={{ position: 'relative' }}>
            <Box style={{
              position: 'absolute',
              top: '-8px',
              left: '-8px',
              backgroundColor: 'var(--accent-3)',
              borderRadius: '50%',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <QuoteIcon width="16" height="16" color="var(--accent-11)" />
            </Box>
            
            <Blockquote size="4" style={{
              fontStyle: 'italic',
              borderLeft: 'none',
              paddingLeft: '1rem',
              margin: 0
            }}>
              {children}
            </Blockquote>
          </Box>
          
          {authorName && (
            <Flex align="center" gap="3" justify="end">
              {authorAvatar && (
                <Avatar
                  src={authorAvatar}
                  alt={authorName}
                  size="2"
                  radius="full"
                  fallback={authorName[0]}
                />
              )}
              <Box>
                <Text size="3" weight="bold">
                  {authorName}
                </Text>
                {authorTitle && (
                  <Text size="2" color="gray" style={{ display: 'block' }}>
                    {authorTitle}
                  </Text>
                )}
              </Box>
            </Flex>
          )}
        </Flex>
      </Box>
    </Card>
  );
};
