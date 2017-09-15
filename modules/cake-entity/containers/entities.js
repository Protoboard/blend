"use strict";

/**
 * Stores entities. When extending attribute documents, always append to avoid
 * removing existing content.
 * @memberOf $entity
 * @type {$data.Tree}
 * @example
 * var attributeDocumentKey =
 *     $entity.AttributeDocumentKey.fromDocumentIdComponents('__field',
 *     ['user', 'gender']);
 * $entity.entities.appendNode(attributeDocumentKey.getEntityPath(), {
 *   fieldType: 'primitive'
 * });
 */
$entity.entities = $data.Tree.fromData({
  document: {
    /** Document attribute documents. */
    __document: {
      __document: {
        fields: [
          'fields'
        ]
      },
      __field: {
        fields: [
          'fieldType',
          'options'
        ]
      },
      __item: {
        fields: [
          'itemType',
          'itemIdType'
        ]
      }

      // Sample document type
      //user: {
      //  fields: ['name', 'emails', 'friends']
      //}
    },

    /** Field attribute documents. */
    __field: {
      '__document/fields': {
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

      // Sample fields
      //'user/name': {
      //  /** Field contains primitive */
      //  fieldType: 'primitive'
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
      // Sample collection items
      //'user/emails': {
      //  /** Items are strings */
      //  itemType: 'primitive'
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
