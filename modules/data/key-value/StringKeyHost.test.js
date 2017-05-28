"use strict";

var $assert = window['giant-assert'],
    $oop = window['giant-oop'],
    $data = window['giant-data'];

describe("$data", function () {
    var result;

    describe("StringKeyHost", function () {
        var StringKeyHost,
            stringKeyHost;

        beforeEach(function () {
            StringKeyHost = $oop.getClass('StringKeyHost')
                .extend($data.DataContainer)
                .include($data.KeyValueContainer)
                .include($data.StringKeyHost)
                .include($data.StringValueHost)
                .define({
                    getValuesForKey: function (key) {
                        var data = this._data;
                        return data.hasOwnProperty(key) ?
                            [this._data[key]] :
                            [];
                    }
                });

            stringKeyHost = StringKeyHost.create({
                foo: "FOO",
                bar: "BAR",
                baz: "BAZ"
            });
        });

        describe("joinTo()", function () {
            var leftContainer;

            beforeEach(function () {
                leftContainer = $data.StringDictionary.create({
                    hello: {foo: 1, bar: 1},
                    quux: {quux: 1, baz: 1}
                });

                result = stringKeyHost.joinTo(leftContainer);
            });

            it("should return correct type", function () {
                expect($data.StringDictionary.isIncludedBy(result))
                    .toBeTruthy();
            });

            it("should return joined data", function () {
                expect(result._data).toEqual({
                    hello: {FOO: 1, BAR: 1},
                    quux: {BAZ: 1}
                });
            });
        });
    });
});
