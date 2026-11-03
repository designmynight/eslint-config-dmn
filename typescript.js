const base = require('./base');
const tseslint = require('typescript-eslint');
const stylistic = require('@stylistic/eslint-plugin');

module.exports = [
    ...base,
    {
        name: 'dmn/typescript',
        files: ['**/*.{ts,tsx}'],
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            '@stylistic-ts': stylistic,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: { projectService: true },
        },
        settings: {
            'import-x/extensions': ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.d.ts'],
            'import-x/parsers': {
                [require.resolve('@typescript-eslint/parser', { paths: [require.resolve('typescript-eslint')] })]: ['.ts', '.tsx', '.d.ts'],
            },
            'import-x/external-module-folders': ['node_modules', 'node_modules/@types'],
        },
        rules: require('./rules/typescript.json'),
    },
];
