# [Confort](https://gitlab.com/GCSBOSS/confort)

A library for incrementaly build config objects through layering config files in many formats.
Check out the features:

- Support native objects input directly
- Load config files
- Merge configs chronologically
- Supported formats so far: TOML (`toml`), JSON, CSON (`cson-parser`) and YAML (`yaml`)
- Available in the Deno ecosystem (see directory `/deno`)

## Get Started

Install with: `npm i -P confort`

> You also need to install the lib for parsing the type of file you mean to use like: `npm i toml` for parsing TOML

In your code:

```js
const confort = require('confort');

// Constructor Forms
let conf = confort(); // Empty conf object
let conf = confort({ key: 'value', key2: 'value2' }); // Initial conf from objects
let conf = confort('./my-file.toml'); // Initial conf from file

// Adding incremental config layer
let c1 = confort(c1, { key: 'value' }); // => { key: 'value' }
c1 = confort(c1, { key: 'newValue', otherKey: 'value' }); // => { key: 'newValue', otherKey: 'value' }
c1 = confort(c1, './my-file.yml');
```

## Reporting Bugs
If you have found any problems with this module, please:

1. [Open an issue](https://gitlab.com/GCSBOSS/confort/issues/new).
2. Describe what happened and how.
3. Also in the issue text, reference the label `~bug`.

We will make sure to take a look when time allows us.

## Proposing Features
If you wish to get that awesome feature or have some advice for us, please:
1. [Open an issue](https://gitlab.com/GCSBOSS/confort/issues/new).
2. Describe your ideas.
3. Also in the issue text, reference the label `~proposal`.

## Contributing
If you have spotted any enhancements to be made and is willing to get your hands
dirty about it, fork us and
[submit your merge request](https://gitlab.com/GCSBOSS/confort/merge_requests/new)
so we can collaborate effectively.
