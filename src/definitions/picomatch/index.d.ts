declare module 'picomatch' {
  namespace picomatch {
    type ExpandRangeFn = (start: string, end: string) => string
    type FormatFn = (str: string) => string

    type ResultHandler = (result: Result) => void

    interface Result {
      glob: string
      regex: RegExp
      input: string
      output: string
    }

    interface TestResults {
      isMatch: boolean
      match: string[]
      output: string
    }

    interface ScanResults {
      prefix: string
      input: string
      base: string
      glob: string
      negated: boolean
      isGlob: boolean
    }

    interface Options {
      /**
       * Allow glob patterns without slashes to match a file path based on its basename. Same behavior as [minimatch](https://github.com/isaacs/minimatch) option `matchBase`.
       *
       * @default false
       *
       * @example
       * ```js
       * mm(['a/b.js', 'a/c.md'], '*.js');
       * //=> []
       *
       * mm(['a/b.js', 'a/c.md'], '*.js', {matchBase: true});
       * //=> ['a/b.js']
       * ```
       */
      basename?: boolean
      /**
       * Enabled by default, this option enforces bash-like behavior with stars immediately following a bracket expression.
       * Bash bracket expressions are similar to regex character classes, but unlike regex, a star following a bracket expression **does not repeat the bracketed characters**.
       * Instead, the star is treated the same as an other star.
       *
       * @default true
       *
       * @example
       * ```js
       * var files = ['abc', 'ajz'];
       * console.log(mm(files, '[a-c]*'));
       * //=> ['abc', 'ajz']
       *
       * console.log(mm(files, '[a-c]*', {bash: false}));
       * ```
       */
      bash?: boolean
      /**
       * Return regex matches in supporting methods.
       *
       * @default undefined
       */
      capture?: boolean
      /**
       * Allows glob to match any part of the given string(s).
       *
       * @default undefined
       */
      contains?: boolean
      /**
       * Current working directory. Used by `picomatch.split()`.
       *
       * @default process.cwd()
       */
      cwd?: string
      /**
       * Debug regular expressions when an error is thrown.
       *
       * @default undefined
       */
      debug?: boolean
      /**
       * Match dotfiles. Same behavior as [minimatch](https://github.com/isaacs/minimatch) option `dot`.
       *
       * @default false
       */
      dot?: boolean
      /**
       * Custom function for expanding ranges in brace patterns, such as `{a..z}`.
       * The function receives the range values as two arguments, and it must return a string to be used in the generated regex.
       *
       * It's recommended that the returned strings be wrapped in parentheses.
       *
       * @example
       * ```js
       * const fill = require('fill-range');
       * const regex = pm.makeRe('foo/{01..25}/bar', {
       *   expandRange(a, b) {
       *     return `(${fill(a, b, { toRegex: true })})`;
       *   }
       * });
       *
       * console.log(regex);
       * //=> /^(?:foo\/((?:0[1-9]|1[0-9]|2[0-5]))\/bar)$/
       *
       * console.log(regex.test('foo/00/bar'))  // false
       * console.log(regex.test('foo/01/bar'))  // true
       * console.log(regex.test('foo/10/bar')) // true
       * console.log(regex.test('foo/22/bar')) // true
       * console.log(regex.test('foo/25/bar')) // true
       * console.log(regex.test('foo/26/bar')) // false
       * ```
       *
       * @default undefined
       */
      expandRange?: ExpandRangeFn
      /**
       * Similar to the `--failglob` behavior in Bash, throws an error when no matches are found.
       *
       * @default undefined
       */
      failglob?: boolean
      /**
       * To speed up processing, full parsing is skipped for a handful of common glob patterns.
       *
       * Disable this behavior by setting this option to `false`.
       *
       * @default true
       */
      fastpaths?: boolean
      /**
       * Regex flags to use in the generated regex.
       *
       * If defined, the `nocase` option will be overridden.
       *
       * @default undefined
       * @todo suspect type is incorrect
       */
      flags?: boolean
      /**
       * Custom function for formatting the returned string.
       *
       * This is useful for removing leading slashes, converting Windows paths to Posix paths, etc.
       *
       * @default undefined
       *
       * @example
       * ```js
       * // strip leading './' from strings
       * const format = str => str.replace(/^\.\//, '');
       * const isMatch = picomatch('foo/*.js', { format });
       * console.log(isMatch('./foo/bar.js')); //=> true
       * ```
       */
      format?: FormatFn
      /**
       * String or array of glob patterns to match files to ignore.
       *
       * @default undefined
       */
      ignore?: string | string[]
      /**
       * Retain quotes in the generated regex, since quotes may also be used as an alternative to backslashes.
       *
       * @default false
       */
      keepQuotes?: boolean
      /**
       * When `true`, brackets in the glob pattern will be escaped so that only literal brackets will be matched.
       *
       * @default undefined
       */
      literalBrackets?: boolean
      /**
       * Support regex positive and negative lookbehinds.
       *
       * Note that you must be using Node 8.1.10 or higher to enable regex lookbehinds.
       * @default true
       */
      lookbehinds?: boolean
      /**
       * Alias for [options.basename](#options-basename).
       *
       * @default false
       */
      matchBase?: boolean
      /**
       * Limit the max length of the input string.
       *
       * An error is thrown if the input string is longer than this value.
       *
       * @default 65536
       */
      maxLength?: number
      /**
       * Disable expansion of brace patterns. Same behavior as [minimatch](https://github.com/isaacs/minimatch) option `nobrace`.
       *
       * @default false
       */
      nobrace?: boolean
      /**
       * Disable matching with regex brackets.
       *
       * @default undefined
       */
      nobracket?: boolean
      /**
       * Use a case-insensitive regex for matching files. Same behavior as [minimatch](https://github.com/isaacs/minimatch).
       *
       * @default undefined
       */
      nocase?: boolean
      /**
       * Remove duplicate elements from the result array.
       *
       * @default undefined
       *
       * @example
       * Example of using the `unescape` and `nodupes` options together:
       *
       * ```js
       * mm.match(['a/b/c', 'a/b/c'], 'a/b/c');
       * //=> ['a/b/c', 'a/b/c']
       *
       * mm.match(['a/b/c', 'a/b/c'], 'a/b/c', {nodupes: true});
       * //=> ['abc']
       * ```
       */
      nodupes?: boolean
      /**
       * Disable extglob support, so that extglobs are regarded as literal characters.
       *
       * @default undefined
       *
       * @example
       * ```js
       * mm(['a/z', 'a/b', 'a/!(z)'], 'a/!(z)');
       * //=> ['a/b', 'a/!(z)']
       *
       * mm(['a/z', 'a/b', 'a/!(z)'], 'a/!(z)', {noext: true});
       * //=> ['a/!(z)'] (matches only as literal characters)
       * ```
       */
      noext?: boolean
      /**
       * Disallow negation (`!`) patterns, and treat leading `!` as a literal character to match.
       *
       * @default undefined
       */
      nonegate?: boolean
      /**
       * Disable matching with globstars (`**`).
       *
       * @default undefined
       */
      noglobstar?: boolean
      /**
       * Function to be called on ignored items.
       *
       * @example
       * ```js
       * const onIgnore = ({ glob, regex, input, output }) => {
       *   console.log({ glob, regex, input, output });
       * };
       *
       * const isMatch = picomatch('*', { onIgnore, ignore: 'f*' });
       * isMatch('foo');
       * isMatch('bar');
       * isMatch('baz');
       * ```
       *
       * @default undefined
       */
      onIgnore?: ResultHandler
      /**
       * Function to be called on matched items.
       *
       * @example
       * ```js
       * const onMatch = ({ glob, regex, input, output }) => {
       *   console.log({ glob, regex, input, output });
       * };
       *
       * const isMatch = picomatch('*', { onMatch });
       * isMatch('foo');
       * isMatch('bar');
       * isMatch('baz');
       * ```
       *
       * @default undefined
       */
      onMatch?: ResultHandler
      /**
       * Function to be called on all items, regardless of whether or not they are matched or ignored.
       *
       * @example
       * ```js
       * const onResult = ({ glob, regex, input, output }) => {
       *   console.log({ glob, regex, input, output });
       * };
       *
       * const isMatch = picomatch('*', { onResult, ignore: 'f*' });
       * isMatch('foo');
       * isMatch('bar');
       * isMatch('baz');
       * ```
       *
       * @default undefined
       */
      onResult?: ResultHandler
      /**
       * Support POSX character classes ("posix brackets").
       *
       * @default false
       */
      posix?: boolean
      /**
       * Convert all slashes in file paths to forward slashes.
       * This does not convert slashes in the glob pattern itself.
       *
       * @default undefined
       */
      posixSlashes?: boolean
      /**
       * String to prepend to the generated regex used for matching.
       *
       * @default undefined
       */
      prepend?: boolean
      /**
       * Use regular expression rules for `+` (instead of matching literal `+`),
       * and for stars that follow losing parentheses or brackets (as in `)*` and `]*`).
       *
       * @default false
       */
      regex?: boolean
      /**
       * Throw an error if brackets, braces, or parens are imbalanced.
       *
       * @default undefined
       */
      strictBrackets?: boolean
      /**
       * When `true`, picomatch won't match trailing slashes with single stars.
       *
       * @default undefined
       */
      strictSlashes?: boolean
      /**
       * Remove backslashes from returned matches.
       *
       * @default undefined
       *
       * @example
       * In this example we want to match a literal `*`:
       *
       * ```js
       * mm.match(['abc', 'a\\*c'], 'a\\*c');
       * //=> ['a\\*c']
       *
       * mm.match(['abc', 'a\\*c'], 'a\\*c', {unescape: true});
       * //=> ['a*c']
       * ```
       */
      unescape?: boolean
      /**
       * Convert path separators on returned files to posix/unix-style forward slashes.
       *
       * @default true
       *
       * @example
       * ```js
       * mm.match(['a\\b\\c'], 'a/**');
       * //=> ['a/b/c']
       *
       * mm.match(['a\\b\\c'], {unixify: false});
       * //=> ['a\\b\\c']
       * ```
       */
      unixify?: boolean
    }
  }

  interface Picomatch {
    /**
     * The main function takes a list of strings and one or more glob patterns to use for matching.
     *
     * @param list A list of strings to match
     * @param patterns One or more glob patterns to use for matching.
     * @param options See available options for changing how matches are performed
     * @returns Returns an array of matches
     *
     * @example
     * ```js
     * var mm = require('picomatch');
     * mm(list, patterns[, options]);
     *
     * console.log(mm(['a.js', 'a.txt'], ['*.js']));
     * //=> [ 'a.js' ]
     * ```
     */
    (
      list: string[],
      patterns: string | string[],
      options?: picomatch.Options
    ): string[]

    /**
     * Test `input` with the given `regex`. This is used by the main `picomatch()` function to test the input string.
     *
     * @param {string} input
     * @param {RegExp} regex
     *
     * @returns {picomatch.TestResults}
     */
    test(input: string, regex: RegExp): picomatch.TestResults

    /**
     * Match the basename of a filepath.
     *
     * @param {string} input string to test.
     * @param {RegExp | string} glob glob pattern or regex created by {@link #makeRe}
     *
     * @return {boolean}
     */
    matchBase(input: string, glob: RegExp | string): boolean

    /**
     * Returns true if the specified `string` matches the given glob `pattern`.
     *
     * @param string String to match
     * @param pattern Glob pattern to use for matching.
     * @param options See available options for changing how matches are performed
     * @returns Returns true if the string matches the glob pattern.
     *
     * @example
     * ```js
     * const picomatch = require('picomatch');
     * // picomatch.isMatch(string, patterns[, options]);
     *
     * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
     * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
     * ```
     */
    isMatch(
      string: string | string[],
      pattern: string | string[],
      options?: picomatch.Options
    ): boolean

    /**
     * Scans a glob pattern to separate the pattern into segments.
     *
     * @param {string} input
     * @param {picomatch.Options} options
     *
     * @return {picomatch.ScanResults}
     *
     * @example
     * ```js
     * const picomatch = require('picomatch');
     * // picomatch.scan(input[, options]);
     *
     * const result = picomatch.scan('!./foo/*.js');
     * console.log(result);
     * // { prefix: '!./',
     * //   input: '!./foo/*.js',
     * //   base: 'foo',
     * //   glob: '*.js',
     * //   negated: true,
     * //   isGlob: true }
     * ```
     */
    scan(input: string, options?: picomatch.Options): picomatch.ScanResults

    /**
     * Create a regular expression from the given glob `pattern`.
     *
     * @param pattern A glob pattern to convert to regex.
     * @param options See available options for changing how matches are performed.
     * @returns Returns a regex created from the given pattern.
     *
     * @example
     * ```js
     * const picomatch = require('picomatch');
     * // picomatch.makeRe(input[, options]);
     *
     * console.log(picomatch.makeRe('*.js'));
     * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
     * ```
     */
    makeRe(pattern: string, options?: picomatch.Options): RegExp

    /**
     * Create a regular expression from the given regex source string.
     *
     * @param {string} source
     * @param {picomatch.Options} options
     *
     * @return {RegExp}
     *
     * @example
     * ```js
     * const picomatch = require('picomatch');
     * // picomatch.toRegex(source[, options]);
     *
     * const { output } = picomatch.parse('*.js');
     * console.log(picomatch.toRegex(output));
     * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
     * ```
     */
    toRegex(source: string, options?: picomatch.Options): RegExp

    /**
     * Parse a `glob` pattern to create the source string for a regular expression.
     *
     * @returns Returns an object with useful properties and output to be used as a regex source string.
     *
     * @example
     * ```js
     * const picomatch = require('picomatch');
     * const result = picomatch.parse(glob[, options]);
     * ```
     */
    parse(glob: string, options?: picomatch.Options): object
  }

  const picomatch: Picomatch
  export = picomatch
}
