# eslint-config-dmn v2

ESLint 10 flat configurations preserving DMN's v1 Airbnb policy. Node must be
`^20.19.0 || ^22.13.0 || >=24`. ESLint is a peer dependency; plugins are bundled
as dependencies. TypeScript consumers also need TypeScript `>=4.8.4 <6.1.0`.

## Installation

Install the v2 release/tag (after it is released):

```sh
npm install --save-dev eslint@^10 eslint-config-dmn@github:designmynight/eslint-config-dmn#2.0.0
# TypeScript projects additionally need:
npm install --save-dev typescript@~5.6.3
```

### Temporary React/a11y peer overrides

`eslint-plugin-react@7.37.5` and `eslint-plugin-jsx-a11y@6.10.2` do not yet declare
ESLint 10 support. React also uses removed ESLint APIs. The React export wraps
both plugins with `@eslint/compat`'s `fixupPluginRules`; this is a tested
compatibility bridge, not a claim of upstream support.

**Before installing**, put the following in the consuming root `package.json`:

```json
{
  "devDependencies": {
    "eslint": "^10.14.0"
  },
  "overrides": {
    "minimatch@>=10 <11": "11.0.4",
    "eslint-plugin-react": { "eslint": "$eslint" },
    "eslint-plugin-jsx-a11y": { "eslint": "$eslint" }
  }
}
```

These root-only npm overrides are also used in this repository, so plain
`npm install` / `npm ci` works without `--force` or `--legacy-peer-deps`.
Overrides in dependencies do not propagate to consumers. Even base-only users
currently need the overrides at installation time because this package bundles
the React plugins; base/TypeScript exports do not load them at runtime. Remove
the overrides only once the upstream plugins support ESLint 10 and the fixture
suite passes against those releases.

### Scoped minimatch security override

The `minimatch@>=10 <11` override pins the named-export API consumers (ESLint,
its config array, TypeScript ESLint and import-x) to minimatch **11.0.4** for
GHSA-g3hv-75wg-m249. Consumers must copy this override into their root
`package.json` too; this package's overrides do not propagate.

Do **not** replace it with an unscoped `"minimatch": "11.0.4"` override:
React 7.37.5 and jsx-a11y 6.10.2 call the legacy default function from minimatch
3. Version 11 exports an object with a named `minimatch` function instead.
An unscoped override would crash React rules such as `jsx-pascal-case` and the
a11y label/control glob helpers. Regression fixtures exercise those exact calls,
including wildcard matches and nonmatches; checking JSX filename extensions
alone would not exercise minimatch.

**This is a partial advisory remediation.** React/a11y's minimatch 3 dependency
remains affected by GHSA-g3hv-75wg-m249. Clearing those remaining findings needs
upstream plugin changes or separately reviewed compatible forks; the scoped
override is not a claim of a clean audit. Do not expose lint configuration or
glob patterns to untrusted input.

## Flat-config exports

All exports are arrays. Use `eslint.config.mjs` (or equivalent CommonJS):

| Export | Contents |
| --- | --- |
| `eslint-config-dmn/base` | Airbnb-base + non-React DMN overrides; no React plugins loaded |
| `eslint-config-dmn/typescript` | Base + v1 Airbnb TypeScript/recommended rules scoped to `.ts`/`.tsx`; no React |
| `eslint-config-dmn/react` | React, hooks, accessibility and DMN JSX overrides; use alongside base or TypeScript |
| `eslint-config-dmn/javascript` | `[...base, ...react]`: replacement for v1 `javascript` |
| `eslint-config-dmn/typescript-react` | `[...typescript, ...react]`: replacement for v1 `typescript` |
| `eslint-config-dmn` | Alias of `javascript` |

### JavaScript backend

```js
import base from 'eslint-config-dmn/base';

export default [...base];
```

### TypeScript backend

```js
import typescript from 'eslint-config-dmn/typescript';

export default [...typescript];
```

Typed rules use TypeScript's project service. Linted TS files must belong to a
`tsconfig.json`. For unusual layouts, append a TS-scoped object overriding
`languageOptions.parserOptions` (for example, `tsconfigRootDir`). To use explicit
projects instead, set `projectService: false` and `project: './tsconfig.json'`.
The preset does not silently disable rules requiring type information.

### React JavaScript

```js
import base from 'eslint-config-dmn/base';
import react from 'eslint-config-dmn/react';

export default [...base, ...react];
```

Alternatively import `eslint-config-dmn/javascript`. As in v1, JSX in JavaScript
is permitted in `.js`, **not `.jsx`** (the latter produces a warning). React is
detected from the consuming project. Install its actual React runtime separately.

### React TypeScript

```js
import typescript from 'eslint-config-dmn/typescript';
import react from 'eslint-config-dmn/react';

export default [...typescript, ...react];
```

Alternatively import `eslint-config-dmn/typescript-react`. JSX is permitted in
`.ts`/`.tsx`; TS parser rules only apply to TS files. The React export on its own
does not supply a TypeScript parser or the base import/style rules.

The base provides ES2015/Node globals, module syntax and ECMAScript 2018, matching
v1's language level. Add consumer-specific browser/test globals and a newer
`ecmaVersion` when needed. CSS, SCSS and snap files are globally ignored by base.

## Migration from v1

