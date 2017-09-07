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
    /** Document-descriptor metadata documents. */
    __document: {
      //user: {
      //  documentType: 'user'
      //}
    },

    /** Field-descriptor metadata documents. */
    __field: {
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

    /** Item-descriptor metadata documents. */
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
