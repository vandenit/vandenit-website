"use client";
import React from 'react';
import { Box, Callout, Flex, Text } from '@radix-ui/themes';
import { 
  ExclamationTriangleIcon, 
  InfoCircledIcon, 
  CheckCircledIcon,
  CrossCircledIcon 
} from '@radix-ui/react-icons';

interface SecurityAlertProps {
  type?: 'warning' | 'info' | 'success' | 'error';
  title?: string;
  children: React.ReactNode;
}

export const SecurityAlert: React.FC<SecurityAlertProps> = ({
  type = 'warning',
  title,
  children
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <ExclamationTriangleIcon width="16" height="16" />;
      case 'info':
        return <InfoCircledIcon width="16" height="16" />;
      case 'success':
        return <CheckCircledIcon width="16" height="16" />;
      case 'error':
        return <CrossCircledIcon width="16" height="16" />;
      default:
        return <ExclamationTriangleIcon width="16" height="16" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'warning':
        return 'orange';
      case 'info':
        return 'blue';
      case 'success':
        return 'green';
      case 'error':
        return 'red';
      default:
        return 'orange';
    }
  };

  return (
    <Box mb="4">
      <Callout.Root color={getColor()} size="2">
        <Callout.Icon>
          {getIcon()}
        </Callout.Icon>
        <Callout.Text>
          {title && (
            <Text weight="bold" style={{ display: 'block', marginBottom: '0.5rem' }}>
              {title}
            </Text>
          )}
          {children}
        </Callout.Text>
      </Callout.Root>
    </Box>
  );
};
