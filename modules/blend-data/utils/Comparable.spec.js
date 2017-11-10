"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'];

describe("$data", function () {
  describe("Comparable", function () {
    var Comparable,
        comparable;

    beforeAll(function () {
      Comparable = $oop.getClass('test.$data.Comparable.Comparable')
      .blend($data.Comparable);
    });

    beforeEach(function () {
      comparable = Comparable.create();
    });
  });
});
