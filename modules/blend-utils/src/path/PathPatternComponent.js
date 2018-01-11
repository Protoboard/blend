"use strict";

/**
 * @function $utils.PathPatternComponent.create
 * @param {Object} [properties]
 * @returns {$utils.PathPatternComponent}
 */

/**
 * @class $utils.PathPatternComponent
 * @extends $utils.Cloneable
 * @implements $utils.Matchable
 * @implements $utils.Stringifiable
 */
$utils.PathPatternComponent = $oop.createClass('$utils.PathPatternComponent')
.blend($utils.Cloneable)
.implement($utils.Matchable)
.implement($utils.Stringifiable)
.define(/** @lends $utils.PathPatternComponent# */{
  /**
   * String representation of the component.
   * @member {string} $utils.PathPatternComponent#componentString
   */

  /**
   * Parameter name extracted from component. Undefined when no parameter
   * can be extracted.
   * @member {string} $utils.PathPatternComponent#parameterName
   */

  /**
   * Creates a `PathPatternComponent` instance based on the specified string.
   * @memberOf $utils.PathPatternComponent
   * @param {string} componentString
   * @param {Object} [properties]
   * @returns {$utils.PathPatternComponent}
   */
  fromString: function (componentString, properties) {
    return this.create({componentString: componentString}, properties);
  },

  /**
   * Creates a `QueryComponent` instance based on the specified string.
   * @memberOf $utils.PathPatternComponent
   * @param {string} parameterName
   * @param {Object} [properties]
   * @returns {$utils.PathPatternComponent}
   */
  fromParameterName: function (parameterName, properties) {
    return this.create({parameterName: parameterName}, properties);
  },

  /** @ignore */
  spread: function () {
    if (this.componentString !== undefined) {
      this._spreadComponentString();
    }

    if (this.parameterName !== undefined) {
      this._spreadParameterName();
    }
  },

  /** @private */
  _spreadComponentString: function () {
    var componentString = this.componentString;
    if (componentString[0] === ':') {
      this.parameterName = $utils.unescapePathPatternComponent(componentString.substr(1));
    }
  },

  /** @private */
  _spreadParameterName: function () {
    this.componentString = ':' + $utils.escapePathPatternComponent(this.parameterName);
  },

  /**
   * @param {string} pathComponent
   * @return {boolean}
   */
  matches: function (pathComponent) {
    if (this.parameterName) {
      return true;
    } else {
      return this.componentString === pathComponent;
    }
  },

  /**
   * @returns {string}
   */
  toString: function () {
    return this.componentString;
  }
})
.build();

$oop.copyProperties($utils, /** @lends $utils */{
  /**
   * Special characters in path pattern components. (To be escaped.)
   * @constant
   */
  PATH_PATTERN_COMPONENT_SPECIAL_CHARS: ':',

  /**
   * @param {string} componentString
   * @returns {string}
   */
  escapePathPatternComponent: function (componentString) {
    return $utils.escape(componentString,
        $utils.PATH_PATTERN_COMPONENT_SPECIAL_CHARS);
  },

  /**
   * @param {string} componentString
   * @returns {string}
   */
  unescapePathPatternComponent: function (componentString) {
    return $utils.unescape(componentString,
        $utils.PATH_PATTERN_COMPONENT_SPECIAL_CHARS);
  }
});
