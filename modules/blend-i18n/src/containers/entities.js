"use strict";

$entity.entities
.appendNode($data.TreePath.fromString('document.__document'), {
  _localeEnvironment: {
    fields: [
      'activeLocale'
    ]
  },

  _locale: {
    fields: [
      'localeName',
      'countryCode',
      'languageCode',
      'pluralFormula',
      'translations'
    ]
  },

  _translation: {
    fields: [
      'originalString',
      'pluralForms',
      'context'
    ]
  }
})
.appendNode($data.TreePath.fromString('document.__field'), {
  '_localeEnvironment/activeLocale': {
    valueType: 'reference'
  },

  '_locale/localeName': {
    valueType: 'string'
  },
  '_locale/countryCode': {
    valueType: 'string'
  },
  '_locale/languageCode': {
    valueType: 'string'
  },
  '_locale/pluralFormula': {
    valueType: 'string'
  },
  '_locale/translations': {
    nodeType: 'branch',
    valueType: 'collection',
    itemIdType: 'reference'
  },

  '_translation/originalString': {
    valueType: 'string'
  },
  '_translation/pluralForms': {
    nodeType: 'branch',
    valueType: 'collection'
  },
  '_translation/context': {
    valueType: 'string'
  }
});
