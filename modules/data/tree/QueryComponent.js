"use strict";

/**
 * @function $data.QueryComponent.create
 * @param {string} queryComponentStr
 * @returns {$data.QueryComponent}
 */

/**
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
            var safeSplit = $utils.safeSplit,
                // separating key & value tokens
                componentTokens = safeSplit(queryComponentStr, ':'),
                keyTokens = componentTokens[0] &&
                    $data.QC_KEY_TOKENIZER.exec(componentTokens[0]),
                valueTokens = componentTokens[1] &&
                    $data.QC_VALUE_TOKENIZER.exec(componentTokens[1]),
                keyWildcardToken = keyTokens && keyTokens[1],
                keyNegatorToken = keyTokens && keyTokens[2],
                keyOptionsToken = keyTokens && keyTokens[3],
                valuePrimitiveToken = valueTokens && valueTokens[1],
                valueWildcardToken = valueTokens && valueTokens[2],
                valueNegatorToken = valueTokens && valueTokens[3],
                valueOptionsToken = valueTokens && valueTokens[4];

            /**
             * @type {boolean}
             * @private
             */
            this._isSkipper = keyWildcardToken === '**';

            /**
             * @type {boolean}
             * @private
             */
            this._matchesAnyKey = keyWildcardToken === '*';

            /**
             * @type {boolean}
             * @private
             */
            this._isKeyNegated = keyNegatorToken === '!';

            /**
             * @type {Array}
             * @private
             */
            this._keyOptions = keyOptionsToken && safeSplit(keyOptionsToken, ',')
                    .map(this.unescapeQueryComponent);

            /**
             * @type {boolean}
             * @private
             */
            this._matchesPrimitiveValues = valuePrimitiveToken === '$';

            /**
             * @type {boolean}
             * @private
             */
            this._matchesAnyValue = valueWildcardToken === '*' ||
                valuePrimitiveToken === undefined &&
                valueWildcardToken === undefined &&
                valueOptionsToken === undefined;

            /**
             * @type {boolean}
             * @private
             */
            this._isValueNegated = valueNegatorToken === '!';

            /**
             * @type {*}
             * @private
             */
            this._valueOptions = valueOptionsToken && safeSplit(valueOptionsToken, ',')
                    .map(this.unescapeQueryComponent);
        },

        /**
         * Returns string representation of query component.
         * @returns {string}
         */
        toString: function () {
            return [
                // key
                this._isSkipper ? '**' : undefined,
                this._matchesAnyKey ?
                    this._isKeyNegated ? '' : '*' :
                    undefined,
                this._isKeyNegated ? '!' : undefined,
                this._keyOptions ? this._keyOptions
                    .map(this.escapeQueryComponent)
                    .join(',') :
                    undefined,

                // value
                this._isSkipper ? undefined : [
                    ':',
                    this._matchesPrimitiveValues ? '$' : undefined,
                    this._matchesAnyValue ?
                        this._isValueNegated ? '' : '*' :
                        undefined,
                    this._isValueNegated ? '!' : undefined,
                    this._valueOptions ? this._valueOptions
                        .map(this.escapeQueryComponent)
                        .join(',') :
                        undefined
                ].join('')
            ].join('');
        },

        /**
         * @param {string} queryComponentStr
         * @returns {string}
         */
        escapeQueryComponent: function (queryComponentStr) {
            return $utils.escape(queryComponentStr, $data.QC_SPECIAL_CHARS);
        },

        /**
         * @param {string} queryComponentStr
         * @returns {string}
         */
        unescapeQueryComponent: function (queryComponentStr) {
            return $utils.unescape(queryComponentStr, $data.QC_SPECIAL_CHARS);
        }
    });

$oop.copyProperties($data, /** @lends $data */{
    /**
     * Special characters in query components. (To be escaped.)
     * @constant
     */
    QC_SPECIAL_CHARS: '*.,:!$',

    /**
     * Tokenizes key or value portion of query component.
     * @constant
     */
    QC_KEY_TOKENIZER: /^(\*\*|\*)?(!)?(.*)$/,

    /**
     * Tokenizes key or value portion of query component.
     * @constant
     */
    QC_VALUE_TOKENIZER: /^(\$)|(\*)?(!)?(.*)$/
});

$oop.copyProperties(String.prototype, /** @lends String# */{
    /**
     * @returns {$data.QueryComponent}
     */
    toQueryComponent: function () {
        return $data.QueryComponent.create(this);
    }
});
