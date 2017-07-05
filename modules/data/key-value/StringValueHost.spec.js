"use strict";

var $oop = window['giant-oop'],
    $data = window['giant-data'];

describe("$data", function () {
  var result;

  describe("StringValueHost", function () {
    var StringKeyHost,
        StringValueHost,
        stringValueHost;

    beforeEach(function () {
      StringKeyHost = $oop.getClass('test.$data.StringValueHost.StringKeyHost')
      .mix($data.DataContainer)
      .mix($data.KeyValueContainer)
      .mixOnly($data.StringKeyHost)
      .define({
        getValuesForKey: function (key) {
          var data = this.data;
          return data.hasOwnProperty(key) ?
              [this.data[key]] :
              [];
        }
      });

      StringValueHost = $oop.getClass('test.$data.StringValueHost.StringValueHost')
      .mix($data.DataContainer)
      .mix($data.KeyValueContainer)
      .mixOnly($data.StringValueHost)
      .define({
        forEachItem: function (callback) {
          var keys = Object.keys(this.data),
              i, values, j;
          for (i = 0; i < keys.length; i++) {
            values = this.data[keys[i]];
            for (j = 0; j < values.length; j++) {
              callback(values[j], keys[i]);
            }
          }
        }
      });

      stringValueHost = StringValueHost.create({
        hello: ['foo', 'bar'],
        quux: ['quux', 'baz']
      });
    });

    describe("join()", function () {
      var rightContainer;

      beforeEach(function () {
        rightContainer = StringKeyHost.create({
          foo: "FOO",
          bar: "BAR",
          baz: "BAZ"
        });

        result = stringValueHost.join(rightContainer);
      });

      it("should return correct type", function () {
        expect($data.PairList.mixedBy(result))
        .toBeTruthy();
      });

      it("should return joined data", function () {
        expect(result.data).toEqual([
          {key: "hello", value: 'FOO'},
          {key: "hello", value: 'BAR'},
          {key: "quux", value: 'BAZ'}
        ]);
      });
    });
  });
});
