module.exports = {
  extends: [
    "./javascript"
  ],
  overrides: [
    {
      extends: [
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/recommended",
        "./javascript"
      ],
      plugins: [
        '@typescript-eslint',
      ],
      files: ['**/*.tsx', '**/*.ts'],
      rules: {
        // 4 space indentation
        "@typescript-eslint/indent": ["error", 4],
        // Allows Typescript files to have tsx.
        "react/jsx-filename-extension": [1, { "extensions": [".tsx", ".ts"] }],
        // Allows omission of JS/TS extensions.
        "import/extensions": [
          "error",
          "ignorePackages",
          {
            "js": "never",
            "jsx": "never",
            "ts": "never",
            "tsx": "never"
          }
        ]
      },
      settings: {
        "import/resolver": {
          "node": {
            "extensions": [".js", ".jsx", ".ts", ".tsx"]
          }
        }
      }
    }
  ]
}
