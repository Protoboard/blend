"use strict";

/**
 * @function $utils.PathPattern.create
 * @param {Object} [properties]
 * @param {string[]} properties.components Series of patterns to match
 * corresponding path components.
 * @returns {$utils.PathPattern}
 */

/**
 * Path with colon-prefixed parameters.
 * @class $utils.PathPattern
 * @implements $utils.Matchable
 */
$utils.PathPattern = $oop.createClass('$utils.PathPattern')
.implement($utils.Matchable)
.define(/** @lends $utils.PathPattern# */{
  /**
   * Query components.
   * @member {Array.<$utils.PathPatternComponent>} $utils.PathPattern#components
   */

  /**
   * Lookup of parameter indices by parameter name.
   * @member {Object.<string,number>} $utils.PathPattern#_paramPositions
   * @private
   */

  /**
   * Creates a `PathPattern` instance based on the specified component array.
   * @memberOf $utils.PathPattern
   * @param {Array.<$utils.PathPatternComponent|string>} components
   * @param {Object} [properties]
   * @returns {$utils.PathPattern}
   */
  fromComponents: function (components, properties) {
    return this.create({components: components}, properties);
  },

  /** @ignore */
  init: function () {
    $assert.isArray(this.components, "Invalid component list");

    var PatternComponent = $utils.PathPatternComponent;

    // making sure all components are actually instances of
    // $utils.PathPatternComponent
    this.components = this.components
    .map(function (component) {
      return PatternComponent.mixedBy(component) ?
          component :
          PatternComponent.fromString(component);
    });

    this._paramPositions = this.components
    .reduce(function (paramPositions, component, i) {
      var parameterName = component.parameterName;
      if (parameterName !== undefined) {
        paramPositions[parameterName] = i;
      }
      return paramPositions;
    }, {});
  },

  /**
   * Matches pattern against the specified `Path`.
   * @param {$utils.Path} path
   * @return {boolean}
   */
  matches: function (path) {
    var patternComponents = this.components,
        patternComponentCount = patternComponents.length,
        pathComponents = path.components,
        i, patternComponent, pathComponent;

    for (i = 0; i < patternComponentCount; i++) {
      patternComponent = patternComponents[i];
      pathComponent = pathComponents[i];
      if (!patternComponent.matches(pathComponent)) {
        return false;
      }
    }
    return true;
  },

  /**
   * Extracts value of the specified parameter from the specified `Path`.
   * @param {$utils.Path} path
   * @param {string} parameterName
   * @returns {*}
   */
  extractParameter: function (path, parameterName) {
    return path.components[this._paramPositions[parameterName]];
  }
})
.build();
