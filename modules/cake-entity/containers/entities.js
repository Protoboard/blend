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
          'valueOptions',
          'itemIdType',
          'itemIdOptions',
          'itemValueType',
          'itemValueOptions'
        ]
      },
      __item: {
        fields: [
          'idType',
          'idOptions',
          'valueType',
          'valueOptions'
        ]
      }

      // Sample document type
      //user: {
      //  fields: ['name', 'emails', 'friends']
      //}
    },

    /** Field attribute documents. */
    __field: {
      '__document/valueType': {
        valueType: 'string',
        valueOptions: {
          document: 1
        }
      },
      '__document/fields': {
        valueType: 'collection'
      },

      '__field/nodeType': {
        valueType: 'string',
        valueOptions: {
          leaf: 1, // default
          branch: 1
        }
      },
      '__field/valueType': {
        valueType: 'string',
        valueOptions: {
          string: 1, // default
          number: 1,
          boolean: 1,
          reference: 1,
          collection: 1
        }
      },
      '__field/valueOptions': {
        nodeType: 'branch',
        valueType: 'collection'
      },
      '__field/itemIdType': {
        valueType: 'string',
        valueOptions: {
          string: 1, // default
          reference: 1,
          order: 1
        }
      },
      '__field/itemIdOptions': {
        nodeType: 'branch',
        valueType: 'collection'
      },
      '__field/itemValueType': {
        valueType: 'string',
        valueOptions: {
          string: 1, // default
          reference: 1,
          order: 1
        }
      },
      '__field/itemValueOptions': {
        nodeType: 'branch',
        valueType: 'collection'
      },

      // todo Redundant
      '__item/idType': {
        valueType: 'string',
        valueOptions: {
          string: 1, // default
          reference: 1,
          order: 1
        }
      },
      '__item/idOptions': {
        nodeType: 'branch',
        valueType: 'collection'
      },
      '__item/valueType': {
        valueType: 'string',
        valueOptions: {
          string: 1, // default
          reference: 1,
          order: 1
        }
      },
      '__item/valueOptions': {
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
      //  valueType: 'collection',
      //  /** Items are emails */
      //  itemValueType: 'email'
      //},
      //'user/friends': {
      //  /** Field contains collection */
      //  nodeType: 'branch',
      //  valueType: 'collection'
      //  /** Item IDs are references */
      //  itemIdType: 'reference',
      //  /** Items are booleans */
      //  itemValueType: 'boolean'
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
      //  /** Item IDs are references */
      //  idType: 'reference',
      //  /** Items are booleans */
      //  valueType: 'boolean'
      //}
    }
  }
});
