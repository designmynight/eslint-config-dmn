module.exports = {
  extends: [
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "./javascript"
  ],
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    // 4 space indentation
    "@typescript-eslint/indent": ["error", 4],
  },
}
