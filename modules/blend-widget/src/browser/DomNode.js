"use strict";

/**
 * DOM manifest behavior for `Node` classes. Expects to be added to `Node`
 * classes that also have the `XmlNode` mixin.
 * Requires browser environment.
 * @mixin $widget.DomNode
 * @extends $widget.HtmlNode
 * @implements $widget.Renderable
 * @todo Wrap element modifications in requestAnimationFrame()
 */
$widget.DomNode = $oop.createClass('$widget.DomNode')
.blend($widget.HtmlNode)
.implement($widget.Renderable)
.setup(/** @lends $widget.DomNode */{
  /** @ignore */
  build: function () {
    var that = this,
        xmlTemplate = this.xmlTemplate,
        childSelectors;
    if (xmlTemplate) {
      childSelectors = this._extractParentSelectors(xmlTemplate);
      Object.keys(childSelectors)
      .forEach(function (nodeName) {
        var childProperties = that.getChildProperties(nodeName);
        childProperties.parentElementSelector = childSelectors[nodeName];
      });
    }
  }
})
.define(/** @lends $widget.DomNode# */{
  /**
   * Identifies parent element in the context of the parent DomNode.
   * @member {string} $widget.DomNode#parentElementSelector
   * @constant
   */

  /**
   * Extracts
   * @memberOf $widget.DomNode
   * @return {Object}
   * @private
   */
  _extractParentSelectors: function (xmlTemplate) {
    var element = document.createElement('div'),
        domNodes;

    element.innerHTML = xmlTemplate;
    domNodes = slice.call(element.querySelectorAll('[blend-nodeName]'));

    return domNodes
    .map(function (domNode) {
      var elementIndexes = [],
          elementIndex,
          parentElement = domNode.parentElement;
      while (parentElement.parentElement) {
        elementIndex = indexOf.call(parentElement.parentElement.childNodes, parentElement);
        elementIndexes.unshift(elementIndex);
        parentElement = parentElement.parentElement;
      }
      return elementIndexes
      .map(function (index) {
        return ':nth-child(' + (index + 1) + ')';
      })
      .join('>');
    })
    .reduce(function (result, selector, index) {
      result[domNodes[index].getAttribute('blend-nodeName')] = selector;
      return result;
    }, {});
  },

  /**
   * Renders child node and adds it to the DOM at the appropriate child index.
   * @param {$widget.DomNode} node
   * @returns {$widget.DomNode}
   */
  addChildNode: function addChildNode(node) {
    var childNodeBefore = addChildNode.shared.childNodeBefore,
        parentElement = this.getParentElementForChild(node.nodeName),
        childElement,
        nextChild, nextChildElement;

    if (parentElement && node !== childNodeBefore) {
      childElement = node.createElement();
      nextChild = this.getNextChild(node);
      nextChildElement = nextChild && nextChild.getElement() || null;
      parentElement.insertBefore(childElement, nextChildElement);
    }

    return this;
  },

  /**
   * Removes element associated with specified child node from DOM.
   * @param {string} nodeName
   * @returns {$widget.DomNode}
   */
  removeChildNode: function removeChildNode(nodeName) {
    var childNodeBefore = removeChildNode.shared.childNodeBefore,
        childNodeElement = childNodeBefore && childNodeBefore.getElement(),
        parentElement = childNodeElement && childNodeElement.parentNode;

    if (parentElement) {
      parentElement.removeChild(childNodeElement);
    }

    return this;
  },

  /**
   * Moves element associated with current node within parent element, to
   * reflect changed `nodeOrder`.
   * @param {$widget.DomNode} childNode
   * @param {number} nodeOrder
   * @returns {$widget.DomNode}
   */
  setChildOrder: function setChildOrder(childNode, nodeOrder) {
    var nodeOrderBefore = setChildOrder.shared.nodeOrderBefore,
        parentElement = this.getParentElementForChild(childNode.nodeName),
        childElement,
        nextChild, nextChildElement;

    if (parentElement && nodeOrder !== nodeOrderBefore) {
      childElement = childNode.getElement();
      if (childElement) {
        // moving child element to new index
        nextChild = this.getNextChild(childNode);
        nextChildElement = nextChild && nextChild.getElement() || null;
        parentElement.insertBefore(childElement, nextChildElement);
      }
    }

    return this;
  },

  /**
   * Updates HTML attribute on the element associated with the current node.
   * @param {string} attributeName
   * @param {string} attributeValue
   * @returns {$widget.DomNode}
   */
  setAttribute: function (attributeName, attributeValue) {
    var element = this.getElement();
    if (element) {
      switch (attributeName) {
      case 'style':
        element.style.cssText = attributeValue;
        break;
      default:
        element.setAttribute(attributeName, attributeValue);
        break;
      }
    }
    return this;
  },

  /**
   * Removes HTML attribute from the element associated with the current node.
   * @param {string} attributeName
   * @returns {$widget.DomNode}
   */
  deleteAttribute: function (attributeName) {
    var element = this.getElement();
    if (element) {
      switch (attributeName) {
      case 'style':
        element.style.cssText = '';
        break;
      default:
        element.removeAttribute(attributeName);
        break;
      }
    }
    return this;
  },

  /**
   * Renders current node and appends it to the children of the specified
   * `parentElement`.
   * @param {Element} parentElement
   * @returns {$widget.DomNode}
   * @ignore
   */
  renderInto: function (parentElement) {
    var element = this.getElement() || this.createElement();
    parentElement.appendChild(element);
    return this;
  },

  /**
   * Re-renders current node.
   * @returns {$widget.DomNode}
   */
  reRender: function () {
    var element = this.getElement(),
        parentElement = element && element.parentNode;
    if (parentElement) {
      parentElement.replaceChild(this.createElement(), element);
    }
    return this;
  },

  /**
   * Re-renders contents of current node. Own element will not be replaced.
   * @returns {$widget.DomNode}
   */
  reRenderContents: function () {
    var element = this.getElement();
    if (element) {
      element.innerHTML = this.getContentMarkup();
    }
    return this;
  },

  /**
   * Creates a DOM element which reflects the node's current state.
   * @returns {Element}
   */
  createElement: function () {
    var element = document.createElement(this.elementName);

    // adding attributes to element
    this.attributes
    .forEachItem(function (attributeValue, attributeName) {
      element.setAttribute(attributeName, attributeValue);
    });

    // adding content to element
    element.innerHTML = this.getContentMarkup();

    return element;
  },

  /**
   * Fetches the currently rendered element for the current node.
   * @returns {Element}
   */
  getElement: function () {
    return document.getElementById(this.elementId);
  },

  /**
   * Retrieves DOM element that is (to be) parent of the specified node's root
   * element. Specified node doesn't have to be rendered for it to return a
   * valid Element. (But current node does.)
   * @param {string} nodeName
   * @return {Element}
   */
  getParentElementForChild: function (nodeName) {
    var childProperties = this.getChildProperties(nodeName),
        parentElementSelector = childProperties &&
            childProperties.parentElementSelector,
        element = this.getElement();

    // parentElementSelector can be undefined or empty string - both mean
    // lack of nesting
    return parentElementSelector ?
        element && element.querySelector(
        '#' + this.elementId + '>' + parentElementSelector) :
        element;
  }
})
.build();

$widget.HtmlNode
.forwardBlend($widget.DomNode, $utils.isBrowser);
