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
    // todo Move to respective _add method once $entity.NodeTypeIndex is fixed.
    $entity.entities
    .appendNode('document.__document.character'.toTreePath(), {
      fields: ['name']
    })
    .appendNode('document.__document.show'.toTreePath(), {
      fields: ['title', 'url']
    });

    $widgets.Text.create({
      elementName: 'h1',
      textString: "Blend Demo"
    })
    .addToParentNode(this);

    // adding plain text
    $demo.DemoItem.create({
      code: this._createText,
      itemTitle: $widgets.Text.__classId,
      contentWidget: this._createText()
    })
    .addToParentNode(this);

    // adding locale-bound text
    $demo.DemoItem.create({
      code: this._createLocaleText,
      itemTitle: $widgets.LocaleText.__classId,
      contentWidget: this._createLocaleText()
    })
    .addToParentNode(this);

    // adding entity-bound text
    $demo.DemoItem.create({
      code: this._createDataText,
      itemTitle: $widgets.EntityText.__classId,
      contentWidget: this._createDataText()
    })
    .addToParentNode(this);

    // adding template text
    $demo.DemoItem.create({
      code: this._createTemplateText,
      itemTitle: $widgets.TemplateText.__classId,
      contentWidget: this._createTemplateText()
    })
    .addToParentNode(this);

    // adding plain hyperlink
    $demo.DemoItem.create({
      code: this._createHyperlink,
      itemTitle: $widgets.Hyperlink.__classId,
      contentWidget: this._createHyperlink()
    })
    .addToParentNode(this);

    // adding entity-bound hyperlink
    $demo.DemoItem.create({
      code: this._createDatHyperlink,
      itemTitle: $widgets.EntityHyperlink.__classId,
      contentWidget: this._createDatHyperlink()
    })
    .addToParentNode(this);

    // adding plain image
    $demo.DemoItem.create({
      code: this._createImage,
      itemTitle: $widgets.Image.__classId,
      contentWidget: this._createImage()
    })
    .addToParentNode(this);

    // adding entity-bound image
    $demo.DemoItem.create({
      code: this._createEntityImage,
      itemTitle: $widgets.EntityImage.__classId,
      contentWidget: this._createEntityImage()
    })
    .addToParentNode(this);

    // adding plain button
    $demo.DemoItem.create({
      code: this._createButton,
      itemTitle: $widgets.Button.__classId,
      contentWidget: this._createButton()
    })
    .addToParentNode(this);
  },

  //@formatter:off
/** @private */
_createText: function () {
  return $widgets.Text.create({
    textString: "<em>wubba lubba dub dub</em>"
  });
},

/** @private */
_createLocaleText: function () {
  // translatable text
  '_translation/wubba-birdperson'.toDocument().setNode({
    originalString: "I am in great pain, please help me",
    pluralForms: ["wubba lubba dub dub"]
  });
  '_locale/birdperson'.toDocument().setNode({
    localeName: 'Birdperson',
    pluralFormula: 'nplurals=2; plural=(n != 1);',
    translations: {
      '_translation/wubba-birdperson': 1
    }
  });
  $i18n.Locale.fromLocaleId('birdperson').setAsActiveLocale();
  return $widgets.LocaleText.create({
    textTranslatable: "I am in great pain, please help me".toTranslatable()
  });
},

/** @private */
_createDataText: function () {
  'character/rick/name'.toField().setNode("Rick Shanchez");
  return $widgets.EntityText.create({
    textEntity: 'character/rick/name'.toField()
  });
},

/** @private */
_createTemplateText: function () {
  'character/jerry/name'.toField().setNode("Jerry");
  return $widgets.TemplateText.create({
    textTemplate: "What's up, {{name}}?".toLiveTemplate()
    .setParameterValues({
      name: 'character/jerry/name'.toField()
    })
  });
},

/** @private */
_createHyperlink: function () {
  return $widgets.Hyperlink.create({
    textString: "Rick and Morty",
    targetUrl: 'http://www.adultswim.com/videos/rick-and-morty/'
  });
},

/** @private */
_createDatHyperlink: function () {
  'show/rick-and-morty'.toDocument().setNode({
    title: "Rick and Morty",
    url: 'http://www.adultswim.com/videos/rick-and-morty/'
  });
  return $widgets.EntityHyperlink.create({
    textEntity: 'show/rick-and-morty/title'.toField(),
    targetUrlEntity: 'show/rick-and-morty/url'.toField()
  });
},

/** @private */
_createImage: function () {
  return $widgets.Image.create({
    imageUrl: 'https://i.cdn.turner.com/adultswim/big/video/meet-the-vindicators/rickandmorty_ep304_001_Meet_The_Vindicators.jpg'
  });
},

/** @private */
_createEntityImage: function () {
  'show/rick-and-morty/image'.toField()
  .setNode('https://i.cdn.turner.com/adultswim/big/video/morty-and-summer-on-trial/rickandmorty_ep301_003_Trial_Summer_And_Morty.jpg');
  return $widgets.EntityImage.create({
    imageUrlEntity: 'show/rick-and-morty/image'.toField()
  });
},

/** @private */
_createButton: function () {
  return $widgets.Button.create()
      .addChildNode($widgets.Text.create({
        textString: "Open portal"
      }));
}
  //@formatter:on
});

$event.EventSpace.create()
.on(
    $router.EVENT_ROUTE_CHANGE,
    'route',
    $demo.DemoPage.__classId,
    function () {
      $demo.DemoPage.create().setAsActivePage();
    });
