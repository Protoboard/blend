"use strict";

/**
 * @function $data.QueryComponent.create
 * @param {string} [queryComponentStr] String representation of query component
 * @returns {$data.QueryComponent}
 */

/**
 * Matches a single key-value pair. An array of `QueryComponent`s make up a
 * {@link $data.Query}.
 * Special characters in query components:
 * - `*` (Asterisk) Matches any key or value. When doubled, (`**`) will match
 * any key plus skip forward on the  path until next query component is
 * matched. Skipper query components allow key options to be excluded.
 * - `,` (Comma) Separates key or value options
 * - `:` (Colon) Separates key and value
 * - `!` (Exclamation mark) Excludes key or value options
 * - `$` (Dollar sign) Matches primitive values (string, number, boolean,
 * `null`, `undefined`)
 * @class $data.QueryComponent
 * @mixes $utils.Cloneable
 * @implements $utils.Stringifiable
 * @implements $data.Matchable
 * @todo Add return marker.
 * @example
 * $data.QueryComponent.create("foo:bar") // matches a specific pair
 * $data.QueryComponent.create("*:bar") // matches pair where value is "bar"
 */
$data.QueryComponent = $oop.getClass('$data.QueryComponent')
.extend($utils.Cloneable)
.implement($utils.Stringifiable)
.implement($oop.getClass('$data.Matchable'))
.define(/** @lends $data.QueryComponent# */{
  /**
   * @param {string} [queryComponentStr]
   * @ignore
   */
  init: function (queryComponentStr) {
    /**
     * Whether to skip matching path components (keys) until next path
     * component is matched by the next `QueryComponent` in a
     * {@link $data.Query}.
     * @member {boolean} $data.QueryComponent#isSkipper
     */
    this.isSkipper = false;

    /**
     * Whether to exclude specified key options.
     * @member {boolean} $data.QueryComponent#isKeyExcluded
     * @see $data.QueryComponent#keyOptions
     */
    this.isKeyExcluded = false;

    /**
     * Whether `QueryComponent` matches any key in a key-value pair.
     * @member {boolean} $data.QueryComponent#matchesAnyKey
     * @default true
     */
    this.matchesAnyKey = true;

    /**
     * List of keys to be matched. For iterating over options and access to
     * option count.
     * @member {string[]} $data.QueryComponent#keyOptions
     */
    this.keyOptions = undefined;

    /**
     * List of keys to be matched. For checking whether a key option is present.
     * @member {Object} $data.QueryComponent#keyOptionLookup
     */
    this.keyOptionLookup = undefined;

    /**
     * Whether `QueryComponent` matches primitive values only. (String, number,
     * boolean, & `null`.)
     * @member {boolean} $data.QueryComponent#matchesPrimitiveValues
     */
    this.matchesPrimitiveValues = false;

    /**
     * Whether to exclude specified value options.
     * @member {boolean} $data.QueryComponent#isValueExcluded
     * @see $data.QueryComponent#valueOptions
     */
    this.isValueExcluded = false;

    /**
     * Whether `QueryComponent` matches any value in a key-value pair. Query
     * components except for the last one in a query usually have this flag set.
     * @member {boolean} $data.QueryComponent#matchesAnyValue
     * @default true
     */
    this.matchesAnyValue = true;

    /**
     * List of keys to be matched.
     * @member {Array} $data.QueryComponent#valueOptions
     */
    this.valueOptions = undefined;

    if (queryComponentStr !== undefined) {
      this._parseQueryComponentString(queryComponentStr);
    }
  },

  /**
   * @todo Move to namespace?
   * @param {Array} array
   * @returns {Object}
   * @private
   */
  _arrayToLookup: function (array) {
    var count = array.length,
        i,
        result = {};
    for (i = 0; i < count; i++) {
      result[array[i]] = 1;
    }
    return result;
  },

  /**
   * @param {string} queryComponentStr
   * @private
   */
  _parseQueryComponentString: function (queryComponentStr) {
    var safeSplit = $utils.safeSplit,
        // separating key & value tokens
        componentTokens = safeSplit(queryComponentStr, ':'),
        keyTokens = componentTokens[0] &&
            $data.QUERY_COMPONENT_KEY_TOKENIZER.exec(componentTokens[0]),
        valueTokens = componentTokens[1] &&
            $data.QUERY_COMPONENT_VALUE_TOKENIZER.exec(componentTokens[1]),
        keyWildcardToken = keyTokens && keyTokens[1],
        keySkipperToken = keyTokens && keyTokens[2],
        keyExclusionToken = keyTokens && keyTokens[3],
        keyOptionsToken = keyTokens && keyTokens[4],
        valuePrimitiveToken = valueTokens && valueTokens[1],
        valueWildcardToken = valueTokens && valueTokens[2],
        valueExclusionToken = valueTokens && valueTokens[3],
        valueOptionsToken = valueTokens && valueTokens[4];

    this.isSkipper = keySkipperToken === '**';

    this.isKeyExcluded = keyExclusionToken === '!';

    this.matchesAnyKey = !this.isKeyExcluded && (
        this.isSkipper ||
        keyWildcardToken === '*');

    if (keyOptionsToken !== undefined) {
      this.setKeyOptions(safeSplit(keyOptionsToken, ',')
      .map($data.unescapeQueryComponent));
    }

    this.matchesPrimitiveValues = valuePrimitiveToken === '$';

    this.isValueExcluded = valueExclusionToken === '!';

    this.matchesAnyValue = !this.isValueExcluded && (
        this.isSkipper ||
        valueWildcardToken === '*' ||
        valuePrimitiveToken === undefined &&
        valueWildcardToken === undefined &&
        valueOptionsToken === undefined);

    if (valueOptionsToken !== undefined) {
      this.setValueOptions(safeSplit(valueOptionsToken, ',')
      .map($data.unescapeQueryComponent));
    }
  },

  /**
   * @inheritDoc
   * @returns {$data.QueryComponent}
   */
  clone: function clone() {
    var cloned = clone.returned;
    // properties alterable through methods
    cloned.keyOptions = slice.call(this.keyOptions);
    cloned.keyOptionLookup = $data.shallowCopy(this.keyOptionLookup);
    cloned.matchesAnyKey = this.matchesAnyKey;
    cloned.isKeyExcluded = this.isKeyExcluded;
    cloned.valueOptions = slice.call(this.valueOptions);
    cloned.matchesAnyValue = this.matchesAnyValue;
    cloned.isValueExcluded = this.isValueExcluded;
    return cloned;
  },

  /**
   * Returns string representation of query component.
   * @returns {string}
   */
  toString: function () {
    return [
      // key
      this.isSkipper ? '**' : undefined,
      this.matchesAnyKey && !this.isSkipper ?
          this.isKeyExcluded ? '' : '*' :
          undefined,
      this.isKeyExcluded ? '!' : undefined,
      this.keyOptions ? this.keyOptions
      .map($data.escapeQueryComponent)
      .join(',') :
          undefined,

      // value
      this.isSkipper ? undefined : [
        this.matchesAnyValue ? undefined : ':',
        this.matchesPrimitiveValues ? '$' : undefined,
        this.isValueExcluded ? '!' : undefined,
        this.valueOptions ? this.valueOptions
        .map($data.escapeQueryComponent)
        .join(',') :
            undefined
      ].join('')
    ].join('');
  },

  /**
   * Matches query component against a key-value pair.
   * @param {string} key Key to be matched
   * @param {*} [value] Value to be matched
   * @returns {boolean}
   * @example
   * $data.QueryComponent.create('*:foo').matches('bar', 'foo') // true
   * $data.QueryComponent.create('*:!foo').matches('bar', 'foo') // false
   */
  matches: function (key, value) {
    // a) either matches any key, or,
    return (this.matchesAnyKey ||
        // b) pathComponent is (not) one of the available options
        (this.isKeyExcluded ?
            !hOP.call(this.keyOptionLookup, key) :
            hOP.call(this.keyOptionLookup, key))) &&

        // and
        // c) either matches any value,
        (this.matchesAnyValue ||
        // d) matches primitives and value is primitive, or,
        this.matchesPrimitiveValues &&
        (typeof value !== 'object' || value === null) ||
        // e) value is (not) one of the available options
        !!this.valueOptions && (this.isValueExcluded ?
            // can't use lookup as values may be other than strings
            // hence value matching is slower than key matching
            this.valueOptions.indexOf(value) === -1 :
            this.valueOptions.indexOf(value) > -1));
  },

  /**
   * @param {string[]} keyOptions
   * @returns {$data.QueryComponent}
   */
  setKeyOptions: function (keyOptions) {
    var keyOptionLookup = this._arrayToLookup(keyOptions);
    this.keyOptions = Object.keys(keyOptionLookup);
    this.keyOptionLookup = keyOptionLookup;
    this.matchesAnyKey = false;
    return this;
  },

  /**
   * @todo Pass keyOptions or rename to setKeyExcluded?
   * @returns {$data.QueryComponent}
   */
  excludeKeyOptions: function () {
    this.isKeyExcluded = true;
    return this;
  },

  /**
   * @param {Array} valueOptions
   * @returns {$data.QueryComponent}
   */
  setValueOptions: function (valueOptions) {
    this.valueOptions = valueOptions;
    this.matchesAnyValue = false;
    return this;
  },

  /**
   * @todo Pass valueOptions or rename to setValueExcluded?
   * @returns {$data.QueryComponent}
   */
  excludeValueOptions: function () {
    this.isValueExcluded = true;
    return this;
  }
});

