"use strict";

/**
 * @function $entity.FieldTypeIndex.create
 * @returns {$entity.FieldTypeIndex}
 */

/**
 * Maintains a lookup of field references by document type and field type.
 * @class $entity.FieldTypeIndex
 * @todo Create fieldType enum for documentation.
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
    // querying all fieldType paths
    var that = this,
        allFieldsQuery = $data.Query.fromString('document.__field.*'),
        compositeFieldQuery = $data.Query.fromString('document.__field.*.fieldType:composite'),

        fieldAttributeKeys = $entity.entities.queryPathsWrapped(allFieldsQuery)
        .mapKeys(String)
        .mapValues(function (path) {
          return path.components[2];
        })
        .mapKeys(function (fieldAttributeRef) {
          return fieldAttributeRef;
        })
        .passEachValueTo($entity.DocumentKey.fromString, $entity.DocumentKey)
        .toCollection(),

        compositeFieldRefs = $entity.entities.queryPathsWrapped(compositeFieldQuery)
        .mapValues(function (path) {
          return path.components[2];
        })
        .mapKeys(function (fieldAttributeRef) {
          return fieldAttributeRef;
        })
        .toStringCollection();

    // processing field types
    // a) adding composite fields
    compositeFieldRefs
    .join(fieldAttributeKeys)
    .forEachItem(function (fieldAttributeKey, fieldAttributeRef) {
      var documentType = fieldAttributeKey.documentType,
          fieldName = fieldAttributeKey.documentId;

      that._addFieldRef('composite', fieldAttributeRef);
      that._addFieldName('composite', documentType, fieldName);

      // removing composite field from list of all fields
      fieldAttributeKeys.deleteItem(fieldAttributeRef);
    });

    // b) adding primitive fields (remaining)
    fieldAttributeKeys
    .forEachItem(function (fieldAttributeKey, fieldAttributeRef) {
      var documentType = fieldAttributeKey.documentType,
          fieldName = fieldAttributeKey.documentId;
      that._addFieldRef('primitive', fieldAttributeRef);
      that._addFieldName('primitive', documentType, fieldName);
    });
  },

  /**
   * @param {string} fieldType
   * @param {reference} fieldRef
   * @returns {$entity.FieldTypeIndex}
   * @private
   */
  _addFieldRef: function (fieldType, fieldRef) {
    var indexPath = $data.Path.fromComponents([
      '__fieldRef', 'byFieldType', fieldType, fieldRef]);
    $entity.index.setNode(indexPath, 1);
    return this;
  },

  /**
   * @param {string} fieldType
   * @param {string} documentType
   * @param {reference} fieldName
   * @returns {$entity.FieldTypeIndex}
   * @private
   */
  _addFieldName: function (fieldType, documentType, fieldName) {
    var indexPath = $data.Path.fromComponents([
      '__fieldName', 'byFieldType', fieldType, documentType, fieldName]);
    $entity.index.setNode(indexPath, 1);
    return this;
  },

  /**
   * Retrieves a list of field attribute references matching the specified
   * `documentType` and `fieldType`.
   * @param {string} fieldType Either 'primitive' or 'composite'.
   * @returns {Array.<reference>} List of field names
   */
  getFieldRefsByFieldType: function (fieldType) {
    var indexPath = $data.Path.fromComponents([
          '__fieldRef', 'byFieldType', fieldType]),
        fieldRefLookup = $entity.index.getNode(indexPath);
    return fieldRefLookup && Object.keys(fieldRefLookup);
  },

  /**
   * Retrieves a list of field attribute references matching the specified
   * `documentType` and `fieldType`.
   * @param {string} documentType Document type associated with field.
   * @param {string} fieldType Either 'primitive' or 'composite'.
   * @returns {Array.<reference>} List of field names
   */
  getFieldNamesByFieldType: function (documentType, fieldType) {
    var indexPath = $data.Path.fromComponents([
          '__fieldName', 'byFieldType', fieldType, documentType]),
        fieldRefLookup = $entity.index.getNode(indexPath);
    return fieldRefLookup && Object.keys(fieldRefLookup);
  }
});
