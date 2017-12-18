"use strict";

/**
 * Common functionality for entity keys.
 * @class $entity.EntityKey
 * @extends $utils.Equatable
 * @extends $data.Comparable
 * @todo Add parentKey & entityId properties?
 */
$entity.EntityKey = $oop.createClass('$entity.EntityKey')
.blend($utils.Equatable)
.blend($data.Comparable)
.define(/** @lends $entity.EntityKey# */{
  /**
   * Identifies the entity's data node in the entity store.
   * @member {$data.TreePath} $entity.EntityKey#_entityPath
   * @protected
   */

  /**
   * Subclasses are expected to spread the entity path onto key-specific
   * properties.
   * @memberOf $entity.EntityKey
   * @param {$data.TreePath} entityPath
   * @param {Object} [properties]
   * @returns {$entity.EntityKey}
   */
  fromEntityPath: function (entityPath, properties) {
    return this.create({
      _entityPath: entityPath
    }, properties);
  },

  /**
   * Retrieves a `Path` instance identifying the entity's data node in the
   * entity store.
   * @returns {$data.TreePath}
   */
  getEntityPath: function () {
    return this._entityPath;
  },

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
  },

  /**
   * Retrieves a key to the attributes associated with the entity class.
   * @returns {$entity.DocumentKey}
   * @abstract
   */
  getAttributeDocumentKey: function () {},

  /**
   * Retrieves a key to the child entity identified by `childId`.
   * @param {string} childId
   * @returns {$entity.EntityKey}
   * @abstract
   */
  getChildKey: function (childId) {},

  /**
   * Retrieves a key to the parent entity.
   * @returns {$entity.EntityKey}
   * @abstract
   */
  getParentKey: function () {},

  /**
   * Retrieves a string that identifies the current entity in its parent.
   * @returns {string}
   * @abstract
   */
  getEntityId: function () {}
})
.build();

$data.TreePath
.delegate(/** @lends $data.TreePath# */{
  /**
   * @param {Object} [properties]
   * @returns {$entity.EntityKey}
   */
  toEntityKey: function (properties) {
    return $entity.EntityKey.fromEntityPath(this, properties);
  }
});