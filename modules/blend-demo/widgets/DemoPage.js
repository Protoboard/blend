"use strict";

/**
 * @function $demo.DemoPage.create
 * @returns {$demo.DemoPage}
 */

/**
 * @class $demo.DemoPage
 * @extends $ui.Page
 */
$demo.DemoPage = $oop.getClass('$demo.DemoPage')
.blend($ui.Page)
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

    $ui.Text.create({
      elementName: 'h1',
      textString: "Blend Demo"
    })
    .addToParentNode(this);

    $ui.TemplateText.create({
      elementName: 'p',
      textTemplate: "Current locale ID: {{localeId}}".toLiveTemplate()
      .setParameterValues({
        localeId: {
          toString: function () {
            return $utils.stringify($i18n.LocaleEnvironment.create()
            .getActiveLocale());
          }
        }
      })
    })
    .addToParentNode(this);

    //// todo Have this update on route change
    //$ui.TemplateText.create({
    //  elementName: 'p',
    //  textTemplate: "Current route: {{route}}".toLiveTemplate()
    //  .setParameterValues({
    //    route: {
    //      toString: function () {
    //        return $utils.stringify($router.Router.create().getActiveRoute());
    //      }
    //    }
    //  })
    //})
    //.addToParentNode(this);

    // adding plain text
    $demo.DemoItem.create({
      code: this._createText,
      itemTitle: $ui.Text.__classId,
      contentWidget: this._createText()
    })
    .addToParentNode(this);

    // adding locale-bound text
    $demo.DemoItem.create({
      code: this._createLocaleText,
      itemTitle: $ui.LocaleText.__classId,
      contentWidget: this._createLocaleText()
    })
    .addToParentNode(this);

    // adding entity-bound text
    $demo.DemoItem.create({
      code: this._createDataText,
      itemTitle: $ui.EntityText.__classId,
      contentWidget: this._createDataText()
    })
    .addToParentNode(this);

    // adding template text
    $demo.DemoItem.create({
      code: this._createTemplateText,
      itemTitle: $ui.TemplateText.__classId,
      contentWidget: this._createTemplateText()
    })
    .addToParentNode(this);

    // adding plain hyperlink
    $demo.DemoItem.create({
      code: this._createHyperlink,
      itemTitle: $ui.Hyperlink.__classId,
      contentWidget: this._createHyperlink()
    })
    .addToParentNode(this);

    // adding entity-bound hyperlink
    $demo.DemoItem.create({
      code: this._createDatHyperlink,
      itemTitle: $ui.EntityHyperlink.__classId,
      contentWidget: this._createDatHyperlink()
    })
    .addToParentNode(this);

    // adding plain image
    $demo.DemoItem.create({
      code: this._createImage,
      itemTitle: $ui.Image.__classId,
      contentWidget: this._createImage()
    })
    .addToParentNode(this);

    // adding entity-bound image
    $demo.DemoItem.create({
      code: this._createEntityImage,
      itemTitle: $ui.EntityImage.__classId,
      contentWidget: this._createEntityImage()
    })
    .addToParentNode(this);

    // adding plain button
    $demo.DemoItem.create({
      code: this._createButton,
      itemTitle: $ui.Button.__classId,
      contentWidget: this._createButton()
    })
    .addToParentNode(this);

    // adding plain text input
    $demo.DemoItem.create({
      code: this._createTextInput,
      itemTitle: $ui.TextInput.__classId,
      contentWidget: this._createTextInput()
    })
    .addToParentNode(this);

    // adding plain multiline text input
    $demo.DemoItem.create({
      code: this._createMultilineTextInput,
      itemTitle: $ui.TextInput.__classId,
      contentWidget: this._createMultilineTextInput()
    })
    .addToParentNode(this);

    // adding entity-bound text input
    $demo.DemoItem.create({
      code: this._createEntityTextInput,
      itemTitle: $ui.EntityTextInput.__classId,
      contentWidget: this._createEntityTextInput()
    })
    .addToParentNode(this);

    // adding plain checkbox
    $demo.DemoItem.create({
      code: this._createCheckbox,
      itemTitle: $ui.Checkbox.__classId,
      contentWidget: this._createCheckbox()
    })
    .addToParentNode(this);

    // adding plain checkbox
    $demo.DemoItem.create({
      code: this._createRadioButton,
      itemTitle: $ui.RadioButton.__classId,
      contentWidget: this._createRadioButton()
    })
    .addToParentNode(this);
  },

  //@formatter:off
/** @private */
_createText: function () {
  return $ui.Text.create({
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
  return $ui.LocaleText.create({
    textTranslatable: "I am in great pain, please help me".toTranslatable()
  });
},

/** @private */
_createDataText: function () {
  'character/rick/name'.toField().setNode("Rick Shanchez");
  return $ui.EntityText.create({
    textEntity: 'character/rick/name'.toField()
  });
},

/** @private */
_createTemplateText: function () {
  'character/jerry/name'.toField().setNode("Jerry");
  return $ui.TemplateText.create({
    textTemplate: "What's up, {{name}}?".toLiveTemplate()
    .setParameterValues({
      name: 'character/jerry/name'.toField()
    })
  });
},

/** @private */
_createHyperlink: function () {
  return $ui.Hyperlink.create({
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
  return $ui.EntityHyperlink.create({
    textEntity: 'show/rick-and-morty/title'.toField(),
    targetUrlEntity: 'show/rick-and-morty/url'.toField()
  });
},

/** @private */
_createImage: function () {
  return $ui.Image.create({
    imageUrl: 'https://i.cdn.turner.com/adultswim/big/video/meet-the-vindicators/rickandmorty_ep304_001_Meet_The_Vindicators.jpg'
  });
},

/** @private */
_createEntityImage: function () {
  'show/rick-and-morty/image'.toField()
  .setNode('https://i.cdn.turner.com/adultswim/big/video/morty-and-summer-on-trial/rickandmorty_ep301_003_Trial_Summer_And_Morty.jpg');
  return $ui.EntityImage.create({
    imageUrlEntity: 'show/rick-and-morty/image'.toField()
  });
},

/** @private */
_createButton: function () {
  return $ui.Button.create()
  .addChildNode($ui.Text.create({
    textString: "Open portal"
  }));
},

/** @private */
_createTextInput: function () {
  return $ui.TextInput.create({
    // here we're assuming that widget will manifest as <input>
    inputType: 'email',
    inputValue: "rick@100timesrickandmorty.com"
  });
},

/** @private */
_createMultilineTextInput: function () {
  return $ui.TextInput.create({
    isMultiline: true,
    inputValue: "Rick and Morty, forever and forever, a hundred years!"
  });
},

/** @private */
_createEntityTextInput: function () {
  'character/rick/name'.toField().setNode("Rick Shanchez");
  return $ui.EntityTextInput.create({
    inputValueEntity: 'character/rick/name'.toField()
  });
},

/** @private */
_createCheckbox: function () {
  return $ui.Checkbox.create({
    ownValue: "Rick",
    state: {
      selected: true
    }
  });
},

/** @private */
_createRadioButton: function () {
  return $ui.RadioButton.create({
    ownValue: "Morty"
  });
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
