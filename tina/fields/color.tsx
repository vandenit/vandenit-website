import React from "react";
import { wrapFieldsWithMeta } from "tinacms";
import styled, { ThemeProvider } from 'styled-components';

export const colorOptions = [
  "Soft", "Gray", "Gold", "Bronze", "Brown", "Yellow", "Amber", "Orange", "Tomato", "Red", "Ruby",
  "Crimson", "Pink", "Plum", "Purple", "Violet", "Iris", "Indigo", "Blue", "Cyan", "Teal", "Jade", "Green", "Grass", "Lime", "Mint", "Sky"
];

const Button = styled.button`
  background-color: ${(props) => props.color};
  width: 2.25rem; /* Equivalent to w-9 */
  height: 2.25rem; /* Equivalent to h-9 */
  border-radius: 9999px; /* Equivalent to rounded-full */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06); /* Equivalent to shadow */
  border: 1px solid #e5e7eb; /* Equivalent to border, using a neutral color */
`;

export const ColorPickerInput = wrapFieldsWithMeta(({ input }) => {

  return (
    <>
      <input type="text" id={input.name} className="hidden" {...input} />
      <div className="flex gap-2 flex-wrap">
        {colorOptions.map((color) => {
          return (
            <Button
              key={color}
              color={color}
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
