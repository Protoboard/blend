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
$ui.EntityOption = $oop.getClass('$ui.EntityOption')
.blend($oop.getClass('$ui.Option'))
.blend($oop.getClass('$ui.EntityText'))
.blend($oop.getClass('$ui.EntitySelectable'))
.blend($oop.getClass('$ui.EntityListItem'));
