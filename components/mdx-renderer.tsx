"use client";
import React from 'react';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { mdxComponents } from './mdx-components';
import type { MDX } from 'contentlayer/core';

interface MDXRendererProps {
  mdxSource: MDX;
  className?: string;
}

export const MDXRenderer: React.FC<MDXRendererProps> = ({
  mdxSource,
  className
}) => {
  const MDXContent = useMDXComponent(mdxSource.code);

  return (
    <div className={className}>
      <MDXContent components={mdxComponents} />
    </div>
  );
};
