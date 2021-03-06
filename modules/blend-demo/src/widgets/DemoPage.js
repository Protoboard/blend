"use strict";

/**
 * @function $demo.DemoPage.create
 * @returns {$demo.DemoPage}
 */

/**
 * @class $demo.DemoPage
 * @extends $ui.Page
 */
$demo.DemoPage = $oop.createClass('$demo.DemoPage')
.blend($ui.Page)
.define(/** @lends $demo.DemoPage# */{
  /** @ignore */
  init: function () {
    $ui.Text.create({
      elementName: 'h1',
      textContent: "Blend Demo"
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
      itemTitle: $ui.Text.__className,
      contentWidget: this._createText()
    })
    .addToParentNode(this);

    // adding locale-bound text
    $demo.DemoItem.create({
      code: this._createLocaleText,
      itemTitle: $ui.LocaleText.__className,
      contentWidget: this._createLocaleText()
    })
    .addToParentNode(this);

    // adding entity-bound text
    $demo.DemoItem.create({
      code: this._createDataText,
      itemTitle: $ui.EntityText.__className,
      contentWidget: this._createDataText()
    })
    .addToParentNode(this);

    // adding template text
    $demo.DemoItem.create({
      code: this._createTemplateText,
      itemTitle: $ui.TemplateText.__className,
      contentWidget: this._createTemplateText()
    })
    .addToParentNode(this);

    // adding plain hyperlink
    $demo.DemoItem.create({
      code: this._createHyperlink,
      itemTitle: $ui.Hyperlink.__className,
      contentWidget: this._createHyperlink()
    })
    .addToParentNode(this);

    // adding entity-bound hyperlink
    $demo.DemoItem.create({
      code: this._createDatHyperlink,
      itemTitle: $ui.EntityHyperlink.__className,
      contentWidget: this._createDatHyperlink()
    })
    .addToParentNode(this);

    // adding plain image
    $demo.DemoItem.create({
      code: this._createImage,
      itemTitle: $ui.Image.__className,
      contentWidget: this._createImage()
    })
    .addToParentNode(this);

    // adding entity-bound image
    $demo.DemoItem.create({
      code: this._createEntityImage,
      itemTitle: $ui.EntityImage.__className,
      contentWidget: this._createEntityImage()
    })
    .addToParentNode(this);

    // adding plain button
    $demo.DemoItem.create({
      code: this._createButton,
      itemTitle: $ui.Button.__className,
      contentWidget: this._createButton()
    })
    .addToParentNode(this);

    // adding entity-bound select dropdown
    $demo.DemoItem.create({
      code: this._createEntityList,
      itemTitle: $ui.EntityList.__className,
      contentWidget: this._createEntityList()
    })
    .addToParentNode(this);

    // adding plain text input
    $demo.DemoItem.create({
      code: this._createTextInput,
      itemTitle: $ui.TextInput.__className,
      contentWidget: this._createTextInput()
    })
    .addToParentNode(this);

    // adding plain multiline text input
    $demo.DemoItem.create({
      code: this._createMultilineTextInput,
      itemTitle: $ui.TextInput.__className,
      contentWidget: this._createMultilineTextInput()
    })
    .addToParentNode(this);

    // adding entity-bound text input
    $demo.DemoItem.create({
      code: this._createEntityTextInput,
      itemTitle: $ui.EntityTextInput.__className,
      contentWidget: this._createEntityTextInput()
    })
    .addToParentNode(this);

    // adding plain checkbox
    $demo.DemoItem.create({
      code: this._createCheckbox,
      itemTitle: $ui.Checkbox.__className,
      contentWidget: this._createCheckbox()
    })
    .addToParentNode(this);

    // adding plain checkbox
    $demo.DemoItem.create({
      code: this._createRadioButton,
      itemTitle: $ui.RadioButton.__className,
      contentWidget: this._createRadioButton()
    })
    .addToParentNode(this);

    // adding plain select dropdown
    $demo.DemoItem.create({
      code: this._createSingleSelect,
      itemTitle: $ui.SingleSelect.__className,
      contentWidget: this._createSingleSelect()
    })
    .addToParentNode(this);

    // adding entity-bound select dropdown
    $demo.DemoItem.create({
      code: this._createEntitySingleSelect,
      itemTitle: $ui.EntitySingleSelect.__className,
      contentWidget: this._createEntitySingleSelect()
    })
    .addToParentNode(this);

    // adding plain multi-select list
    $demo.DemoItem.create({
      code: this._createMultiSelect,
      itemTitle: $ui.MultiSelect.__className,
      contentWidget: this._createMultiSelect()
    })
    .addToParentNode(this);

    // adding entity-bound multi-select list
    $demo.DemoItem.create({
      code: this._createEntityMultiSelect,
      itemTitle: $ui.EntityMultiSelect.__className,
      contentWidget: this._createEntityMultiSelect()
    })
    .addToParentNode(this);
  },

  //@formatter:off
/** @private */
_createText: function () {
  return $ui.Text.create({
    textContent: "<em>wubba lubba dub dub</em>"
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
  'birdperson'.toLocale().setAsActiveLocale();
  return $ui.LocaleText.create({
    textTranslatable: "I am in great pain, please help me".toTranslatable()
  });
},

/** @private */
_createDataText: function () {
  'character/rick/name'.toField().setNode("Rick Shanchez");
  return $ui.EntityText.create({
    textContentEntity: 'character/rick/name'.toField()
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
    textContent: "Rick and Morty",
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
    textContentEntity: 'show/rick-and-morty/title'.toField(),
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
    textContent: "Open portal"
  }));
},

/** @private */
_createEntityList: function () {
  'show/rick-and-morty/episodes'.toField().setNode({
    'episode/r-m-s1-e1': 1,
    'episode/r-m-s1-e2': 2,
    'episode/r-m-s1-e3': 3
  });
  'episode/r-m-s1-e1/title'.toField().setNode("S01-E01 Pilot");
  'episode/r-m-s1-e2/title'.toField().setNode("S01-E02 Lawnmower Dog");
  'episode/r-m-s1-e3/title'.toField().setNode("S01-E03 Anatomy Park");

  var
      EntityListItem = $oop.createClass('$demo.EntityListItem')
      .blend($ui.EntityListItem)
      .blend($ui.EntityText)
      .define({
        defaults: function () {
          this.elementName = 'li';
        },
        _syncToEntityProperty: function (entityProperty) {
          if (entityProperty === 'listItemEntity') {
            this.setTextContentEntity(this.listItemEntity.entityKey.entityName.toDocument()
            .getField('title'));
          }
        }
      })
      .build(),
      EntityList = $oop.createClass('$demo.EntityList')
      .blend($widget.Widget)
      .blend($ui.EntityList)
      .define({
        ListItemClass: EntityListItem,
        defaults: function () {
          this.elementName = 'ul';
        }
      })
      .build();

  return EntityList.fromListEntity('show/rick-and-morty/episodes'.toField());
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
},

/** @private */
_createSingleSelect: function () {
  return $ui.SingleSelect.create()
  .addChildNode($ui.Option.create({
    textContent: "Rick",
    ownValue: 'Rick'
  }))
  .addChildNode($ui.Option.create({
    textContent: "Morty",
    ownValue: 'Morty'
  }))
  .addChildNode($ui.Option.create({
    textContent: "Summer",
    ownValue: 'Summer'
  }))
  .setInputValue("Morty");
},

/** @private */
_createEntitySingleSelect: function () {
  'episode/r-m-s1-e1/title'.toField().setNode("S01-E01 Pilot");
  'episode/r-m-s1-e2/title'.toField().setNode("S01-E02 Lawnmower Dog");
  'episode/r-m-s1-e3/title'.toField().setNode("S01-E03 Anatomy Park");
  'show/rick-and-morty/episodes'.toField().setNode({
    'episode/r-m-s1-e1': 1,
    'episode/r-m-s1-e2': 2,
    'episode/r-m-s1-e3': 3
  });

  var
      EntityOption = $oop.createClass('$demo.EntityOption')
      .blend($ui.EntityOption)
      .define({
        _syncToEntityProperty: function (entityProperty) {
          var listItemKey = this.listItemEntity.entityKey;
          if (entityProperty === 'listItemEntity') {
            this.setTextContentEntity(listItemKey.entityName.toDocument()
            .getField('title'));
            this.setOwnValue(listItemKey.entityName);
          }
        }
      })
      .build(),
      EntitySingleSelect = $oop.createClass('$demo.EntitySingleSelect')
      .blend($ui.EntitySingleSelect)
      .define({
        ListItemClass: EntityOption
      })
      .build();

  return EntitySingleSelect.create({
    listEntity: 'show/rick-and-morty/episodes'.toField(),
    inputValueEntity: 'show/rick-and-morty/selectedEpisode'.toField()
  });
},

/** @private */
_createMultiSelect: function () {
  return $ui.MultiSelect.create()
  .addChildNode($ui.Option.create({
    textContent: "Rick",
    ownValue: 'Rick'
  }))
  .addChildNode($ui.Option.create({
    textContent: "Morty",
    ownValue: 'Morty'
  }))
  .addChildNode($ui.Option.create({
    textContent: "Summer",
    ownValue: 'Summer'
  }))
  .setInputValues({
    "Morty": "Morty",
    "Rick": "Rick"
  });
},

/** @private */
_createEntityMultiSelect: function () {
  'episode/r-m-s1-e1/title'.toField().setNode("S01-E01 Pilot");
  'episode/r-m-s1-e2/title'.toField().setNode("S01-E02 Lawnmower Dog");
  'episode/r-m-s1-e3/title'.toField().setNode("S01-E03 Anatomy Park");
  'show/rick-and-morty/episodes'.toField().setNode({
    'episode/r-m-s1-e1': 1,
    'episode/r-m-s1-e2': 2,
    'episode/r-m-s1-e3': 3
  });
  'show/rick-and-morty/selectedEpisodes'.toField().setNode({
    'episode/r-m-s1-e1': 'episode/r-m-s1-e1',
    'episode/r-m-s1-e3': 'episode/r-m-s1-e3'
  });

  var
      EntityOption = $oop.createClass('$demo.EntityOption')
      .blend($ui.EntityOption)
      .define({
        _syncToEntityProperty: function (entityProperty) {
          var listItemKey = this.listItemEntity.entityKey;
          if (entityProperty === 'listItemEntity') {
            this.setTextContentEntity(listItemKey.entityName.toDocument()
            .getField('title'));
            this.setOwnValue(listItemKey.entityName);
          }
        }
      })
      .build(),
      EntityMultiSelect = $oop.createClass('$demo.EntityMultiSelect')
      .blend($ui.EntityMultiSelect)
      .define({
        ListItemClass: EntityOption
      })
      .build();

  return EntityMultiSelect.create({
    listEntity: 'show/rick-and-morty/episodes'.toField(),
    inputValuesEntity: 'show/rick-and-morty/selectedEpisodes'.toField()
  });
}
  //@formatter:on
})
.build();

$event.EventSpace.create()
.on(
    $router.EVENT_ROUTE_CHANGE,
    'route',
    $demo.DemoPage.__className,
    function () {
      $demo.DemoPage.create().setAsActivePage();
    })
.on(
    $module.EVENT_MODULE_AVAILABLE,
    'module.blend-demo',
    $demo.DemoPage.__className,
    function () {
      $demo.DemoPage.create().setAsActivePage();
    });
