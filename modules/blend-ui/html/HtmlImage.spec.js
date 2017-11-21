"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("HtmlImage", function () {
    var HtmlImage,
        htmlImage;

    beforeAll(function () {
      HtmlImage = $oop.getClass('test.$ui.HtmlImage.HtmlImage')
      .blend($ui.Image)
      .blend($ui.HtmlImage);
      HtmlImage.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize elementName", function () {
        htmlImage = HtmlImage.create();
        expect(htmlImage.elementName).toBe('img');
      });
    });

    describe("setImageUrl()", function () {
      beforeEach(function () {
        htmlImage = HtmlImage.create({
          imageUrl: 'foo'
        });
      });

      it("should return self", function () {
        var result = htmlImage.setImageUrl('bar');
        expect(result).toBe(htmlImage);
      });

      it("should sync 'src' attribute", function () {
        htmlImage.setImageUrl('bar');
        expect(htmlImage.getAttribute('src')).toBe('bar');
      });
    });
  });

  describe("Image", function () {
    var Image,
        image;

    beforeAll(function () {
      Image = $oop.getClass('test.$ui.HtmlImage.Image')
      .blend($ui.Image);
    });

    describe("create()", function () {
      describe("in HTML environment", function () {
        it("should return HtmlImage instance", function () {
          image = Image.create();
          expect($ui.HtmlImage.mixedBy(image)).toBeTruthy();
        });
      });
    });
  });
});
