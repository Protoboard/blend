"use strict";

/**
 * @function $ui.EntityDropdown.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {*} [properties.inputValue]
 * @param {$entity.LeafNoded} [properties.inputValueEntity]
 * @param {$entity.CollectionField} [properties.listEntity]
 * @returns {$ui.EntityDropdown}
 */

/**
 * @class $ui.EntityDropdown
 * @extends $ui.Dropdown
 * @extends $ui.EntityInputable
 * @extends $ui.EntityList
 */
$ui.EntityDropdown = $oop.getClass('$ui.EntityDropdown')
.blend($oop.getClass('$ui.Dropdown'))
.blend($oop.getClass('$ui.EntityInputable'))
.blend($oop.getClass('$ui.EntityList'))
.define(/** @lends $ui.EntityDropdown# */{
  ListItemClass: $oop.getClass('$ui.EntityOption')
});
