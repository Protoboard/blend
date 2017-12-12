"use strict";

/**
 * @function $ui.EntitySingleSelect.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {*} [properties.inputValue]
 * @param {$entity.LeafNoded} [properties.inputValueEntity]
 * @param {$entity.CollectionField} [properties.listEntity]
 * @returns {$ui.EntitySingleSelect}
 */

/**
 * @class $ui.EntitySingleSelect
 * @extends $ui.SingleSelect
 * @extends $ui.EntityInputable
 * @extends $ui.EntityList
 */
$ui.EntitySingleSelect = $oop.createClass('$ui.EntitySingleSelect')
.blend($ui.SingleSelect)
.blend($ui.EntityInputable)
.blend($ui.EntityList)
.define(/** @lends $ui.EntitySingleSelect# */{
  ListItemClass: $ui.EntityOption
})
.build();
