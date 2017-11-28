"use strict";

/**
 * @mixin $ui.EntityList
 * @extends $ui.EntityPropertyBound
 */
$ui.EntityList = $oop.getClass('$ui.EntityList')
.blend($oop.getClass('$ui.EntityPropertyBound'))
.define(/** @lends $ui.EntityList# */{
  /**
   * @memberOf $ui.EntityList
   * @type {$ui.EntityListItem}
   */
  ListItemClass: $oop.blendClass([
    $widget.Widget, $oop.getClass('$ui.EntityListItem')]),

  /**
   * @member {$entity.CollectionField} $ui.EntityList#listEntity
   */

  /**
   * @member {$data.Collection} $ui.EntityList#itemWidgetByItemId
   */

  /**
   * @memberOf $ui.EntityList
   * @param {$entity.CollectionField} listEntity
   * @param {Object} [properties]
   * @returns {$ui.EntityList}
   */
  fromListEntity: function (listEntity, properties) {
    return this.create({listEntity: listEntity}, properties);
  },

  /** @ignore */
  defaults: function () {
    this.itemWidgetByItemId = this.itemWidgetByItemId ||
        $data.Collection.create();
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOfOptional(this.listEntity, $entity.CollectionField,
        "Invalid listEntity");
  },

  /**
   * @param {string} entityProperty
   * @private
   */
  _syncToEntityProperty: function (entityProperty) {
    if (entityProperty === 'listEntity') {
      this._syncToListEntity();
    }
  },

  /**
   * Syncs widget contents to current contents of `listEntity`. Does full
   * comparison. Should only be invoked on (re)initialization.
   * @protected
   */
  _syncToListEntity: function () {
    var
        itemIdsAfter = $data.StringSet.fromData(this.listEntity.getNode()),
        itemIdsBefore = this.itemWidgetByItemId.asStringSet(),
        itemIdsToAdd = itemIdsAfter.subtract(itemIdsBefore)
        .asCollection()
        .getKeys(),
        itemIdsToRemove = itemIdsAfter.subtractFrom(itemIdsBefore)
        .asCollection()
        .getKeys();

    this._updateItemWidgets(itemIdsToAdd, itemIdsToRemove);
  },

  /**
   * @param {Array.<string>} [itemIdsAdded]
   * @param {Array.<string>} [itemIdsRemoved]
   * @private
   */
  _updateItemWidgets: function (itemIdsAdded, itemIdsRemoved) {
    var that = this,
        ListItemClass = this.ListItemClass,
        listEntity = this.listEntity,
        itemWidgetByItemId = this.itemWidgetByItemId;

    if (itemIdsAdded) {
      itemIdsAdded
      .filter(function (itemId) {
        return !itemWidgetByItemId.getValue(itemId);
      })
      .map(function (itemId) {
        var item = listEntity.getItem(itemId);
        return ListItemClass.fromListItemEntity(item);
      })
      .forEach(function (listItem) {
        that.addChildNode(listItem);
      });
    }

    if (itemIdsRemoved) {
      itemIdsRemoved
      .map(function (itemId) {
        return itemWidgetByItemId.getValue(itemId);
      })
      .filter(function (listItem) {
        return listItem;
      })
      .forEach(function (listItem) {
        listItem.removeFromParentNode();
      });
    }
  },

  /**
   * @param {$ui.EntityListItem} node
   * @returns {$ui.EntityList}
   */
  addChildNode: function addChildNode(node) {
    var childNodeBefore = addChildNode.shared.childNodeBefore,
        itemWidgetByItemId,
        listItemKeyBefore,
        listItemKeyAfter;

    if (node !== childNodeBefore) {
      itemWidgetByItemId = this.itemWidgetByItemId;
      listItemKeyAfter = node.listItemEntity.entityKey;
      if (childNodeBefore) {
        listItemKeyBefore = childNodeBefore && childNodeBefore.listItemEntity.entityKey;
        if (!listItemKeyBefore.equals(listItemKeyAfter)) {
          itemWidgetByItemId.deleteItem(listItemKeyBefore.itemId);
        }
      }
      itemWidgetByItemId.setItem(listItemKeyAfter.itemId, node);
    }

    return this;
  },

  /**
   * @param {string} nodeName
   * @returns {$ui.EntityList}
   */
  removeChildNode: function removeChildNode(nodeName) {
    var childNodeBefore = removeChildNode.shared.childNodeBefore,
        listItemKeyBefore;
    if (childNodeBefore) {
      listItemKeyBefore = childNodeBefore.listItemEntity.entityKey;
      this.itemWidgetByItemId.deleteItem(listItemKeyBefore.itemId);
    }
    return this;
  },

  /**
   * @param {string} itemId
   * @returns {$ui.EntityListItem}
   */
  getItemWidgetByItemId: function (itemId) {
    return this.itemWidgetByItemId.getValue(itemId);
  },

  /**
   * @param {$entity.CollectionField} listEntity
   * @returns {$ui.EntityList}
   */
  setListEntity: function (listEntity) {
    this.setEntityProperty('listEntity', listEntity);
    return this;
  },

  /**
   * @param {$entity.EntityChangeEvent} event
   * @ignore
   */
  onEntityChange: function (event) {
    var entityKey = event.sender.entityKey,
        entityProperty = this.entityPropertiesByEntityKeys
        .getValue(entityKey.toString());

    if (entityProperty === 'listEntity') {
      this._updateItemWidgets(event.propertiesAdded, event.propertiesRemoved);
    }
  }
});
