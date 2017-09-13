"use strict";

/**
 * Common functionality for entity keys.
 * @class $entity.EntityKey
 * @extends $data.Comparable
 */
$entity.EntityKey = $oop.getClass('$entity.EntityKey')
.mix($data.Comparable)
.define(/** @lends $entity.EntityKey# */{
  /**
   * Identifies the entity's data node in the entity store.
   * @member {$data.Path} $entity.EntityKey#_entityPath
   * @protected
   */

  /**
   * Subclasses are expected to spread the entity path onto key-specific
   * properties.
   * @memberOf $entity.EntityKey
   * @param {$data.Path} entityPath
   * @returns {$entity.EntityKey}
   */
  fromEntityPath: function (entityPath) {
    return this.create({
      _entityPath: entityPath
    });
  },

  /**
   * Retrieves a `Path` instance identifying the entity's data node in the
   * entity store.
   * @returns {$data.Path}
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
  }

  /**
   * Retrieves a key to the attributes associated with the entity class.
   * @function $entity.EntityKey#getAttributeDocumentKey
   * @returns {$entity.DocumentKey}
   * @abstract
   */
});

$oop.getClass('$data.Path')
.delegate(/** @lends $data.Path# */{
  /** @returns {$entity.EntityKey} */
  toEntityKey: function () {
    return $entity.EntityKey.fromEntityPath(this);
  }
});
