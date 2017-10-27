"use strict";

$entity.entities
.appendNode($data.Path.fromString('document.__field'), {
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
  }
});
