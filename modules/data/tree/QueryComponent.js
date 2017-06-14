"use strict";

/**
 * @function $data.QueryComponent.create
 * @param {string} queryComponentStr
 * @returns {$data.QueryComponent}
 */

/**
 * TODO: Should we allow mixing skipper/wildcard and negation? Eg. **!foo
 * @class $data.QueryComponent
 * @mixes $utils.Cloneable
 * @implements $utils.Stringifiable
 */
$data.QueryComponent = $oop.getClass('$data.QueryComponent')
    .extend($utils.Cloneable)
    .implement($utils.Stringifiable)
    .define(/** @lends $data.QueryComponent# */{
        /**
         * @param {string} queryComponentStr
         * @ignore
         */
        init: function (queryComponentStr) {
            // separating key & value tokens
            var RE_KEY_VALUE_TOKENIZER = $data.RE_KEY_VALUE_TOKENIZER,
                safeSplit = $utils.safeSplit,
                tokens = safeSplit(queryComponentStr, ':'),
                key = tokens[0],
                value = tokens[1];

            // setting key properties
            switch (key) {
            case '**':
                /**
                 * @type {boolean}
                 * @private
                 */
                this._isSkipper = true;
                break;

            case '*':
            case undefined:
                /**
                 * @type {boolean}
                 * @private
                 */
                this._matchesAnyKey = true;
                break;

            default:
                key = RE_KEY_VALUE_TOKENIZER.exec(key);

                /**
                 * @type {Array}
                 * @private
                 */
                this._keyOptions = key[2] && safeSplit(key[2], ',')
                        .map(this.unescapeQueryComponent);

                /**
                 * @type {boolean}
                 * @private
                 */
                this._isKeyNegated = key[1] === '!';
                break;
            }

            // setting value properties
            switch (value) {
            case '$':
                /**
                 * @type {boolean}
                 * @private
                 */
                this._isValuePrimitive = true;
                break;

            case '*':
            case undefined:
                /**
                 * @type {boolean}
                 * @private
                 */
                this._matchesAnyValue = true;
                break;

            default:
                value = RE_KEY_VALUE_TOKENIZER.exec(value);

                /**
                 * @type {*}
                 * @private
                 */
                this._valueOptions = value[2] && safeSplit(value[2], ',')
                        .map(this.unescapeQueryComponent);

                /**
                 * @type {boolean}
                 * @private
                 */
                this._isValueNegated = value[1] === '!';
                break;
            }
        },

        /**
         * Returns string representation of query component.
         * @returns {string}
         */
        toString: function () {
            var key, value;

            if (this._isSkipper) {
                return '**';
            } else {
                if (this._matchesAnyKey) {
                    key = '*';
                } else {
                    key = (this._isKeyNegated ? '!' : '') +
                        this._keyOptions
                            .map(this.escapeQueryComponent)
                            .join(',');
                }

                if (this._isValuePrimitive) {
                    value = '$';
                } else if (this._matchesAnyValue) {
                    value = '*';
                } else {
                    value = (this._isValueNegated ? '!' : '') +
                        this._valueOptions
                            .map(this.escapeQueryComponent)
                            .join(',');
                }

                return key + ':' + value;
            }
        },

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

$oop.copyProperties($data, /** @lends $data */{
    /**
     * Special characters in query components. (To be escaped.)
     * @constant
     */
    QUERY_COMPONENT_SPECIAL_CHARS: '*.,:!$',

    /**
     * Tokenizes key or value portion of query component.
     * @constant
     */
    RE_KEY_VALUE_TOKENIZER: /^(!?)(.*)$/
});

$oop.copyProperties(String.prototype, /** @lends String# */{
    /**
     * @returns {$data.QueryComponent}
     */
    toQueryComponent: function () {
        return $data.QueryComponent.create(this);
    }
});
