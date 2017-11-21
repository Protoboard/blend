"use strict";

/**
 * @function $ui.TemplateText.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {$template.LiveTemplate} [properties.textTemplate]
 * @returns {$ui.TemplateText}
 */

/**
 * @class $ui.TemplateText
 * @extends $ui.Text
 * @mixes $ui.LocaleBound
 */
$ui.TemplateText = $oop.getClass('$ui.TemplateText')
.blend($oop.getClass('$ui.Text'))
.blend($oop.getClass('$ui.LocaleBound'))
.define(/** @lends $ui.TemplateText# */{
  /**
   * @member {$template.LiveTemplate} $ui.Text#textTemplate
   */

  /**
   * @memberOf $ui.TemplateText
   * @param {$template.LiveTemplate} textTemplate
   * @param {Object} [properties]
   * @returns {$ui.TemplateText}
   */
  fromTextTemplate: function (textTemplate, properties) {
    return this.create({
      textTemplate: textTemplate
    }, properties);
  },

  /** @ignore */
  init: function () {
    $assert.isInstanceOf(
        this.textTemplate, $template.LiveTemplate, "Invalid textTemplate");
  },

  /**
   * @param {$template.LiveTemplate} liveTemplate
   * @private
   */
  _addTemplateBindings: function (liveTemplate) {
    this.on(
        $template.EVENT_TEMPLATE_PARAMETER_CHANGE,
        liveTemplate,
        this.onTemplateParameterChange);
  },

  /**
   * @param {$template.LiveTemplate} liveTemplate
   * @private
   */
  _removeTemplateBindings: function (liveTemplate) {
    this.off($template.EVENT_TEMPLATE_PARAMETER_CHANGE, liveTemplate);
  },

  /**
   * @param {$template.LiveTemplate} liveTemplate
   * @private
   */
  _addEntityBindings: function (liveTemplate) {
    var that = this;
    $data.Collection.fromData(liveTemplate.parameterValues)
    .filterByValueType($entity.Entity)
    .forEachItem(function (entity) {
      that.on($entity.EVENT_ENTITY_CHANGE, entity, that.onEntityParameterChange);
    });
  },

  /**
   * @param {$template.LiveTemplate} liveTemplate
   * @private
   */
  _removeEntityBindings: function (liveTemplate) {
    var that = this;
    $data.Collection.fromData(liveTemplate.parameterValues)
    .filterByValueType($entity.Entity)
    .forEachItem(function (entity) {
      that.off($entity.EVENT_ENTITY_CHANGE, entity);
    });
  },

  /**
   * @protected
   */
  _syncToTextTemplate: function () {
    this.setTextString(this.textTemplate.toString());
  },

  /**
   * @protected
   */
  _syncToActiveTranslations: function () {
    this._syncToTextTemplate();
  },

  /**
   * @param {$template.LiveTemplate} textTemplate
   * @returns {$ui.TemplateText}
   */
  setTextTemplate: function setTextTemplate(textTemplate) {
    var textTemplateBefore = this.textTemplate;

    this._syncToTextTemplate();

    // unsubscribing from old LiveTemplate and contained Entities
    this._removeTemplateBindings(textTemplateBefore);
    this._removeEntityBindings(textTemplateBefore);

    // subscribing to new LiveTemplate and contained Entities
    this._addTemplateBindings(textTemplate);
    this._addEntityBindings(textTemplate);

    setTextTemplate.shared.textTemplateBefore = textTemplateBefore;

    return this;
  },

  /** @ignore */
  onAttach: function () {
    var textTemplate = this.textTemplate;
    this._addTemplateBindings(textTemplate);
    this._addEntityBindings(textTemplate);
  },

  /** @ignore */
  onTemplateParameterChange: function () {
    this._syncToTextTemplate();
  },

  /** @ignore */
  onEntityParameterChange: function () {
    this._syncToTextTemplate();
  }
});
