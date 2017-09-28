"use strict";

var $oop = window['cake-oop'],
    $utils = window['cake-utils'],
    $entity = window['cake-entity'];

describe("$entity", function () {
  describe("Document", function () {
    var Document,
        document,
        result;

    beforeEach(function () {
      Document = $oop.getClass('test.$entity.Document.Document')
      .mix($entity.Document);
      document = Document.fromEntityKey('foo/bar'.toDocumentKey());
    });

    describe("fromComponents()", function () {
      beforeEach(function () {
        document = Document.fromComponents('foo', 'bar');
      });

      it("should return Document instance", function () {
        expect(Document.mixedBy(document)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        expect(document.entityKey.equals('foo/bar'.toDocumentKey()));
      });
    });

    describe("fromString()", function () {
      beforeEach(function () {
        document = Document.fromString('foo/bar');
      });

      it("should return Document instance", function () {
        expect(Document.mixedBy(document)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        expect(document.entityKey.equals('foo/bar'.toDocumentKey()));
      });
    });

    describe("create()", function () {
      it("should initialize listeningPath", function () {
        expect(document.listeningPath)
        .toEqual('entity.document.foo.bar'.toPath());
      });

      it("should initialize triggerPaths", function () {
        expect(document.triggerPaths)
        .toEqual([
          'entity.document.foo.bar'.toPath(),
          'entity.document.__document.foo'.toPath()
        ]);
      });

      describe("when entityKey is cached", function () {
        var DocumentKey,
            documentKey,
            document,
            result;

        beforeEach(function () {
          DocumentKey = $oop.getClass('test.$entity.Document.DocumentKey')
          .mix($entity.DocumentKey)
          .mix($utils.StringifyCached);
          documentKey = DocumentKey.fromComponents('foo', 'bar');
          document = $entity.Document.fromEntityKey(documentKey);

          result = $entity.Document.fromEntityKey(documentKey);
        });

        it("should retrieve cached instance", function () {
          expect(result).toBe(document);
        });
      });
    });

    describe("spawnEntityChangeEvents()", function () {
      var entitiesBefore,
          entitiesAfter,
          result,
          affectedFields;

      beforeEach(function () {
        document = Document.fromEntityKey('user/1'.toDocumentKey());
        result = 0;
        affectedFields = [];

        spyOn($entity.Field, 'spawnEntityChangeEvents')
        .and.callFake(function () {
          affectedFields.push(this);
          return result++;
        });

        $entity.entities
        .appendNode('document.__document'.toPath(), {
          user: {
            fields: ['name', 'emails', 'children', 'gender', 'age']
          }
        });

        entitiesBefore = $data.Tree.create({
          document: {
            user: {
              1: {
                name: "Rick Sanchez",
                gender: 'male',
                emails: {
                  "rick@rickandmortyahundredyears.com": 1,
                  "rick.sanchez@smithfamily.com": 1
                },
                children: {
                  'user/2': 1
                }
              }
            }
          }
        });
        entitiesAfter = $data.Tree.create({
          document: {
            user: {
              1: {
                name: "Pickle Rick",
                gender: 'male',
                emails: {
                  "rick@rickandmortyahundredyears.com": 1,
                  "rick.sanchez@smithfamily.com": 1,
                  "picklerick@gazorpazorp.org": 1
                },
                age: 64
              }
            }
          }
        });

        result = document.spawnEntityChangeEvents(entitiesBefore, entitiesAfter);
      });

      afterEach(function () {
        $entity.entities
        .deleteNode('document.__document.user'.toPath());
      });

      it("should invoke spawners", function () {
        expect($entity.Field.spawnEntityChangeEvents.calls.allArgs())
        .toEqual([
          [entitiesBefore, entitiesAfter],
          [entitiesBefore, entitiesAfter],
          [entitiesBefore, entitiesAfter],
          [entitiesBefore, entitiesAfter],
          [entitiesBefore, entitiesAfter]
        ]);
      });

      it("should return array of event instances", function () {
        expect(result).toEqual([0, 1, 2, 3, 4]);
      });
    });

    describe("getField()", function () {
      var field;

      beforeEach(function () {
        field = $entity.Field.fromEntityKey('foo/bar/baz'.toFieldKey());
        result = document.getField('baz');
      });

      it("should return a Field instance", function () {
        expect($entity.Field.mixedBy(result)).toBeTruthy();
      });

      it("should set field components", function () {
        expect(result).toEqual(field);
      });
    });
  });

  describe("DocumentKey", function () {
    var documentKey,
        result;

    describe("toDocument()", function () {
      beforeEach(function () {
        documentKey = 'foo/bar'.toDocumentKey();
        result = documentKey.toDocument();
      });

      it("should return Document instance", function () {
        expect($entity.Document.mixedBy(result)).toBeTruthy();
      });

      it("should set entityKey property", function () {
        expect(result.entityKey).toBe(documentKey);
      });
    });
  });

  describe("Entity", function () {
    var entity;

    describe("create", function () {
      describe("when passing DocumentKey", function () {
        beforeEach(function () {
          entity = $entity.Entity.fromEntityKey('foo/bar'.toDocumentKey());
        });

        it("should return Document instance", function () {
          expect($entity.Document.mixedBy(entity)).toBeTruthy();
        });
      });
    });
  });
});

describe("String", function () {
  var result;

  describe("toDocument()", function () {
    var document;

    beforeEach(function () {
      document = $entity.Document.fromString('foo/bar');
      spyOn($entity.Document, 'create').and.returnValue(document);
      result = 'foo/bar'.toDocument();
    });

    it("should create a Document instance", function () {
      expect($entity.Document.create).toHaveBeenCalledWith({
        entityKey: 'foo/bar'.toDocumentKey()
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(document);
    });
  });
});

describe("Array", function () {
  var result;

  describe("toDocument()", function () {
    var components,
        document;

    beforeEach(function () {
      components = ['foo', 'bar'];
      document = $entity.Document.fromString('foo/bar');
      spyOn($entity.Document, 'create').and.returnValue(document);
      result = components.toDocument();
    });

    it("should create a Document instance", function () {
      expect($entity.Document.create).toHaveBeenCalledWith({
        entityKey: 'foo/bar'.toDocumentKey()
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(document);
    });
  });
});
