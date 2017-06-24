"use strict";

/**
 * @function $data.MasterLink.create
 * @param {$data.Chain} parentChain
 * @returns {$data.MasterLink}
 */

/**
 * Master link in a `Chain`. Non-removable. All other link in the chain
 * attach through a `MasterLink` instance.
 * @class $data.MasterLink
 */
$data.MasterLink = $oop.getClass('$data.MasterLink')
  .define(/** @lends $data.MasterLink# */{
    /**
     * @param {$data.Chain} chain
     * @ignore
     */
    init: function (chain) {
      $assert.isChain(chain, "Invalid chain");

      /**
       * Chain instance the link is associated with.
       * @member {$data.Chain} $data.MasterLink#chain
       * @constant
       */
      this.chain = chain;

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
