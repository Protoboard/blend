"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'],
    $module = window['blend-module'];

describe("$module", function () {
  describe("ModuleEnvironmentDocument", function () {
    var ModuleEnvironmentDocument,
        moduleEnvironmentDocument;

    beforeAll(function () {
      ModuleEnvironmentDocument = $oop.getClass('test.$module.ModuleEnvironmentDocument.ModuleEnvironmentDocument')
      .blend($module.ModuleEnvironmentDocument);
      ModuleEnvironmentDocument.__forwards = {
        list: [],
        sources: [],
        lookup: {}
      };
    });

    describe("addToAvailableModules()", function () {
      beforeEach(function () {
        moduleEnvironmentDocument = ModuleEnvironmentDocument
        .fromEntityKey('foo/bar'.toDocumentKey());
        moduleEnvironmentDocument.deleteNode();
      });

      it("should return self", function () {
        var result = moduleEnvironmentDocument.addToAvailableModules('baz');
        expect(result).toBe(moduleEnvironmentDocument);
      });

      it("should add moduleId to availableModules", function () {
        moduleEnvironmentDocument.addToAvailableModules('baz');
        expect(moduleEnvironmentDocument.getNode()).toEqual({
          availableModules: {
            baz: 1
          }
        });
      });
    });

    describe("removeToAvailableModules()", function () {
      beforeEach(function () {
        moduleEnvironmentDocument = ModuleEnvironmentDocument
        .fromEntityKey('foo/bar'.toDocumentKey());
        moduleEnvironmentDocument
        .deleteNode()
        .addToAvailableModules('baz');
      });

      it("should return self", function () {
        var result = moduleEnvironmentDocument.removeFromAvailableModules('baz');
        expect(result).toBe(moduleEnvironmentDocument);
      });

      it("should remove moduleId from availableModules", function () {
        moduleEnvironmentDocument.removeFromAvailableModules('baz');
        expect(moduleEnvironmentDocument.getNode()).toEqual({
          availableModules: {}
        });
      });
    });

    describe("isInAvailableModules", function () {
      beforeEach(function () {
        moduleEnvironmentDocument = ModuleEnvironmentDocument
        .fromEntityKey('foo/bar'.toDocumentKey());
        moduleEnvironmentDocument
        .deleteNode()
        .addToAvailableModules('baz');
      });

      describe("for present moduleId", function () {
        it("should return truthy", function () {
          expect(moduleEnvironmentDocument.isInAvailableModules('baz'))
          .toBeTruthy();
        });
      });

      describe("for absent moduleId", function () {
        it("should return falsy", function () {
          expect(moduleEnvironmentDocument.isInAvailableModules('quux'))
          .toBeFalsy();
        });
      });
    });
  });
});

describe("$entity", function () {
  describe("Document", function () {
    describe("create()", function () {
      var document;

      describe("when documentType is '_moduleEnvironment'", function () {
        it("should return ModuleEnvironmentDocument instance", function () {
          document = $entity.Document.fromEntityKey('_moduleEnvironment/foo'.toDocumentKey());
          expect($module.ModuleEnvironmentDocument.mixedBy(document))
          .toBeTruthy();
        });
      });
    });
  });
});
