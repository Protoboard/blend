"use strict";

var $oop = window['blend-oop'],
    $module = window['blend-module'],
    $i18n = window['blend-i18n'];

describe("$i18n", function () {
  describe("LocalizedModule", function () {
    var LocalizedModule,
        localizedModule,
        localesByModuleNode,
        modulesByLocaleNode;

    beforeAll(function () {
      LocalizedModule = $oop.createClass('test.$i18n.LocalizedModule.LocalizedModule')
      .blend($i18n.LocalizedModule)
      .build();
      LocalizedModule.__builder.forwards = {list: [], lookup: {}};
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

    describe("getLocales()", function () {
      beforeEach(function () {
        localizedModule = LocalizedModule.fromModuleId('foo');
        $i18n.ModuleLocaleIndex.create()
        .addLocaleForModule('foo', 'bar')
        .addLocaleForModule('foo', 'baz');
      });

      it("should return list of associated Locale instances", function () {
        var result = localizedModule.getLocales();
        expect(result).toEqual([
          'bar'.toLocale(),
          'baz'.toLocale()
        ]);
      });
    });
  });
});

describe("$module", function () {
  describe("Module", function () {
    describe("create()", function () {
      var localesByModuleNode,
          modulesByLocaleNode;

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

      describe("when module has associated locales", function () {
        beforeEach(function () {
          $i18n.ModuleLocaleIndex.create()
          .addLocaleForModule('foo', 'bar')
          .addLocaleForModule('foo', 'baz');
        });

        it("should return LocalizedModule instance", function () {
          var result = $module.Module.fromModuleId('foo');
          expect($i18n.LocalizedModule.mixedBy(result)).toBeTruthy();
        });
      });

      describe("when module has no associated locales", function () {
        it("should return Module instance", function () {
          var result = $module.Module.fromModuleId('foo');
          expect($i18n.LocalizedModule.mixedBy(result)).toBeFalsy();
        });
      });
    });
  });
});