v1 tags remain available for legacy consumers; they are not rewritten. v2 is a
major release and is **not** an `.eslintrc` configuration. Remove legacy config
files after translating them, and move `.eslintignore` patterns into flat config.
Replace `extends` with array composition. Most importantly, v2 `typescript` is
backend-only: use `typescript-react` to retain v1's combined TS + React policy.

The explicit rule maps in `rules/` were derived from ESLint 7.32.0 resolved v1
configs: Airbnb 18.2.1, Airbnb-base 14.2.1, Airbnb TypeScript 14.0.2 and TypeScript
ESLint 4.33.0. They are not another package's latest presets. Upgrading the policy
to Airbnb 19 or modern recommended presets is not part of this migration.

### Rule IDs and deliberate adaptations

Update consumer rule overrides and inline `eslint-disable` comments too.

| v1 rule(s) | v2 rule(s) / adaptation |
| --- | --- |
| Deprecated core formatting rules, e.g. `indent`, `quotes`, `semi`, `comma-dangle`, `max-len` | Same names under `@stylistic/` |
| Removed TS ESLint formatting rules, e.g. `@typescript-eslint/indent`, `@typescript-eslint/semi` | Same names under `@stylistic-ts/` |
| Core/TS `func-call-spacing` | `@stylistic/function-call-spacing` / `@stylistic-ts/function-call-spacing` |
| `import/*` | `import-x/*`; resolver settings become `import-x/resolver` |
| `import/no-cycle` | `import-x/no-cycle`; omit unsupported `disableScc` optimization option |
| `object-property-newline` | `@stylistic/object-property-newline`; omit obsolete `allowMultiplePropertiesPerLine`; retain `allowAllPropertiesOnSameLine: true` |
| `dot-notation` | Retained; remove TS-only false options accidentally present in the v1 resolved core options |
| `@typescript-eslint/ban-types` | Split into `@typescript-eslint/no-empty-object-type` (allow interfaces here; the existing empty-interface rule still checks them), `@typescript-eslint/no-unsafe-function-type`, `@typescript-eslint/no-wrapper-object-types` |
| `@typescript-eslint/no-throw-literal` | `@typescript-eslint/only-throw-error`; retain legacy `allowThrowingAny: true` and `allowThrowingUnknown: true` |
| `react/jsx-sort-prop-types`, `require-jsdoc`, `valid-jsdoc` | Removed upstream; all were already **off** in v1 |

The five nontrivial adaptations above (`import/no-cycle`,
`object-property-newline`, `dot-notation`, `@typescript-eslint/ban-types`,
`@typescript-eslint/no-throw-literal`) are the explicit parity allowlist in
`test/snapshots/migration.json`. No enabled rule is dropped or lowered in severity.
The split type-ban rules have different coverage, and newer implementations can
report newer syntax differently. This is configuration/severity parity, not a
guarantee that every diagnostic or autofix is byte-for-byte identical.

`@stylistic-ts` is an intentional second namespace for the same Stylistic plugin:
v1 sometimes enabled both core and TS style rules. Keeping separate rule IDs
preserves those options without silently overwriting one with the other.

`no-spaced-func` and `lines-around-directive` remain active deprecated core rules
as compatibility bridges. Core formatting rules still exist in ESLint 10; the
ones with direct Stylistic replacements have been migrated. Existing deprecated
TS rules that still exist, such as `@typescript-eslint/no-var-requires`, are kept
instead of silently changing policy.

### Legacy defaults pinned

| Rules | Explicit legacy setting |
| --- | --- |
| `no-unused-vars`, `@typescript-eslint/no-unused-vars` | `caughtErrors: 'none'` |
| `no-constant-condition` | `checkLoops: true` |
| `no-inner-declarations` | `'functions'`, `blockScopedFunctions: 'disallow'` |
| `no-shadow-restricted-names` | `reportGlobalThis: false` |
| `no-useless-computed-key` | `enforceForClassMembers: false` |
| `class-methods-use-this` | `enforceForClassFields: false` |
| `@stylistic/lines-between-class-members` | `exceptAfterOverload: false` |
| `@stylistic-ts/lines-between-class-members` | `exceptAfterOverload: true` (v1 TS default) |
| `@stylistic/no-multi-spaces` | `includeTabs: false`, exceptions `{ Property: true }` |

DMN's 4-space indentation (SwitchCase 1), 120-character warning, import extension
policy and React exceptions are retained. The React export explicitly enables
Airbnb's two hooks rules (`rules-of-hooks` and `exhaustive-deps`) as requested;
v1 exposed them only through Airbnb's optional hooks config. It does **not** opt
into the new React Compiler recommended rules.

## Development and verification

```sh
npm ci && npm test
```

Tests use `node:test` and ESLint's API. Committed enabled-rule snapshots cover
357 TypeScript and 312 JSX v1 entries. Tests check mapped severity, explicit
options except the documented allowlist, legacy default pins, every export,
plugin isolation, style/import/TS/React/hooks/a11y fixtures, ignored/empty files
and parser errors. Fixtures intentionally contain lint errors; tests assert
their diagnostics rather than requiring those files to be lint-clean.

GitHub Actions runs the same command on Node 22 and 24. Keep the snapshots
immutable when changing v2 rules; intentional policy changes require reviewed
tests and migration notes, not regenerating the baseline to make tests pass.
