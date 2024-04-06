import { toJS, resolve, versionCheck } from './util';
import { Document } from './document';
import { parse } from './parser';

import type { AsyncAPIObject } from './spec-types';

/**
 *
 * @param {string[]} files Array of stringified AsyncAPI documents in YAML
 * format, that are to be bundled (or array of filepaths, resolved and passed
 * via `Array.map()` and `fs.readFileSync`, which is the same, see `README.md`).
 * @param {Object} [options]
 * @param {string | object} [options.base] Base object whose properties will be
 * retained.
 * @param {boolean} [options.xOrigin] Pass `true` to generate properties
 * `x-origin` that will contain historical values of dereferenced `$ref`s.
 *
 * @return {Document}
 *
 * @example
 *
 * **TypeScript**
 * ```ts
 * import { readFileSync, writeFileSync } from 'fs';
 * import bundle from '@asyncapi/bundler';
 *
 * async function main() {
 *   const document = await bundle([readFileSync('./main.yaml', 'utf-8')], {
 *     xOrigin: true,
 *   });
 *
 *   console.log(document.yml()); // the complete bundled AsyncAPI document
 *   writeFileSync('asyncapi.yaml', document.yml());  // the complete bundled AsyncAPI document
 * }
 *
 * main().catch(e => console.error(e));
 * ```
 *
 * **JavaScript CJS module system**
 * ```js
 * 'use strict';
 *
 * const { readFileSync, writeFileSync } = require('fs');
 * const bundle = require('@asyncapi/bundler');
 *
 * async function main() {
 *   const document = await bundle([readFileSync('./main.yaml', 'utf-8')], {
 *     xOrigin: true,
 *   });
 *   writeFileSync('asyncapi.yaml', document.yml());
 * }
 *
 * main().catch(e => console.error(e));
 * ```
 *
 * **JavaScript ESM module system**
 * ```js
 * 'use strict';
 *
 * import { readFileSync, writeFileSync } from 'fs';
 * import bundle from '@asyncapi/bundler';
 *
 * async function main() {
 *   const document = await bundle([readFileSync('./main.yaml', 'utf-8')], {
 *     xOrigin: true,
 *   });
 *   writeFileSync('asyncapi.yaml', document.yml());
 * }
 *
 * main().catch(e => console.error(e)); 
 * ```
 *
 */
export default async function bundle(files: string[], options: any = {}) {
  const parsedJsons = files.map(file => toJS(file)) as AsyncAPIObject[];

  const majorVersion = versionCheck(parsedJsons);

  if (typeof options.base !== 'undefined') {
    options.base = toJS(options.base);
    await parse(options.base, majorVersion, options);
  }
  
  const resolvedJsons: AsyncAPIObject[] = await resolve(parsedJsons, majorVersion, options);
  
  return new Document(resolvedJsons, options.base);
}

// 'module.exports' is added to maintain backward compatibility with Node.js
// projects, that use CJS module system.
module.exports = bundle;
