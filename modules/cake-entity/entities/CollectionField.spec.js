"use strict";

var $oop = window['cake-oop'],
    $utils = window['cake-utils'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("Field", function () {
    var result;

    describe("create()", function () {
      describe("when nodeType is branch", function () {
        beforeEach(function () {
          $entity.entities
          .appendNode('document.__field'.toPath(), {
            'foo/baz': {
              nodeType: 'branch',
              valueType: 'collection'
            }
          });

          result = 'foo/bar/baz'.toField();
        });

        afterEach(function () {
          $entity.entities
          .deleteNode('document.__field.foo/baz'.toPath());
        });

        it("should return CollectionField instance", function () {
          expect($entity.CollectionField.mixedBy(result))
          .toBeTruthy();
        });
      });
    });
  });
});
