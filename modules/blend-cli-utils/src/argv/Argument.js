"use strict";

/**
 * @function $cli.Argument.create
 * @param {Object} [properties]
 * @returns {$cli.Argument}
 */

/**
 * Describes a single command line argument.
 * @class $cli.Argument
 * @implements $utils.Stringifiable
 */
$cli.Argument = $oop.createClass('$cli.Argument')
.blend($utils.Cloneable)
.implement($utils.Stringifiable)
.define(/** @lends $cli.Argument# */{
  /**
   * @member {string} $cli.Argument#argumentString
   */

  /**
   * @member {string} $cli.Argument#argumentName
   */

  /**
   * @memberOf $cli.Argument
   * @param {string} argumentString
   * @returns {$cli.Argument}
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
