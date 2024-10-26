"use client";
import { Box, Button, Callout, Card, Flex, Heading, Text, TextArea, TextField } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { createAuditRequest } from "./actions/request-form-action";
import { FaHandHoldingHeart } from "react-icons/fa";

// Callout for validation errors
const ValidationCallOut = ({ message }: { message: string }) => (
    <Callout.Root color="red" mb="2" mt="2">
        <Callout.Icon>
            <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
            {message}
        </Callout.Text>
    </Callout.Root>
);

export const AuditForm = () => {
    // State to handle form submission status
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const result = await createAuditRequest(formData);
        console.log('Result from server:', result);

        // Set the form as submitted
        setIsSubmitted(true);
    };

    return (
        <Card>
            {isSubmitted ? (
                <Box p="6">
                    <Callout.Root>
                        <Callout.Icon>
                            <Flex align="center" justify="center" pt="4">
                                <FaHandHoldingHeart size="30" />

                            </Flex>

                        </Callout.Icon>
                        <Callout.Text>
                            <Heading size="3" weight="bold" mb="4">
                                Thank you for your request!
                            </Heading>
                            <Text size="2">
                                We have received your security audit request. Our team will review it and get back to you shortly.
                            </Text>
                        </Callout.Text>
                    </Callout.Root>

                </Box>
            ) : (
                <Form.Root className="FormRoot" onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <Box mb="5">
                        <Form.Field className="FormField" name="name">
                            <Flex mb="1">
                                <Text as="label" htmlFor="name-field" size="2" weight="bold">
                                    Name <Text as="span" color="red">*</Text>
                                </Text>
                            </Flex>

                            <Form.Control asChild>
                                <TextField.Root placeholder="Enter your name" id="name-field" required />
                            </Form.Control>
                            <Form.Message className="FormMessage" match="valueMissing">
                                <ValidationCallOut message="Please enter your name" />
                            </Form.Message>
                        </Form.Field>
                    </Box>

                    {/* Company Field (optional) */}
                    <Box mb="5">
                        <Form.Field className="FormField" name="company">
                            <Flex mb="1">
                                <Text as="label" htmlFor="company-field" size="2" weight="bold">
                                    Company
                                </Text>
                            </Flex>

                            <Form.Control asChild>
                                <TextField.Root placeholder="Enter your company name" id="company-field" />
                            </Form.Control>
                        </Form.Field>
                    </Box>

                    {/* Email Field */}
                    <Box mb="5">
                        <Form.Field className="FormField" name="email">
                            <Flex mb="1">
                                <Text as="label" htmlFor="email-field" size="2" weight="bold">
                                    Email address <Text as="span" color="red">*</Text>
                                </Text>
                            </Flex>

                            <Form.Control asChild>
                                <TextField.Root placeholder="Enter your email" id="email-field" type="email" required />
                            </Form.Control>
                            <Form.Message className="FormMessage" match="valueMissing">
                                <ValidationCallOut message="Please enter your email address" />
                            </Form.Message>
                            <Form.Message className="FormMessage" match="typeMismatch">
                                <ValidationCallOut message="Please enter a valid email address" />
                            </Form.Message>
                        </Form.Field>
                    </Box>

                    {/* Website Field */}
                    <Box mb="5">
                        <Form.Field className="FormField" name="website">
                            <Flex mb="1">
                                <Text as="label" htmlFor="website-field" size="2" weight="bold">
                                    Your website <Text as="span" color="red">*</Text>
                                </Text>
                            </Flex>

                            <Form.Control asChild>
                                <TextField.Root placeholder="Your website that we need to audit" id="website-field" type="url" required />
                            </Form.Control>
                            <Form.Message className="FormMessage" match="valueMissing">
                                <ValidationCallOut message="Please enter your website" />
                            </Form.Message>
                            <Form.Message className="FormMessage" match="typeMismatch">
                                <ValidationCallOut message="Please enter a valid url. eg: https://www.mywebsite.com" />
                            </Form.Message>
                        </Form.Field>
                    </Box>

                    {/* Feedback Field */}
                    <Box mb="5">
                        <Form.Field className="FormField" name="feedBack">
                            <Flex mb="1">
                                <Text as="label" htmlFor="feedback-field" size="2" weight="bold">
                                    Extra feedback
                                </Text>
                            </Flex>

                            <Form.Control asChild>
                                <TextArea size="3" placeholder="Extra feedback/info about your project that we should know" id="feedback-field" />
                            </Form.Control>
                        </Form.Field>
                    </Box>

                    {/* Submit Button */}
                    <Form.Submit asChild>
                        <Button>
                            Request my free security audit preview
                        </Button>
                    </Form.Submit>
                </Form.Root>
            )}
        </Card>
    );
}
