'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { Box, Text, Flex, Card, Button, Quote, Blockquote, Section, Heading } from '@radix-ui/themes'
import { Template } from 'tinacms'
import { PageBlocksTestimonials } from '../../tina/__generated__/types'
import { tinaField } from 'tinacms/dist/react'

const INTERVAL = 10000;

export const TestimonialCarousel = ({
    data,
}: {
    data: PageBlocksTestimonials;
}) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const { items: testimonials } = data
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    useEffect(() => {
        const timer = setInterval(nextSlide, INTERVAL) // Change slide every x seconds
        return () => clearInterval(timer)
    }, [])

    return (
        <Section>
            <Heading as="h2" size="6" mb="4" data-tina-field={tinaField(data, 'title')} align="center"
                id={data.key}>
                {data.title}
            </Heading>
            <Box width="100%" maxWidth="600px" m="auto" >

                <Card size="3">
                    <Flex justify="center" align="center" gap="4" width="100%"
                        direction={{ initial: "column", sm: "row" }}>
                        {/* Left Arrow */}
                        <Button variant="soft" color="gray" radius="full" onClick={prevSlide}>
                            <ChevronLeftIcon width="20" height="20" />
                        </Button>

                        {/* Testimonial Content */}
                        <Box >
                            <Blockquote>
                                {testimonials[currentSlide].content}
                            </Blockquote>
                            <Box mt="5">
                                <Text as="p" weight="bold">
                                    {testimonials[currentSlide].author}
                                </Text>
                                <Text as="p" color="gray">
                                    {testimonials[currentSlide].role}
                                </Text>
                            </Box>
                        </Box>

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

const defaultTestimonial = {
    author: "John Doe",
    role: "Software Engineer",
    content: "This is a testimonial quote. It can be used to highlight a customer's feedback or review."
};

export const testimonialsBlockSchema: Template = {
    name: "testimonials",
    label: "Testimonials",
    ui: {
        previewSrc: "/blocks/features.png",
        defaultItem: {
            title: "Testimonials",
            items: [defaultTestimonial, defaultTestimonial],
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
            label: "key",
            name: "key"
        },
        {
            type: "object",
            label: "Testimonial Items",
            name: "items",
            list: true,
            ui: {
                itemProps: (item) => {
                    return {
                        label: item?.title,
                    };
                },
                defaultItem: {
                    ...defaultTestimonial,
                },
            },
            fields: [
                {
                    type: "string",
                    ui: {
                        component: "textarea",
                    },
                    label: "Quote",
                    name: "content",
                },
                {
                    type: "string",
                    label: "Author",
                    name: "author",
                },
                {
                    type: "string",
                    label: "Role",
                    name: "role",
                },
            ],
        }
    ],
};