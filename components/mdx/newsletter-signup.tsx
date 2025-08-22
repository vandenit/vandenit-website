"use client";
import React, { useState } from 'react';
import { Box, Card, Flex, Heading, Text, TextField, Button, Callout } from '@radix-ui/themes';
import { EnvelopeClosedIcon, CheckIcon } from '@radix-ui/react-icons';

interface NewsletterSignupProps {
  placeholder?: string;
  buttonText?: string;
  disclaimer?: React.ReactNode;
  children?: React.ReactNode;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  disclaimer,
  children
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsLoading(false);
    setEmail('');
  };

  if (isSubmitted) {
    return (
      <Card size="3" style={{ marginBottom: '2rem' }}>
        <Flex direction="column" align="center" gap="3" p="4">
          <Box style={{ 
            backgroundColor: 'var(--green-3)', 
            borderRadius: '50%', 
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckIcon width="24" height="24" color="var(--green-11)" />
          </Box>
          <Heading as="h3" size="5" align="center">
            Thank you for subscribing!
          </Heading>
          <Text size="3" color="gray" align="center">
            We'll keep you updated with our latest security insights and tips.
          </Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card size="3" style={{ marginBottom: '2rem' }}>
      <Box p="4">
        {children && (
          <Box mb="4">
            {children}
          </Box>
        )}
        
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <Flex gap="2">
              <TextField.Root
                placeholder={placeholder}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ flex: 1 }}
              >
                <TextField.Slot>
                  <EnvelopeClosedIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
              
              <Button 
                type="submit" 
                disabled={!email || isLoading}
                loading={isLoading}
              >
                {buttonText}
              </Button>
            </Flex>
            
            {disclaimer && (
              <Text size="2" color="gray">
                {disclaimer}
              </Text>
            )}
          </Flex>
        </form>
      </Box>
    </Card>
  );
};
