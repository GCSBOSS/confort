# Confort Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.2.0] - 2021-01-18

### Added
- support for [Deno](https://deno.land/)

### Changed
- entire interface to a simple funcion (`confort(...layers)`)

### Removed
- reloading capabilities
- layer history
- support to CSON format

## [v0.1.4] - 2020-08-07

### Changed
- no longer includes supported modules as dependencies. Requires the depedent to install the desired modules directly

## [v0.1.3] - 2019-10-15

### Fixed
- merging function to attempt merging 'null' values

## [v0.1.2] - 2019-09-25

### Changed
- layering to not merge objects unless they are direct instances of `Object` and `Array` (mostly created with literals)

## [v0.1.1] - 2019-09-23

### Added
- support to CSON file type

### Changed
- layering to merge objects recursively instead of shallow replacing the keys

## [v0.1.0] - 2019-07-30
- First officially published version.

[v0.1.0]: https://gitlab.com/GCSBOSS/confort/-/tags/v0.1.0
[v0.1.1]: https://gitlab.com/GCSBOSS/confort/-/tags/v0.1.1
[v0.1.2]: https://gitlab.com/GCSBOSS/confort/-/tags/v0.1.2
[v0.1.3]: https://gitlab.com/GCSBOSS/confort/-/tags/v0.1.3
[v0.1.4]: https://gitlab.com/GCSBOSS/confort/-/tags/v0.1.4
[v0.2.0]: https://gitlab.com/GCSBOSS/confort/-/tags/v0.2.0
