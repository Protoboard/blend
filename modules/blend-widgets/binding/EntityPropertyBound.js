"use strict";

/**
 * Binds the host widget to its `Entity` type properties. Whenever entities
 * associated with instance properties change, or when the host widget
 * becomes attached, a relevant synchronization callback (`syncToEntity`) will
 * be invoked.
 * @mixin $widgets.EntityPropertyBound
 * @augments $widget.Widget
 */
$widgets.EntityPropertyBound = $oop.getClass('$widgets.EntityPropertyBound')
.expect($oop.getClass('$widget.Widget'))
.define(/** @lends $widgets.EntityPropertyBound# */{
  /**
   * @member {$data.StringSet} $widgets.EntityPropertyBound#entityProperties
   */

  /**
   * @member {$data.Collection}
   *     $widgets.EntityPropertyBound#entityPropertiesByEntityKeys
   */

  /** @ignore */
  defaults: function () {
    this.entityProperties = this.entityProperties ||
        $data.StringSet.create();
    this.entityPropertiesByEntityKeys = this.entityPropertiesByEntityKeys ||
        $data.Collection.create();
  },

  /** @ignore */
  init: function () {
    this._initEntityProperties();
    this._initEntityPropertiesByEntityKeys();
  },

  /** @private */
  _initEntityProperties: function () {
    var that = this,
        ownPropertyNames = Object.getOwnPropertyNames(this),
        entityProperties = this.entityProperties;

    ownPropertyNames
    .filter(function (propertyName) {
      return $entity.Entity.mixedBy(that[propertyName]);
    })
    .forEach(function (propertyName) {
      entityProperties.setItem(propertyName);
    });
  },

  /** @private */
  _initEntityPropertiesByEntityKeys: function () {
    var that = this,
        entityPropertiesByEntityKeys = this.entityPropertiesByEntityKeys;
    this.entityProperties
    .forEachItem(function (propertyName) {
      var entity = that[propertyName],
          entityKey = entity.entityKey;
      entityPropertiesByEntityKeys.setItem(entityKey.toString(), propertyName);
    });
  },

  /**
   * @param {string} entityProperty
   * @param {$entity.Entity} entity
   * @returns {$widgets.EntityPropertyBound}
   * @todo Should we allow mutating entity properties?
   */
  setEntityProperty: function (entityProperty, entity) {
    var entityProperties = this.entityProperties,
        entityPropertiesByEntityKeys = this.entityPropertiesByEntityKeys,
        entityBefore = this[entityProperty],
        entityKeyBefore = entityBefore && entityBefore.entityKey,
        entityKeyAfter = entity && entity.entityKey;

    if (!entityProperties.hasItem(entityProperty)) {
      entityProperties.setItem(entityProperty);
    }

    if (entityKeyAfter && !entityKeyAfter.equals(entityKeyBefore) ||
        !entityKeyAfter && entity !== entityBefore
    ) {
      this[entityProperty] = entity;

      if (entityBefore) {
        entityPropertiesByEntityKeys
        .deleteItem(entityBefore.entityKey.toString(), entityProperty);
        this.off(
            $entity.EVENT_ENTITY_CHANGE,
            entityBefore);
      }

      if (entityKeyAfter) {
        entityPropertiesByEntityKeys
        .setItem(entity.entityKey.toString(), entityProperty);
        this.on(
            $entity.EVENT_ENTITY_CHANGE,
            entity,
            this.onEntityChange);
      }

      this.syncToEntityProperty(entityProperty);
    }

    return this;
  },

  /** @ignore */
  onAttach: function () {
    var that = this;
    this.entityProperties
    .filter(function (entityProperty) {
      return that[entityProperty];
    })
    .forEachItem(function (entityProperty) {
      var entity = that[entityProperty];
      that.syncToEntityProperty(entityProperty);
      that.on(
          $entity.EVENT_ENTITY_CHANGE,
          entity,
          that.onEntityChange);
    });
  },

  /**
   * @param {string} entityProperty
   * @ignore
   */
  syncToEntityProperty: function (entityProperty) {},

  /**
   * Invoked when a relevant entity has changed.
   * @param {$entity.EntityChangeEvent} event
   * @ignore
   */
  onEntityChange: function (event) {
    var entityKey = event.sender.entityKey,
        entityProperty = this.entityPropertiesByEntityKeys
        .getValue(entityKey.toString());
    this.syncToEntityProperty(entityProperty);
  }
});
