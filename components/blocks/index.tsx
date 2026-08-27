import { Hero } from "./hero";
import { Content } from "./content";
import { Features } from "./features";
import { AvatarBlock } from "./avatar";
import { AboutHeader } from "./about-header";
import { CareerTimeline } from "./career-timeline";
import { ContactHero } from "./contact-hero";
import { TestimonialCarousel } from "./testimonial-carousel";
import { PortfolioCarousel } from "./portfolio-carousel";
import { ActionsBlock } from "./action-block";
import { ImageHeader } from "./imageHeader";
import { EngagementProcess } from "./engagement-process";
import { DecisionTrace } from "./decision-trace";
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
    case "about-header":
      return <AboutHeader data={block} />;
    case "career-timeline":
      return <CareerTimeline data={block} />;
    case "contact-hero":
      return <ContactHero data={block} />;
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
    case "engagement-process":
      return <EngagementProcess />;
    case "decision-trace":
      return <DecisionTrace />;
    default:
      return null;
  }
};
