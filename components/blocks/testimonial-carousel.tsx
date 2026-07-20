'use client'

import React from 'react'
import { Box, Text, Flex, Card, Section, Heading, Grid, Container, Separator } from '@radix-ui/themes'

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
        <Section size="3" mb="5" pb="10" className="section-alt">
            <Container size="3" px="6">
                <Heading as="h2" size={{ initial: '6', sm: '7' }} mb="6" align="center"
                    id={data.testimonialsId}>
                    {data.title}
                </Heading>

                {/* Desktop: 3-column grid, Mobile: horizontal snap scroll */}
                <Box display={{ initial: 'none', sm: 'block' }}>
                    <Grid columns={{ initial: '1', sm: '3' }} gap="4">
                        {data.items && data.items.map((testimonial, i) => (
                            <TestimonialCard key={i} testimonial={testimonial} />
                        ))}
                    </Grid>
                </Box>

                <Box display={{ initial: 'block', sm: 'none' }}>
                    <div className="testimonials-scroll-container">
                        {data.items && data.items.map((testimonial, i) => (
                            <TestimonialCard key={i} testimonial={testimonial} />
                        ))}
                    </div>
                </Box>
            </Container>
        </Section>
    )
}

const TestimonialCard = ({ testimonial }: { testimonial: TestimonialItem }) => (
    <Card className="card-elevated" size="3">
        <Flex direction="column" justify="between" style={{ height: '100%' }}>
            <Box>
                <span className="quote-mark" aria-hidden="true">&ldquo;</span>
                <Text as="p" size="3" color="gray" style={{ lineHeight: '1.6' }}>
                    {testimonial.content}
                </Text>
            </Box>
            <Box mt="4">
                <Separator size="4" mb="3" />
                <Text as="div" size="3" weight="bold">{testimonial.author}</Text>
                <Text as="div" size="2" color="gray">{testimonial.role}</Text>
            </Box>
        </Flex>
    </Card>
);