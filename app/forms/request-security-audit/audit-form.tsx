"use client";
import { Box, Button, Callout, Card, Flex, Heading, Text, TextArea, TextField } from "@radix-ui/themes"
import Layout from "../../../components/layout/layout"
import * as Form from "@radix-ui/react-form";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { createAuditRequest } from "./actions/request-form-action";

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
type submitFn = (event: React.FormEvent<HTMLFormElement>) => void;

export const AuditForm = () => {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const result = await createAuditRequest(formData);
        console.log('Result from server:', result);
    };
    return (
        <Card>
            <Form.Root className="FormRoot"
                onSubmit={handleSubmit}
            >
                <Box mb="5">
                    <Form.Field className="FormField" name="email">
                        <Flex mb="1">
                            <Text
                                as="label"
                                htmlFor="email-field"
                                size="2"
                                weight="bold"
                            >
                                Email address
                            </Text>
                        </Flex>

                        <Form.Control asChild>
                            <TextField.Root
                                placeholder="Enter your email"
                                id="email-field"
                                type="email"
                                required
                            />
                        </Form.Control>
                        <Form.Message className="FormMessage" match="valueMissing">
                            <ValidationCallOut message="Please enter your email address" />
                        </Form.Message>
                        <Form.Message className="FormMessage" match="typeMismatch">
                            <ValidationCallOut message="Please enter a valid email address" />
                        </Form.Message>
                    </Form.Field>
                </Box>
                <Box mb="5">
                    <Form.Field className="FormField" name="website">
                        <Flex mb="1">
                            <Text
                                as="label"
                                htmlFor="website-field"
                                size="2"
                                weight="bold"
                            >
                                Your website
                            </Text>
                        </Flex>

                        <Form.Control asChild>
                            <TextField.Root
                                placeholder="Your website that we need to audit"
                                id="website-field"
                                type="url"
                                required
                            />
                        </Form.Control>
                        <Form.Message className="FormMessage" match="valueMissing">
                            <ValidationCallOut message="Please enter your website" />
                        </Form.Message>
                        <Form.Message className="FormMessage" match="typeMismatch">
                            <ValidationCallOut message="Please enter a valid url. eg: https://www.mywebsite.com" />
                        </Form.Message>
                    </Form.Field>
                </Box>
                <Box mb="5">
                    <Form.Field className="FormField" name="feedBack">
                        <Flex mb="1">
                            <Text
                                as="label"
                                htmlFor="feedback-field"
                                size="2"
                                weight="bold"
                            >
                                Extra feedback
                            </Text>
                        </Flex>

                        <Form.Control asChild>
                            <TextArea size="3" placeholder="Extra feedback/info about your project that we should know" id="feedback-field" />
                        </Form.Control>

                    </Form.Field>
                </Box>
                <Form.Submit asChild>
                    <Button>
                        Request my free security audit preview
                    </Button>
                </Form.Submit>
            </Form.Root>
        </Card>
    );
}