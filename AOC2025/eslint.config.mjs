import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([{
    files: ["**/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": ["error", { args: "all", argsIgnorePattern: "^_" }],
    },
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    }
}]);
