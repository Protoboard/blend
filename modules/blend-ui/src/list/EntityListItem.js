"use strict";

/**
 * Makes widgets suitable to be items of `EntityList`s.
 * Item order may be configured as an entity attribute. (`itemIdType` /
 * `itemValueType`)
 * @mixin $ui.EntityListItem
 * @extends $ui.EntityPropertyBound
 */
$ui.EntityListItem = $oop.createClass('$ui.EntityListItem')
.blend($ui.EntityPropertyBound)
.define(/** @lends $ui.EntityListItem# */{
  /**
   * @member {$entity.Item} $ui.EntityListItem#listItemEntity
   */

  /**
   * @member $ui.EntityListItem
   * @param {$entity.Item} listItemEntity
   * @param {Object} [properties]
   * @returns {$ui.EntityListItem}
   */
  fromListItemEntity: function (listItemEntity, properties) {
    return this.create({listItemEntity: listItemEntity}, properties);
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOfOptional(this.listItemEntity, $entity.Item,
        "Invalid listItemEntity");
  },

  /**
   * @param {string} entityProperty
   * @protected
   */
  _syncToEntityProperty: function (entityProperty) {
    if (entityProperty === 'listItemEntity') {
      this._syncToListItemEntity();
    }
  },

  /**
   * @protected
   */
  _syncToListItemEntity: function () {
    var listItemEntity = this.listItemEntity,
        listItemEntityKey = listItemEntity.entityKey,
        listEntityKey = listItemEntityKey.parentKey;

    // handling 2 default modes of item ordering:
    // - when the item's ID type is 'order'
    // - when the item's value type is 'order'
    // all other (custom) ordering must be added on top
    switch ('order') {
    case listEntityKey.getItemValueType():
      this.setNodeOrder(listItemEntity.getNode());
      break;
    case listEntityKey.getItemIdType():
      this.setNodeOrder(listItemEntityKey.entityName);
      break;
    }
  },

  /**
   * @param {$entity.LeafNoded} listItemEntity
   * @returns {$ui.EntityListItem}
   */
  setListItemEntity: function (listItemEntity) {
    this.setEntityProperty('listItemEntity', listItemEntity);
    return this;
  }
})
.build();
