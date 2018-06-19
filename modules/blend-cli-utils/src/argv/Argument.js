"use strict";

/**
 * @function $cliUtils.Argument.create
 * @param {Object} [properties]
 * @returns {$cliUtils.Argument}
 */

/**
 * Describes a single command line argument.
 * @class $cliUtils.Argument
 * @implements $utils.Stringifiable
 */
$cliUtils.Argument = $oop.createClass('$cliUtils.Argument')
.blend($utils.Cloneable)
.implement($utils.Stringifiable)
.define(/** @lends $cliUtils.Argument# */{
  /**
   * @member {string} $cliUtils.Argument#argumentString
   */

  /**
   * @member {string} $cliUtils.Argument#argumentName
   */

  /**
   * @memberOf $cliUtils.Argument
   * @param {string} argumentString
   * @returns {$cliUtils.Argument}
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
