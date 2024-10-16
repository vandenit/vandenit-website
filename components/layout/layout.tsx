import React, { PropsWithChildren } from "react";
import { LayoutProvider } from "./layout-context";
import client from "../../tina/__generated__/client";
import Header from "../nav/header";
import Footer from "../nav/footer";
import { Box, Container, Flex } from "@radix-ui/themes";

type LayoutProps = PropsWithChildren & {
  rawPageData?: any;
};

export default async function Layout({ children, rawPageData }: LayoutProps) {
  const { data: globalData } = await client.queries.global({
    relativePath: "index.json",
  });

  return (
    <LayoutProvider globalSettings={globalData.global} pageData={rawPageData}>
      <Flex direction="column" minHeight="100vh"  >
        <Header />
        <Box flexGrow="1" >
          <main>
            <Container mx="5" my="5" flexGrow="1" position="relative" >
              {children}
            </Container>
          </main>
        </Box>
        <Footer />
      </Flex>
    </LayoutProvider>
  );
}
