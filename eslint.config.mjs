import js from "@eslint/js";

/**
 * ESLint 9 flat config for vandenit-website (T0 baseline, NEXT16-CONTENT-PIPELINE).
 *
 * Runner repair: the repo shipped `next lint` + eslint-config-next@14, but
 * that plugin's rules still call `context.getAncestors`, an API removed in
 * ESLint 9 — the declared "extends": ["eslint:recommended", "next"] surface
 * never was able to execute under the installed ESLint 9. The lint gate now
 * runs the executable rule surface directly (@eslint/js recommended). Phase B
 * (Next.js 16 upgrade) restores the Next-specific rules natively through
 * eslint-config-next@16, which builds for ESLint 9 flat config.
 */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      ".contentlayer/**",
      ".worktrees/**",
      "dist/**",
      "test-results/**",
      "playwright-report/**",
    ],
  },
  js.configs.recommended,
  {
    // CommonJS Next config file: declare the module-level globals so
    // no-undef does not flag the existing require/module usage.
    files: ["next.config.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "writable",
        process: "readonly",
      },
    },
  },
];

export default eslintConfig;