/* global $oop */
"use strict";

describe("InstatiableClass", function () {
    var Class,
        result;

    beforeEach(function () {
        $oop.Class.classes = {};
        Class = $oop.Class.create('Class');
    });
});
