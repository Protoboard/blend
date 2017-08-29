"use strict";

var $oop = window['cake-oop'],
    $data = window['cake-data'],
    $event = window['cake-event'];

describe("$event", function () {
  describe("EventSpace", function () {
    var EventSpace,
        eventSpace,
        result;

    beforeEach(function () {
      delete $oop.Class.classByClassId['test.$event.EventSpace.EventSpace'];
      EventSpace = $oop.getClass('test.$event.EventSpace.EventSpace')
      .mix($event.EventSpace);

      eventSpace = EventSpace.create();
    });

    describe("create()", function () {
      it("should initialize subscriptions", function () {
        expect($data.Tree.mixedBy(eventSpace.subscriptions)).toBeTruthy();
        expect(eventSpace.subscriptions.data).toEqual({});
      });

      describe("then creating another again", function () {
        it("should return the same instance", function () {
          expect(EventSpace.create()).toBe(eventSpace);
        });
      });
    });

    describe("destroy()", function () {
      beforeEach(function () {
        spyOn(eventSpace.subscriptions, 'destroy');
      });

      it("should destroy subscriptions", function () {
        eventSpace.destroy();
        expect(eventSpace.subscriptions.destroy).toHaveBeenCalled();
      });
    });

    describe("on()", function () {
      var callback;

      beforeEach(function () {
        callback = function () {};
      });

      it("should return self", function () {
        result = eventSpace.on('eventName', 'foo.bar'.toPath(), 'foo', callback);
        expect(result).toBe(eventSpace);
      });

      describe("with subscriptionId", function () {
        beforeEach(function () {
          result = eventSpace.on('eventName', 'foo.bar'.toPath(), 'foo', callback);
        });

        it("should add to subscriptions", function () {
          expect(eventSpace.subscriptions.data).toEqual({
            callbacks: {
              bySubscription: {
                eventName: {
                  'foo.bar': {
                    foo: callback
                  }
                }
              },
              bySubscriber: {
                foo: {
                  eventName: {
                    'foo.bar': callback
                  }
                }
              }
            },
            paths: {
              eventName: [
                'foo.bar'
              ]
            }
          });
        });

        describe("then subscribing again", function () {
          it("should not change subscriptions", function () {
            eventSpace.on('eventName', 'foo.bar'.toPath(), 'foo', callback);
            expect(eventSpace.subscriptions.data).toEqual({
              callbacks: {
                bySubscription: {
                  eventName: {
                    'foo.bar': {
                      foo: callback
                    }
                  }
                },
                bySubscriber: {
                  foo: {
                    eventName: {
                      'foo.bar': callback
                    }
                  }
                }
              },
              paths: {
                eventName: [
                  'foo.bar'
                ]
              }
            });
          });
        });
      });
    });

    describe("off()", function () {
      var callback1, callback2, callback3, callback4;

      beforeEach(function () {
        callback1 = function () {};
        callback2 = function () {};
        callback3 = function () {};
        callback4 = function () {};
        result = eventSpace
        .on('event1', 'foo.bar'.toPath(), 'subscriber3', callback4)
        .on('event1', 'foo.bar.baz'.toPath(), 'subscriber1', callback1)
        .on('event1', 'foo.bar.quux'.toPath(), 'subscriber2', callback2)
        .on('event2', 'foo.baz'.toPath(), 'subscriber1', callback3);
      });

      it("should return self", function () {
        result = eventSpace.off('event1', 'foo.bar.baz'.toPath(), 'subscriber1');
        expect(result).toBe(eventSpace);
      });

      describe("when all arguments are specified", function () {
        it("should remove entries from registry", function () {
          eventSpace.off('event1', 'foo.bar.baz'.toPath(), 'subscriber1');
          expect(eventSpace.subscriptions.data).toEqual({
            callbacks: {
              bySubscription: {
                event1: {
                  'foo.bar': {subscriber3: callback4},
                  'foo.bar.baz': {},
                  'foo.bar.quux': {subscriber2: callback2}
                },
                event2: {
                  'foo.baz': {subscriber1: callback3}
                }
              },
              bySubscriber: {
                subscriber1: {
                  event2: {'foo.baz': callback3},
                  event1: {}
                },
                subscriber2: {
                  event1: {'foo.bar.quux': callback2}
                },
                subscriber3: {
                  event1: {'foo.bar': callback4}
                }
              }
            },
            paths: {
              event1: ['foo.bar', 'foo.bar.quux'],
              event2: ['foo.baz']
            }
          });
        });
      });

      describe("when subscriberId is specified", function () {
        it("should remove entries from registry", function () {
          eventSpace.off(undefined, undefined, 'subscriber1');
          expect(eventSpace.subscriptions.data).toEqual({
            callbacks: {
              bySubscription: {
                event1: {
                  'foo.bar': {subscriber3: callback4},
                  'foo.bar.quux': {subscriber2: callback2}
                }
              },
              bySubscriber: {
                subscriber2: {
                  event1: {'foo.bar.quux': callback2}
                },
                subscriber3: {
                  event1: {'foo.bar': callback4}
                }
              }
            },
            paths: {
              event1: ['foo.bar', 'foo.bar.quux'],
              event2: []
            }
          });
        });

        describe("when eventName is also specified", function () {
          it("should remove entries from registry", function () {
            eventSpace.off('event1', undefined, 'subscriber1');
            expect(eventSpace.subscriptions.data).toEqual({
              callbacks: {
                bySubscription: {
                  event1: {
                    'foo.bar': {subscriber3: callback4},
                    'foo.bar.quux': {subscriber2: callback2}
                  },
                  event2: {
                    'foo.baz': {subscriber1: callback3}
                  }
                },
                bySubscriber: {
                  subscriber1: {
                    event2: {'foo.baz': callback3}
                  },
                  subscriber2: {
                    event1: {'foo.bar.quux': callback2}
                  },
                  subscriber3: {
                    event1: {'foo.bar': callback4}
                  }
                }
              },
              paths: {
                event1: ['foo.bar', 'foo.bar.quux'],
                event2: ['foo.baz']
              }
            });
          });
        });
      });

      describe("when eventName is specified", function () {
        it("should remove entries from registry", function () {
          eventSpace.off('event1');
          expect(eventSpace.subscriptions.data).toEqual({
            callbacks: {
              bySubscription: {
                event2: {
                  'foo.baz': {subscriber1: callback3}
                }
              },
              bySubscriber: {
                subscriber1: {
                  event1: {},
                  event2: {'foo.baz': callback3}
                },
                subscriber2: {
                  event1: {}
                },
                subscriber3: {
                  event1: {}
                }
              }
            },
            paths: {
              event2: ['foo.baz']
            }
          });
        });

        describe("when targetPath is also specified", function () {
          it("should remove entries from registry", function () {
            eventSpace.off('event1', 'foo.bar.baz'.toPath());
            expect(eventSpace.subscriptions.data).toEqual({
              callbacks: {
                bySubscription: {
                  event1: {
                    'foo.bar': {subscriber3: callback4},
                    'foo.bar.quux': {subscriber2: callback2}
                  },
                  event2: {
                    'foo.baz': {subscriber1: callback3}
                  }
                },
                bySubscriber: {
                  subscriber1: {
                    event1: {},
                    event2: {'foo.baz': callback3}
                  },
                  subscriber2: {
                    event1: {'foo.bar.quux': callback2}
                  },
                  subscriber3: {
                    event1: {'foo.bar': callback4}
                  }
                }
              },
              paths: {
                event1: ['foo.bar', 'foo.bar.quux'],
                event2: ['foo.baz']
              }
            });
          });
        });
      });

      describe("when nothing is specified", function () {
        it("should throw", function () {
          expect(function () {
            eventSpace.off();
          }).toThrow();
        });
      });
    });
  });
});
