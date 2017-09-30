"use strict";

/**
 * @function $entity.FieldTypeIndex.create
 * @returns {$entity.FieldTypeIndex}
 */

/**
 * Maintains a lookup of field references by document type and field type.
 * @class $entity.FieldTypeIndex
 * @todo Create nodeType enum for documentation.
 * @todo Rename
 */
$entity.FieldTypeIndex = $oop.getClass('$entity.FieldTypeIndex')
.mix($oop.Singleton)
.define(/** @lends $entity.FieldTypeIndex# */{
  /** @ignore */
  init: function () {
    this._initFieldTypeIndex();
  },

  /** @private */
  _initFieldTypeIndex: function () {
    // querying all nodeType paths
    var that = this,
        fieldsQuery = $data.Query.fromString('document.__document.*.fields.*'),
        compositeFieldsQuery = $data.Query.fromString('document.__field.*.nodeType:branch'),

        // attribute ref:key lookup for all documented fields
        fieldAttributeKeys = $entity.entities.queryPathNodePairs(fieldsQuery)
        .mapValues(function (fieldName, path) {
          var documentType = path.components[2];
          return $entity.DocumentKey.fromComponents(documentType, fieldName);
        })
        .mapKeys(String)
        .toCollection(),

        // attribute ref:ref lookup for all fields documented as branch nodes
        compositeFieldRefs = $entity.entities.queryPathsWrapped(compositeFieldsQuery)
        .mapValues(function (path) {
          return path.components[2];
        })
        .mapKeys(function (fieldAttributeRef) {
          return fieldAttributeRef;
        })
        .toStringCollection();

    // processing field types
    // a) adding branch node fields
    compositeFieldRefs
    .join(fieldAttributeKeys)
    .forEachItem(function (fieldAttributeKey, fieldAttributeRef) {
      var documentType = fieldAttributeKey.documentType,
          fieldName = fieldAttributeKey.documentId;

      that._addFieldRef('branch', fieldAttributeRef);
      that._addFieldName('branch', documentType, fieldName);

      // removing branch node field from list of all fields
      fieldAttributeKeys.deleteItem(fieldAttributeRef);
    });

    // b) adding leaf node fields (remaining)
    fieldAttributeKeys
    .forEachItem(function (fieldAttributeKey, fieldAttributeRef) {
      var documentType = fieldAttributeKey.documentType,
          fieldName = fieldAttributeKey.documentId;
      that._addFieldRef('leaf', fieldAttributeRef);
      that._addFieldName('leaf', documentType, fieldName);
    });
  },

  /**
   * @param {string} nodeType
   * @param {reference} fieldRef
   * @returns {$entity.FieldTypeIndex}
   * @private
   */
  _addFieldRef: function (nodeType, fieldRef) {
    var indexPath = $data.Path.fromComponents([
      '__fieldRef', 'byFieldType', nodeType, fieldRef]);
    $entity.index.setNode(indexPath, 1);
    return this;
  },

  /**
   * @param {string} nodeType
   * @param {string} documentType
   * @param {reference} fieldName
   * @returns {$entity.FieldTypeIndex}
   * @private
   */
  _addFieldName: function (nodeType, documentType, fieldName) {
    var indexPath = $data.Path.fromComponents([
      '__fieldName', 'byFieldType', nodeType, documentType, fieldName]);
    $entity.index.setNode(indexPath, 1);
    return this;
  },

  /**
   * Retrieves a list of field attribute references matching the specified
   * `documentType` and `nodeType`.
   * @param {string} nodeType Either 'leaf' or 'branch'.
   * @returns {Array.<reference>} List of field names
   */
  getFieldRefsByFieldType: function (nodeType) {
    var indexPath = $data.Path.fromComponents([
          '__fieldRef', 'byFieldType', nodeType]),
        fieldRefLookup = $entity.index.getNode(indexPath);
    return fieldRefLookup && Object.keys(fieldRefLookup);
  },

  /**
   * Retrieves a list of field attribute references matching the specified
   * `documentType` and `nodeType`.
   * @param {string} documentType Document type associated with field.
   * @param {string} nodeType Either 'leaf' or 'branch'.
   * @returns {Array.<string>} List of field names
   */
  getFieldNamesByFieldType: function (documentType, nodeType) {
    var indexPath = $data.Path.fromComponents([
          '__fieldName', 'byFieldType', nodeType, documentType]),
        fieldRefLookup = $entity.index.getNode(indexPath);
    return fieldRefLookup && Object.keys(fieldRefLookup);
  }
});
