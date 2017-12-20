"use strict";

/**
 * Common functionality for entity keys.
 * @class $entity.EntityKey
 * @extends $utils.Equatable
 * @extends $data.Comparable
 */
$entity.EntityKey = $oop.createClass('$entity.EntityKey')
.blend($utils.Equatable)
.blend($data.Comparable)
.define(/** @lends $entity.EntityKey# */{
  /**
   * Identifies parent entity.
   * @member {$entity.EntityKey} $entity.EntityKey#parentKey
   */

  /**
   * Identifies entity in the context of its parent.
   * @member {string} $entity.EntityKey#entityName
   */

  /**
   * Identifies the entity's data node in the entity store.
   * @member {$data.TreePath} $entity.EntityKey#_entityPath
   * @private
   */

  /**
   * String representation of the current entity key.
   * @member {string} $entity.EntityKey#_reference
   * @private
   */

  /**
   * @memberOf $entity.EntityKey
   * @param {$data.TreePath} entityPath
   * @param {Object} [properties]
   * @returns {$entity.EntityKey}
   * @abstract
   */
  fromEntityPath: function (entityPath, properties) {},

  /**
   * @memberOf $entity.EntityKey
   * @param {string} reference
   * @param {Object} [properties]
   * @returns {$entity.EntityKey}
   * @abstract
   */
  fromReference: function (reference, properties) {},

  /**
   * @param {$entity.EntityKey} entityKey
   * @returns {boolean}
   */
  equals: function equals(entityKey) {
    return equals.returned &&
        (this.parentKey === entityKey.parentKey ||
            this.parentKey.equals(entityKey.parentKey)) &&
        this.entityName === entityKey.entityName;
  },

  /**
   * Retrieves a key to the child entity identified by `childId`.
   * @param {string} childId
   * @returns {$entity.EntityKey}
   */
  getChildKey: function (childId) {
    return $entity.EntityKey.create({
      parentKey: this,
      entityName: childId
    });
  },

  /**
   * Retrieves a `Path` instance identifying the entity's data node in the
   * entity store.
   * @returns {$data.TreePath}
   * @abstract
   */
  getEntityPath: function () {
    return this._entityPath;
  },

  /**
   * @return {string}
   */
  getReference: function () {
    if (this._reference === undefined) {
      this._reference = this.toString();
    }
    return this._reference;
  },

  /**
   * Retrieves a key to the attributes associated with the entity class.
   * @returns {$entity.DocumentKey}
   * @abstract
   */
  getAttributeDocumentKey: function () {},

  /**
   * Retrieves a static attribute associated with the current entity.
   * @param {string} attributeName
   * @returns {string}
   */
  getAttribute: function (attributeName) {
    var attributeKey = this.getAttributeDocumentKey()
    .getFieldKey(attributeName);
    return $entity.entities.getNode(attributeKey.getEntityPath());
  },

  /**
   * Retrieves `nodeType` attribute for the current entity.
   * @returns {string}
   */
  getNodeType: function () {
    return this.getAttribute('nodeType');
  }
})
.build();
