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
          'composite',
          'valueType',
          'keyType',
          'options'
        ]
      },
      __item: {
        fields: [
          'valueType',
          'keyType'
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
        valueType: 'collection'
      },

      '__field/composite': {
        valueType: 'boolean' // default: false
      },
      '__field/keyType': {
        valueType: 'string',
        options: {
          string: 1 // default
        }
      },
      '__field/valueType': {
        valueType: 'string',
        options: {
          string: 1, // default
          number: 1,
          boolean: 1,
          reference: 1,
          collection: 1
        }
      },
      '__field/options': {
        composite: true
      },

      '__item/valueType': {
        valueType: 'string',
        options: {
          reference: 1,
          order: 1
        }
      },
      '__item/keyType': {
        valueType: 'string',
        options: {
          reference: 1,
          order: 1
        }
      },
      '__item/options': {
        composite: true,
        valueType: 'collection'
      }

      // Sample fields
      //'user/name': {
      //  /** Field contains primitive */
      //  valueType: 'string'
      //},
      //'user/emails': {
      //  /** Field contains collection */
      //  composite: true,
      //  valueType: 'collection'
      //},
      //'user/friends': {
      //  /** Field contains collection */
      //  composite: true,
      //  valueType: 'collection'
      //}
    },

    /** Item attribute documents. */
    __item: {
      // Sample collection items
      //'user/emails': {
      //  /** Items are strings */
      //  valueType: 'email'
      //},
      //'user/friends': {
      //  /** Items are booleans */
      //  valueType: 'boolean',
      //  /** Item IDs are references */
      //  keyType: 'reference'
      //}
    }
  }
});
