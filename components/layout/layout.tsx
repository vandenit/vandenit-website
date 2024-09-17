import React, { PropsWithChildren } from "react";
import { LayoutProvider } from "./layout-context";
import client from "../../tina/__generated__/client";
import Header from "../nav/header";
import Footer from "../nav/footer";
import { Container } from "@radix-ui/themes";

type LayoutProps = PropsWithChildren & {
  rawPageData?: any;
};

export default async function Layout({ children, rawPageData }: LayoutProps) {
  const { data: globalData } = await client.queries.global({
    relativePath: "index.json",
  });

  return (
    <LayoutProvider globalSettings={globalData.global} pageData={rawPageData}>
      <Header />
      <main
      >
        <Container mx="5" my="5" >
          {children}
        </Container>
      </main>
      <Footer />
    </LayoutProvider>
  );
}
