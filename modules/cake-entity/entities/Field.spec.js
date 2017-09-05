"use strict";

var $oop = window['cake-oop'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("Field", function () {
    var Field,
        field,
        result;

    beforeEach(function () {
      Field = $oop.getClass('test.$entity.Field.Field')
      .mix($entity.Field);
      field = Field.fromEntityKey('foo/bar/baz'.toFieldKey());
    });

    describe("create()", function () {
      it("should initialize listeningPath", function () {
        expect(field.listeningPath)
        .toEqual('entity.document.foo.bar.baz'.toPath());
      });

      it("should initialize triggerPaths", function () {
        expect(field.triggerPaths)
        .toEqual([
          'entity.document.foo.bar.baz'.toPath(),
          'entity.document.__field.foo\/baz'.toPath()
        ]);
      });
    });
  });
});
