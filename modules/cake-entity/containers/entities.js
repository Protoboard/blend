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
 *   nodeType: 'leaf'
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
          'nodeType',
          'valueType',
          'keyType',
          'options' // todo Rename to valueOptions
        ]
      },
      __item: {
        fields: [
          'valueType',
          'keyType',
          'options' // todo Rename to valueOptions
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

      '__field/nodeType': {
        valueType: 'string',
        options: {
          leaf: 1, // default
          branch: 1
        }
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
        nodeType: 'branch',
        valueType: 'collection'
      },

      '__item/valueType': {
        valueType: 'string',
        options: {
          string: 1, // default
          reference: 1,
          order: 1
        }
      },
      '__item/keyType': {
        valueType: 'string',
        options: {
          string: 1, // default
          reference: 1,
          order: 1
        }
      },
      '__item/options': {
        nodeType: 'branch',
        valueType: 'collection'
      }

      //// Sample fields
      //'user/name': {
      //  /** Field contains string */
      //  valueType: 'string'
      //},
      //'user/emails': {
      //  /** Field contains collection */
      //  nodeType: 'branch',
      //  valueType: 'collection'
      //},
      //'user/friends': {
      //  /** Field contains collection */
      //  nodeType: 'branch',
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
