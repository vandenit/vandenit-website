import { Heading, Text } from "@radix-ui/themes"
import Layout from "../../../components/layout/layout"
import { AuditForm } from "./audit-form"

type Inputs = {
    example: string
    exampleRequired: string
}


export default function requestSecurityAuditForm() {

    return (
        <Layout>
            <Heading as="h1" mb="5" >
                Request FREE security audit preview
            </Heading>
            <Text as="p" mb="5">
                Protect your website with a fast, expert-driven audit. Fill out the form to receive your free security audit preview. Based on the results, you can decide to upgrade to a full audit, with actionable insights to secure your site.
            </Text>
            <AuditForm />

        </Layout>
    )
}