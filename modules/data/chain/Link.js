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
    .extend($utils.Cloneable)
    .define(/** @lends $data.Link# */{
        /** @ignore */
        init: function () {
            /**
             * Chain instance the link is associated with.
             * @type {$data.Chain}
             * @private
             */
            this._chain = undefined;

            /**
             * Link that comes before the current link in the chain.
             * @type {$data.Link}
             */
            this.previousLink = undefined;

            /**
             * Link that comes after the current link in the chain.
             * @type {$data.Link}
             */
            this.nextLink = undefined;
        },

        /**
         * Adds current unconnected link after the specified link.
         * @param {$data.Link|$data.MasterLink} link
         * @returns {$data.Link}
         */
        addAfter: function (link) {
            if (!link._chain) {
                $assert.assert(false, "Remote link must belong to a Chain");
            }
            if (this === link) {
                $assert.assert(false, "Attempting to link to self");
            }

            if (this._chain) {
                // preparing link to be added
                this.unlink();
            }

            // setting links on current link
            this._chain = link._chain;
            this.previousLink = link;
            this.nextLink = link.nextLink;

            // setting self as previous link on old next link
            if (link.nextLink) {
                link.nextLink.previousLink = this;
            }

            // setting self as next link on target link
            link.nextLink = this;

            this._chain._itemCount++;

            return this;
        },

        /**
         * Adds current link before the specified link.
         * @param {$data.Link|$data.MasterLink} link
         * @returns {$data.Link}
         */
        addBefore: function (link) {
            if (!link._chain) {
                $assert.assert(false, "Remote link must belong to a Chain");
            }
            if (this === link) {
                $assert.assert(false, "Attempting to link to self");
            }

            if (this._chain) {
                // preparing link to be added
                this.unlink();
            }

            // setting links on current link
            this._chain = link._chain;
            this.nextLink = link;
            this.previousLink = link.previousLink;

            // setting self as next link on old previous link
            if (link.previousLink) {
                link.previousLink.nextLink = this;
            }

            // setting self as previous link on target link
            link.previousLink = this;

            this._chain._itemCount++;

            return this;
        },

        /**
         * Removes link from the chain.
         * @returns {$data.Link}
         */
        unlink: function () {
            var chainBefore = this._chain,
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
                this._chain = undefined;
                this.previousLink = undefined;
                this.nextLink = undefined;

                chainBefore._itemCount--;
            }

            return this;
        }
    });
