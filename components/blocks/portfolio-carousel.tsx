'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { Box, Text, Flex, Card, Button, Section, Heading, Badge, Container } from '@radix-ui/themes'
import { MarkdownRenderer } from '../markdown-renderer'

const INTERVAL = 10000;

interface PortfolioItem {
  title: string;
  content?: string;
  richContent?: string;
  image?: {
    src: string;
    alt: string;
  };
  technologies?: string[];
}

interface PortfolioBlockData {
  title?: string;
  portfolioId?: string;
  items: PortfolioItem[];
  _template: string;
}

export const PortfolioCarousel = ({
    data,
}: {
    data: PortfolioBlockData;
}) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const { items: portfolioItems } = data
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % portfolioItems.length)
    }
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + portfolioItems.length) % portfolioItems.length)
    }

    useEffect(() => {
        if (!portfolioItems?.length) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % portfolioItems.length)
        }, INTERVAL)
        return () => clearInterval(timer)
    }, [portfolioItems.length])

    if (!portfolioItems || portfolioItems.length === 0) return null;

    return (
        <Section size="3" mb="5" pb="10" className="section-alt">
            <Container size="3" px="6">
                <Heading as="h2" size={{ initial: '6', sm: '7' }} mb="6" align="center"
                    id={data.portfolioId}>
                    {data.title}
                </Heading>
                <Card className="card-elevated" size="4">
                    <Flex direction={{ initial: "column", sm: "row" }} gap="5">
                        {/* Portfolio Content — full width on mobile, flex-grow on desktop */}
                        <Box p="4" flexGrow="1" style={{ minWidth: 0 }}>
                            <Heading as="h3" size={{ initial: '4', sm: '5' }} mb="4">
                                {portfolioItems[currentSlide].title}
                            </Heading>
                            <Text as="div" color="gray" size="3" style={{ lineHeight: '1.6' }}>
                                {portfolioItems[currentSlide].content}
                            </Text>
                            {portfolioItems[currentSlide].richContent && (
                                <Box mt="3">
                                    <MarkdownRenderer content={portfolioItems[currentSlide].richContent} />
                                </Box>
                            )}
                            {portfolioItems[currentSlide].technologies && (
                                <Flex gap="2" mt="4" wrap="wrap">
                                    {portfolioItems[currentSlide].technologies.map((tech, i) => (
                                        <Badge key={i} color="blue" size="2" variant="soft">{tech}</Badge>
                                    ))}
                                </Flex>
                            )}
                        </Box>

                        {/* Image — hidden on mobile, 300x200 on desktop */}
                        {portfolioItems[currentSlide].image && (
                            <Box display={{ initial: 'none', sm: 'block' }} style={{ flexShrink: 0 }}>
                                <Flex justify="center" align="center" style={{ width: '300px', height: '200px', borderRadius: '8px', overflow: 'hidden' }}>
                                    <img
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        src={portfolioItems[currentSlide].image.src}
                                        alt={portfolioItems[currentSlide].image?.alt || portfolioItems[currentSlide].title}
                                    />
                                </Flex>
                            </Box>
                        )}
                    </Flex>

                    {/* Navigation + pagination */}
                    <Flex justify="center" align="center" gap="3" mt="5">
                        <Button variant="soft" color="gray" radius="full" onClick={prevSlide} size="2" style={{ minHeight: '44px', minWidth: '44px' }} aria-label="Previous slide">
                            <ChevronLeftIcon width="16" height="16" />
                        </Button>
                        <Flex gap="2" align="center">
                            {portfolioItems.map((_, i) => (
                                <Box
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    style={{
                                        width: i === currentSlide ? '24px' : '8px',
                                        height: '8px',
                                        borderRadius: '9999px',
                                        background: i === currentSlide ? 'var(--accent-9)' : 'var(--gray-6)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                />
                            ))}
                        </Flex>
                        <Button variant="soft" color="gray" radius="full" onClick={nextSlide} size="2" style={{ minHeight: '44px', minWidth: '44px' }} aria-label="Next slide">
                            <ChevronRightIcon width="16" height="16" />
                        </Button>
                    </Flex>
                </Card>
            </Container>
        </Section>
    )
}