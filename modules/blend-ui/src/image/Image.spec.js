"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("Image", function () {
    var Image,
        image;

    beforeAll(function () {
      Image = $oop.createClass('test.$ui.Image.Image')
      .blend($ui.Image)
      .build();
      Image.__builder.forwards = {list: [], lookup: {}};
    });

    describe("setImageUrl()", function () {
      beforeEach(function () {
        image = Image.create();
      });

      it("should return self", function () {
        var result = image.setImageUrl('foo');
        expect(result).toBe(image);
      });

      it("should set imageUrl", function () {
        image.setImageUrl('foo');
        expect(image.imageUrl).toBe('foo');
      });

      it("should save beforeState", function () {
        image.setImageUrl('foo');

        image.setImageUrl('bar');
        expect(image.setImageUrl.shared.imageUrlBefore).toBe('foo');
      });
    });
  });
});
