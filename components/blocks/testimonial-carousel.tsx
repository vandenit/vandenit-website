'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { Box, Text, Flex, Card, Button } from '@radix-ui/themes'
import { Template } from 'tinacms'
import { PageBlocksTestimonials } from '../../tina/__generated__/types'


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
        const timer = setInterval(nextSlide, 5000) // Change slide every 5 seconds
        return () => clearInterval(timer)
    }, [])

    return (
        <Box position="relative" width="100%" maxWidth="600px" m="auto">
            <Card size="3" style={{ height: '200px' }}>
                <Flex direction="column" justify="between" height="100%">
                    <Text as="p" size="3">
                        "{testimonials[currentSlide].content}"
                    </Text>
                    <Box>
                        <Text as="p" weight="bold">
                            {testimonials[currentSlide].author}
                        </Text>
                        <Text as="p" color="gray">
                            {testimonials[currentSlide].role}
                        </Text>
                    </Box>
                </Flex>
            </Card>

            <Flex justify="between" position="absolute" top="50%" left="0" right="0" style={{ transform: 'translateY(-50%)' }}>
                <Button variant="soft" color="gray" radius="full" onClick={prevSlide}>
                    <ChevronLeftIcon width="20" height="20" />
                </Button>
                <Button variant="soft" color="gray" radius="full" onClick={nextSlide}>
                    <ChevronRightIcon width="20" height="20" />
                </Button>
            </Flex>
        </Box>
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