const stylistic = require('@stylistic/eslint-plugin');
const importX = require('eslint-plugin-import-x');
const globals = require('globals');

module.exports = [
    { ignores: ['**/*.css', '**/*.scss', '**/*.snap'] },
    {
        name: 'dmn/base',
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        plugins: { '@stylistic': stylistic, 'import-x': importX },
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: 'module',
            globals: { ...globals.es2015, ...globals.node },
        },
        settings: {
            'import-x/extensions': ['.js', '.mjs', '.jsx'],
            'import-x/core-modules': [],
            'import-x/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
            'import-x/resolver': {
                node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
            },
        },
        rules: require('./rules/base.json'),
    },
];
