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
 * - `*` (Asterisk) Matches any key or value. When doubled, (`**`) will
 * match any key plus skip forward on the  path until next query component is
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
             * @type {boolean}
             * @private
             */
            this._isSkipper = false;

            /**
             * @type {boolean}
             * @private
             */
            this._isKeyExcluded = false;

            /**
             * @type {boolean}
             * @private
             */
            this._matchesAnyKey = true;

            /**
             * @type {string[]}
             * @private
             */
            this._keyOptions = undefined;

            /**
             * @type {Object}
             * @private
             */
            this._keyOptionLookup = undefined;

            /**
             * @type {boolean}
             * @private
             */
            this._matchesPrimitiveValues = false;

            /**
             * @type {boolean}
             * @private
             */
            this._isValueExcluded = false;

            /**
             * @type {boolean}
             * @private
             */
            this._matchesAnyValue = true;

            /**
             * @type {Array}
             * @private
             */
            this._valueOptions = undefined;

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

            this._isSkipper = keySkipperToken === '**';

            this._isKeyExcluded = keyExclusionToken === '!';

            this._matchesAnyKey = !this._isKeyExcluded && (
                this._isSkipper ||
                keyWildcardToken === '*');

            if (keyOptionsToken !== undefined) {
                this.setKeyOptions(safeSplit(keyOptionsToken, ',')
                    .map($data.unescapeQueryComponent));
            }

            this._matchesPrimitiveValues = valuePrimitiveToken === '$';

            this._isValueExcluded = valueExclusionToken === '!';

            this._matchesAnyValue = !this._isValueExcluded && (
                this._isSkipper ||
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
            cloned._keyOptions = slice.call(this._keyOptions);
            cloned._keyOptionLookup = $data.shallowCopy(this._keyOptionLookup);
            cloned._matchesAnyKey = this._matchesAnyKey;
            cloned._isKeyExcluded = this._isKeyExcluded;
            cloned._valueOptions = slice.call(this._valueOptions);
            cloned._matchesAnyValue = this._matchesAnyValue;
            cloned._isValueExcluded = this._isValueExcluded;
            return cloned;
        },

        /**
         * Returns string representation of query component.
         * @returns {string}
         */
        toString: function () {
            return [
                // key
                this._isSkipper ? '**' : undefined,
                this._matchesAnyKey && !this._isSkipper ?
                    this._isKeyExcluded ? '' : '*' :
                    undefined,
                this._isKeyExcluded ? '!' : undefined,
                this._keyOptions ? this._keyOptions
                    .map($data.escapeQueryComponent)
                    .join(',') :
                    undefined,

                // value
                this._isSkipper ? undefined : [
                    this._matchesAnyValue ? undefined : ':',
                    this._matchesPrimitiveValues ? '$' : undefined,
                    this._isValueExcluded ? '!' : undefined,
                    this._valueOptions ? this._valueOptions
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
            return (this._matchesAnyKey ||
                // b) pathComponent is (not) one of the available options
                (this._isKeyExcluded ?
                    !hOP.call(this._keyOptionLookup, key) :
                    hOP.call(this._keyOptionLookup, key))) &&

                // and
                // c) either matches any value,
                (this._matchesAnyValue ||
                // d) matches primitives and value is primitive, or,
                this._matchesPrimitiveValues &&
                (typeof value !== 'object' || value === null) ||
                // e) value is (not) one of the available options
                !!this._valueOptions && (this._isValueExcluded ?
                    // can't use lookup as values may be other than strings
                    // hence value matching is slower than key matching
                    this._valueOptions.indexOf(value) === -1 :
                    this._valueOptions.indexOf(value) > -1));
        },

        /**
         * @param {string[]} keyOptions
         * @returns {$data.QueryComponent}
         */
        setKeyOptions: function (keyOptions) {
            this._keyOptions = keyOptions;
            this._keyOptionLookup = this._arrayToLookup(keyOptions);
            this._matchesAnyKey = false;
            return this;
        },

        /**
         * @todo Pass keyOptions or rename to setKeyExcluded?
         * @returns {$data.QueryComponent}
         */
        excludeKeyOptions: function () {
            this._isKeyExcluded = true;
            return this;
        },

        /**
         * @param {Array} valueOptions
         * @returns {$data.QueryComponent}
         */
        setValueOptions: function (valueOptions) {
            this._valueOptions = valueOptions;
            this._matchesAnyValue = false;
            return this;
        },

        /**
         * @todo Pass valueOptions or rename to setValueExcluded?
         * @returns {$data.QueryComponent}
         */
        excludeValueOptions: function () {
            this._isValueExcluded = true;
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
