"use strict";

/**
 * @function $data.Chain.create
 * @returns {$data.Chain}
 */

/**
 * Chain data structure with two fixed ends and value carrying links in between.
 * Chain behaves like a stack in that you may append and prepend the chain
 * using a stack-like API. (push, pop, etc.)
 * @todo Accept & process data in & out
 * @todo Make sure clone() is right. Might 'steal' links from original.
 * @todo Add Clearable?
 * @class $data.Chain
 * @extends $data.DataContainer
 * @extends $data.SetContainer
 * @implements $data.Stackable
 */
$data.Chain = $oop.getClass('$data.Chain')
.mix($oop.getClass('$data.DataContainer'))
.mix($oop.getClass('$data.SetContainer'))
.implement($oop.getClass('$data.Stackable'))
.define(/** @lends $data.Chain# */{
  /**
   * @member {$data.MasterLink} $data.Chain#data
   */

  /**
   * @member {number} $data.Chain#_itemCount
   * @private
   */

  /** @ignore */
  spread: function () {
    // forcing data buffer to be a MasterLink
    this.data = $data.MasterLink.create({chain: this});

    // forcing item count to zero
    this._itemCount = 0;
  },

  /**
   * @returns {$data.Chain}
   */
  clear: function () {
    this.data = $data.MasterLink.create({chain: this});
    return this;
  },

  /**
   * @todo Test
   * @returns {boolean}
   */
  isEmpty: function () {
    var masterLink = this.data;
    return masterLink === masterLink.nextLink === masterLink.previousLink;
  },

  /**
   * @param {$data.Link} item
   * @returns {$data.Chain}
   * @todo Should accept any value
   */
  setItem: function (item) {
    this.push(item);
    return this;
  },

  /**
   * @param {$data.Link} item
   * @returns {$data.Chain}
   * @todo Should accept any value
   */
  deleteItem: function (item) {
    item.unlink();
    return this;
  },

  /**
   * @param {$data.Link} item
   * @returns {boolean}
   * @todo Should accept any value
   */
  hasItem: function (item) {
    return item.chain === this;
  },

  /**
   * @param {function} callback
   * @param {Object} [context]
   * @returns {$data.Chain}
   * @todo Call callback with link payload
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

$oop.getClass('$data.SetContainer')
.delegate(/** @lends $data.SetContainer# */{
  /**
   * @returns {$data.Chain}
   */
  toChain: function () {
    return $data.Chain.fromSetContainer(this);
  }
});

$oop.copyProperties($assert, /** @lends $assert */{
  /**
   * @param {$data.Chain} expr
   * @param {string} [message]
   * @returns {$assert}
   */
  isChain: function (expr, message) {
    return $assert.assert(
        $data.Chain.mixedBy(expr), message);
  },

  /**
   * @param {$data.Chain} [expr]
   * @param {string} [message]
   * @returns {$assert}
   */
  isChainOptional: function (expr, message) {
    return $assert.assert(
        expr === undefined ||
        $data.Chain.mixedBy(expr), message);
  }
});
