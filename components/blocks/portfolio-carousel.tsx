'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { Box, Text, Flex, Card, Button, Section, Heading, Badge } from '@radix-ui/themes'
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
        const timer = setInterval(nextSlide, INTERVAL) // Change slide every x seconds
        return () => clearInterval(timer)
    }, [])

    return (
        <Section>
            <Heading as="h2" size="6" mb="4" align="center"
                id={data.portfolioId}>
                {data.title}
            </Heading>
            <Box width="100%" m="auto" >

                <Card size="3">
                    <Flex justify="center" align="center" gap="4" width="100%"
                        direction={{ initial: "column", sm: "row" }}>
                        {/* Left Arrow */}
                        <Button variant="soft" color="gray" radius="full" onClick={prevSlide}>
                            <ChevronLeftIcon width="20" height="20" />
                        </Button>

                        {/* Portfolio Content */}
                        <Flex direction={{ initial: "column", sm: "row" }}>
                            <Box p="2">
                                <Heading as="h3" size={{ initial: "3", sm: "4", md: "5" }} mb="4">
                                    {portfolioItems[currentSlide].title}
                                </Heading>
                                <Text as="div" color="gray">
                                    {portfolioItems[currentSlide].content}
                                </Text>
                                {portfolioItems[currentSlide].richContent && (
                                    <MarkdownRenderer content={portfolioItems[currentSlide].richContent} />
                                )}
                                {portfolioItems[currentSlide].technologies && (
                                    <Flex gap="2" mt="2">
                                        {portfolioItems[currentSlide].technologies.map((tech, i) => (
                                            <Badge key={i} color="gray" size="2">{tech}</Badge>
                                        ))}
                                    </Flex>
                                )}
                            </Box>
                            {portfolioItems[currentSlide].image && (
                                <Flex justify="center" align="center" mt={{ initial: "5", sm: "0" }}>
                                    <img style={{ width: "200px", height: "auto", objectFit: "contain" }}
                                        src={portfolioItems[currentSlide].image.src}
                                    />
                                </Flex>
                            )}
                        </Flex>

                        {/* Right Arrow */}
                        <Button variant="soft" color="gray" radius="full" onClick={nextSlide}>
                            <ChevronRightIcon width="20" height="20" />
                        </Button>
                    </Flex>
                </Card>
            </Box>
        </Section>
    )
}

