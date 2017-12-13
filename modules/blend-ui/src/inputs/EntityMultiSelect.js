"use strict";

/**
 * @function $ui.EntityMultiSelect.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {*} [properties.inputValues]
 * @param {$entity.LeafNoded} [properties.inputValuesEntity]
 * @param {$entity.CollectionField} [properties.listEntity]
 * @returns {$ui.EntityMultiSelect}
 */

/**
 * @class $ui.EntityMultiSelect
 * @extends $ui.MultiSelect
 * @extends $ui.EntityInputValuesHost
 * @extends $ui.EntityList
 */
$ui.EntityMultiSelect = $oop.createClass('$ui.EntityMultiSelect')
.blend($ui.MultiSelect)
.blend($ui.EntityInputValuesHost)
.blend($ui.EntityList)
.define(/** @lends $ui.EntityMultiSelect# */{
  ListItemClass: $ui.EntityOption
})
.build();
