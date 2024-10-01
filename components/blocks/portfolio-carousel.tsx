'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { Box, Text, Flex, Card, Button, Quote, Blockquote, Section, Heading, Badge } from '@radix-ui/themes'
import { Template } from 'tinacms'
import { PageBlocksPortfolio } from '../../tina/__generated__/types'
import { tinaField } from 'tinacms/dist/react'
import Image from 'next/image'
import { TinaMarkdown } from 'tinacms/dist/rich-text'

const INTERVAL = 10000;

export const PortfolioCarousel = ({
    data,
}: {
    data: PageBlocksPortfolio;
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
            <Heading as="h2" size="6" mb="4" data-tina-field={tinaField(data, 'title')} align="center"
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
                                <Heading as="h3" size={{ initial: "3", sm: "4", md: "5" }} mb="4" data-tina-field={tinaField(portfolioItems[currentSlide], 'title')}>
                                    {portfolioItems[currentSlide].title}
                                </Heading>
                                <Text as="div" color="gray" data-tina-field={tinaField(portfolioItems[currentSlide], 'richContent')}>
                                    {portfolioItems[currentSlide].content}
                                    {portfolioItems[currentSlide].richContent && (
                                        <TinaMarkdown content={portfolioItems[currentSlide].richContent} />
                                    )}
                                </Text>
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

const defaultPortfolioItem = {
    title: "My project",
    content: "This is a project I worked on and it was great"
};

export const portfolioBlockSchema: Template = {
    name: "portfolio",
    label: "Portfolio",
    ui: {
        previewSrc: "/blocks/features.png",
        defaultItem: {
            title: "Portfolio",
            items: [defaultPortfolioItem],
        },
    },
    fields: [
        {
            type: "string",
            label: "Title",
            name: "title"
        },
        {
            type: "string",
            label: "id",
            name: "portfolioId"
        },
        {
            type: "object",
            label: "Portfolio Items",
            name: "items",
            list: true,
            ui: {
                itemProps: (item) => {
                    return {
                        label: item?.title,
                    };
                },
                defaultItem: {
                    ...defaultPortfolioItem,
                },
            },
            fields: [
                {
                    type: "string",
                    label: "Title",
                    name: "title",
                },
                {
                    type: "string",
                    label: "content",
                    name: "content",
                },
                {
                    type: "rich-text",
                    label: "content",
                    name: "richContent",
                },
                {
                    type: "object",
                    label: "Image",
                    name: "image",
                    fields: [
                        {
                            name: "src",
                            label: "Image Source",
                            type: "image",
                        },
                        {
                            name: "alt",
                            label: "Alt Text",
                            type: "string",
                        }
                    ]
                },
                {
                    type: "string",
                    label: "Technologies",
                    name: "technologies",
                    list: true
                }
            ],
        }
    ],
};