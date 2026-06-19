# Changelog

All notable changes to `go-quicktype` are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0](https://github.com/eSlider/go-quicktype/compare/v0.1.0...v0.2.0) (2026-06-19)


### Features

* add backendless browser web app with GitHub Pages deploy ([bc9229e](https://github.com/eSlider/go-quicktype/commit/bc9229e13369915b4db24ce1cb07764c213d0e1c))
* Add support for json_annotation in Dart ([#2266](https://github.com/eSlider/go-quicktype/issues/2266)) ([2f1f0d3](https://github.com/eSlider/go-quicktype/commit/2f1f0d31781456613e2bf837162a44c933ad17aa))
* add typescript-effect-schema language ([#2312](https://github.com/eSlider/go-quicktype/issues/2312)) ([fed3738](https://github.com/eSlider/go-quicktype/commit/fed3738eda530454454a0ca23855f2b1cc84e3b2))
* **dart:** add [@freezed](https://github.com/freezed) classes support ([b6bc97a](https://github.com/eSlider/go-quicktype/commit/b6bc97aa56f3caf23a568f07c5deeaf07023c27c))
* **dart:** add [@freezed](https://github.com/freezed) classes support ([3fb9d06](https://github.com/eSlider/go-quicktype/commit/3fb9d063ab8e9a3d3ef6258fd5b6df821d3321b6))
* export MultiFileRenderResult ([aedfdd2](https://github.com/eSlider/go-quicktype/commit/aedfdd2f4976fc69c47fb52a5fe81c250ac890e3))
* export MultiFileRenderResult ([f0475f8](https://github.com/eSlider/go-quicktype/commit/f0475f85272ac54bc96c64813127999bb08a62fd))
* expose various emit functions to subclasses ([#2658](https://github.com/eSlider/go-quicktype/issues/2658)) ([96f888e](https://github.com/eSlider/go-quicktype/commit/96f888ed4b6f9062870ddeaa7b9c047ab1b4d09f))
* **Go:** Add support for custom tags generation ([#2286](https://github.com/eSlider/go-quicktype/issues/2286)) ([9a8be68](https://github.com/eSlider/go-quicktype/commit/9a8be68d0b102a8cee9ea14c94fc3d798526a007))
* **Golang:** Add support for native golang Date/Time types ([#2306](https://github.com/eSlider/go-quicktype/issues/2306)) ([1f89a97](https://github.com/eSlider/go-quicktype/commit/1f89a9710f35a96da070e4c3c445e208deee197f))
* Haskell language ([74c5a32](https://github.com/eSlider/go-quicktype/commit/74c5a32f6e3b90a514f508a83eeb5a668debc254))
* Haskell language ([6e75334](https://github.com/eSlider/go-quicktype/commit/6e75334677bad327ff0bb0017493d2deb8672d85))
* Make the input name optional ([#2209](https://github.com/eSlider/go-quicktype/issues/2209)) ([5751712](https://github.com/eSlider/go-quicktype/commit/57517129aec91a55dd47f246139302714d710ee1))
* **python:** add --pydantic-base-model option ([#2604](https://github.com/eSlider/go-quicktype/issues/2604)) ([37320e7](https://github.com/eSlider/go-quicktype/commit/37320e76f718b2778f90db2a89cfd69a078fb980))
* **Rust:** Use rename_all ([#2214](https://github.com/eSlider/go-quicktype/issues/2214)) ([4c23429](https://github.com/eSlider/go-quicktype/commit/4c23429baf805a62616e7d3ad9caef548c718383))
* Support more leading comment types ([#2482](https://github.com/eSlider/go-quicktype/issues/2482)) ([c188aba](https://github.com/eSlider/go-quicktype/commit/c188abad9c71d440117c86e1d7ce72a83bcb191e))
* **web:** add CodeMirror editors with system theme and Vuetify layout ([46628cf](https://github.com/eSlider/go-quicktype/commit/46628cfda339612b561f5549e07212fa42664f15))


### Bug Fixes

* "List" should be one of Java keywords ([#1969](https://github.com/eSlider/go-quicktype/issues/1969)) ([e00e6e9](https://github.com/eSlider/go-quicktype/commit/e00e6e903d2aa9192e822a61b30aa19236b33b39))
* [#1592](https://github.com/eSlider/go-quicktype/issues/1592) c++ type re-definition errors ([#1941](https://github.com/eSlider/go-quicktype/issues/1941)) ([e9e68d7](https://github.com/eSlider/go-quicktype/commit/e9e68d71ededf2006e3470a1a3816308643301fa))
* 2144 ([97224b2](https://github.com/eSlider/go-quicktype/commit/97224b2e122d50d7ced7f0a88df8c92bf938a403))
* **C#:** added dependency usings based on types present in renderContext ([#2606](https://github.com/eSlider/go-quicktype/issues/2606)) ([ea36c22](https://github.com/eSlider/go-quicktype/commit/ea36c22e5c0cffa2d38319c4a51acff22c991b9d))
* **ci:** make env.sh idempotent and slim Pages build setup ([4b2e975](https://github.com/eSlider/go-quicktype/commit/4b2e9750048263d7fc2fdcfc995f57e1a1eb813b))
* **ci:** unblock release-please and fix web deploy build ([c6a5d8d](https://github.com/eSlider/go-quicktype/commit/c6a5d8d89baa0c1a8d15d5af6a23d48bf8c2f7b2))
* **ci:** use jq to inject VITE_APP_VERSION in Pages deploy ([a430f87](https://github.com/eSlider/go-quicktype/commit/a430f875630fc81683ffdcc021180234b962c5af))
* combinations1.json throw exception ([40d1557](https://github.com/eSlider/go-quicktype/commit/40d15575f13f4538e6a236f2d0c1a839aa1383f2))
* const generation for types other than string [#2325](https://github.com/eSlider/go-quicktype/issues/2325) ([#2327](https://github.com/eSlider/go-quicktype/issues/2327)) ([6f25000](https://github.com/eSlider/go-quicktype/commit/6f250008445822f9b08984d2d9c95c57a1c8bdda))
* **core:** add missing lodash dependency to quicktype-core ([f31b1c5](https://github.com/eSlider/go-quicktype/commit/f31b1c545875f29f79b40b902ea2484b121f4337))
* **core:** add missing lodash dependency to quicktype-core ([362918a](https://github.com/eSlider/go-quicktype/commit/362918aff851876c24f9ea967d29680714f065cd))
* **dart:** fix blank line if `just-types` enabled ([ba23746](https://github.com/eSlider/go-quicktype/commit/ba237468cbd2123b4f4bb246590ecb796c6ec69c))
* direct-union.schema ([f7b2c2e](https://github.com/eSlider/go-quicktype/commit/f7b2c2ec481aa4c506a0cbda2bef5908e6c73c73))
* double shared_ptr error in wstring ([40d1557](https://github.com/eSlider/go-quicktype/commit/40d15575f13f4538e6a236f2d0c1a839aa1383f2))
* Emit top level primitives for missing Languages ([#2552](https://github.com/eSlider/go-quicktype/issues/2552)) ([32028a8](https://github.com/eSlider/go-quicktype/commit/32028a89cae28ca3b4a18bd3f48cb833f65b9e5d))
* enum + option (from test bug427.json) ([40d1557](https://github.com/eSlider/go-quicktype/commit/40d15575f13f4538e6a236f2d0c1a839aa1383f2))
* enum property overriding when using $ref [#2319](https://github.com/eSlider/go-quicktype/issues/2319) ([#2326](https://github.com/eSlider/go-quicktype/issues/2326)) ([bb5f033](https://github.com/eSlider/go-quicktype/commit/bb5f03357df2ccf3bc2c263d07d59e7f357d443c))
* Expose the prefer-const-values Typescript language setting via CLI ([317deef](https://github.com/eSlider/go-quicktype/commit/317deefa6a0c8ba0201b9b2b50d00c7e93c41d78))
* Extend OptionDefinition from command-line-args, fix positional arg bug ([#2767](https://github.com/eSlider/go-quicktype/issues/2767)) ([4195020](https://github.com/eSlider/go-quicktype/commit/41950205609abd8c18a8e315ea87d8904f625012))
* **Golang:** fix enums generation ([#2309](https://github.com/eSlider/go-quicktype/issues/2309)) ([90be425](https://github.com/eSlider/go-quicktype/commit/90be42511604485f6d78be5d1458ca3aa2083906))
* **golang:** fix output file names case sensitivity (unnecessary lowercasing filename characters) ([#2289](https://github.com/eSlider/go-quicktype/issues/2289)) ([f9e842d](https://github.com/eSlider/go-quicktype/commit/f9e842d65ed2ad3afba9ed79ec2815474ebd5d49))
* increase --help output width from 80 to 120 ([#2391](https://github.com/eSlider/go-quicktype/issues/2391)) ([8a602d3](https://github.com/eSlider/go-quicktype/commit/8a602d3fe18e524829a2f4af760274c83baafcc7))
* link in README ([#2273](https://github.com/eSlider/go-quicktype/issues/2273)) ([7365186](https://github.com/eSlider/go-quicktype/commit/7365186ddca86cddf92790e8f2db4067b1c3f750))
* Make private members of TypeScriptZodRenderer protected ([#2476](https://github.com/eSlider/go-quicktype/issues/2476)) ([0427ff6](https://github.com/eSlider/go-quicktype/commit/0427ff6b7e913956ea97a869b5408b4d77cd692a))
* missing description emit when freezed is used ([#2394](https://github.com/eSlider/go-quicktype/issues/2394)) ([9d1ad9a](https://github.com/eSlider/go-quicktype/commit/9d1ad9a7539c3dfba77075dfb28c885c4d4d962b))
* optional union ([40d1557](https://github.com/eSlider/go-quicktype/commit/40d15575f13f4538e6a236f2d0c1a839aa1383f2))
* Options parse check ([#2723](https://github.com/eSlider/go-quicktype/issues/2723)) ([088dadc](https://github.com/eSlider/go-quicktype/commit/088dadca2afb8200b083e1b73321638398c266d3))
* punycode error for non CI ([#2587](https://github.com/eSlider/go-quicktype/issues/2587)) ([c7837e6](https://github.com/eSlider/go-quicktype/commit/c7837e64f893c801b6ccfb2a7d85e793d543cc5f))
* Resolve ReadableStream types issue in test suite ([#2581](https://github.com/eSlider/go-quicktype/issues/2581)) ([49e9e03](https://github.com/eSlider/go-quicktype/commit/49e9e032af255f4d1c70603a5c2045b2265c841d))
* Restores old build output by removing package.json import ([#2596](https://github.com/eSlider/go-quicktype/issues/2596)) ([2d4ce03](https://github.com/eSlider/go-quicktype/commit/2d4ce03d7eaf85e6ea8da72e28d8a693c90906e4))
* Revert GH Actions to use Ubuntu 22.04 ([#2701](https://github.com/eSlider/go-quicktype/issues/2701)) ([63db12c](https://github.com/eSlider/go-quicktype/commit/63db12c42317e198d7c1868da945b48cfbd7a85c))
* **ts-input:** Replace topLevelName for TypeScript input if first type is export default ([#2550](https://github.com/eSlider/go-quicktype/issues/2550)) ([a550841](https://github.com/eSlider/go-quicktype/commit/a5508419b3678cbcb278bab1cd9e7b089e7d3174))
* Typescript zod (and effect) language uses block scoped variables before they've been declared ([#2419](https://github.com/eSlider/go-quicktype/issues/2419)) ([cab3d94](https://github.com/eSlider/go-quicktype/commit/cab3d94302406dfc85f5c4f02aa7197b141d8a35))
* union type with only one type (test list.json) ([40d1557](https://github.com/eSlider/go-quicktype/commit/40d15575f13f4538e6a236f2d0c1a839aa1383f2))
* update `dist/index.js` to `dist/src/index.js` ([#2594](https://github.com/eSlider/go-quicktype/issues/2594)) ([50713eb](https://github.com/eSlider/go-quicktype/commit/50713eb075a0198fca18cca6ac312fab1601e064))
* **web:** avoid Vuetify system theme crash on CDN build ([143e792](https://github.com/eSlider/go-quicktype/commit/143e792fd7fac9c5c4e6cea7f214f06734b40d5f))
* **web:** render boolean and enum renderer options correctly ([b35c341](https://github.com/eSlider/go-quicktype/commit/b35c3417d032da07d66c050d3daf2f2b757385d4))


### Code Refactoring

* **dart:** fix lint problems ([197b548](https://github.com/eSlider/go-quicktype/commit/197b548331dcdd6e6ffa4ef68e77ebe61bb6b5a0))
* Fixes some easier dependency cycles ([#2605](https://github.com/eSlider/go-quicktype/issues/2605)) ([29bb816](https://github.com/eSlider/go-quicktype/commit/29bb8160660a7daa2a837ac0cb1e92f99729ad8e))
* Split monolithic language files into dirs with component files ([#2564](https://github.com/eSlider/go-quicktype/issues/2564)) ([be6a937](https://github.com/eSlider/go-quicktype/commit/be6a937dbfdc28ccffa771eefbe2c0b2e2f517fe))
* update fetch import for node v21+ compatibility ([#2573](https://github.com/eSlider/go-quicktype/issues/2573)) ([8d4169b](https://github.com/eSlider/go-quicktype/commit/8d4169bf2dcad7c678bf941e554b629b0d79f024))
* **web:** replace CodeMirror with Ace Editor from CDN ([2ee7146](https://github.com/eSlider/go-quicktype/commit/2ee7146d16cc53acc11bfe7ee3959b0b9e6b45c3))
* **web:** replace React/Vite UI with Vuetify CDN and Bun build ([9e0b75f](https://github.com/eSlider/go-quicktype/commit/9e0b75f7ed644808446acc4e8e17a70b232e10f8))
* **web:** use switches for boolean renderer options ([a519a11](https://github.com/eSlider/go-quicktype/commit/a519a11b22108b9a3aa62a63db95819753fa31e9))

## [0.1.0](https://github.com/eSlider/go-quicktype/releases/tag/v0.1.0) (2026-06-18)

### Features

* **web:** backendless browser app — JSON, JSON Schema, TypeScript, and GraphQL input with 25+ output languages via bundled `quicktype-core`
* **ci:** GitHub Pages deployment and release-please automated SemVer
