"use strict";

/**
 * @function $cli.NodeArgv.create
 * @param {Object} [properties]
 * @returns {$cli.NodeArgv}
 */

/**
 * Node-specific argument vector. Allows logical access to command line
 * arguments of Node.js scripts.
 * @class $cli.NodeArgv
 * @extends $cli.Argv
 */
$cli.NodeArgv = $oop.createClass('$cli.NodeArgv')
.blend($cli.Argv)
.define(/** @lends $cli.NodeArgv# */{
  /**
   * @member {string} $cli.NodeArgv#nodePath
   */

  /**
   * @member {string} $cli.NodeArgv#scriptPath
   */

  /** @ignore */
  spread: function () {
    var argumentList = this.argumentList;
    this.nodePath = argumentList[0];
    this.scriptPath = argumentList[1];
  }
})
.build();

$cli.Argv
.forwardBlend($cli.NodeArgv, $utils.isNode);
