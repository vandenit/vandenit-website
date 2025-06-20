'use client'

import React from 'react'
import { Box, Text, Flex, Card, Blockquote, Section, Heading, Grid } from '@radix-ui/themes'

interface TestimonialItem {
  content: string;
  author: string;
  role: string;
}

interface TestimonialsBlockData {
  title?: string;
  testimonialsId?: string;
  items: TestimonialItem[];
  _template: string;
}

export const TestimonialCarousel = ({
    data,
}: {
    data: TestimonialsBlockData;
}) => {

    return (
        <Section>
            <Heading as="h2" size="6" mb="4" align="center"
                id={data.testimonialsId}>
                {data.title}
            </Heading>
            <Grid columns={{ initial: '1', sm: '3' }} gap="3">
                {data.items && data.items.map((testimonial, i) => (
                    <Card key={i}>
                        <Flex direction="column" justify="between" style={{ height: '100%' }} >
                            <Blockquote>
                                {testimonial.content}
                            </Blockquote>
                            <Box mt="3">
                                <Text as="div" size="2" weight="bold">{testimonial.author}</Text>
                                <Text as="div" size="2" color="gray">{testimonial.role}</Text>
                            </Box>
                        </Flex>

                    </Card>
                ))}

            </Grid>
        </Section>
    )
}

