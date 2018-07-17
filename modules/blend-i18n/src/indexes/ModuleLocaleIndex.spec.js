"use strict";

var $oop = window['blend-oop'],
    $i18n = window['blend-i18n'];

describe("$i18n", function () {
  describe("ModuleLocaleIndex", function () {
    var ModuleLocaleIndex,
        moduleLocaleIndex,
        localesByModuleNode,
        modulesByLocaleNode;

    beforeAll(function () {
      ModuleLocaleIndex = $oop.createClass('test.$i18n.ModuleLocaleIndex.ModuleLocaleIndex')
      .blend($i18n.ModuleLocaleIndex)
      .build();
      ModuleLocaleIndex.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      localesByModuleNode = $entity.index.data._localesByModule;
      $entity.index.data._localesByModule = {};
      modulesByLocaleNode = $entity.index.data._modulesByLocale;
      $entity.index.data._modulesByLocale = {};
    });

    afterEach(function () {
      $entity.index.data._localesByModule = localesByModuleNode;
      $entity.index.data._modulesByLocale = modulesByLocaleNode;
    });

    it("should be singleton", function () {
      expect(ModuleLocaleIndex.create()).toBe(ModuleLocaleIndex.create());
    });

    describe("#addLocaleForModule()", function () {
      beforeEach(function () {
        moduleLocaleIndex = ModuleLocaleIndex.create();
      });

      it("should return self", function () {
        var result = moduleLocaleIndex.addLocaleForModule('foo', 'bar');
        expect(result).toBe(moduleLocaleIndex);
      });

      it("should add entries to index", function () {
        moduleLocaleIndex.addLocaleForModule('foo', 'bar');
        expect($entity.index.data._localesByModule).toEqual({
          foo: {
            bar: 1
          }
        });
        expect($entity.index.data._modulesByLocale).toEqual({
          bar: {
            foo: 1
          }
        });
      });
    });

    describe("#getModuleIdsForLocale()", function () {
      beforeEach(function () {
        moduleLocaleIndex = ModuleLocaleIndex.create();
        moduleLocaleIndex.addLocaleForModule('foo', 'bar');
      });

      it("should return list of module IDs", function () {
        expect(moduleLocaleIndex.getModuleIdsForLocale('bar')).toEqual(['foo']);
        expect(moduleLocaleIndex.getModuleIdsForLocale('baz')).toEqual([]);
      });
    });

    describe("#getLocaleIdsForModule()", function () {
      beforeEach(function () {
        moduleLocaleIndex = ModuleLocaleIndex.create();
        moduleLocaleIndex.addLocaleForModule('foo', 'bar');
      });

      it("should return list of module IDs", function () {
        expect(moduleLocaleIndex.getLocaleIdsForModule('foo')).toEqual(['bar']);
        expect(moduleLocaleIndex.getLocaleIdsForModule('baz')).toEqual([]);
      });
    });
  });
});
