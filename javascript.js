module.exports = {
  extends: [
    "airbnb"
  ],
  rules: {
    // 4 space indentation (including in switch statements)
    "indent": ["error", 4, {"SwitchCase": 1}],
    "react/jsx-indent": ["error", 4],
    'react/jsx-indent-props': ['error', 4],
    // Allow ++ operator
    "no-plusplus": "off",
    // Allow import react at top of file.
    "no-use-before-define": "off",
    // Don't mandate props destructuring.
    "react/destructuring-assignment": "off"
  },
  ignorePatterns: ["*.css", "*.scss"]
};
