"use strict";

/**
 * @function $data.Link.create
 * @returns {$data.Link}
 */

/**
 * Link that can be added to a chain.
 * @class $data.Link
 * @mixes $utils.Cloneable
 */
$data.Link = $oop.getClass('$data.Link')
.mix($utils.Cloneable)
.define(/** @lends $data.Link# */{
  /** @ignore */
  init: function () {
    /**
     * Chain instance the link is associated with.
     * @member {$data.Chain} $data.Link#chain
     */
    this.chain = undefined;

    /**
     * Link that comes before the current link in the chain.
     * @member {$data.Link} $data.Link#previousLink
     */
    this.previousLink = undefined;

    /**
     * Link that comes after the current link in the chain.
     * @member {$data.Link} $data.Link#nextLink
     */
    this.nextLink = undefined;
  },

  /**
   * Adds current unconnected link after the specified link.
   * @param {$data.Link|$data.MasterLink} link
   * @returns {$data.Link}
   */
  addAfter: function (link) {
    if (!link.chain) {
      $assert.assert(false, "Remote link must belong to a Chain");
    }
    if (this === link) {
      $assert.assert(false, "Attempting to link to self");
    }

    if (this.chain) {
      // preparing link to be added
      this.unlink();
    }

    // setting links on current link
    this.chain = link.chain;
    this.previousLink = link;
    this.nextLink = link.nextLink;

    // setting self as previous link on old next link
    if (link.nextLink) {
      link.nextLink.previousLink = this;
    }

    // setting self as next link on target link
    link.nextLink = this;

    this.chain._itemCount++;

    return this;
  },

  /**
   * Adds current link before the specified link.
   * @param {$data.Link|$data.MasterLink} link
   * @returns {$data.Link}
   */
  addBefore: function (link) {
    if (!link.chain) {
      $assert.assert(false, "Remote link must belong to a Chain");
    }
    if (this === link) {
      $assert.assert(false, "Attempting to link to self");
    }

    if (this.chain) {
      // preparing link to be added
      this.unlink();
    }

    // setting links on current link
    this.chain = link.chain;
    this.nextLink = link;
    this.previousLink = link.previousLink;

    // setting self as next link on old previous link
    if (link.previousLink) {
      link.previousLink.nextLink = this;
    }

    // setting self as previous link on target link
    link.previousLink = this;

    this.chain._itemCount++;

    return this;
  },

  /**
   * Removes link from the chain.
   * @returns {$data.Link}
   */
  unlink: function () {
    var chainBefore = this.chain,
        nextLinkBefore,
        previousLinkBefore;

    if (chainBefore) {
      nextLinkBefore = this.nextLink;
      previousLinkBefore = this.previousLink;

      // linking up neighbors
      if (nextLinkBefore) {
        nextLinkBefore.previousLink = previousLinkBefore;
      }
      if (previousLinkBefore) {
        previousLinkBefore.nextLink = nextLinkBefore;
      }

      // clearing references
      this.chain = undefined;
      this.previousLink = undefined;
      this.nextLink = undefined;

      chainBefore._itemCount--;
    }

    return this;
  }
});
