import { Hero } from "./hero";
import { Content } from "./content";
import { Features } from "./features";
import { AvatarBlock } from "./avatar";
import { TestimonialCarousel } from "./testimonial-carousel";
import { PortfolioCarousel } from "./portfolio-carousel";
import { ActionsBlock } from "./action-block";
import { ImageHeader } from "./imageHeader";
import type { Page } from '.contentlayer/generated';

export const Blocks = (props: Page) => {
  return (
    <>
      {props.blocks
        ? props.blocks.map(function (block: any, i: number) {
          return (
            <div key={i}>
              <Block {...block} />
            </div>
          );
        })
        : null}
    </>
  );
};

const Block = (block: any) => {
  switch (block._template) {
    case "hero":
      return <Hero data={block} />;
    case "avatar":
      return <AvatarBlock data={block} />;
    case "content":
      return <Content data={block} />;
    case "features":
      return <Features data={block} />;
    case "testimonials":
      return <TestimonialCarousel data={block} />;
    case "portfolio":
      return <PortfolioCarousel data={block} />;
    case "actions":
      return <ActionsBlock data={block} />;
    case "imageHeader":
      return <ImageHeader data={block} />;
    default:
      return null;
  }
};