$oop.copyProperties($data, /** @lends $data */{
  /**
   * Special characters in query components. (To be escaped.)
   * @constant
   */
  QUERY_COMPONENT_SPECIAL_CHARS: '*,:!$',

  /**
   * Tokenizes key or value portion of query component.
   * @constant
   */
  QUERY_COMPONENT_KEY_TOKENIZER: /^(?:(\*)|(\*\*)?(!)?(.*)?)$/,

  /**
   * Tokenizes key or value portion of query component.
   * @constant
   */
  QUERY_COMPONENT_VALUE_TOKENIZER: /^(?:(\$)|(\*)|(!)?(.*))$/,

  /**
   * @param {string} queryComponentStr
   * @returns {string}
   */
  escapeQueryComponent: function (queryComponentStr) {
    return $utils.escape(queryComponentStr, $data.QUERY_COMPONENT_SPECIAL_CHARS);
  },

  /**
   * @param {string} queryComponentStr
   * @returns {string}
   */
  unescapeQueryComponent: function (queryComponentStr) {
    return $utils.unescape(queryComponentStr, $data.QUERY_COMPONENT_SPECIAL_CHARS);
  }
});

$oop.copyProperties(String.prototype, /** @lends external:String# */{
  /**
   * @returns {$data.QueryComponent}
   */
  toQueryComponent: function () {
    return $data.QueryComponent.create(this);
  }
});
