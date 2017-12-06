"use strict";

/**
 * @function $ui.EntityOption.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {string|$utils.Stringifiable} [properties.textContent]
 * @param {*} [properties.ownValue]
 * @param {boolean} [properties.state.selected]
 * @param {$entity.ValueKey} [properties.textContentEntity]
 * @param {$entity.LeafNoded} [properties.ownValueEntity]
 * @param {$entity.LeafNoded} [properties.selectedStateEntity]
 * @param {$entity.Item} [properties.listItemEntity]
 * @returns {$ui.EntityOption}
 */

/**
 * @class $ui.EntityOption
 * @extends $ui.EntityText
 * @extends $ui.Option
 * @extends $ui.EntitySelectable
 */
$ui.EntityOption = $oop.createClass('$ui.EntityOption')
.blend($ui.Option)
.blend($ui.EntityText)
.blend($ui.EntitySelectable)
.blend($ui.EntityListItem)
.build();
