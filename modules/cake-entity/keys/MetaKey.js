"use strict";

/**
 * @function $entity.MetaKey.create
 * @returns {$entity.MetaKey}
 */

/**
 * @class $entity.MetaKey
 * @extends $entity.DocumentKey
 */
$entity.MetaKey = $oop.getClass('$entity.MetaKey')
.cache(function (properties) {
  return $entity.MetaKey.toString.call(properties);
})
.mix($oop.getClass('$entity.DocumentKey'))
.define(/** @lends $entity.MetaKey# */{
  /**
   * @member {Array.<string>} $entity.MetaKey#components
   */

  /**
   * @memberOf $entity.DocumentKey
   * @param {string} documentType
   * @param {Array.<string>} components
   * @returns {$entity.MetaKey}
   */
  fromMetaComponents: function (documentType, components) {
    return this.create({
      documentType: documentType,
      documentId: components
      .map(function (component) {
        return $utils.escape(component, '/');
      })
      .join('/')
    });
  }
});
