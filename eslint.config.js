import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-this-alias": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/no-wrapper-object-types": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "no-empty": "warn",
      "no-case-declarations": "warn",
      "no-useless-escape": "warn",
      "prefer-const": "warn",
      "no-var": "warn",
      "no-prototype-builtins": "warn",
      "no-async-promise-executor": "warn",
      "no-fallthrough": "warn",
      "no-cond-assign": "warn",
      "no-control-regex": "warn",
      "no-misleading-character-class": "warn",
      "no-constant-condition": "warn",
      "no-self-assign": "warn",
      "no-extra-boolean-cast": "warn",
      "no-unsafe-optional-chaining": "warn",
      "no-unexpected-multiline": "warn",
      "no-func-assign": "warn",
      "no-setter-return": "warn",
      "getter-return": "warn",
      "valid-typeof": "warn",
      "no-import-assign": "warn",
      "react-hooks/rules-of-hooks": "warn",
      "@typescript-eslint/triple-slash-reference": "warn",
    },
  }
);
