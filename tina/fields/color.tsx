import React from "react";
import { wrapFieldsWithMeta } from "tinacms";
import styled, { ThemeProvider } from 'styled-components';
// import all colors from the radix-ui theme
import * as colors from "@radix-ui/colors";
export const colorOptions = ["gray", "gold", "bronze", "brown", "yellow", "amber",
  "orange", "tomato", "red", "ruby", "crimson", "pink", "plum", "purple", "violet", "iris", "indigo", "blue", "cyan", "teal", "jade", "green", "grass", "lime", "mint", "sky"
];

export const greyOptions = ["auto", "gray", "mauve", "slate", "sage", "olive", "sand"];

const Button = styled.button`
  background-color: ${(props) => props.color};
  width: 2.25rem; /* Equivalent to w-9 */
  height: 2.25rem; /* Equivalent to h-9 */
  border-radius: 9999px; /* Equivalent to rounded-full */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06); /* Equivalent to shadow */
  border: 1px solid #e5e7eb; /* Equivalent to border, using a neutral color */
`;

export const ColorPickerInput = wrapFieldsWithMeta(({ input }) => {
  // dark toggle

  return (
    <>
      <input type="text" id={input.name} className="hidden" {...input} />
      <div className="flex gap-2 flex-wrap">
        {colorOptions.map((color) => {
          const finalColor = colors[color][`${color}9`];
          return (
            <Button
              key={color}
              title={color}
              color={finalColor}
              onClick={() => {
                input.onChange(color);
              }}
            ></Button>
          );
        })}
      </div>
    </>
  );
});
