'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { Box, Text, Flex, Card, Button, Quote, Blockquote, Section, Heading, Table, Grid } from '@radix-ui/themes'
import { Template } from 'tinacms'
import { PageBlocksTestimonials } from '../../tina/__generated__/types'
import { tinaField } from 'tinacms/dist/react'

const INTERVAL = 10000;

export const TestimonialCarousel = ({
    data,
}: {
    data: PageBlocksTestimonials;
}) => {

    return (
        <Section>
            <Heading as="h2" size="6" mb="4" data-tina-field={tinaField(data, 'title')} align="center"
                id={data.testimonialsId}>
                {data.title}
            </Heading>
            <Grid columns={{ initial: '1', sm: '3' }} gap="3">
                {data.items && data.items.map((testimonial, i) => (
                    <Card key={i}>
                        <Flex direction="column" justify="between" style={{ height: '100%' }} >
                            <Blockquote  data-tina-field={tinaField(testimonial, 'content')}>
                                {testimonial.content}
                            </Blockquote>
                            <Box mt="3">
                                <Text as="div" size="2" weight="bold" data-tina-field={tinaField(testimonial, 'author')}>{testimonial.author}</Text>
                                <Text as="div" size="2" color="gray" data-tina-field={tinaField(testimonial, 'role')}>{testimonial.role}</Text>
                            </Box>
                        </Flex>

                    </Card>
                ))}

            </Grid>
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
            label: "testimonials id",
            name: "testimonialsId"
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