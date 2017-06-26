"use strict";

/**
 * @name $data.Chain.create
 * @function
 * @returns {$data.Chain}
 */

/**
 * Chain data structure with two fixed ends and value carrying links in between.
 * Chain behaves like a stack in that you may append and prepend the chain
 * using a stack-like API. (push, pop, etc.)
 * @todo Accept & process data in & out
 * @todo Make sure clone() is right. Might 'steal' links from original.
 * @class $data.Chain
 * @extends $data.DataContainer
 * @extends $data.SetContainer
 * @implements $data.Stackable
 */
$data.Chain = $oop.getClass('$data.Chain')
.extend($oop.getClass('$data.DataContainer'))
.extend($oop.getClass('$data.SetContainer'))
.implement($oop.getClass('$data.Stackable'))
.define(/** @lends $data.Chain# */{
  /** @ignore */
  init: function () {
    /**
     * @member {$data.MasterLink} $data.Chain#data
     */
    this.data = $data.MasterLink.create(this);

    // forcing item count to zero
    this._itemCount = 0;
  },

  /**
   * @returns {$data.Chain}
   */
  clear: function () {
    this.data = $data.MasterLink.create(this);
    return this;
  },

  /**
   * @param {$data.Link} item
   * @returns {$data.Chain}
   */
  setItem: function (item) {
    this.push(item);
    return this;
  },

  /**
   * @param {$data.Link} item
   * @returns {$data.Chain}
   */
  deleteItem: function (item) {
    item.unlink();
    return this;
  },

  /**
   * @param {$data.Link} item
   * @returns {boolean}
   */
  hasItem: function (item) {
    return item.chain === this;
  },

  /**
   * @param {function} callback
   * @param {Object} [context]
   * @returns {$data.Chain}
   */
  forEachItem: function (callback, context) {
    var link = this.data.nextLink;

    while (link !== this.data) {
      if (callback.call(context || this, link) === false) {
        break;
      }
      link = link.nextLink;
    }

    return this;
  },

  /**
   * Adds link at the end of the chain.
   * @param {$data.Link} link
   */
  push: function (link) {
    link.addBefore(this.data);
    return this;
  },

  /**
   * Removes link from the end of the chain and returns removed link.
   * @returns {$data.Link}
   */
  pop: function () {
    var masterLink = this.data,
        previousLink = masterLink.previousLink;
    if (previousLink !== masterLink) {
      return previousLink.unlink();
    }
  },

  /**
   * Adds link at the start of the chain.
   * @param {$data.Link} link
   */
  unshift: function (link) {
    link.addAfter(this.data);
    return this;
  },

  /**
   * Removes link from the start of the chain and returns removed link.
   * @returns {$data.Link}
   */
  shift: function () {
    var masterLink = this.data,
        nextLink = masterLink.nextLink;
    if (nextLink !== masterLink) {
      return this.data.nextLink.unlink();
    }
  },

  /**
   * @param {$data.Chain} chain
   * @returns {$data.Chain}
   */
  concat: function (chain) {
    var result = $oop.getClass(this.__classId).create();
    this.forEachItem(function (link) {
      result.push(link.clone());
    });
    chain.forEachItem(function (link) {
      result.push(link.clone());
    });
    return result;
  }
});

$oop.copyProperties($assert, /** @lends $assert# */{
  /**
   * @param {$data.Chain} expr
   * @param {string} [message]
   * @returns {$assert}
   */
  isChain: function (expr, message) {
    return $assert.assert(
        $data.Chain.isIncludedBy(expr), message);
  },

  /**
   * @param {$data.Chain} [expr]
   * @param {string} [message]
   * @returns {$assert}
   */
  isChainOptional: function (expr, message) {
    return $assert.assert(
        expr === undefined ||
        $data.Chain.isIncludedBy(expr), message);
  }
});
