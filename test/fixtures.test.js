const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');
const { ESLint } = require('eslint');

const fixture = name => path.join(__dirname, 'fixtures', name);
const engine = preset => new ESLint({ overrideConfigFile: true, overrideConfig: require(`eslint-config-dmn/${preset}`) });
const ruleIds = result => result.messages.map(message => message.ruleId);
const has = (result, id) => assert.ok(ruleIds(result).includes(id), `${id} missing: ${JSON.stringify(result.messages)}`);
const lacks = (result, id) => assert.ok(!ruleIds(result).includes(id), `${id} unexpected: ${JSON.stringify(result.messages)}`);

for (const [preset, file] of [
    ['base', 'empty.js'],
    ['typescript', 'parity.ts'],
    ['react', 'parity.jsx'],
    ['javascript', 'parity.jsx'],
    ['typescript-react', 'react-typescript.tsx'],
]) {
    test(`${preset} export loads and lints without config/parser errors`, async () => {
        const exported = require(`eslint-config-dmn/${preset}`);
        assert.ok(Array.isArray(exported));
        const [result] = await engine(preset).lintFiles([fixture(file)]);
        assert.equal(result.fatalErrorCount, 0, JSON.stringify(result.messages));
        assert.ok(result.messages.every(message => message.ruleId), JSON.stringify(result.messages));
    });
}

test('base and typescript do not load React, hooks or a11y plugins', () => {
    for (const preset of ['base', 'typescript']) {
        const loaded = JSON.parse(execFileSync(process.execPath, ['-e', `require('eslint-config-dmn/${preset}'); console.log(JSON.stringify(Object.keys(require.cache)));`], { cwd: path.join(__dirname, '..'), encoding: 'utf8' }));
        assert.ok(loaded.every(name => !/node_modules[\\/]eslint-plugin-(react|react-hooks|jsx-a11y)[\\/]/.test(name)));
    }
});

test('base enforces formatting and import rules, retaining DMN exceptions', async () => {
    const [result] = await engine('base').lintFiles([fixture('base.js')]);
    for (const id of ['@stylistic/indent', '@stylistic/quotes', '@stylistic/semi', '@stylistic/max-len']) has(result, id);
    lacks(result, 'no-plusplus');
    lacks(result, 'no-use-before-define');
    const [imports] = await engine('base').lintFiles([fixture('imports.js')]);
    has(imports, 'import-x/extensions');
    has(imports, 'import-x/no-unresolved');
    const [valid] = await engine('base').lintFiles([fixture('valid-import.js')]);
    lacks(valid, 'import-x/extensions');
    lacks(valid, 'import-x/no-unresolved');
});

test('base preserves legacy loop, catch, declaration and shadow behavior', async () => {
    const [result] = await engine('base').lintFiles([fixture('defaults.js')]);
    has(result, 'no-constant-condition');
    has(result, 'no-inner-declarations');
    lacks(result, 'no-unused-vars');
    lacks(result, 'no-shadow-restricted-names');
    lacks(result, 'no-useless-computed-key');
});

test('typescript retains typed, style and import checks without React', async () => {
    const [result] = await engine('typescript').lintFiles([fixture('typescript.ts')]);
    for (const id of ['@typescript-eslint/no-explicit-any', '@typescript-eslint/explicit-module-boundary-types', '@typescript-eslint/no-var-requires', '@typescript-eslint/no-wrapper-object-types', '@typescript-eslint/no-empty-object-type', '@typescript-eslint/no-unsafe-function-type', '@typescript-eslint/only-throw-error', '@stylistic-ts/semi']) has(result, id);
    assert.ok(ruleIds(result).every(id => !id || !/^(react|jsx-a11y|react-hooks)\//.test(id)));
    const [imports] = await engine('typescript').lintFiles([fixture('typescript-imports.ts')]);
    assert.equal(imports.fatalErrorCount, 0, JSON.stringify(imports.messages));
    has(imports, 'import-x/named');
    lacks(imports, 'import-x/no-unresolved');
});

test('react export retains React, hooks, accessibility and DMN JSX rules', async () => {
    const [result] = await engine('react').lintFiles([fixture('react.js')]);
    for (const id of ['react/jsx-indent', 'react/jsx-indent-props', 'react-hooks/rules-of-hooks', 'react-hooks/exhaustive-deps', 'jsx-a11y/alt-text']) has(result, id);
    for (const id of ['react/jsx-filename-extension', 'react/destructuring-assignment', 'react/require-default-props', 'jsx-a11y/label-has-associated-control']) lacks(result, id);
    const [jsx] = await engine('javascript').lintFiles([fixture('parity.jsx')]);
    has(jsx, 'react/jsx-filename-extension');
    const [tsx] = await engine('typescript-react').lintFiles([fixture('react-typescript.tsx')]);
    lacks(tsx, 'react/jsx-filename-extension');
});

test('TypeScript rules and React filename options are scoped to TypeScript files', async () => {
    const config = await engine('typescript-react').calculateConfigForFile(fixture('react.js'));
    assert.equal(config.plugins['@typescript-eslint'], undefined);
    assert.deepEqual(config.rules['react/jsx-filename-extension'], [1, { extensions: ['.js'] }]);
});

test('empty files work and css/scss/snap are ignored', async () => {
    const eslint = engine('base');
    const [empty] = await eslint.lintFiles([fixture('empty.js')]);
    assert.deepEqual(empty.messages, []);
    for (const extension of ['css', 'scss', 'snap']) assert.equal(await eslint.isPathIgnored(fixture(`ignored.${extension}`)), true);
});

test('a malformed source is reported as a parser error', async () => {
    const [result] = await engine('base').lintText('const = ;', { filePath: fixture('broken.js') });
    assert.equal(result.fatalErrorCount, 1);
});

test('root export is the javascript preset', () => {
    assert.equal(require('eslint-config-dmn'), require('eslint-config-dmn/javascript'));
});

test('typed files outside a project report a useful parser error', async () => {
    const [result] = await engine('typescript').lintText('export const value: number = 1;', { filePath: path.join(__dirname, 'outside-project.ts') });
    assert.equal(result.fatalErrorCount, 1);
    assert.match(result.messages[0].message, /project service/);
});
