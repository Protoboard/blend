"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $entity = window['blend-entity'];

describe("$entity", function () {
  describe("Document", function () {
    var Document,
        document,
        result;

    beforeAll(function () {
      Document = $oop.getClass('test.$entity.Document.Document')
      .blend($entity.Document);
    });

    beforeEach(function () {
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
      describe("when entityKey is cached", function () {
        var DocumentKey,
            documentKey,
            document,
            result;

        beforeAll(function () {
          DocumentKey = $oop.getClass('test.$entity.Document.DocumentKey')
          .blend($entity.DocumentKey)
          .blend($utils.StringifyCached);
        });

        beforeEach(function () {
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
      var nodeBefore, nodeAfter,
          result;

      beforeEach(function () {
        document = 'user/1'.toDocument();
        result = 0;

        // bringing ad-hoc LeafNoded class into existence
        // spy wouldn't work otherwise
        document.getField('name');
        spyOn($entity.Field, 'spawnEvent')
        .and.callFake(function () {
          return result++;
        });
        spyOn($entity.Field, 'spawnEntityChangeEvents')
        .and.callFake(function () {
          return result++;
        });

        $entity.entities
        .appendNode('document.__document'.toPath(), {
          user: {
            fields: ['name', 'emails', 'children', 'gender', 'age']
          }
        })
        .appendNode('document.__field'.toPath(), {
          'user/emails': {
            nodeType: 'branch',
            valueType: 'collection',
            itemIdType: 'email'
          },
          'user/children': {
            nodeType: 'branch',
            valueType: 'collection',
            itemIdType: 'reference'
          }
        });

        nodeBefore = {
          name: "Rick Sanchez",
          gender: 'male',
          emails: {
            "rick@rickandmortyahundredyears.com": 1,
            "rick.sanchez@smithfamily.com": 1
          },
          children: {
            'user/2': 1
          }
        };
        nodeAfter = {
          name: "Pickle Rick",
          gender: 'male',
          emails: {
            "rick@rickandmortyahundredyears.com": 1,
            "rick.sanchez@smithfamily.com": 1,
            "picklerick@gazorpazorp.org": 1
          },
          age: 64
        };
      });

      afterEach(function () {
        $entity.entities
        .deleteNode('document.__document.user'.toPath())
        .deleteNode('document.__field.user/emails'.toPath())
        .deleteNode('document.__field.user/children'.toPath());
      });

      it("should spawn events for leaf node fields", function () {
        document.spawnEntityChangeEvents(nodeBefore, nodeAfter);
        var calls = $entity.Field.spawnEvent.calls.all();

        expect(calls[0].object).toEqual('user/1/name'.toField());
        expect(calls[0].args).toEqual([{
          eventName: $entity.EVENT_ENTITY_CHANGE,
          nodeBefore: "Rick Sanchez",
          nodeAfter: "Pickle Rick"
        }]);
        expect(calls[0].returnValue).toBe(0);

        expect(calls[1].object).toEqual('user/1/age'.toField());
        expect(calls[1].args).toEqual([{
          eventName: $entity.EVENT_ENTITY_CHANGE,
          nodeBefore: undefined,
          nodeAfter: 64
        }]);
        expect(calls[1].returnValue).toBe(1);
      });

      it("should invoke spawners on branch node fields", function () {
        document.spawnEntityChangeEvents(nodeBefore, nodeAfter);
        var calls = $entity.Field.spawnEntityChangeEvents.calls.all();

        expect(calls[0].object).toEqual('user/1/emails'.toField());
        expect(calls[0].args)
        .toEqual([nodeBefore.emails, nodeAfter.emails]);
        expect(calls[0].returnValue).toBe(2);

        expect(calls[1].object).toEqual('user/1/children'.toField());
        expect(calls[1].args)
        .toEqual([nodeBefore.children, nodeAfter.children]);
        expect(calls[1].returnValue).toBe(3);
      });

      it("should return array of event instances", function () {
        result = document.spawnEntityChangeEvents(nodeBefore, nodeAfter);
        expect(result).toEqual([0, 1, 2, 3]);
      });

      describe("when fields attribute is not documented", function () {
        it("should not throw", function () {
          expect(function () {
            'foo/bar'.toDocument()
            .spawnEntityChangeEvents(nodeBefore, nodeAfter);
          }).not.toThrow();
        });
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
