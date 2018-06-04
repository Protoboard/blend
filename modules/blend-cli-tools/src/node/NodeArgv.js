"use strict";

/**
 * @function $cliTools.NodeArgv.create
 * @param {Object} [properties]
 * @returns {$cliTools.NodeArgv}
 */

/**
 * Allows logical access to command line arguments of Node.js scripts.
 * @class $cliTools.NodeArgv
 * @extends $cliTools.Argv
 */
$cliTools.NodeArgv = $oop.createClass('$cliTools.NodeArgv')
.blend($cliTools.Argv)
.define(/** @lends $cliTools.NodeArgv# */{
  /**
   * @member {string} $cliTools.NodeArgv#nodePath
   */

  /**
   * @member {string} $cliTools.NodeArgv#scriptPath
   */

  /** @ignore */
  spread: function () {
    var argumentList = this.argumentList;
    this.nodePath = argumentList[0];
    this.scriptPath = argumentList[1];
  }
})
.build();

$cliTools.Argv
.forwardBlend($cliTools.NodeArgv, $utils.isNode);
