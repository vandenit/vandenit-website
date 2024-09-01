import { TinaField } from "tinacms";
import tags from "../../content/theme/tags.json";

const allTags = tags.data.map((tag) => ({
  label: tag,
  value: tag,
}));

export const tagField: TinaField = {
  type: "string",
  name: "tags",
  label: "Tags",
  options: allTags,
  list: true,
};
