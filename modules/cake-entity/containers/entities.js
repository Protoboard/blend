"use strict";

/**
 * Stores entities. When extending meta documents, always append to avoid
 * removing existing content.
 * @memberOf $entity
 * @type {$data.Tree}
 * @example
 * var metaKey = $entity.DocumentKey.fromComponents('__field', 'user/gender');
 * $entity.entities.appendNode(metaKey.getEntityPath(), {
 *   fieldType: 'string'
 * });
 */
$entity.entities = $data.Tree.fromData({
  document: {
    /** Document attribute documents. */
    __document: {
      //user: {
      //  documentType: 'user'
      //}
    },

    /** Field attribute documents. */
    __field: {
      '__document/documentType': {
        fieldType: 'primitive'
      },

      '__field/fieldType': {
        fieldType: 'primitive',
        options: {
          primitive: 1, // default
          reference: 1,
          collection: 1
        }
      },
      '__field/options': {
        fieldType: 'collection'
      },

      '__item/itemType': {
        fieldType: 'primitive',
        options: {
          primitive: 1, // default
          reference: 1,
          order: 1
        }
      },
      '__item/itemIdType': {
        fieldType: 'primitive',
        options: {
          primitive: 1, // default
          reference: 1,
          order: 1
        }
      },
      '__item/options': {
        fieldType: 'collection'
      }

      //'user/name': {
      //  /** Field contains string */
      //  fieldType: 'string'
      //},
      //'user/emails': {
      //  /** Field contains collection */
      //  fieldType: 'collection'
      //},
      //'user/friends': {
      //  /** Field contains collection */
      //  fieldType: 'collection'
      //}
    },

    /** Item attribute documents. */
    __item: {
      //'user/emails': {
      //  /** Items are strings */
      //  itemType: 'string'
      //},
      //'user/friends': {
      //  /** Items are booleans */
      //  itemType: 'boolean',
      //  /** Item IDs are references */
      //  itemIdType: 'reference'
      //}
    }
  }
});
