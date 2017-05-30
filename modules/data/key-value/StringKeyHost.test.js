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
                .extend($data.KeyValueContainer)
                .include($data.StringKeyHost);

            stringKeyHost = StringKeyHost.create();
        });

        describe("joinTo()", function () {
            var StringValueHost,
                leftContainer,
                joinedContainer;

            beforeEach(function () {
                StringValueHost = $oop.getClass('StringValueHost')
                    .extend($data.DataContainer)
                    .extend($data.KeyValueContainer)
                    .include($data.StringValueHost);

                leftContainer = StringValueHost.create({});

                joinedContainer = {};

                spyOn(leftContainer, 'join').and.returnValue(joinedContainer);

                result = stringKeyHost.joinTo(leftContainer);
            });

            it("should join containers", function () {
                expect(leftContainer.join).toHaveBeenCalledWith(stringKeyHost);
                expect(result).toBe(joinedContainer);
            });
        });
    });
});
