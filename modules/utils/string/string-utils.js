"use strict";

$oop.copyProperties($utils, /** @lends $utils */{
    /**
     * Pairs up character sets with escape regular expressions.
     * @type {object}
     * @constant
     * @private
     */
    _escapeRegexpLookup: {},

    /**
     * Pairs up character sets with un-escape regular expressions.
     * @type {object}
     * @constant
     * @private
     */
    _unescapeRegexpLookup: {},

    /**
     * Cached splitter regular expressions.
     * @constant
     * @private
     */
    _separatorRegexpLookup: {},

    /**
     * Serializes variables. Returns strings unchanged, converts numbers and
     * booleans to string, calls .toString() on Objects, returns empty string
     * for undefined, null, and functions.
     * @function $utils.stringify
     * @param {*} [stringifiable]
     * @returns {string}
     */
    stringify: function (stringifiable) {
        switch (typeof stringifiable) {
        case 'string':
            return stringifiable;
        case 'object':
            if (stringifiable instanceof Object) {
                return stringifiable.toString();
            } else {
                return '';
            }
            break;
        case 'boolean':
        case 'number':
            return String(stringifiable);
        default:
        case 'function':
        case 'undefined':
            return '';
        }
    },

    /**
     * Escapes specified characters in specified string.
     * @param {string} string
     * @param {string} chars
     * @returns {string}
     */
    escape: function (string, chars) {
        var escapeRegexpLookup = $utils._escapeRegexpLookup,
            re = escapeRegexpLookup[chars];

        if (!re) {
            re = escapeRegexpLookup[chars] = new RegExp('\\\\|[' + chars + ']', 'g');
        }

        return string.replace(re, '\\$&');
    },

    /**
     * Un-escapes specified characters in specified string.
     * @param {string} string
     * @param {string} chars
     * @returns {string}
     */
    unescape: function (string, chars) {
        var unescapeRegexpLookup = $utils._unescapeRegexpLookup,
            re = unescapeRegexpLookup[chars];

        if (!re) {
            re = unescapeRegexpLookup[chars] = new RegExp('\\\\(\\\\|[' + chars + '])', 'g');
        }

        return string.replace(re, '$1');
    },

    /**
     * Splits string safely along the specified separator, leaving escaped
     * separators unaffected.
     * @param {string} string
     * @param {string} separator
     * @returns {string[]}
     */
    safeSplit: function (string, separator) {
        var separatorLookup = $utils._separatorRegexpLookup,
            re = separatorLookup[separator],
            hits,
            indexBefore,
            indexAfter,
            result;

        if (!re) {
            // adding separator regexp to cache
            re = separatorLookup[separator] = new RegExp('[^\\\\][' + separator + ']', 'g');
        }

        // leading separator can't be matched by regexp
        if (string[0] === separator) {
            result = [''];
            indexBefore = 1;
        } else {
            result = [];
            indexBefore = 0;
        }

        // adding tokens up to last separator
        while ((hits = re.exec(string)) !== null) {
            indexAfter = hits.index + 1;
            result.push(string.slice(indexBefore, indexAfter));
            indexBefore = indexAfter + 1;
        }

        // adding token beyond last separator
        result.push(string.slice(indexBefore));

        return result;
    }
});
