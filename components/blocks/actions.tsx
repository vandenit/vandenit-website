"use client";
import Link from "next/link";
import * as React from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { PageBlocksHeroActions } from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import { useLayout } from "../layout/layout-context";
import { Button } from "@radix-ui/themes";

export const Actions = ({
  parentColor = "default",
  className = "",
  actions,
}: {
  parentColor: string;
  className: string;
  actions: PageBlocksHeroActions[];
}) => {
  const { theme } = useLayout();
  return (
    <div className={`flex flex-wrap items-center gap-y-4 gap-x-6 ${className}`}>
      {actions &&
        actions.map(function (action, index) {
          let element = null;
          if (action.type === "button") {
            element = (
              <Link key={index} href={action.link ? action.link : "/"}>
                <Button
                  data-tina-field={tinaField(action)}
                >
                  {action.label}
                  {action.icon && (
                    <BiRightArrowAlt
                      className={`ml-1 -mr-1 w-6 h-6 opacity-80`}
                    />
                  )}
                </Button>
              </Link>
            );
          }
          if (action.type === "link" || action.type === "linkExternal") {
            element = (
              <Link
                key={index}
                href={action.link ? action.link : "/"}
                data-tina-field={tinaField(action)}
                style={{
                  textShadow: `0 3px 7px rgba(var(--color-rgb-blue-400),0.2)`,
                }}
              >
                {action.label}
                {action.icon && (
                  <BiRightArrowAlt className={`ml-0 mr-0 w-6 h-6 opacity-80`} />
                )}
              </Link>
            );
          }
          return element;
        })}
    </div>
  );
};
