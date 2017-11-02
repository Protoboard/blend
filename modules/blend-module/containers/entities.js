"use strict";

$entity.entities
.appendNode($data.Path.fromString('document.__document'), {
  _moduleEnvironment: {
    fields: [
      'availableModules'
    ]
  }
})
.appendNode($data.Path.fromString('document.__field'), {
  '_moduleEnvironment/availableModules': {
    nodeType: 'branch',
    valueType: 'collection',
    itemIdType: 'string'
  }
})
.appendNode($data.Path.fromString('document'), {
  // module environment initial content
  _moduleEnvironment: {
    '': {
      availableModules: {
        'blend-assert': 1,
        'blend-data': 1,
        'blend-entity': 1,
        'blend-module': 1,
        'blend-oop': 1,
        'blend-utils': 1
      }
    }
  }
});