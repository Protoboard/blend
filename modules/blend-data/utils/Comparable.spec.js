"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'];

describe("$data", function () {
  describe("Comparable", function () {
    var Comparable,
        comparable;

    beforeAll(function () {
      Comparable = $oop.createClass('test.$data.Comparable.Comparable')
      .blend($data.Comparable)
      .build();
    });

    beforeEach(function () {
      comparable = Comparable.create();
    });
  });
});
