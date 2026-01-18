module.exports = {
  root: true,
  ignorePatterns: ["node_modules", ".next", "dist", "coverage"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  env: {
    es2022: true,
    node: true
  }
};
