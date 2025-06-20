import React, { PropsWithChildren } from "react";
import { LayoutProvider } from "./layout-context";
import { getGlobalConfig } from "../../lib/contentlayer";
import Header from "../nav/header";
import Footer from "../nav/footer";
import { Box, Container, Flex } from "@radix-ui/themes";

type LayoutProps = PropsWithChildren;

export default async function Layout({ children }: LayoutProps) {
  const globalData = getGlobalConfig();

  return (
    <LayoutProvider globalSettings={globalData} pageData={null}>
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
