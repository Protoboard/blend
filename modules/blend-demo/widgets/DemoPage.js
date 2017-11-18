"use strict";

/**
 * @function $demo.DemoPage.create
 * @returns {$demo.DemoPage}
 */

/**
 * @class $demo.DemoPage
 * @extends $widgets.Page
 */
$demo.DemoPage = $oop.getClass('$demo.DemoPage')
.blend($widgets.Page)
.define(/** @lends $demo.DemoPage# */{
  /** @ignore */
  init: function () {
    $entity.entities
    .appendNode('document.__document.character'.toTreePath(), {
      fields: ['name']
    });

    $widgets.Text.create({
      elementName: 'h1',
      textString: "Blend Demo"
    })
    .addToParentNode(this);

    this._addText();
    this._addLocaleText();
    this._addDataText();
    this._addTemplateText();
    this._addHyperlink();
  },

  /** @private */
  _addText: function () {
    $demo.DemoItem.create({
      itemTitle: $widgets.Text.__classId,
      contentWidget: $widgets.Text.create({
        textString: "<b>Hello World!</b>"
      })
    })
    .addToParentNode(this);
  },

  /** @private */
  _addLocaleText: function () {
    // translatable text
    '_translation/helloworld-de'.toDocument().setNode({
      originalString: "Hello World!",
      pluralForms: ["Hallo Welt!"]
    });
    '_locale/de'.toDocument().setNode({
      localeName: 'German',
      pluralFormula: 'nplurals=2; plural=(n != 1);',
      translations: {
        '_translation/helloworld-de': 1
      }
    });
    $demo.DemoItem.create({
      itemTitle: $widgets.LocaleText.__classId,
      contentWidget: $widgets.LocaleText.create({
        textTranslatable: "Hello World!".toTranslatable()
      })
    })
    .addToParentNode(this);
  },

  /** @private */
  _addDataText: function () {
    'character/rick/name'.toField().setNode("Rick Shanchez");
    $demo.DemoItem.create({
      itemTitle: $widgets.DataText.__classId,
      contentWidget: $widgets.DataText.fromTextKey('character/rick/name'.toFieldKey())
    })
    .addToParentNode(this);
  },

  /** @private */
  _addTemplateText: function () {
    'character/jerry/name'.toField().setNode("Jerry");
    var liveTemplate = "What's up, {{name}}?".toLiveTemplate()
    .setParameterValues({
      name: 'character/jerry/name'.toField()
    });
    $demo.DemoItem.create({
      itemTitle: $widgets.TemplateText.__classId,
      contentWidget: $widgets.TemplateText.create({
        textTemplate: liveTemplate
      })
    })
    .addToParentNode(this);
  },

  /** @private */
  _addHyperlink: function () {
    $demo.DemoItem.create({
      itemTitle: $widgets.Hyperlink.__classId,
      contentWidget: $widgets.Hyperlink.create({
        textString: "Rick and Morty",
        targetUrl: 'http://www.adultswim.com/videos/rick-and-morty/'
      })
    })
    .addToParentNode(this);
  }
});

$event.EventSpace.create()
.on(
    $router.EVENT_ROUTE_CHANGE,
    'route',
    $demo.DemoPage.__classId,
    function () {
      $demo.DemoPage.create().setAsActivePage();
    });
