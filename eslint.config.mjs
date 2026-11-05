import next from "eslint-config-next";

// eslint-config-next@16 ships flat configs natively. The base ("." export)
// carries the core surface; "core-web-vitals" adds the Next runtime rules.
const base = Array.isArray(next) ? next : [next];

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      ".worktrees/**",
      "dist/**",
      "test-results/**",
      "playwright-report/**",
      "scripts/verify/**",
    ],
  },
  ...base,
  {
    rules: {
      // Existing JSX copy uses raw ampersands/apostrophes by design.
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;