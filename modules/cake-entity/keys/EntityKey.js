"use strict";

/**
 * Common functionality for entity keys.
 * @class $entity.EntityKey
 * @extends $data.Comparable
 * @extends $event.EventSender
 * @extends $event.EventListener
 */
$entity.EntityKey = $oop.getClass('$entity.EntityKey')
.mix($data.Comparable)
.mix($event.EventSender)
.mix($event.EventListener);

/**
 * Retrieves a key to the metadata associated with the entity class.
 * @function $entity.EntityKey#getMetaKey
 * @returns {$entity.DocumentKey}
 * @abstract
 */

/**
 * Retrieves a `Path` identifying the entity's data node in the entity store.
 * @function $entity.EntityKey#getEntityPath
 * @returns {$data.Path}
 * @abstract
 */
