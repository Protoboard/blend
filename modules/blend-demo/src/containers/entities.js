"use strict";

$entity.entities
.appendNode($data.TreePath.fromString('document.__document'), {
  character: {
    fields: ['name']
  },

  show: {
    fields: ['title', 'url', 'image', 'episodes', 'selectedEpisode']
  },

  episode: {
    fields: ['title']
  }
})
.appendNode($data.TreePath.fromString('document.__field'), {
  'show/episodes': {
    nodeType: 'branch',
    valueType: 'collection',
    itemIdType: 'reference',
    itemValueType: 'order'
  },
  'show/selectedEpisodes': {
    nodeType: 'branch',
    valueType: 'collection',
    itemIdType: 'reference'
  }
});
