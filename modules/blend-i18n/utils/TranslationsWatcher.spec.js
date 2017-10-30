"use strict";

var $oop = window['blend-oop'],
    $i18n = window['blend-i18n'];

describe("$i18n", function () {
  describe("TranslationsWatcher", function () {
    var TranslationsWatcher,
        translationsWatcher;

    beforeAll(function () {
      TranslationsWatcher = $oop.getClass('test.$i18n.TranslationsWatcher.TranslationsWatcher')
      .blend($i18n.TranslationsWatcher);
      TranslationsWatcher.__forwards = {list: [], sources: [], lookup: {}};
    });

    it("should be singleton", function () {
      expect(TranslationsWatcher.create()).toBe(TranslationsWatcher.create());
    });

    describe("create()", function () {
      it("should initialize subscriberId", function () {
        translationsWatcher = TranslationsWatcher.create();
        expect(translationsWatcher.subscriberId)
        .toBe('test.$i18n.TranslationsWatcher.TranslationsWatcher');
      });

      it("should initialize listeningPath", function () {
        translationsWatcher = TranslationsWatcher.create();
        expect(translationsWatcher.listeningPath)
        .toBe('entity.document.__field._locale/translations');
      });
    });

    describe("onTranslationsFieldChange()", function () {
      beforeEach(function () {
        translationsWatcher = TranslationsWatcher.create();
        '_translation/foo-en-us'.toDocument().deleteNode();
        '_locale/en-us/translations'.toField().deleteNode();
        spyOn($i18n.LocaleDocument, 'trigger');
      });

      it("should trigger EVENT_TRANSLATIONS_CHANGE on locale", function () {
        '_translation/foo-en-us'.toDocument().setNode({
          locale: '_locale/en-us',
          originalString: 'foo',
          pluralForms: ['foo', 'foo']
        });
        '_locale/en-us/translations'.toField().appendNode({
          '_translation/foo-en-us': 1
        });

        var calls = $i18n.LocaleDocument.trigger.calls.all();
        // there may be multiple triggers as we're working w/ override
        // vs. original class instantiated (and subscribed by) other parts
        // of the framework
        expect(calls[0].object).toEqual('_locale/en-us'.toDocument());
        expect(calls[0].args).toEqual(['i18n.change.translations']);
      });
    });
  });
});
