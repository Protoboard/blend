"use strict";

/**
 * @function $entity.FieldTypeIndex.create
 * @returns {$entity.FieldTypeIndex}
 */

/**
 * Maintains a lookup of field references by document type and field type.
 * @class $entity.FieldTypeIndex
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
        allFieldPaths = $entity.entities.queryPathsWrapped(allFieldsQuery)
        .mapKeys(String)
        .toCollection(),
        compositeFieldPaths = $entity.entities.queryPathsWrapped(compositeFieldQuery)
        .mapKeys(function (path) {
          path = path.clone();
          path.pop();
          return path.toString();
        })
        .toCollection();

    // processing field types
    // a) adding composite fields
    compositeFieldPaths.forEachItem(function (path, key) {
      var fieldRef = path.components[2],
          documentType = $entity.DocumentKey.fromString(fieldRef).documentType;
      that._addFieldRef(documentType, 'composite', fieldRef);

      // removing composite field from list of primitive fields
      allFieldPaths.deleteItem(key);
    });

    // b) adding primitive fields (remaining)
    allFieldPaths.forEachItem(function (path) {
      var fieldRef = path.components[2],
          documentType = $entity.DocumentKey.fromString(fieldRef).documentType;
      that._addFieldRef(documentType, 'primitive', fieldRef);
    });
  },

  /**
   * Adds a fieldType entry to the index. Private because this index is not
   * expected to be updated.
   * @param {string} documentType
   * @param {string} fieldType
   * @param {reference} fieldRef
   * @returns {$entity.FieldTypeIndex}
   * @private
   */
  _addFieldRef: function (documentType, fieldType, fieldRef) {
    var indexPath = $data.Path.fromComponents([
      '__fieldType', documentType, fieldType, fieldRef]);
    $entity.index.setNode(indexPath, 1);
    return this;
  },

  /**
   * Retrieves a list of field attribute references matching the specified
   * `documentType` and `fieldType`.
   * @param {string} documentType Document type associated with field.
   * @param {string} fieldType Either 'primitive' or 'composite'.
   * @returns {Array.<reference>} List of field names
   * @todo Create fieldType enum for documentation.
   */
  getFieldRefsByType: function (documentType, fieldType) {
    var indexPath = $data.Path.fromComponents([
          '__fieldType', documentType, fieldType]),
        fieldLookup = $entity.index.getNode(indexPath);
    return fieldLookup && Object.keys(fieldLookup);
  }
});
