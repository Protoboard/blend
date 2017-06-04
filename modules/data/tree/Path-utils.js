"use strict";

$oop.copyProperties($data, /** @lends $data */{
    /**
     * Identifies parts of path component to be escaped.
     * @type {RegExp}
     * @constant
     */
    RE_PATH_COMPONENT_ESCAPE: /\\|[.]/g,

    /**
     * Identifies parts of path component to be un-escaped.
     * @type {RegExp}
     * @constant
     */
    RE_PATH_COMPONENT_UNESCAPE: /\\(\\|[.])/g,

    /**
     * Identifies separator positions within path.
     * @type {RegExp}
     * @constant
     */
    RE_PATH_COMPONENT_SEPARATOR: /[^\\]\./g,

    /**
     * Escapes special characters in path components.
     * @param {string} key
     * @returns {string}
     */
    escapePathComponent: function (key) {
        return key.replace($data.RE_PATH_COMPONENT_ESCAPE, '\\$&');
    },

    /**
     * Un-escapes special characters in path components.
     * @param {string} key
     * @returns {string}
     */
    unescapePathComponent: function (key) {
        return key.replace($data.RE_PATH_COMPONENT_UNESCAPE, '$1');
    },

    /**
     * Splits path safely along component separators, leaving escaped
     * separators unaffected.
     * @param {string} path
     * @returns {string[]}
     */
    safeSplitPath: function (path) {
        var re = $data.RE_PATH_COMPONENT_SEPARATOR,
            hits,
            indexBefore,
            indexAfter,
            result;

        // leading dot can't be matched by regexp
        if (path[0] === $data.PATH_COMPONENT_SEPARATOR) {
            result = [''];
            indexBefore = 1;
        } else {
            result = [];
            indexBefore = 0;
        }

        // adding tokens up to last separator
        while ((hits = re.exec(path)) !== null) {
            indexAfter = hits.index + 1;
            result.push(path.slice(indexBefore, indexAfter));
            indexBefore = indexAfter + 1;
        }

        // adding token beyond last separator
        result.push(path.slice(indexBefore));

        return result;
    }
});
