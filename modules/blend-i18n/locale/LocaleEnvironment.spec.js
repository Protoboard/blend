"use strict";

var $oop = window['blend-oop'],
    $i18n = window['blend-i18n'];

describe("$i18n", function () {
  describe("LocaleEnvironment", function () {
    var LocaleEnvironment,
        localeEnvironment;

    beforeAll(function () {
      LocaleEnvironment = $oop.getClass('test.$i18n.LocaleEnvironment.LocaleEnvironment')
      .blend($i18n.LocaleEnvironment);
      LocaleEnvironment.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize subscriberId", function () {
        localeEnvironment = LocaleEnvironment.create();
        expect(localeEnvironment.subscriberId)
        .toBe('test.$i18n.LocaleEnvironment.LocaleEnvironment');
      });

      it("should initialize localeEnvironmentKey", function () {
        localeEnvironment = LocaleEnvironment.create();
        expect($entity.DocumentKey.mixedBy(localeEnvironment.localeEnvironmentKey))
        .toBeTruthy();
        expect(localeEnvironment.localeEnvironmentKey)
        .toEqual('_localeEnvironment/'.toDocumentKey());
      });

      it("should initialize listeningPath", function () {
        localeEnvironment = LocaleEnvironment.create();
        expect(localeEnvironment.listeningPath).toEqual('locale');
      });

      it("should initialize triggerPaths", function () {
        localeEnvironment = LocaleEnvironment.create();
        expect(localeEnvironment.triggerPaths.list).toContain('locale');
      });
    });

    describe("setActiveLocale()", function () {
      var localeEnvironmentNode;

      beforeEach(function () {
        localeEnvironmentNode = $entity.entities.getNode('document._localeEnvironment.'.toPath());
        $entity.entities.setNode('document._localeEnvironment.'.toPath(), {});
        localeEnvironment = LocaleEnvironment.create();
      });

      afterEach(function () {
        $entity.entities.setNode('document._localeEnvironment.'.toPath(), localeEnvironmentNode);
      });

      it("should return self", function () {
        var result = localeEnvironment.setActiveLocale('foo'.toLocale());
        expect(result).toBe(localeEnvironment);
      });

      it("should set active locale field in document", function () {
        localeEnvironment.setActiveLocale('foo'.toLocale());
        var localeEnvironmentDocument = '_localeEnvironment/'.toDocument();
        expect(localeEnvironmentDocument.getField('activeLocale').getNode())
        .toBe('_locale/foo');
      });
    });

    describe("getActiveLocale()", function () {
      beforeEach(function () {
        localeEnvironment = LocaleEnvironment.create();
        localeEnvironment.setActiveLocale('de-at'.toLocale());
      });

      it("should return Locale instance", function () {
        var result = localeEnvironment.getActiveLocale();
        expect($i18n.Locale.mixedBy(result)).toBeTruthy();
      });

      it("should retrieve active locale", function () {
        var result = localeEnvironment.getActiveLocale();
        expect(result).toEqual('de-at'.toLocale());
      });
    });

    describe("onActiveLocaleFieldChange()", function () {
      var localeEnvironmentNode;

      beforeEach(function () {
        localeEnvironmentNode = $entity.entities.getNode('document._localeEnvironment.'.toPath());
        $entity.entities.setNode('document._localeEnvironment.'.toPath(), {});
        localeEnvironment = $i18n.LocaleEnvironment.create();
        spyOn($i18n.LocaleChangeEvent, 'trigger');
      });

      afterEach(function () {
        $entity.entities.setNode('document._localeEnvironment.'.toPath(), localeEnvironmentNode);
      });

      it("should trigger EVENT_LOCALE_CHANGE", function () {
        '_localeEnvironment//activeLocale'.toField().setNode('_locale/en-gb');
        var calls = $i18n.LocaleChangeEvent.trigger.calls.all();
        expect(calls[0].object.sender).toBe(localeEnvironment);
        expect(calls[0].object.eventName).toBe('i18n.change.locale');
        expect(calls[0].object.localeBefore).toBeUndefined();
        expect(calls[0].object.localeAfter).toEqual('en-gb'.toLocale());
      });
    });
  });
});
