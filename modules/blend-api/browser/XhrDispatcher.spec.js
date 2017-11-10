"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $event = window['blend-event'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("XhrDispatcher", function () {
    var XhrDispatcher;

    beforeAll(function () {
      XhrDispatcher = $oop.getClass('test.$api.XhrDispatcher.XhrDispatcher')
      .blend($api.XhrDispatcher);
    });

    describe("dispatchRequest()", function () {
      var request;

      beforeEach(function () {
        request = 'user/:userId/name'.toHttpEndpoint().toRequest({
          'method:': 'PUT',
          'endpoint:userId': 'rick123',
          'header:Content-Type': "application:json",
          'body:': "Rick"
        });
        spyOn(XMLHttpRequest.prototype, 'open');
        spyOn(XMLHttpRequest.prototype, 'setRequestHeader');
        spyOn(XMLHttpRequest.prototype, 'send');
      });

      describe("on invalid HTTP request", function () {
        it("should throw", function () {
          expect(function () {
            XhrDispatcher.dispatchRequest();
          }).toThrow();
          expect(function () {
            XhrDispatcher.dispatchRequest($api.ObjectEndpoint.fromEndpointProperties({})
            .toRequest());
          }).toThrow();
        });
      });

      it('should return Promise', function () {
        var result = XhrDispatcher.dispatchRequest(request);
        expect($utils.Promise.mixedBy(result)).toBeTruthy();
      });

      it("should open XHR", function () {
        XhrDispatcher.dispatchRequest(request);
        expect(XMLHttpRequest.prototype.open)
        .toHaveBeenCalledWith('PUT', 'user/rick123/name', true);
      });

      it("should add header params", function () {
        XhrDispatcher.dispatchRequest(request);
        expect(XMLHttpRequest.prototype.setRequestHeader)
        .toHaveBeenCalledWith('Content-Type', 'application:json');
      });

      it("should send XHR request", function () {
        XhrDispatcher.dispatchRequest(request);
        expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith("Rick");
      });

      describe("when readyState advances to 1", function () {
        var xhr,
            promise;

        beforeEach(function () {
          xhr = new XMLHttpRequest();
          spyOn(window, 'XMLHttpRequest').and.returnValue(xhr);
          spyOn($event.Event, 'trigger');
          spyOn($utils.Deferred, 'notify');
          spyOn(XhrDispatcher, '_readyStateGetterProxy').and.returnValue(1);
          promise = XhrDispatcher.dispatchRequest(request);
        });

        it("should trigger EVENT_REQUEST_OPEN", function () {
          xhr.onreadystatechange();
          var calls = $event.Event.trigger.calls.all(),
              event = calls[0].object;
          expect(calls.length).toBe(1);
          expect(event.eventName).toBe('request.open');
          expect(event.request).toBe(request);
          expect(event.xhr).toBe(xhr);
        });

        it("should notify promise", function () {
          xhr.onreadystatechange();
          var calls = $utils.Deferred.notify.calls.all(),
              deferred = calls[0].object,
              event = calls[0].args[0];
          expect(deferred.promise).toBe(promise);
          expect($event.Event.mixedBy(event)).toBeTruthy();
          expect(event.eventName).toBe('request.open');
          expect(event.request).toBe(request);
          expect(event.xhr).toBe(xhr);
        });
      });

      describe("when readyState advances to 2", function () {
        var xhr,
            promise;

        beforeEach(function () {
          xhr = new XMLHttpRequest();
          spyOn(window, 'XMLHttpRequest').and.returnValue(xhr);
          spyOn($event.Event, 'trigger');
          spyOn($utils.Deferred, 'notify');
          spyOn(XhrDispatcher, '_readyStateGetterProxy').and.returnValue(2);
          promise = XhrDispatcher.dispatchRequest(request);
        });

        it("should trigger EVENT_REQUEST_SEND", function () {
          xhr.onreadystatechange();
          var calls = $event.Event.trigger.calls.all(),
              event = calls[0].object;
          expect(calls.length).toBe(1);
          expect(event.eventName).toBe('request.send');
          expect(event.request).toBe(request);
          expect(event.xhr).toBe(xhr);
        });

        it("should notify promise", function () {
          xhr.onreadystatechange();
          var calls = $utils.Deferred.notify.calls.all(),
              deferred = calls[0].object,
              event = calls[0].args[0];
          expect(deferred.promise).toBe(promise);
          expect($event.Event.mixedBy(event)).toBeTruthy();
          expect(event.eventName).toBe('request.send');
          expect(event.request).toBe(request);
          expect(event.xhr).toBe(xhr);
        });
      });

      describe("when readyState advances to 3", function () {
        var xhr,
            promise;

        beforeEach(function () {
          xhr = new XMLHttpRequest();
          spyOn(window, 'XMLHttpRequest').and.returnValue(xhr);
          spyOn($event.Event, 'trigger');
          spyOn($utils.Deferred, 'notify');
          spyOn(XhrDispatcher, '_readyStateGetterProxy').and.returnValue(3);
          promise = XhrDispatcher.dispatchRequest(request);
        });

        it("should trigger EVENT_RESPONSE_PROGRESS", function () {
          xhr.onreadystatechange();
          var calls = $event.Event.trigger.calls.all(),
              event = calls[0].object;
          expect(calls.length).toBe(1);
          expect(event.eventName).toBe('response.progress');
          expect(event.request).toBe(request);
          expect(event.xhr).toBe(xhr);
        });

        it("should notify promise", function () {
          xhr.onreadystatechange();
          var calls = $utils.Deferred.notify.calls.all(),
              deferred = calls[0].object,
              event = calls[0].args[0];
          expect(deferred.promise).toBe(promise);
          expect($event.Event.mixedBy(event)).toBeTruthy();
          expect(event.eventName).toBe('response.progress');
          expect(event.request).toBe(request);
          expect(event.xhr).toBe(xhr);
        });
      });

      describe("when readyState advances to 4", function () {
        var xhr,
            promise;

        beforeEach(function () {
          xhr = new XMLHttpRequest();
          spyOn(window, 'XMLHttpRequest').and.returnValue(xhr);
          spyOn($event.Event, 'trigger');
          spyOn($utils.Deferred, 'resolve');
          spyOn(XhrDispatcher, '_readyStateGetterProxy').and.returnValue(4);
          promise = XhrDispatcher.dispatchRequest(request);
        });

        it("should trigger EVENT_RESPONSE_PROGRESS", function () {
          xhr.onreadystatechange();
          var calls = $event.Event.trigger.calls.all(),
              event = calls[0].object;
          expect(calls.length).toBe(1);
          expect(event.eventName).toBe('response.receive');
          expect(event.request).toBe(request);
          expect(event.xhr).toBe(xhr);
        });

        it("should resolve promise", function () {
          xhr.onreadystatechange();
          var calls = $utils.Deferred.resolve.calls.all(),
              deferred = calls[0].object,
              event = calls[0].args[0];
          expect(deferred.promise).toBe(promise);
          expect($event.Event.mixedBy(event)).toBeTruthy();
          expect(event.eventName).toBe('response.receive');
          expect(event.request).toBe(request);
          expect(event.xhr).toBe(xhr);
        });
      });
    });
  });
});
