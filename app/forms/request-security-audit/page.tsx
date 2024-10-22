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
                Fill out the form below to receive your free security audit preview.
                Then you can decide to purchase a full security audit and optionally hire us to fix any issues.
            </Text>
            <AuditForm />

        </Layout>
    )
}