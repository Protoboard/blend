"use strict";

/**
 * @function $cliUtils.NodeArgv.create
 * @param {Object} [properties]
 * @returns {$cliUtils.NodeArgv}
 */

/**
 * Allows logical access to command line arguments of Node.js scripts.
 * @class $cliUtils.NodeArgv
 * @extends $cliUtils.Argv
 */
$cliUtils.NodeArgv = $oop.createClass('$cliUtils.NodeArgv')
.blend($cliUtils.Argv)
.define(/** @lends $cliUtils.NodeArgv# */{
  /**
   * @member {string} $cliUtils.NodeArgv#nodePath
   */

  /**
   * @member {string} $cliUtils.NodeArgv#scriptPath
   */

  /** @ignore */
  spread: function () {
    var argumentList = this.argumentList;
    this.nodePath = argumentList[0];
    this.scriptPath = argumentList[1];
  }
})
.build();

$cliUtils.Argv
.forwardBlend($cliUtils.NodeArgv, $utils.isNode);
