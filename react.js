const react = require('eslint-plugin-react');
const hooks = require('eslint-plugin-react-hooks');
const a11y = require('eslint-plugin-jsx-a11y');
const { fixupPluginRules } = require('@eslint/compat');
const stylistic = require('@stylistic/eslint-plugin');

module.exports = [
    {
        name: 'dmn/react',
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            '@stylistic': stylistic,
            react: fixupPluginRules(react),
            'react-hooks': hooks,
            'jsx-a11y': fixupPluginRules(a11y),
        },
        languageOptions: {
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        settings: {
            react: { version: 'detect', pragma: 'React' },
            propWrapperFunctions: ['forbidExtraProps', 'exact', 'Object.freeze'],
        },
        rules: require('./rules/react.json'),
    },
    {
        name: 'dmn/react-typescript',
        files: ['**/*.{ts,tsx}'],
        rules: {
            'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.ts'] }],
        },
    },
];
