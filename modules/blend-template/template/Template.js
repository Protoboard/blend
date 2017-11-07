"use strict";

/**
 * @function $template.Template.create
 * @param {object} properties
 * @param {string|$utils.Stringifiable} properties.templateString
 * @returns {$template.Template}
 */

/**
 * @class $template.Template
 */
$template.Template = $oop.getClass('$template.Template')
.define(/** @lends $template.Template# */{
  /**
   * @member {string|$utils.Stringifiable} $template.Template#templateString
   */

  /**
   * @param {string} templateString
   * @memberOf $template.Template
   */
  fromString: function (templateString) {
    return this.create({templateString: templateString});
  },

  /**
   * @param {string|$utils.Stringifiable} templateString
   * @memberOf $template.Template
   */
  fromStringifiable: function (templateString) {
    return this.create({templateString: templateString});
  },

  /**
   * @param {Array.<string>} tokens
   * @returns {Array.<string>} Sanitized tokens
   * @private
   */
  _sanitizeTokens: function (tokens) {
    var tokenCount = tokens.length,
        i, token, matches;

    for (i = 0; i < tokenCount; i++) {
      token = tokens[i];
      matches = $template.RE_TEMPLATE_PARAMETER_EXTRACTOR.exec(token);
      if (matches) {
        tokens[i] = '{{' + matches[1] + '}}';
      }
    }

    return tokens;
  },

  /**
   * Resolves templateString parameters. Returns an object in which each
   * templateString parameter is associated with an array-of-arrays structure
   * holding corresponding string literals.
   * @param {$data.Collection.<$template.Template>} templateCollection
   * @returns {object}
   * @private
   */
  _buildTokenTree: function (templateCollection) {
    return templateCollection
    // extracting tokens from all Template items
    .callOnEachValue('extractTokens')
    // cycling through tokens and replacing parameter values
    .forEachItem(function (tokens) {
      var tokenCount = tokens.length,
          i, token, replacement;
      for (i = 0; i < tokenCount; i++) {
        token = tokens[i];
        replacement = this.getValue(token);
        if (replacement !== undefined) {
          tokens[i] = replacement;
        }
      }
    }).data;
  },

  /**
   * @param {Array} stringTree Multi-level array of strings
   * @returns {string}
   * @private
   */
  _flattenStringTree: function (stringTree) {
    var result = "",
        stringTreeLength = stringTree.length,
        i, subTree;

    for (i = 0; i < stringTreeLength; i++) {
      subTree = stringTree[i];
      if (subTree instanceof Array) {
        result += this._flattenStringTree(subTree);
      } else {
        result += subTree;
      }
    }

    return result;
  },

  /**
   * @param {object} parameterValues
   * @returns {string}
   * @private
   */
  _resolveParameters: function (parameterValues) {
    var
        parameterValuesAsTemplates = $data.Collection.fromData(parameterValues)
        .mapKeys(function (templateString, parameter) {
          return $template.RE_TEMPLATE_PARAMETER_TESTER.test(parameter) ?
              parameter :
              '{{' + parameter + '}}';
        })
        // discarding undefined parameter values
        .filter(function (parameterValue) {
          return parameterValue !== undefined;
        })
        // converting each parameter value to Template
        .passEachValueTo($template.Template.fromString, $template.Template)
        .setItem('{{}}', this)
        .toCollection(),
        tokenTree = this._buildTokenTree(parameterValuesAsTemplates);

    return this._flattenStringTree(tokenTree['{{}}']);
  },

  /**
   * @returns {string}
   * @private
   */
  _clearParameters: function () {
    return this.templateString.replace($template.RE_TEMPLATE_PARAMETER, '');
  },

  /**
   * Parses current template string and returns an array of tokens
   * that make up the template's current value.
   * @returns {string|string[]}
   */
  extractTokens: function () {
    var templateString = $utils.stringify(this.templateString),
        tokens;
    if ($template.RE_TEMPLATE_PARAMETER_TESTER.test(templateString)) {
      return [templateString];
    } else {
      tokens = templateString.split($template.RE_TEMPLATE_SPLITTER);
      return this._sanitizeTokens(tokens);
    }
  },

  /**
   * Resolves parameters in the template as well as in the specified parameter
   * values (which can also carry templates) and returns the generated string.
   * @param {object} [parameterValues] Parameter name - parameter value (string
   *     / Stringifiable) associations. When omitted, parameters will be
   *     replaced with empty string.
   * @returns {string}
   */
  getResolvedString: function (parameterValues) {
    if (parameterValues) {
      return this._resolveParameters(parameterValues);
    } else {
      return this._clearParameters();
    }
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /** @returns {$template.Template} */
  toTemplate: function () {
    return $template.Template.create({templateString: this.valueOf()});
  }
});

$oop.copyProperties($template, /** @lends $template */{
  /**
   * @type {RegExp}
   * @constant
   */
  RE_TEMPLATE_PARAMETER: /{{[^{}]+}}/g,

  /**
   * @type {RegExp}
   * @constant
   */
  RE_TEMPLATE_PARAMETER_TESTER: /^{{[^{}]+}}$/,

  /**
   * @type {RegExp}
   * @constant
   */
  RE_TEMPLATE_PARAMETER_EXTRACTOR: /^{{\s*([^{}\s]+)\s*}}$/,

  /**
   * @type {RegExp}
   * @constant
   */
  RE_TEMPLATE_SPLITTER: /({{.+?}})/
});