import type { Collection } from "tinacms";

const Theme: Collection = {
  label: "Theme",
  name: "theme",
  path: "content/theme",
  format: "json",
  templates: [
    {
      name: "tags",
      label: "Tags",
      fields: [
        {
          type: "string",
          label: "Data",
          name: "data",
          list: true,
        },
      ],
    },
  ],
};
export default Theme;
