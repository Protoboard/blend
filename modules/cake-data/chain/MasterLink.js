"use strict";

/**
 * @function $data.MasterLink.create
 * @param {Object} parameters
 * @param {$data.Chain} parameters.parentChain
 * @returns {$data.MasterLink}
 */

/**
 * Master link in a `Chain`. Non-removable. All other link in the chain attach
 * through a `MasterLink` instance.
 * @class $data.MasterLink
 */
$data.MasterLink = $oop.getClass('$data.MasterLink')
.define(/** @lends $data.MasterLink# */{
  /**
   * @ignore
   */
  init: function () {
    $assert.isChain(this.chain, "Invalid chain");

    /**
     * Chain instance the link is associated with.
     * @member {$data.Chain} $data.MasterLink#chain
     * @constant
     */

    /**
     * Link that comes before the current link in the chain.
     * @member {$data.Link|$data.MasterLink} $data.MasterLink#previousLink
     */
    this.previousLink = this;

    /**
     * Link that comes after the current link in the chain.
     * @member {$data.Link|$data.MasterLink} $data.MasterLink#nextLink
     */
    this.nextLink = this;
  }
});
