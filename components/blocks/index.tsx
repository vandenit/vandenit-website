import { tinaField } from "tinacms/dist/react";
import { Page, PageBlocks } from "../../tina/__generated__/types";
import { Hero } from "./hero";
import { Content } from "./content";
import { Features } from "./features";
import { AvatarBlock } from "./avatar";
import { TestimonialCarousel } from "./testimonial-carousel";
import { PortfolioCarousel } from "./portfolio-carousel";
import { ActionsBlock } from "./action-block";

export const Blocks = (props: Omit<Page, "id" | "_sys" | "_values">) => {
  return (
    <>
      {props.blocks
        ? props.blocks.map(function (block, i) {
          return (
            <div key={i} data-tina-field={tinaField(block)}>
              <Block {...block} />
            </div>
          );
        })
        : null}
    </>
  );
};

const Block = (block: PageBlocks) => {
  switch (block.__typename) {
    case "PageBlocksHero":
      return <Hero data={block} />;
    case "PageBlocksAvatar":
      return <AvatarBlock data={block} />;
    case "PageBlocksContent":
      return <Content data={block} />;
    case "PageBlocksFeatures":
      return <Features data={block} />;
    case "PageBlocksTestimonials":
      return <TestimonialCarousel data={block} />;
    case "PageBlocksPortfolio":
      return <PortfolioCarousel data={block} />;
    case "PageBlocksActions":
      return <ActionsBlock data={block} />;
    default:
      return null;
  }
};
