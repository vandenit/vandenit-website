"use client";
import React from "react";
import Image from "next/image";
import { useLayout } from "../../../components/layout/layout-context";
import { tinaField, useTina } from "tinacms/dist/react";
import { format } from "date-fns";
import { PostQuery } from "../../../tina/__generated__/types";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { components } from "../../../components/mdx-components";
import { FaTag } from "react-icons/fa";
import Link from "next/link";
import { Container, Section } from "@radix-ui/themes";


interface ClientPostProps {
  data: PostQuery;
  variables: {
    relativePath: string;
  };
  query: string;
}

export default function PostClientPage(props: ClientPostProps) {
  const { theme } = useLayout();
  const { data } = useTina({ ...props });
  const post = data.post;

  const date = new Date(post.date);
  let formattedDate = "";
  if (!isNaN(date.getTime())) {
    formattedDate = format(date, "MMM dd, yyyy");
  }

  return (
    <Section>
      <Container>
        <h2
          data-tina-field={tinaField(post, "title")}
          className={`w-full relative	mb-8 text-6xl font-extrabold tracking-normal text-center title-font`}
        >
          <span
            className={`bg-clip-text text-transparent bg-gradient-to-r
              }`}
          >
            {post.title}
          </span>
        </h2>
        <div
          data-tina-field={tinaField(post, "author")}
          className="flex items-center justify-center mb-16"
        >
          {post.author && (
            <>
              <div className="flex-shrink-0 mr-4">
                <Image
                  data-tina-field={tinaField(post.author, "avatar")}
                  className="h-14 w-14 object-cover rounded-full shadow-sm"
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={500}
                  height={500}
                />
              </div>
              <p
                data-tina-field={tinaField(post.author, "name")}
                className="text-base font-medium text-gray-600 group-hover:text-gray-800 dark:text-gray-200 dark:group-hover:text-white"
              >
                {post.author.name}
              </p>
              <span className="font-bold text-gray-200 dark:text-gray-500 mx-2">
                —
              </span>
            </>
          )}
          <p
            data-tina-field={tinaField(post, "date")}
            className="text-base text-gray-400 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-150"
          >
            {formattedDate}
          </p>
        </div>
        {post.tags && (
          <div className="flex items-center justify-center mb-16">
            <FaTag />
            {post.tags.map((tag) => (
              <span key={tag} className="badge ml-2 text-xs font-semibold">
                <Link href={`/posts?tag=${tag}`}>{tag}</Link>
              </span>
            ))}
          </div>
        )}
      </Container>
      {post.heroImg && (
        <div>
          <div
            data-tina-field={tinaField(post, "heroImg")}
          >
            <Image
              src={post.heroImg}
              alt={post.title}
              aria-hidden="true"
              width={500}
              height={500}
            />
            <Image
              src={post.heroImg}
              alt={post.title}
              width={500}
              height={500}
            />
          </div>
        </div>
      )}
      <Container>
        <div
          data-tina-field={tinaField(post, "_body")}
        >
          <TinaMarkdown components={components} content={post._body} />
        </div>
      </Container>
    </Section>
  );
}
