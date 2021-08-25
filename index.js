module.exports = {
  extends: [
    "airbnb"
  ],
  rules: {
    // 4 space indentation
    "indent": ["error", 4],
    // Allow ++ operator
    "no-plusplus": "off"
  },
  // Typescript-specific rules
  overrides: [{
    extends: [
      "airbnb-typescript/base",
      "plugin:@typescript-eslint/recommended"
    ],
    files: ["*.ts", "*.tsx"],
    plugins: [
      '@typescript-eslint',
    ],
    rules: {
      // 4 space indentation
      "@typescript-eslint/indent": ["error", 4],

    },
  }]
};
