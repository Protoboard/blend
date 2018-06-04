"use strict";

/**
 * @function $cliTools.Argument.create
 * @param {Object} [properties]
 * @returns {$cliTools.Argument}
 */

/**
 * Describes a single command line argument.
 * @class $cliTools.Argument
 * @implements $utils.Stringifiable
 */
$cliTools.Argument = $oop.createClass('$cliTools.Argument')
.blend($utils.Cloneable)
.implement($utils.Stringifiable)
.define(/** @lends $cliTools.Argument# */{
  /**
   * @member {string} $cliTools.Argument#argumentString
   */

  /**
   * @member {string} $cliTools.Argument#argumentName
   */

  /**
   * @memberOf $cliTools.Argument
   * @param {string} argumentString
   * @returns {$cliTools.Argument}
   */
  fromString: function (argumentString) {
    return this.create({argumentString: argumentString});
  },

  /**
   * @returns {string}
   */
  toString: function () {
    return this.argumentString;
  }
})
.build();
