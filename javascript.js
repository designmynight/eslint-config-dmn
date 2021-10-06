module.exports = {
  extends: [
    "airbnb"
  ],
  rules: {
    // 4 space indentation
    "indent": ["error", 4],
    "react/jsx-indent": ["error", 4],
    'react/jsx-indent-props': ['error', 4],
    // Allow ++ operator
    "no-plusplus": "off"
  }
};
