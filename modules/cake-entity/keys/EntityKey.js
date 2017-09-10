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
  }

  /**
   * Retrieves a key to the metadata associated with the entity class.
   * @function $entity.EntityKey#getMetaKey
   * @returns {$entity.DocumentKey}
   * @abstract
   */

  /**
   * Retrieves a `Path` instance identifying the entity's data node in the entity
   * store.
   * @function $entity.EntityKey#getEntityPath
   * @returns {$data.Path}
   * @abstract
   */
});
