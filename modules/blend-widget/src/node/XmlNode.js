"use strict";

/**
 * XML manifest behavior for `Node` classes.
 * @class $widget.XmlNode
 * @extends $widget.Node
 * @implements $utils.Stringifiable
 * @todo Add property merge to .addChildNode()
 */
$widget.XmlNode = $oop.createClass('$widget.XmlNode')
.expect($widget.Node)
.implement($utils.Stringifiable)
.setup(/** @lends $widget.XmlNode */{
  /** @ignore */
  build: function () {
    var xmlTemplate = this.xmlTemplate;
    if (xmlTemplate) {
      this._childProperties = this._extractChildProperties(xmlTemplate);
      this._template = this._extractTemplate(xmlTemplate);
    }
  }
})
.define(/** @lends $widget.XmlNode# */{
  /**
   * Describes XML-specific child node properties: containment, element
   * name, order.
   * @member {string} $widget.XmlNode.xmlTemplate
   */

  /**
   * Pre-processed child node properties as extracted from `xmlTemplate`.
   * @member {Object.<string,Object>} $widget.XmlNode#_childProperties
   * @private
   * @todo Belongs to Node or a different mixin?
   */

  /**
   * Pre-processed substitution template as extracted from `xmlTemplate`.
   * @member {$template.Template} $widget.XmlNode#_template
   * @private
   * @todo Belongs to Node or a different mixin?
   */

  /**
   * Name of the XML element associated with the current node. Eg. 'html',
   * 'div', etc.
   * @member {string} $widget.XmlNode#elementName
   */

  /**
   * XML attributes associated with current node.
   * @member {$widget.XmlAttributes} $widget.XmlNode#attributes
   */

  /**
   * Extracts XmlNode references from a suitable XML template. Used at
   * pre-processing `xmlTemplate`.
   * @memberOf {$widget.XmlNode}
   * @type {RegExp}
   * @constant
   */
  RE_XML_NODE_EXTRACTOR: /<(\?|[a-zA-Z][a-zA-Z0-9]*)[^>]*?\bblend-nodeName="([^"]*)"[^>]*?(?:>\s*<\/\1>|\/>|>)/g,

  /**
   * @memberOf $widget.XmlNode
   * @param {string} elementName
   * @param {Object} [properties]
   * @returns {$widget.XmlNode}
   */
  fromElementName: function (elementName, properties) {
    return this.create({elementName: elementName}, properties);
  },

  /** @ignore */
  defaults: function () {
    this.attributes = this.attributes || $widget.XmlAttributes.create();
  },

  /** @ignore */
  init: function () {
    $assert.isString(this.elementName, "Invalid elementName");

    var childNodes = this.childNodes;
    this.childNodes = childNodes ?
        childNodes.as($widget.XmlNodes) :
        $widget.XmlNodes.create();
  },

  /**
   * Extracts child node properties from XML template.
   * @memberOf $widget.XmlNode
   * @param {string} xmlTemplate
   * @return {Object}
   * @private
   * @todo Extract initial attributes. (incremental)
   */
  _extractChildProperties: function (xmlTemplate) {
    var matches = this.RE_XML_NODE_EXTRACTOR.exec(xmlTemplate),
        elementName, nodeName, childProperties,
        result = {},
        order = 0;
    while (matches) {
      elementName = matches[1];
      nodeName = matches[2];
      result[nodeName] = childProperties = {};
      if (elementName !== '?') {
        childProperties.elementName = elementName;
      }
      childProperties.nodeOrder = order++;
      matches = this.RE_XML_NODE_EXTRACTOR.exec(xmlTemplate);
    }
    return result;
  },

  /**
   * Extracts child node properties from XML template.
   * @memberOf $widget.XmlNode
   * @param {string} xmlTemplate
   * @return {$template.Template}
   * @private
   */
  _extractTemplate: function (xmlTemplate) {
    var templateString = xmlTemplate.replace(this.RE_XML_NODE_EXTRACTOR,
        function (match, elementName, nodeName) {
          return '{{' + nodeName + '}}';
        });
    return $template.Template.fromString(templateString);
  },

  /**
   * Retrieves child node properties for the specified child as extracted
   * from the template.
   * @param {string} nodeName
   * @return {Object}
   * @todo Belongs to Node or a different mixin?
   */
  getChildProperties: function (nodeName) {
    var childProperties = this._childProperties;
    return childProperties && childProperties[nodeName];
  },

  /**
   * Creates a new node instance of the specified `Class` and adds it to the
   * current node as child.
   * @param {$oop.Class|$widget.Node} Class
   * @param {Object} [properties]
   * @param {string} [properties.nodeName]
   * @return {$widget.XmlNode}
   * @todo Belongs to Node or a different mixin?
   */
  createChildNode: function (Class, properties) {
    var nodeName = properties && properties.nodeName,
        childProperties,
        childNode;

    if (nodeName !== undefined) {
      childProperties = this.getChildProperties(nodeName);
      childNode = Class.create(childProperties, properties);
    } else {
      childNode = Class.create(properties);
    }

    this.addChildNode(childNode);

    return this;
  },

  /**
   * @param {string} attributeName
   * @param {string} attributeValue
   * @returns {$widget.XmlNode}
   */
  setAttribute: function (attributeName, attributeValue) {
    this.attributes.setItem(attributeName, attributeValue);
    return this;
  },

  /**
   * @param {string} attributeName
   * @returns {string}
   */
  getAttribute: function (attributeName) {
    return this.attributes.getValue(attributeName);
  },

  /**
   * @param {string} attributeName
   * @returns {$widget.XmlNode}
   */
  deleteAttribute: function (attributeName) {
    this.attributes.deleteItem(attributeName);
    return this;
  },

  /**
   * @returns {string}
   */
  getContentMarkup: function () {
    var template = this._template;
    return template ?
        template.getResolvedString(this.childNodeByNodeName.data) :
        this.childNodes.toString();
  },

  /**
   * @returns {string}
   */
  toString: function () {
    var elementName = $widget.escapeXmlEntities(this.elementName),
        attributes = this.attributes;
    return [
      '<' + elementName + (attributes.getItemCount() ? (' ' + attributes) : '') + '>',
      this.getContentMarkup(),
      '</' + elementName + '>'
    ].join('');
  }
})
.build();
