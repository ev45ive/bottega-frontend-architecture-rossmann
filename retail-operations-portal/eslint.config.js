import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import boundaries from "eslint-plugin-boundaries";
import localRules from "./eslint-rules/no-declare-global.js";

// Module boundaries (docs/adr/0000-podzial-na-moduly-domenowe.md): domain modules talk to each
// other only through their public API (index.ts); allowed cross-module directions mirror the
// ownership map in docs/ARCHITECTURE.md.
const domainModules = ["product-catalog", "product-pricing", "sales-fulfilment", "platform"];

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      boundaries,
      local: localRules,
    },
    settings: {
      "import/resolver": {
        typescript: { alwaysTryTypes: true },
      },
      "boundaries/elements": [
        { type: "product-catalog", pattern: "packages/product-catalog", partialMatch: false },
        { type: "product-pricing", pattern: "packages/product-pricing", partialMatch: false },
        { type: "sales-fulfilment", pattern: "packages/sales-fulfilment", partialMatch: false },
        { type: "platform", pattern: "packages/platform", partialMatch: false },
        { type: "shared", pattern: "src/shared", partialMatch: false },
        { type: "app", pattern: "src/app", partialMatch: false },
        { type: "layout", pattern: "src/layout", partialMatch: false },
      ],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "local/no-declare-global": "error",
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          message:
            "{{from.element.types}} must not depend on {{to.element.types}}. See docs/adr/0000-podzial-na-moduly-domenowe.md.",
          policies: [
            {
              // Deep imports into another module's internals are forbidden — only its
              // public API (index.ts) is reachable. Imports within the same module are
              // exempt automatically (checkInternals defaults to false).
              to: { element: { type: domainModules, fileInternalPath: "!index.ts" } },
              disallow: { from: { element: { type: "*" } } },
              message:
                "Deep imports into another module's internals are forbidden. Import only the module's public API (e.g. @/modules/product-catalog).",
            },
            {
              from: { element: { type: "product-pricing" } },
              disallow: { to: { element: { type: "sales-fulfilment" } } },
            },
            {
              from: { element: { type: "sales-fulfilment" } },
              disallow: { to: { element: { type: ["product-pricing", "platform"] } } },
            },
            {
              from: { element: { type: "platform" } },
              disallow: {
                to: { element: { type: ["product-catalog", "product-pricing", "sales-fulfilment"] } },
              },
            },
          ],
        },
      ],
    },
  },
);
