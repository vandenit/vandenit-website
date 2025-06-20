// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
var Author = defineDocumentType(() => ({
  name: "Author",
  filePathPattern: `authors/**/*.md`,
  contentType: "markdown",
  fields: {
    name: {
      type: "string",
      description: "The name of the author",
      required: true
    },
    avatar: {
      type: "string",
      description: "The avatar image path",
      required: false
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (author) => `/authors/${author._raw.flattenedPath}`
    }
  }
}));
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true
    },
    heroImg: {
      type: "string",
      description: "The hero image path",
      required: false
    },
    excerpt: {
      type: "string",
      description: "The excerpt of the post",
      required: false
    },
    author: {
      type: "string",
      description: "Reference to author file",
      required: false
    },
    date: {
      type: "date",
      description: "The date of the post",
      required: true
    },
    tags: {
      type: "list",
      of: { type: "string" },
      description: "Tags for the post",
      required: false
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/posts/${post._raw.flattenedPath}`
    },
    slug: {
      type: "string",
      resolve: (post) => post._raw.flattenedPath
    }
  }
}));
var Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `pages/**/*.md`,
  contentType: "markdown",
  fields: {
    title: {
      type: "string",
      description: "The title of the page",
      required: true
    },
    blocks: {
      type: "json",
      description: "Page blocks/sections",
      required: false
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (page) => `/${page._raw.flattenedPath}`
    },
    slug: {
      type: "string",
      resolve: (page) => page._raw.flattenedPath
    }
  }
}));
var Global = defineDocumentType(() => ({
  name: "Global",
  filePathPattern: `global/**/*.json`,
  contentType: "data",
  isSingleton: true,
  fields: {
    header: {
      type: "json",
      description: "Header configuration",
      required: false
    },
    footer: {
      type: "json",
      description: "Footer configuration",
      required: false
    },
    theme: {
      type: "json",
      description: "Theme configuration",
      required: false
    }
  }
}));
var Theme = defineDocumentType(() => ({
  name: "Theme",
  filePathPattern: `theme/**/*.json`,
  contentType: "data",
  fields: {
    data: {
      type: "list",
      of: { type: "string" },
      description: "Theme data (tags, etc.)",
      required: false
    },
    _template: {
      type: "string",
      description: "Template type",
      required: false
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "./content",
  documentTypes: [Author, Post, Page, Global, Theme],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: []
  }
});
export {
  Author,
  Global,
  Page,
  Post,
  Theme,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-WY5CKALE.mjs.map
