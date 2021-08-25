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
  // Typescript-specific overrides
  overrides: [{
    extends: [
      "airbnb-typescript/base"
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
