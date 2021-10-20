module.exports = {
  extends: [
    "airbnb"
  ],
  rules: {
    // 4 space indentation (including in switch statements)
    "indent": ["error", 4, {"SwitchCase": 1}],
    "react/jsx-indent": ["error", 4],
    'react/jsx-indent-props': ['error', 4],
    // Allows JS files to have jsx.
    "react/jsx-filename-extension": [1, { "extensions": [".js"] }],
    // Allow ++ operator
    "no-plusplus": "off",
    // Allow import react at top of file.
    "no-use-before-define": "off",
    // Don't mandate props destructuring.
    "react/destructuring-assignment": "off",
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
    ],
    // Don't require default props for functional components.
    "react/require-default-props": "off",
    // Increase max line length to 120.
    "max-len": ["warn", {"code": 120}],
    // Allow wrapping labels around tag components.
    "jsx-a11y/label-has-associated-control": ["off"],
  },
  settings: {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  ignorePatterns: ["*.css", "*.scss", '*.snap']
}
