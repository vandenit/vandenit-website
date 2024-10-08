import type { Collection } from "tinacms";
import { heroBlockSchema } from "../../components/blocks/hero";
import { contentBlockSchema } from "../../components/blocks/content";
import { featureBlockSchema } from "../../components/blocks/features";
import { avatarBlockSchema } from "../../components/blocks/avatar";
import { testimonialsBlockSchema } from "../../components/blocks/testimonial-carousel";
import { portfolioBlockSchema } from "../../components/blocks/portfolio-carousel";
import { actionsBlockSchema } from "../../components/blocks/action-block";

const Page: Collection = {
  label: "Pages",
  name: "page",
  path: "content/pages",
  ui: {
    router: ({ document }) => {
      if (document._sys.filename === "home") {
        return `/`;
      }
      if (document._sys.filename === "about") {
        return `/about`;
      }
      if (document._sys.filename === "fullcv") {
        return `/fullcv`;
      }
      return undefined;
    },
  },
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
      description:
        "The title of the page. This is used to display the title in the CMS",
      isTitle: true,
      required: true,
    },
    {
      type: "object",
      list: true,
      name: "blocks",
      label: "Sections",
      ui: {
        visualSelector: true,
      },
      templates: [
        heroBlockSchema,
        avatarBlockSchema,
        //@ts-ignore
        featureBlockSchema,
        contentBlockSchema,
        testimonialsBlockSchema,
        portfolioBlockSchema,
        actionsBlockSchema,
      ],
    },
  ],
};

export default Page;
