"use strict";

var $i18n = window['blend-i18n'];

describe("$i18n", function () {
  describe(".tr()", function () {
    var translatable;

    beforeEach(function () {
      translatable = {};
      spyOn($i18n.Translatable, 'create').and.returnValue(translatable);
    });

    it("should use arguments to create Translatable", function () {
      $i18n.tr('foo', 'foos', 10, {context: 'nonsense'});
      expect($i18n.Translatable.create).toHaveBeenCalledWith({
        originalString: 'foo',
        count: 10,
        context: 'nonsense'
      });
    });

    it("should return created instance", function () {
      var result = $i18n.tr('foo', 'foos', 10, {context: 'nonsense'});
      expect(result).toBe(translatable);
    });

    describe("when originalPlural & count are omitted", function () {
      it("should use arguments to create Translatable", function () {
        $i18n.tr('foo', {context: 'nonsense'});
        expect($i18n.Translatable.create).toHaveBeenCalledWith({
          originalString: 'foo',
          count: undefined,
          context: 'nonsense'
        });
      });
    });
  });
});
