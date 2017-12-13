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
  _splitterRegexpLookup: {},

  /**
   * Serializes variables. Returns strings unchanged, converts numbers and
   * booleans to string, calls .toString() on Objects, returns empty string for
   * undefined, null, and functions.
   * @function $utils.stringify
   * @param {*} [stringifiable]
   * @returns {string}
   */
  stringify: function (stringifiable) {
    switch (typeof stringifiable) {
    case 'string':
      return stringifiable;
    case 'object':
      return stringifiable instanceof Object ?
          stringifiable.toString() :
          '';
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
    var splitterRegexpLookup = $utils._splitterRegexpLookup,
        re = splitterRegexpLookup[separator],
        tokens, tokenCount,
        i, token, component,
        result = [];

    if (!re) {
      // regexp leaves undefined 'holes' in token list where unescaped
      // separators would be
      re = splitterRegexpLookup[separator] =
          new RegExp('(\\\\[' + separator + '])|[' + separator + ']');
    }

    // joining tokens between holes
    tokens = string.split(re);
    tokenCount = tokens.length;
    for (i = 0, component = ''; i < tokenCount; i++) {
      token = tokens[i];
      if (token === undefined) {
        result.push(component);
        component = '';
      } else {
        component += token;
      }
    }
    result.push(component);

    return result;
  },

  /**
   * Converts a JSON object to a nested array with properties in
   * alphabetical order. Mostly used as identifier when stringified.
   * @param {Object} json
   * @returns {Array|*}
   */
  jsonToSafeJson: function (json) {
    if (json instanceof Array) {
      return ['array'].concat(json.map($utils.jsonToSafeJson));
    } else if (json instanceof Object) {
      return ['object'].concat(Object.keys(json)
      .sort()
      .map(function (key) {
        return [key, $utils.jsonToSafeJson(json[key])];
      }));
    } else {
      return json;
    }
  },

  /**
   * Converts a nested array back to its original form. Safe JSON is mostly
   * used as identifier when stringified.
   * @param {Array|*} safeJson
   * @returns {Object|Array|*}
   */
  safeJsonToJson: function (safeJson) {
    var nodeType;
    if (safeJson instanceof Array) {
      nodeType = safeJson.shift();
      switch (nodeType) {
      case 'array':
        return safeJson.map($utils.safeJsonToJson);

      case 'object':
        return safeJson.reduce(function (json, safeChildNode) {
          var key = safeChildNode[0],
              value = safeChildNode[1];
          json[key] = $utils.safeJsonToJson(value);
          return json;
        }, {});
      }
    } else {
      return safeJson;
    }
  },

  /**
   * Tests whether the specified string matches the specified prefix.
   * @param {string} string
   * @param {string} prefix
   * @returns {boolean}
   */
  matchesPrefix: function (string, prefix) {
    return string && string.substr(0, prefix.length) === prefix;
  }
});
