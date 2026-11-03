const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const { ESLint } = require('eslint');
const migration = require('./snapshots/migration.json');

function includesOptions(actual, expected, label) {
    if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
        for (const [key, value] of Object.entries(expected)) {
            includesOptions(actual?.[key], value, `${label}.${key}`);
        }
    } else {
        assert.deepEqual(actual, expected, label);
    }
}

for (const [language, preset] of [['jsx', 'javascript'], ['ts', 'typescript-react']]) {
    test(`v1 ${language} enabled-rule parity`, async () => {
        const snapshot = require(`./snapshots/v1-${language}.json`);
        const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: require(`../${preset}`) });
        const config = await eslint.calculateConfigForFile(path.join(__dirname, 'fixtures', `parity.${language}`));
        const summary = { kept: 0, renamed: 0, changed: 0, allowlisted: 0 };
        for (const [old, value] of Object.entries(snapshot.rules)) {
            const targets = migration.renamed[old] || [old];
            assert.ok(targets.length, `Enabled rule ${old} cannot be dropped`);
            for (const name of targets) {
                assert.ok(config.rules[name], `${old} -> ${name} missing`);
                assert.equal(config.rules[name][0], value[0], `${old} -> ${name} severity`);
                if (!migration.adaptations[old]) {
                    value.slice(1).forEach((option, index) => includesOptions(config.rules[name][index + 1], option, `${old} option ${index}`));
                }
            }
            if (migration.adaptations[old]) {
                summary.changed++;
                summary.allowlisted++;
            } else if (targets.some(name => name !== old)) {
                summary.renamed++;
            } else {
                summary.kept++;
            }
        }
        assert.equal(summary.kept + summary.renamed + summary.changed, Object.keys(snapshot.rules).length);
        console.log(`Parity ${language}: ${Object.keys(snapshot.rules).length} enabled; kept=${summary.kept}, renamed=${summary.renamed}, changed=${summary.changed}, allowlisted=${summary.allowlisted}, dropped=0`);
    });
}

test('legacy defaults are explicitly pinned', async () => {
    const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: require('../typescript-react') });
    const { rules } = await eslint.calculateConfigForFile(path.join(__dirname, 'fixtures', 'parity.ts'));
    for (const [name, pin] of Object.entries(migration.pins)) {
        if (Array.isArray(pin)) {
            pin.forEach((option, index) => includesOptions(rules[name][index + 1], option, name));
        } else {
            includesOptions(rules[name][1], pin, name);
        }
    }
    includesOptions(rules['@typescript-eslint/only-throw-error'][1], { allowThrowingAny: true, allowThrowingUnknown: true }, 'only-throw-error legacy allowances');
});

test('migration exceptions are documented and no enabled rule is removed', () => {
    const readme = require('node:fs').readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8');
    for (const name of Object.keys(migration.adaptations)) assert.ok(readme.includes(`\`${name}\``), `${name} not documented`);
    for (const name of migration.removed) {
        assert.ok(readme.includes(`\`${name}\``), `${name} not documented`);
        for (const language of ['jsx', 'ts']) assert.equal(require(`./snapshots/v1-${language}.json`).rules[name], undefined);
    }
});
