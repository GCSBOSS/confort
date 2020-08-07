# [Confort](https://gitlab.com/GCSBOSS/confort)

A library for incrementaly build config objects through layering config files in many formats.
Check out the features:

- Support native objects input directly
- Load config files
- Merge configs chronologically
- Option to watch changes in loaded config files
- Supported formats so far: TOML (`toml`), JSON, CSON (`cson-parser`) and YAML (`yaml`)

## Get Started

Install with: `npm i -P confort`

> You also need to install the lib for parsing the type of file you mean to use like: `npm i toml` for parsing TOML

In your code:

```js
const Confort = require('confort');

// Constructor Forms
let conf = new Confort(); // Empty conf object
let conf = new Confort({ key: 'value', key2: 'value2' }); // Initial conf from objects
let conf = new Confort('./my-file.toml'); // Initial conf from file

// Adding incremental config layer
conf.addLayer({ key: 'value' });
conf.object; // => { key: 'value' }
conf.addLayer({ key: 'newValue', otherKey: 'value' });
conf.object; // => { key: 'newValue', otherKey: 'value' }
conf.addLayer('./my-file.yml');

// Reset the configuration for reuse
conf.clear();

// Reset the conf and reapply all layers effectively reading changes in files
conf.reload();

// Enable auto reload when changes in loaded conf files happen
conf.liveReload = true;

// Disables auto reload
conf.liveReload = false;
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
